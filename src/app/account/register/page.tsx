"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Policy from "@/components/auth/Policy";
import { useUser } from "@/hooks/useUser";

import Logo from "@/assets/svg/LOGO.svg";
import PwShow from "@/assets/svg/login_signup/pw_show.svg";
import PwHide from "@/assets/svg/login_signup/pw_hide.svg";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
        router.replace("/database/search");
    }
  }, [user, router]);

  const {
    register,
    loading,
    error,
    clearError,
    emailVerifyPending,
    emailVerifyMsg,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordConfirm, setPasswordConfirm] = useState(""); // Not used in UI but used in logic? 
  // Old code: const [passwordConfirm, setPasswordConfirm] = useState("");
  // Old code calls register(email, password, password); passing password as confirm.
  
  const [agree, setAgree] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Password validation function
  const validatePassword = (pw: string) => {
    const lengthValid = pw.length >= 8;
    const digitValid = /[0-9]/.test(pw);
    const lowerValid = /[a-z]/.test(pw);
    const upperValid = /[A-Z]/.test(pw);
    return lengthValid && digitValid && lowerValid && upperValid;
  };

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!validatePassword(password)) {
      setShowPasswordError(true);
      return;
    }
    setShowPasswordError(false);
    
    // Pass password as confirm password as per old implementation logic (or simplifiction)
    await register(email, password, password);
  };

  // When emailVerifyPending, redirect
  useEffect(() => {
    if (emailVerifyPending && emailVerifyMsg) {
      toast.success("Email has been sent!");
      // Pass email via query string
      router.push(`/account/verify-prompt?email=${encodeURIComponent(email)}`);
    }
  }, [emailVerifyPending, emailVerifyMsg, router, email]);

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊效果 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />

        {/* 主要內容區塊 */}
        <div className="relative w-full sm:w-[480px] h-full sm:h-fit flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-10px">
          {/* LOGO */}
          <Link href="/">
            <Image src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>

          {/* 內容區塊 */}
          <div className="flex flex-col items-center w-full gap-9">
            {/* 標題 */}
            <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center">
              Create your free account
            </h2>

            {/* Google 註冊 */}
            <div className="w-full">
              <GoogleLoginButton />
            </div>

            {/* 表單區 */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-6"
              autoComplete="off"
            >
              {/* Email 輸入 */}
              <label className="flex flex-col gap-1">
                <span className="text-textColor-primary text-sm1 font-medium">
                  Work email
                </span>
                <input
                  id="Email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=" border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none border"
                />
              </label>

              {/* Password 輸入 */}
              <label className="flex flex-col gap-1">
                <span className="text-textColor-primary text-sm1 font-medium">
                  Password
                </span>
                <div className="relative w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (showPasswordError) setShowPasswordError(false);
                    }}
                    required
                    className={`w-full border ${
                      showPasswordError
                        ? "border-warning focus:border-warning"
                        : "border-interface-gray-light focus:border-primary-color-blue"
                    } text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:ring-0 focus:outline-none pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                    tabIndex={0}
                  >
                    <Image
                      src={showPassword ? PwShow : PwHide}
                      alt={showPassword ? "hide password" : "show password"}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                {showPasswordError && (
                  <span className="text-xs2 text-warning mt-1">
                    Use at least 8 characters, including uppercase, lowercase,
                    and a number.
                  </span>
                )}
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 px-5 transition-all"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* 前端驗證密碼錯誤顯示 */}
            {localError && (
              <p className="text-warning text-sm1 mt-1 flex items-center gap-1">
                {localError}
              </p>
            )}
          </div>

          {/* 已有帳號導連結 */}
          <div className="w-full text-center gap-[10px]">
            <span className="text-sm1 text-textColor-secondary mr-2">
              Already have an account?
            </span>
            <Link
              href="/account/login"
              className="text-primary-default hover:text-primary-hovered text-sm1 font-normal underline transition"
            >
              Login
            </Link>
          </div>
        </div>
        {/* 條款 Checkbox */}
        {showPolicy && <Policy setShowPolicy={setShowPolicy} />}
        <div className="absolute bottom-30 sm:bottom-auto flex flex-col text-center w-full bg-white sm:bg-opacity-0 items-center px-4 gap-1 mt-0 sm:mt-6">
          <p className="text-xs3 text-textColor-secondary leading-[14px]">
            By signing up, you acknowledge that you have read and understood,
            <br />
            <span>
              and agree to Atlassian’s
              {/* Using a href for external/static page usually, but Policy component might be overlay */}
              {/* Old code has navigate to /terms, assuming it exists */}
              <Link
                href="/terms"
                target="_blank"
                className="text-primary-default underline mx-1 hover:cursor-pointer"
                rel="noopener noreferrer"
              >
                Terms
              </Link>
              and
              <Link
                href="/terms"
                target="_blank"
                className="text-primary-default underline mx-1 hover:cursor-pointer"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
