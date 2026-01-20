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
  loading: true, // Start loading to check auth status
  error: null,
  errorCode: null,
  token: null, // We keep the key for compatibility but it will be empty or null
  emailVerifyPending: false,
  emailVerifyMsg: null,
};

// Actions types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload?: string } // Payload optional now
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
  | { type: "CLEAR_ERROR" }
  | { type: "AUTH_CHECK_COMPLETE"; isAuthenticated: boolean };

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
      return { ...state, loading: false, token: "active" }; // Set valid state
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
      return { ...initialState, token: null, loading: false };
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
    case "AUTH_CHECK_COMPLETE":
        return {
            ...state,
            loading: false,
            token: (action as any).isAuthenticated ? "active" : null
        };
    default:
      return state;
  }
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            if (res.data.user) {
                dispatch({ type: "AUTH_CHECK_COMPLETE", isAuthenticated: true } as any);
            } else {
                dispatch({ type: "AUTH_CHECK_COMPLETE", isAuthenticated: false } as any);
            }
        } catch (e) {
             dispatch({ type: "AUTH_CHECK_COMPLETE", isAuthenticated: false } as any);
        }
    };
    checkAuth();

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
    try {
      const res = await axios.post('/api/auth/login/email', { email, password });
      
      const { user } = res.data;
      
      dispatch({ type: "LOGIN_SUCCESS" }); // No payload needed, cookie is set

      isFirstTimeLogin(user, router);
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
      const res = await axios.post('/api/auth/login/google', { accessToken });

      const { user } = res.data;
      
      dispatch({ type: "LOGIN_SUCCESS" });

      isFirstTimeLogin(user, router);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Google login failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
    }
  };

  const logout = async () => {
    try {
        await axios.post('/api/auth/logout');
    } catch(e) { console.error("Logout API failed", e); }
    
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

      // Register still hits backend directly? Or should we proxy it?
      // Register usually returns token if successful (Login type).
      // So we should proxy register too if we want to set cookie.
      // BUT, existing Register implementation in backend sets token?
      // The previous code called /api/Account/Register.
      // If it returns user.token, we need to set cookie.
      // So we should probably route Register through a proxy that sets cookie if successful.
      // For now, let's keep direct call but if it returns token, we need to set it via an API endpoint.
      // Easiest is to just call backend, get token, then call /api/auth/login/email (via hidden mechanism) or a new "set-cookie" route.
      // Better: Use a Proxy Route for Register too? Or just let Register happen, then auto-login?
      // Since 'Register' endpoint in existing backend returns Token on success, we need to intercept it.
      
      // Temporary solution: Client calls backend (via Proxy for cleaner net), gets token, then calls internal /api/auth/login/... ? No.
      // Let's create a special Proxy for register needed?
      // Actually, let's proxy the register call via our '/api/proxy' but checking the response?
      
      // Let's just use the direct Register call, and if it returns a token, we handle it.
      // BUT current implementation of Register in backend:
      // "type": "Login" -> has token.
      
      // We can create a new route handler `/api/auth/register` that forwards to backend and sets cookie if token.
      // Since that wasn't in original plan, let's simplify:
      // Leave register as is, but if it returns token, call our /api/auth/set-session (we don't have this).
      // OR, just call /api/auth/login/email with credentials right after successful register? But we don't have raw password if we encoded it?
      
      // Ideally we create `/api/auth/register` route handler. I'll add that TODO or just implement it.
      // For now, I will use the generic proxy for Register, but generic proxy doesn't set cookie.
      
      // I'll stick to calling `backend` via proxy but realize cookie won't be set automatically.
      // Wait, if I use the generic proxy, the backend response comes to client. Client sees token. Client can't set HttpOnly cookie.
      
      // So I NEED a server-side route for register.
      // I'll assume for now register might prompt verify, OR if it auto-logs in, it's an issue.
      // Let's rely on user login after register or verification. 
      // If `type === "Login"`, we have a problem.
      // Let's assume Register DOES NOT auto-login for now or we accept it's broken until I fix Register API route.
      // Actually, I can just call `/api/auth/login/email` with the raw credentials immediately?
      
      const res = await axios.post(
        `/api/proxy/api/Account/Register?email=${encodedEmail}&pKey=${encodedPassword}&pKeyConfirm=${encodedConfirm}${promoQuery}`
      );

      const { type, user } = res.data;

      if (type === "Login" && user?.token) {
        // We have a token but can't set cookie from here.
        // We should ideally call a route handler to set it.
        // Or re-login via our /api/auth/login/email route using the raw credentials we have in scope!
        // This is the easiest fix.
        await login(email, password); 
        return;
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
    try {
      // Verify also returns token. We need to set cookie.
      // This usually happens from the Verify Page.
      // We can create `/api/auth/verify` route handler. 
      // Or we can let the client verify, get token, and then... send token to server to set cookie?
      // Sending token to server to set cookie is okay if we trust the token (server verifies it).
      
      // Let's make a `/api/auth/session` endpoint that takes a token and sets cookie?
      // No, that's insecure (XSS can set any cookie).
      
      // Correct approach: Route Handler proxies the verify call and sets cookie.
      // We'll use the generic proxy logic but specifically for verify?
      // Let's use `/api/proxy` but that doesn't set cookie.
      
      // Re-architect: We need `/api/auth/verify` that proxies to `/api/Account/VerifyMail` and sets cookie.
      // I will implement this logic inside `verifyEmail` by creating a specific route handler later? 
      // Or just cheat and use a "set-session" route for now? 
      // Safe "set-session" route: takes token, validates it against backend (GET /Account), if valid, sets cookie.
      // Let's just use that. It's robust.
      // Wait, I can just write the `/api/auth/verify` code right now.
      
      const res = await axios.post('/api/auth/verify', { token });

      dispatch({ type: "LOGIN_SUCCESS" }); // Cookie set by route handler

      return res.data;
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
        `/api/proxy/api/Account/SendVerifyMail`,
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
      `/api/proxy/api/Account/ForgetPassword`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const createStripeCustomer = async () => {
    try {
      // Use proxy
      const response = await fetch(`/api/proxy/api/Stripe/CreateCustomer`, {
        method: "POST"
        // Cookie is attached automatically by browser
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
      const response = await fetch(
        `/api/proxy/api/Stripe/CreateCustomerPortal`,
        {
          method: "POST"
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
      const response = await fetch(`/api/proxy/api/Stripe/MakePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
