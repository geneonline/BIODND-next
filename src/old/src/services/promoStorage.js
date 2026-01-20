const PROMO_CODE_KEY = "promo_code";
const PROMO_PENDING_KEY = "promo_pending_after_login";
const PROMO_HAS_SHOWN_KEY = "promo_has_shown";

export const promoStorageKeys = {
  code: PROMO_CODE_KEY,
  pendingAfterLogin: PROMO_PENDING_KEY,
  hasShown: PROMO_HAS_SHOWN_KEY,
};

export function getStoredPromoCode() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PROMO_CODE_KEY);
}

export function setStoredPromoCode(code) {
  if (typeof window === "undefined") return;
  if (code) {
    sessionStorage.setItem(PROMO_CODE_KEY, code);
  } else {
    sessionStorage.removeItem(PROMO_CODE_KEY);
  }
}

export function markPromoPendingAfterLogin() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROMO_PENDING_KEY, "true");
}

export function consumePromoPendingAfterLogin() {
  if (typeof window === "undefined") return false;
  const pending = sessionStorage.getItem(PROMO_PENDING_KEY) === "true";
  if (pending) {
    sessionStorage.removeItem(PROMO_PENDING_KEY);
  }
  return pending;
}

export function hasPromoBeenShown() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PROMO_HAS_SHOWN_KEY) === "true";
}

export function markPromoAsShown() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROMO_HAS_SHOWN_KEY, "true");
}

export function resetPromoShownFlag() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROMO_HAS_SHOWN_KEY);
}

export function clearPromoState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROMO_CODE_KEY);
  sessionStorage.removeItem(PROMO_PENDING_KEY);
  sessionStorage.removeItem(PROMO_HAS_SHOWN_KEY);
}
