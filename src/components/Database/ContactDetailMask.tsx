import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContactDetailMask() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {/* Background Mask */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>

      {/* Container */}
      <div className="relative flex flex-col gap-6 items-center max-w-[760px] px-6 text-center">
        <div className="absolute h-[22px] w-[144px] top-8 left-1/2 -translate-x-[calc(50%-144px/2)]" />
        <p className="text-textColor-secondary text-lg font-medium">
          Want full access to your search results?
          <br />
          Try BIODND Pro{" "}
          <span className="text-Neon-Green bg-Purple-500 font-semibold">
            free for 14 days.
          </span>{" "}
          — No charges during trial!
        </p>

        {/* Button */}
        <Link
          href="/subscribe"
          className="bg-gradient-to-l from-purple-400 to-[#03d4ef] text-white rounded-full px-6 py-3 text-lg font-medium shadow-sm"
        >
          Try BIODND Pro Free
        </Link>

        {/* Features */}
        <div className="flex flex-col text-textColor-secondary gap-2 items-center">
          <Feature
            icon="/assets/svg/onboarding/AI.svg"
            text="Unlimited Access to Startups & Assets"
          />
          <Feature
            icon="/assets/svg/onboarding/Handshake.svg"
            text="Full Search Results, No Limits"
          />
          <Feature
            icon="/assets/svg/onboarding/News.svg"
            text="Unlimited Use of Insights AI"
          />
          <Feature
            icon="/assets/svg/onboarding/Pill.svg"
            text="Connect with Investors & Partners"
          />
          <Feature
            icon="/assets/svg/onboarding/Search.svg"
            text="Stay Ahead with Real-Time News"
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex gap-2 items-center w-[324px]">
      <Image src={icon} alt="" width={20} height={20} className="w-5 h-5" />
      <span className="text-textColor-secondary text-base">{text}</span>
    </div>
  );
}
