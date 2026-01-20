"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Logo from "@/assets/svg/LOGO.svg";

function VerifyContent() {
  const { verifyEmail, sendVerifyMail } = useAuth();
  const router = useRouter();

  // We need to parse token from window.location.search to match old behavior (getting raw token)
  // useSearchParams returns decoded values, which might differ from what the old app extracted if it wanted raw encoded string
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const rawSearch = window.location.search;
        const rawMatch = rawSearch.match(/(?:\?|&)token=([^&]+)/);
        setToken(rawMatch ? rawMatch[1] : null);
    }
  }, []);

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verifyErrorMsg, setVerifyErrorMsg] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState("");
  const [resendErrorMsg, setResendErrorMsg] = useState("");
  
  // Use ref to track the verification promise to avoid double execution in React Strict Mode or re-renders
  const verifyPromiseRef = useRef<{ token: string; settled: boolean; promise: Promise<any> } | null>(null);

  useEffect(() => {
    // Wait until token is extracted
    if (token === null && typeof window !== "undefined" && !window.location.search.includes("token=")) {
       // If URL has no token at all
       setVerifyStatus("error");
       setVerifyErrorMsg("Invalid or expired verification link.");
       return;
    }
    if (!token) return; 

    // Logic from old code
    let cached = verifyPromiseRef.current;
    if (cached?.token === token && cached.settled) {
        return;
    }

    if (!cached || cached.token !== token) {
      cached = {
        token,
        settled: false,
        promise: verifyEmail(token),
      };
      verifyPromiseRef.current = cached;
    }

    setVerifyStatus("loading");

    let isMounted = true;
    let redirectTimer: NodeJS.Timeout;

    cached.promise
      .then((data: any) => {
        if (!isMounted) return;

        setVerifyStatus("success");
        toast.success("Verification successful! Logging you in...");

        const userData = data?.user ?? data ?? {};
        const reasonForUse = Array.isArray(userData.reasonForUse)
          ? userData.reasonForUse
          : null;
        const isFirstTime = reasonForUse ? reasonForUse.length === 0 : false;

        sessionStorage.setItem(
          "user_firstTime_login",
          isFirstTime ? "true" : "false"
        );

        const targetPath = isFirstTime
          ? "/account/onboarding"
          : "/database/search/assets";

        redirectTimer = setTimeout(() => {
          router.replace(targetPath);
        }, 1500);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const msg = err.response?.data?.error || err.message || "verify failed";
        setVerifyStatus("error");
        setVerifyErrorMsg(msg);

        // Parse token to get email if possible, format "xxx&email" roughly
        let email = "";
        try {
          const decoded = decodeURIComponent(token);
          const parts = decoded.split("&");
          email = parts[parts.length - 1];
        } catch {
          email = "";
        }

        // Navigate to verify-prompt with email
        // Logic says setTimeout 0
        setTimeout(() => {
             router.push(`/account/verify-prompt?email=${encodeURIComponent(email)}`);
        }, 0);
        
        toast.error(msg);
      })
      .finally(() => {
        if (cached === verifyPromiseRef.current) {
          cached.settled = true;
        }
      });

    return () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [token, verifyEmail, router]);

  const statusConfig = useMemo(() => {
    return {
      loading: {
        title: "Verifying your email",
        description: "Hang tight while we confirm your account details.",
        tone: "info" as const,
      },
      success: {
        title: "Email verified!",
        description: "All set. We are preparing your workspace and will redirect you shortly.",
        tone: "success" as const,
      },
      error: {
        title: "Verification failed",
        description: verifyErrorMsg || "We couldn't verify this link. Please request a new email.",
        tone: "error" as const,
      },
    };
  }, [verifyErrorMsg]);

  const effectiveStatus = verifyStatus === "idle" ? "loading" : verifyStatus;
  const { title, description, tone } = statusConfig[effectiveStatus] || statusConfig.loading;

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccessMsg("");
    setResendErrorMsg("");

    const email = prompt("please input your email to resend verification email");
    if (!email) {
      setResendErrorMsg("please input your email");
      setResendLoading(false);
      return;
    }

    try {
      await sendVerifyMail(email);
      setResendSuccessMsg("✅ verification email has been resent, please check your inbox");
    } catch {
      setResendErrorMsg("❌ resend verification email failed");
    } finally {
      setResendLoading(false);
    }
  };

  const renderStatusBadge = () => {
    if (tone === "success") {
      return (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B7247]">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-8 h-8"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 13 4 4L19 7"
            />
            </svg>
        </div>
      );
    }

    if (tone === "error") {
      return (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FDECEA] text-[#D32F2F]">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-8 h-8"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M12 5c-.9 0-1.767.39-2.36 1.08L4.71 12.5a3.25 3.25 0 0 0 0 4.24l2.93 3.42A3.25 3.25 0 0 0 9.64 21h4.72c.97 0 1.895-.42 2.57-1.16l2.93-3.42a3.25 3.25 0 0 0 0-4.24l-4.93-5.42A3.25 3.25 0 0 0 12 5Z"
            />
            </svg>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0FE] text-primary-default">
            <svg
            className="w-8 h-8 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                d="M21 12a9 9 0 0 1-9 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
            </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)] px-4">
      <div className="relative w-full sm:w-[480px] max-w-full">
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />
        <div className="relative flex flex-col items-center gap-8 bg-white rounded-none sm:rounded-2xl px-8 py-10 shadow-sm">
          <Link href="/">
            <Image src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>

          <div className="flex flex-col items-center text-center gap-6 w-full">
            {renderStatusBadge()}

            <div className="flex flex-col gap-2">
              <h2 className="text-[28px] leading-[36px] font-bold text-[#222326]">
                {title}
              </h2>
              <p className="text-base text-textColor-secondary max-w-[320px] mx-auto">
                {description}
              </p>
            </div>

            {effectiveStatus === "success" && (
              <div className="flex flex-col items-center gap-1 text-sm1 text-textColor-secondary">
                <span>We will take you to your workspace in a moment.</span>
                <span>If you are not redirected, you can close this tab and return later.</span>
              </div>
            )}

            {effectiveStatus === "loading" && (
              <span className="text-sm1 text-textColor-secondary">
                This usually takes just a few seconds.
              </span>
            )}

            {effectiveStatus === "error" && (
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  className="w-full bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 transition-all disabled:opacity-60"
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend verification email"}
                </button>
                {resendSuccessMsg && (
                  <p className="text-green-600 text-sm1">{resendSuccessMsg}</p>
                )}
                {resendErrorMsg && (
                  <p className="text-warning text-sm1">{resendErrorMsg}</p>
                )}
                <Link
                  href="/account/login"
                  className="text-sm1 text-primary-default hover:text-primary-hovered underline"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}

