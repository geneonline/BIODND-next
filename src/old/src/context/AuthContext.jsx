import { createContext, useReducer, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { btoa, atob } from "js-base64"; // npm install js-base64
import { getStoredPromoCode } from "@/services/promoStorage";
const baseURL = import.meta.env.VITE_Effect_API;

const AuthContext = createContext();

const initialState = {
  loading: false,
  error: null,
  errorCode: null,
  token: localStorage.getItem("token"),
  emailVerifyPending: false,
  emailVerifyMsg: null,
};

const isFirstTimeLogin = (userData, navigate) => {
  // 直接根據回應中的 reasonForUse 判斷首次登入
  if (userData.reasonForUse.length === 0) {
    sessionStorage.setItem("user_firstTime_login", "true");
    navigate("/account/onboarding", { replace: true });
  } else {
    sessionStorage.setItem("user_firstTime_login", "false");
    navigate("database/search/assets", { replace: true });
  }
};

function authReducer(state, action) {
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

export function UserAuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  useEffect(() => {
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

  const login = async (email, password) => {
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

      isFirstTimeLogin(res.data, navigate);
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      const code = err.response?.data?.errorCode || null;
      if (code) {
        dispatch({ type: "LOGIN_ERROR_CODE", payload: { msg, code } });
      } else {
        dispatch({ type: "LOGIN_ERROR", payload: msg });
      }
    }
  };

  const loginWithGoogle = async (accessToken) => {
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

      isFirstTimeLogin(res.data, navigate);
    } catch (err) {
      const msg = err.response?.data?.error || "Google login failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
    }
  };

  //登出
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    dispatch({ type: "LOGOUT" });
  };

  // Register function
  const register = async (
    email,
    password,
    passwordConfirm,
    promoCodeOverride
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
      const promoCode = typeof promoCodeSource === "string" ? promoCodeSource.trim() : "";
      const promoQuery = promoCode
        ? `&promoCode=${encodeURIComponent(promoCode)}`
        : "";

      const res = await axios.post(
        `${baseURL}/api/Account/Register?email=${encodedEmail}&pKey=${encodedPassword}&pKeyConfirm=${encodedConfirm}${promoQuery}`
      );

      const { type, user } = res.data;

      // Situation 1: 註冊成功並登入(直接根據 reasonForUse 判斷首次登入)
      if (type === "Login" && user?.token) {
        localStorage.setItem("token", user.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: user.token });

        isFirstTimeLogin(user, navigate);
      } else {
        // Situation 2 or 3: 註冊成功但未登入（需驗證信箱）
        dispatch({
          type: "REGISTER_VERIFY_PENDING",
          payload:
            "Registration successful, please check your email to verify your account.",
        });
        // return {
        //   success: true,
        //   message:
        //     "Registration successful, please check your email to verify your account.",
        // };
      }
    } catch (err) {
      const msg = err.response?.data?.error || "register failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      return { success: false, message: msg };
    }
  };

  const verifyEmail = async (token) => {
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
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "verify failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      throw err;
    }
  };

  // ─── 補寄驗證信 ────────────────────────
  const sendVerifyMail = async (email) => {
    dispatch({ type: "RESEND_VERIFY_START" });
    try {
      await axios.post(
        `${baseURL}/api/Account/SendVerifyMail`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      dispatch({ type: "RESEND_VERIFY_SUCCESS" });
    } catch (err) {
      const code = err.response?.data?.errorCode || "";
      const msg =
        err.response?.data?.error || "Resend verification email failed";
      dispatch({ type: "RESEND_VERIFY_ERROR", payload: { code, msg } });
      throw err;
    }
  };

  const forgotPassword = (email) => {
    return axios.post(
      `${baseURL}/api/Account/ForgetPassword`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  // Stripe 建立 Customer
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

  // Stripe 查詢 & 管理訂閱 Portal
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
        // Stripe portal URL
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

  // Stripe 付款
  const makeStripePayment = async ({ priceId }) => {
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
        return text; // 這就是 Stripe checkout 的網址
      } else {
        // 如果不是 200
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
