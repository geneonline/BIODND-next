"use client";

import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { btoa } from "js-base64";
import { getStoredPromoCode } from "@/services/promoStorage";

// TODO: Set this in .env.local
const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  loading: boolean;
  error: string | null;
  errorCode: string | number | null;
  token: string | null;
  emailVerifyPending: boolean;
  emailVerifyMsg: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  errorCode: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  emailVerifyPending: false,
  emailVerifyMsg: null,
};

// Actions types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: string }
  | { type: "LOGIN_ERROR"; payload: string }
  | {
      type: "LOGIN_ERROR_CODE";
      payload: { msg: string; code: string | number };
    }
  | { type: "LOGOUT" }
  | { type: "RESEND_VERIFY_START" }
  | { type: "RESEND_VERIFY_SUCCESS" }
  | {
      type: "RESEND_VERIFY_ERROR";
      payload: { msg: string; code: string | number };
    }
  | { type: "REGISTER_VERIFY_PENDING"; payload?: string }
  | { type: "CLEAR_ERROR" };

const AuthContext = createContext<any>(null);

const isFirstTimeLogin = (userData: any, router: any) => {
  if (userData.reasonForUse.length === 0) {
    sessionStorage.setItem("user_firstTime_login", "true");
    router.replace("/account/onboarding");
  } else {
    sessionStorage.setItem("user_firstTime_login", "false");
    router.replace("/database/search/assets");
  }
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
        emailVerifyPending: false,
        emailVerifyMsg: null,
      };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, token: action.payload };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGIN_ERROR_CODE":
      return {
        ...state,
        loading: false,
        error: action.payload.msg,
        errorCode: action.payload.code,
      };
    case "LOGOUT":
      return { ...initialState, token: null };
    case "RESEND_VERIFY_START":
      return { ...state, loading: true, error: null, errorCode: null };
    case "RESEND_VERIFY_SUCCESS":
      return { ...state, loading: false };
    case "RESEND_VERIFY_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.msg,
        errorCode: action.payload.code,
      };
    case "REGISTER_VERIFY_PENDING":
      return {
        ...state,
        loading: false,
        error: null,
        errorCode: null,
        emailVerifyPending: true,
        emailVerifyMsg:
          action.payload ||
          "Registration successful, please check your email to verify your account.",
      };
    case "CLEAR_ERROR":
      return { ...state, error: null, errorCode: null };
    default:
      return state;
  }
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    // Sync token from localStorage on mount (for client-side hydration)
    const token = localStorage.getItem("token");
    if (token && token !== state.token) {
      dispatch({ type: "LOGIN_SUCCESS", payload: token });
    }

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    localStorage.clear();
    try {
      const encodedEmail = btoa(email);
      const encodedPassword = btoa(password);
      const res = await axios.post(
        `${baseURL}/api/Account/Login?email=${encodedEmail}&abcd=${encodedPassword}`
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      dispatch({ type: "LOGIN_SUCCESS", payload: token });

      isFirstTimeLogin(res.data, router);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";
      const code = err.response?.data?.errorCode || null;
      if (code) {
        dispatch({ type: "LOGIN_ERROR_CODE", payload: { msg, code } });
      } else {
        dispatch({ type: "LOGIN_ERROR", payload: msg });
      }
    }
  };

  const loginWithGoogle = async (accessToken: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        `${baseURL}/api/Account/GoogleLogin`,
        { accessToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.token;
      localStorage.setItem("token", token);
      dispatch({ type: "LOGIN_SUCCESS", payload: token });

      isFirstTimeLogin(res.data, router);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Google login failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    promoCodeOverride?: string
  ) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const encodedEmail = btoa(email);
      const encodedPassword = btoa(password);
      const encodedConfirm = btoa(passwordConfirm);
      const promoCodeSource =
        typeof promoCodeOverride === "string" && promoCodeOverride.trim()
          ? promoCodeOverride
          : getStoredPromoCode();
      const promoCode =
        typeof promoCodeSource === "string" ? promoCodeSource.trim() : "";
      const promoQuery = promoCode
        ? `&promoCode=${encodeURIComponent(promoCode)}`
        : "";

      const res = await axios.post(
        `${baseURL}/api/Account/Register?email=${encodedEmail}&pKey=${encodedPassword}&pKeyConfirm=${encodedConfirm}${promoQuery}`
      );

      const { type, user } = res.data;

      if (type === "Login" && user?.token) {
        localStorage.setItem("token", user.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: user.token });
        isFirstTimeLogin(user, router);
      } else {
        dispatch({
          type: "REGISTER_VERIFY_PENDING",
          payload:
            "Registration successful, please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "register failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      return { success: false, message: msg };
    }
  };

  const verifyEmail = async (token: string) => {
    dispatch({ type: "LOGIN_START" });
    localStorage.clear();
    try {
      const res = await axios.post(
        `${baseURL}/api/Account/VerifyMail`,
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      const authToken = data?.token || data?.user?.token;
      if (!authToken) {
        throw new Error("Verification succeeded but token is missing");
      }

      localStorage.setItem("token", authToken);
      dispatch({ type: "LOGIN_SUCCESS", payload: authToken });

      return data;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "verify failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      throw err;
    }
  };

  const sendVerifyMail = async (email: string) => {
    dispatch({ type: "RESEND_VERIFY_START" });
    try {
      await axios.post(
        `${baseURL}/api/Account/SendVerifyMail`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      dispatch({ type: "RESEND_VERIFY_SUCCESS" });
    } catch (err: any) {
      const code = err.response?.data?.errorCode || "";
      const msg =
        err.response?.data?.error || "Resend verification email failed";
      dispatch({ type: "RESEND_VERIFY_ERROR", payload: { code, msg } });
      throw err;
    }
  };

  const forgotPassword = (email: string) => {
    return axios.post(
      `${baseURL}/api/Account/ForgetPassword`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const createStripeCustomer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const response = await fetch(`${baseURL}/api/Stripe/CreateCustomer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return true;
      } else {
        let msg = "Stripe customer creation failed";
        try {
          const data = await response.json();
          msg = data?.error || msg;
        } catch (_) {
          const text = await response.text();
          if (text) msg = text;
        }
        throw new Error(msg);
      }
    } catch (err) {
      throw err;
    }
  };

  const createStripeCustomerPortal = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const response = await fetch(
        `${baseURL}/api/Stripe/CreateCustomerPortal`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      if (response.ok) {
        return text;
      } else {
        let errorMsg = "Failed to create customer portal";
        try {
          const data = JSON.parse(text);
          errorMsg = data?.error || errorMsg;
        } catch (_) {
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
    } catch (err) {
      throw err;
    }
  };

  const makeStripePayment = async ({ priceId }: { priceId: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const response = await fetch(`${baseURL}/api/Stripe/MakePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const text = await response.text();
      console.log("Stripe payment response:", text);

      if (response.ok) {
        return text;
      } else {
        throw new Error("Stripe payment failed: " + text);
      }
    } catch (err) {
      throw err;
    }
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        verifyEmail,
        loginWithGoogle,
        sendVerifyMail,
        forgotPassword,
        clearError,
        makeStripePayment,
        createStripeCustomer,
        createStripeCustomerPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
