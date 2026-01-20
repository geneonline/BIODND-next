"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import EmailIcon from "@/assets/svg/login_signup/email_icon.svg";

function VerifyPromptContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊效果 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />

        {/* 主要內容區塊 */}
        <div className="relative w-full sm:w-[580px] h-full sm:h-fit flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-10px text-center">
            
            <Image
                src={EmailIcon}
                alt="email icon"
                className="w-[72px] h-[72px]"
            />

            <h2 className="font-bold text-[30px] leading-140 text-[#222326]">
                Check your inbox to log in
            </h2>

            <p className="text-base text-[#52525B]">
                To complete your setup, please verify your email address. We’ve sent a verification email to <span className="font-bold text-[#18181B]">{email}</span>.
            </p>

            <div className="h-[1px] w-full bg-[#E4E4E7]"></div>

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
      </div>
    </div>
  );
}

export default function VerifyPromptPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyPromptContent />
        </Suspense>
    );
}
