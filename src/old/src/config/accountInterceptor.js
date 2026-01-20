import axios from "axios";

// 外部 API 名單：這些主機的請求不應自動附帶 Authorization。
export const AUTH_SKIP_HOSTS = ["serpapi.biodnd.com"];

// Attach token from localStorage to every request.
axios.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      const shouldSkipAuth = (() => {
        const url = config?.url || "";
        const baseURL = config?.baseURL;

        // Fast path: absolute url in either url or baseURL string
        const candidateStrings = [url, baseURL].filter(Boolean);
        if (candidateStrings.some((str) => AUTH_SKIP_HOSTS.some((host) => str.includes(host)))) {
          return true;
        }

        // Resolve relative URLs when possible to check hostname precisely
        try {
          let resolved;
          if (baseURL) {
            resolved = new URL(url || "", baseURL);
          } else if (/^https?:\/\//i.test(url)) {
            resolved = new URL(url);
          }
          if (resolved) {
            return AUTH_SKIP_HOSTS.includes(resolved.hostname);
          }
        } catch (_) {
          // ignore resolution errors and default to sending token
        }

        return false;
      })();

      if (token && !shouldSkipAuth) {
        config.headers = config.headers || {};
        // Do not clobber existing Authorization if explicitly set
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {
      // no-op: localStorage might be unavailable in some contexts
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept all responses to capture new tokens and clear on specific auth errors.
axios.interceptors.response.use(
  (response) => {
    const newToken = response?.data?.token;
    // Only rotate token when already logged in (had a token before)
    const hadToken = !!localStorage.getItem("token");
    if (hadToken && newToken) {
      try {
        localStorage.setItem("token", newToken);
      } catch (_) {
        // ignore storage errors
      }
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const errorCode = error?.response?.data?.errorCode;
    // If backend uses custom error code for expired tokens, or returns 401
    if (status === 401 || errorCode === 1033) {
      try {
        localStorage.removeItem("token");
      } catch (_) {
        // ignore storage errors
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
