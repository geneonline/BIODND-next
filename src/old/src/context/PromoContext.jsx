import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PromoTrialMask from "@/parts/database/PromoTrialMask";
import { useAuth } from "@/context/AuthContext";
import {
  clearPromoState,
  consumePromoPendingAfterLogin,
  getStoredPromoCode,
  markPromoPendingAfterLogin,
  setStoredPromoCode,
} from "@/services/promoStorage";
import {
  fetchOfferStatus,
  makePaymentByPromoCode,
} from "@/services/promoService";

// Add routes to this list when the promo modal should stay hidden entirely.
// Use full path strings (e.g. "/account/verifyEmail").
const PROMO_MODAL_SUPPRESS_PATHS = [
  "/account/verifyEmail",
  "/account/onboarding",
];

const PromoContext = createContext(null);

const initialState = {
  code: getStoredPromoCode(),
  offer: null,
  isModalOpen: false,
  isLoading: false,
  isRedeeming: false,
  error: null,
  redeemError: null,
};

function promoReducer(state, action) {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "CLEAR_PROMO_STATE":
      return {
        ...state,
        code: null,
        offer: null,
        isModalOpen: false,
      };
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true, redeemError: null };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false, redeemError: null };
    case "START_FETCH":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, offer: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "START_REDEEM":
      return { ...state, isRedeeming: true, redeemError: null };
    case "REDEEM_SUCCESS":
      return { ...state, isRedeeming: false };
    case "REDEEM_ERROR":
      return { ...state, isRedeeming: false, redeemError: action.payload };
    default:
      return state;
  }
}

