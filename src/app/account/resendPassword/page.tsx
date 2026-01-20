"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Logo from "@/assets/svg/LOGO.svg";
import ResendMailIcon from "@/assets/svg/login_signup/resendmail.svg";


import { useUser } from "@/hooks/useUser";

export default function ResendPasswordPage() {
  const { user } = useUser();
  const { forgotPassword } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize email state once on mount is safer in Next.js structure
  // searchParams might be null initially during partial hydration but usually fine in client comp
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resentLoading, setResentLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
        router.replace("/database/search");
    }
  }, [user, router]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    isSent ? setResentLoading(true) : setLoading(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
      toast.success("Email has been sent!");
    } catch {
      toast.error("something went wrong, please try again");
    } finally {
      setLoading(false);
      setResentLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />
        <div className="relative h-full w-full sm:w-[480px] flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-2xl">
          <Link href="/">
            <Image src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>
          {!isSent ? (
            <div className="flex flex-col items-center w-full gap-9">
              <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center mb-2">
                Reset Your Password
              </h2>
              <p className="text-textColor-secondary text-center text-base">
                Enter your email and we’ll send you a link to reset your
                password.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-6"
                autoComplete="off"
              >
                <label className="flex flex-col gap-1">
                  <input
                    id="email"
                    type="email"
                    placeholder="xxxx@xxxxx.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className=" border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none border"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 px-5 transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full gap-9">
              <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center mb-2">
                Reset Your Password
              </h2>
              <div className="flex flex-col items-center w-full gap-1">
                <span className="text-textColor-secondary text-center text-base">
                  We’ve sent a password reset link to
                </span>
                <span className="text-[#7369CC] text-base font-medium text-center">
                  {email || "xxxx@xxxxx.com"}
                </span>
                <span className="text-textColor-secondary text-center text-base">
                  Please check your email.
                </span>
              </div>
              {/* mail illustration */}
              <div className="flex flex-col items-center my-2">
                <Image src={ResendMailIcon} alt="resend mail icon" />
              </div>
              {/* Resend Link */}
              <div className="w-full flex justify-center items-center">
                <span className="text-sm1 text-textColor-secondary mr-2">
                  Haven’t got the email?
                </span>
                <button
                  disabled={resentLoading}
                  onClick={() => handleSubmit()}
                  className="text-primary-default hover:text-primary-hovered text-sm1 font-normal underline transition cursor-pointer px-1"
                  tabIndex={0}
                >
                  {resentLoading ? "Resending..." : "Resend link"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
