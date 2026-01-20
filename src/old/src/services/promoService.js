const baseURL = import.meta.env.VITE_Effect_API;

function buildError(message, { code, status } = {}) {
  const error = new Error(message || "Unexpected promo service error");
  if (code) {
    error.code = code;
  }
  if (typeof status !== "undefined") {
    error.status = status;
  }
  return error;
}

export async function fetchOfferStatus(code) {
  if (!code) {
    throw buildError("Promo code is missing");
  }

  const response = await fetch(`${baseURL}/api/Offer/${encodeURIComponent(code)}/status`, {
    method: "GET",
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === "object" && data?.error ? data.error : text || "Failed to fetch offer";
    const codeValue = typeof data === "object" ? data?.errorCode : undefined;
    throw buildError(message, { code: codeValue, status: response.status });
  }

  if (typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data;
}

export async function makePaymentByPromoCode({ code, token }) {
  if (!code) {
    throw buildError("Promo code is missing");
  }
  if (!token) {
    throw buildError("Authentication required to redeem promo");
  }

  const response = await fetch(`${baseURL}/api/Stripe/MakePaymentByCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  const text = await response.text();
  if (!response.ok) {
    let message = text || "Failed to start promo checkout";
    let codeValue;
    if (text) {
      try {
        const data = JSON.parse(text);
        message = data?.error || message;
        codeValue = data?.errorCode;
      } catch (_) {
        // keep original message
      }
    }
    throw buildError(message, { code: codeValue, status: response.status });
  }

  if (!text) {
    throw buildError("Checkout link missing in response");
  }

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "string" && parsed.startsWith("http")) {
      return parsed;
    }
  } catch (_) {
    if (text.startsWith("http")) {
      return text;
    }
  }

  return text;
}
