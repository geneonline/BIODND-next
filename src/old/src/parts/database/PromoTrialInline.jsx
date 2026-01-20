import React from "react";

import AI_icon from "@/assets/svg/onboarding/AI.svg";
import Handshake_icon from "@/assets/svg/onboarding/Handshake.svg";
import News_icon from "@/assets/svg/onboarding/News.svg";
import Pill_icon from "@/assets/svg/onboarding/Pill.svg";
import Search_icon from "@/assets/svg/onboarding/Search.svg";

const FEATURES = [
  { icon: AI_icon, text: "Unlimited Access to Startups & Assets" },
  { icon: Handshake_icon, text: "Full Search Results, No Limits" },
  { icon: News_icon, text: "Unlimited Use of Insights AI" },
  { icon: Pill_icon, text: "Connect with Investors & Partners" },
  { icon: Search_icon, text: "Stay Ahead with Real-Time News" },
];

export default function PromoTrialInline({ ctaHref = "/subscribe" }) {
  return (
    <section className="max-w-[960px] mx-auto">
      <div className="rounded-2xl bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue p-[4px] shadow-primary-shadow">
        <div className="rounded-xl bg-white px-6 md:px-12 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-text-primary text-24px md:text-28px font-bold leading-140">
                  Want full access to your search results?
                </p>
                <div className="flex flex-wrap gap-2 items-baseline justify-center ">
                  <span className="text-primaryBlue-900 text-18px font-medium">
                    Try BIODND Pro free for
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-[20px] font-extrabold italic [filter:drop-shadow(1px_1px_0px_#000)]">
                    14 days.
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start justify-center gap-1">
                <p className="px-3 text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-36px font-black italic [filter:drop-shadow(1px_1px_0px_#000)] leading-160">
                  $0
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-base font-bold leading-160">
                  during trial!
                </p>
              </div>

              <a
                href={ctaHref}
                className="relative rounded-full px-6 py-3 max-w-[320px] w-full text-18px font-medium text-white text-center
               bg-gradient-to-r from-Neon-Purple-light via-Neon-Blue to-Neon-Purple-light
               bg-[length:200%_200%] transition-transform duration-300
               hover:animate-gradient-loop hover:scale-105 shadow-border-b"
              >
                Try BIODND Pro Free
              </a>
            </div>

            <div className="bg-[rgba(198,241,255,0.4)] rounded-2xl px-6 py-5 flex flex-col gap-3 w-full max-w-[360px]">
              {FEATURES.map(({ icon, text }) => (
                <Feature key={text} icon={icon} text={text} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex gap-3 items-center">
      <img src={icon} alt="" className="w-5 h-5" />
      <span className="text-textColor-secondary text-sm">{text}</span>
    </div>
  );
}