export function PromoProvider({ children, token, userLoading, userData }) {
  const [state, dispatch] = useReducer(promoReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const logout = auth?.logout;
  const suppressPromoForRoute = PROMO_MODAL_SUPPRESS_PATHS.includes(
    location.pathname
  );

  const offerRef = useRef(state.offer);
  const fetchErrorRef = useRef(null);
  const redeemErrorRef = useRef(null);
  useEffect(() => {
    offerRef.current = state.offer;
  }, [state.offer]);

  const isAuthenticated = Boolean(token);
  const userSubscriptionLevel = userData?.subscriptionLevel;

  const handleAlreadyPro = useCallback(
    (shouldToast = true) => {
      if (!isAuthenticated || userSubscriptionLevel !== "Pro") {
        return false;
      }

      const storedCode = getStoredPromoCode();
      if (!storedCode) {
        return false;
      }

      dispatch({ type: "CLOSE_MODAL" });
      dispatch({ type: "SET_CODE", payload: null });
      dispatch({ type: "FETCH_SUCCESS", payload: null });
      clearPromoState();

      if (shouldToast) {
        toast.success("You are already a Pro member");
      }

      return true;
    },
    [dispatch, isAuthenticated, userSubscriptionLevel]
  );

  const invalidatePromo = useCallback(() => {
    clearPromoState();
    dispatch({ type: "CLEAR_PROMO_STATE" });
  }, []);

  const ensureOffer = useCallback(async (code) => {
    dispatch({ type: "START_FETCH" });
    try {
      const offer = await fetchOfferStatus(code);
      dispatch({ type: "FETCH_SUCCESS", payload: offer });
      return offer;
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: { message: error.message, code: error.code },
      });
      if (error?.status === 400 || error?.status === 404) {
        invalidatePromo();
      }
      throw error;
    }
  }, [invalidatePromo]);

  const showPromo = useCallback(
    async ({ forceFetch = false } = {}) => {
      if (isAuthenticated && userLoading) {
        return null;
      }

      const code = getStoredPromoCode();
      if (!code) return null;

      dispatch({ type: "SET_CODE", payload: code });

      const currentOffer = offerRef.current;
      const needsFetch =
        forceFetch || !currentOffer || currentOffer.code !== code;

      if (needsFetch) {
        try {
          const offer = await ensureOffer(code);
          if (offer) {
            dispatch({ type: "OPEN_MODAL" });
          }
          return offer;
        } catch (error) {
          return null;
        }
      }

      dispatch({ type: "OPEN_MODAL" });
      return currentOffer;
    },
    [ensureOffer, isAuthenticated, userLoading]
  );

  const closePromo = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  const redeemPromo = useCallback(async () => {
    const code = getStoredPromoCode();
    if (!code) {
      dispatch({
        type: "REDEEM_ERROR",
        payload: { message: "Promo code is missing" },
      });
      return;
    }

    if (!isAuthenticated) {
      markPromoPendingAfterLogin();
      dispatch({ type: "CLOSE_MODAL" });
      if (location.pathname !== "/account/register") {
        navigate("/account/register", {
          state: { from: location, fromPromo: true },
        });
      }
      return;
    }

    dispatch({ type: "START_REDEEM" });
    try {
      const redirectUrl = await makePaymentByPromoCode({ code, token });
      dispatch({ type: "REDEEM_SUCCESS" });
      clearPromoState();
      window.location.assign(redirectUrl);
    } catch (error) {
      const status =
        error?.status ??
        error?.response?.status ??
        (typeof error?.code === "number" ? error.code : undefined);

      if (status === 401) {
        markPromoPendingAfterLogin();
        dispatch({
          type: "REDEEM_ERROR",
          payload: { message: "Your session expired. Please log in again." },
        });
        dispatch({ type: "CLOSE_MODAL" });
        if (typeof logout === "function") {
          logout();
        } else {
          try {
            localStorage.removeItem("token");
          } catch (_) {
            // ignore storage errors
          }
        }
        if (location.pathname !== "/account/login") {
          navigate("/account/login", {
            replace: true,
            state: { from: location, fromPromo: true },
          });
        }
        return;
      }

      dispatch({
        type: "REDEEM_ERROR",
        payload: { message: error.message, code: error.code },
      });
    }
  }, [isAuthenticated, location, logout, navigate, token]);

  useEffect(() => {
    const message = state.error?.message || state.error;
    if (message && message !== fetchErrorRef.current) {
      toast.error(message);
      fetchErrorRef.current = message;
      return;
    }
    if (!message) {
      fetchErrorRef.current = null;
    }
  }, [state.error]);

  useEffect(() => {
    const message = state.redeemError?.message || state.redeemError;
    if (message && message !== redeemErrorRef.current) {
      toast.error(message);
      redeemErrorRef.current = message;
      return;
    }
    if (!message) {
      redeemErrorRef.current = null;
    }
  }, [state.redeemError]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeFromUrl = params.get("promo-code");
    if (!codeFromUrl) return;

    const normalizedCode = codeFromUrl.trim();
    if (!normalizedCode) return;

    const existingCode = getStoredPromoCode();
    setStoredPromoCode(normalizedCode);

    if (existingCode !== normalizedCode) {
      dispatch({ type: "SET_CODE", payload: normalizedCode });
    }

    if (suppressPromoForRoute) {
      if (!isAuthenticated) {
        markPromoPendingAfterLogin();
      }
      return;
    }

    if (isAuthenticated && userLoading) {
      return;
    }

    if (isAuthenticated) {
      if (handleAlreadyPro()) {
        return;
      }
      showPromo({ forceFetch: existingCode !== normalizedCode });
    } else {
      markPromoPendingAfterLogin();
      if (location.pathname !== "/account/register") {
        navigate("/account/register", {
          state: { from: location, fromPromo: true },
        });
      }
    }
  }, [
    isAuthenticated,
    location.pathname,
    location.search,
    navigate,
    showPromo,
    userLoading,
    handleAlreadyPro,
  ]);

  useEffect(() => {
    if (suppressPromoForRoute) {
      return;
    }

    if (!userLoading && isAuthenticated) {
      const hadPending = consumePromoPendingAfterLogin();

      if (handleAlreadyPro()) {
        return;
      }

      if (hadPending && getStoredPromoCode()) {
        showPromo({ forceFetch: true });
      }
    }
  }, [
    handleAlreadyPro,
    isAuthenticated,
    showPromo,
    userLoading,
    suppressPromoForRoute,
  ]);

  const onSubscribePage = location.pathname === "/subscribe";
  useEffect(() => {
    if (!getStoredPromoCode()) return;

    if (isAuthenticated && userLoading) {
      return;
    }

    if (handleAlreadyPro()) {
      return;
    }

    if (onSubscribePage) {
      showPromo();
    }
  }, [handleAlreadyPro, isAuthenticated, onSubscribePage, showPromo, userLoading]);

  const {
    code,
    offer,
    isModalOpen,
    isLoading,
    isRedeeming,
    error,
    redeemError,
  } = state;

  const value = useMemo(
    () => ({
      promoCode: code,
      offer,
      isModalOpen,
      isLoading,
      isRedeeming,
      error,
      redeemError,
      showPromo,
      closePromo,
      redeemPromo,
      hasPromo: Boolean(code),
    }),
    [
      code,
      offer,
      isModalOpen,
      isLoading,
      isRedeeming,
      error,
      redeemError,
      showPromo,
      closePromo,
      redeemPromo,
    ]
  );

  return (
    <PromoContext.Provider value={value}>
      {children}
      {state.isModalOpen && (
        <PromoTrialMask
          onClose={closePromo}
          offer={state.offer}
          isLoading={state.isLoading}
          error={state.error}
          onTry={redeemPromo}
          isRedeeming={state.isRedeeming}
          redeemError={state.redeemError}
        />
      )}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error("usePromo must be used within a PromoProvider");
  }
  return context;
}
