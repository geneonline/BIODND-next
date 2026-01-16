"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// Note: Ensure PromoTrialMask is migrated or comment it out if not ready
// import PromoTrialMask from "@/parts/database/PromoTrialMask";
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
const PROMO_MODAL_SUPPRESS_PATHS = [
  "/account/verifyEmail",
  "/account/onboarding",
];

const PromoContext = createContext<any>(null);

const initialState = {
  code: typeof window !== "undefined" ? getStoredPromoCode() : null,
  offer: null,
  isModalOpen: false,
  isLoading: false,
  isRedeeming: false,
  error: null,
  redeemError: null,
};

function promoReducer(state: any, action: any) {
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

export function PromoProvider({
  children,
  token,
  userLoading,
  userData,
}: {
  children: ReactNode;
  token: string | null;
  userLoading: boolean;
  userData: any;
}) {
  const [state, dispatch] = useReducer(promoReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const logout = auth?.logout;
  const suppressPromoForRoute = PROMO_MODAL_SUPPRESS_PATHS.includes(
    pathname || ""
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

  const ensureOffer = useCallback(
    async (code: string) => {
      dispatch({ type: "START_FETCH" });
      try {
        const offer = await fetchOfferStatus(code);
        dispatch({ type: "FETCH_SUCCESS", payload: offer });
        return offer;
      } catch (error: any) {
        dispatch({
          type: "FETCH_ERROR",
          payload: { message: error.message, code: error.code },
        });
        if (error?.status === 400 || error?.status === 404) {
          invalidatePromo();
        }
        throw error;
      }
    },
    [invalidatePromo]
  );

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
      if (pathname !== "/account/register") {
        router.push("/account/register"); // Simplified redirect for now
      }
      return;
    }

    dispatch({ type: "START_REDEEM" });
    try {
      const redirectUrl = await makePaymentByPromoCode({ code, token: token! });
      dispatch({ type: "REDEEM_SUCCESS" });
      clearPromoState();
      window.location.assign(redirectUrl);
    } catch (error: any) {
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
          } catch (_) {}
        }
        if (pathname !== "/account/login") {
          router.push("/account/login");
        }
        return;
      }

      dispatch({
        type: "REDEEM_ERROR",
        payload: { message: error.message, code: error.code },
      });
    }
  }, [isAuthenticated, pathname, logout, router, token]);

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
    const codeFromUrl = searchParams.get("promo-code");
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
      if (pathname !== "/account/register") {
        router.push("/account/register");
      }
    }
  }, [
    isAuthenticated,
    pathname,
    searchParams,
    router,
    showPromo,
    userLoading,
    handleAlreadyPro,
    suppressPromoForRoute,
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
    getStoredPromoCode,
  ]);

  const onSubscribePage = pathname === "/subscribe";
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
  }, [
    handleAlreadyPro,
    isAuthenticated,
    onSubscribePage,
    showPromo,
    userLoading,
    getStoredPromoCode,
  ]);

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
      {/* 
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
      */}
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
