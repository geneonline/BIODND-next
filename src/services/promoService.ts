const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

function buildError(
  message: string,
  { code, status }: { code?: string | number; status?: number } = {}
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = new Error(message || "Unexpected promo service error");
  if (code) {
    error.code = code;
  }
  if (typeof status !== "undefined") {
    error.status = status;
  }
  return error;
}

export async function fetchOfferStatus(code: string) {
  if (!code) {
    throw buildError("Promo code is missing");
  }

  const response = await fetch(
    `${baseURL}/api/Offer/${encodeURIComponent(code)}/status`,
    {
      method: "GET",
    }
  );

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? (data as any).error
        : text || "Failed to fetch offer";
    const codeValue =
      typeof data === "object" && data !== null && "errorCode" in data
        ? (data as any).errorCode
        : undefined;
    throw buildError(message, { code: codeValue, status: response.status });
  }

  if (typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data;
}

export async function makePaymentByPromoCode({
  code,
  token,
}: {
  code: string;
  token: string;
}) {
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
