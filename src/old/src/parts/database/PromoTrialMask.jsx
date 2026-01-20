import React from "react";

import AI_icon from "@/assets/svg/onboarding/AI.svg";
import Handshake_icon from "@/assets/svg/onboarding/Handshake.svg";
import News_icon from "@/assets/svg/onboarding/News.svg";
import Pill_icon from "@/assets/svg/onboarding/Pill.svg";
import Search_icon from "@/assets/svg/onboarding/Search.svg";

function formatPrice(amountCents) {
  if (typeof amountCents !== "number") return null;
  const value = amountCents / 100;
  const hasCents = Math.abs(value % 1) > 0;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export default function PromoTrialMask({
  offer,
  onClose,
  isLoading,
  error,
  onTry,
  isRedeeming,
  redeemError,
}) {
  const trialDays = offer?.trialDays;
  const amountText = formatPrice(offer?.amountCents);
  const intervalLabel = offer?.intervalType
    ? offer.intervalType.toLowerCase()
    : null;
  const termMonths = offer?.termMonths;
  const isUnlimited = offer?.isUnlimited;
  const seatsLimit = offer?.seatsLimit;
  const remainingSeats = offer?.remainingSeats;
  const description = offer?.description;
  const disableCta = isLoading || isRedeeming;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/70" />

      <div className="relative top-4 h-fit mt-12 mx-4 flex flex-col gap-2 items-end rounded-2xl max-w-[578px] w-full bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue p-[4px] shadow-primary-shadow">
        <div className="relative w-full h-full px-4 sm:px-6 md:px-8 xl:px-20 rounded-xl bg-white py-8 md:py-10 overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[16px] top-[16px] size-[24px] overflow-clip"
            aria-label="Close promo"
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
                fill="#222326"
              />
            </svg>
          </button>

          <div className="flex flex-col gap-6 items-center w-full">
            <div className="flex flex-col gap-2 items-center pt-4 px-4 sm:px-8 w-full">
              <p className="text-text-primary text-24px font-bold text-center leading-140">
                Try BIODND Pro free for
              </p>
              <p className="w-fit gap-1 flex items-center py-1.5 px-3 bg-Purple-100 rounded-full">
                <svg
                  width={21}
                  height={20}
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.0005 4.93746C15.236 5.65117 16.2239 6.72541 16.8318 8.01625C17.4398 9.3071 17.6387 10.7529 17.402 12.16C17.1654 13.567 16.5043 14.8682 15.5075 15.8891C14.5107 16.91 13.2257 17.6019 11.8247 17.8721C10.4237 18.1423 8.97353 17.978 7.66854 17.401C6.36355 16.8241 5.26603 15.8621 4.52302 14.644C3.78 13.4259 3.42698 12.0098 3.51124 10.5854C3.59551 9.16106 4.11303 7.79647 4.99448 6.67446C5.19648 6.41746 5.58448 6.45646 5.78748 6.71346C6.06548 7.06546 6.38148 7.38546 6.73048 7.66746C7.06248 7.93646 7.51648 7.61846 7.50348 7.19146C7.47155 6.23935 7.66766 5.2934 8.07548 4.43246C8.60921 3.30882 9.4776 2.3779 10.5615 1.76746C10.8085 1.62746 11.1115 1.75146 11.2385 2.00546C11.8504 3.23342 12.8112 4.2534 14.0005 4.93746ZM14.5005 11.9995C14.5005 13.0603 14.079 14.0777 13.3289 14.8279C12.5788 15.578 11.5613 15.9995 10.5005 15.9995C8.58748 15.9995 6.98048 14.6015 6.59048 12.8175C6.49748 12.3885 7.03048 12.1745 7.40448 12.4045C7.89222 12.7036 8.43791 12.8959 9.00548 12.9685C9.30848 13.0065 9.53648 12.7285 9.51548 12.4245C9.40553 10.9108 9.87568 9.41208 10.8305 8.23246C10.8811 8.16925 10.9479 8.12098 11.0238 8.0928C11.0997 8.06462 11.1819 8.05759 11.2615 8.07246C12.1732 8.24934 12.9951 8.73792 13.586 9.45442C14.177 10.1709 14.5003 11.0707 14.5005 11.9995Z"
                    fill="#5C51B1"
                  />
                </svg>

                <span className="text-Purple-600 italic font-bold leading-160">{`${trialDays} day${
                  trialDays > 1 ? "s" : ""
                } trial.`}</span>
              </p>

              <div>
                <div className="flex items-baseline justify-center pb-2">
                  <p className="px-3 text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-36px font-black italic [filter:drop-shadow(1px_1px_0px_#000)] leading-160">
                    {amountText ? `$${amountText}` : "$0"}
                  </p>
                  <p className="text-primaryBlue-900 font-medium text-18px leading-160">
                    USD/ month
                  </p>
                </div>

                {!isUnlimited && (
                  <p className="text-primaryBlue-900 font-medium text-18px leading-160">
                    {`First ${seatsLimit} users only (  `}
                    <span className="text-[#C10007]">{remainingSeats}</span>
                    {" spots left)"}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onTry}
              disabled={disableCta}
              className={`relative rounded-[50px] px-6 py-3 max-w-[400px] w-full text-18px font-medium text-white text-center
             bg-gradient-to-r from-Neon-Purple-light via-Neon-Blue to-Neon-Purple-light
             bg-[length:200%_200%] transition-all duration-300
             hover:animate-gradient-loop hover:scale-105 shadow-border-b ${
               disableCta ? "opacity-70 cursor-not-allowed" : ""
             }`}
            >
              {isRedeeming
                ? "Processing..."
                : `${amountText ? `$${amountText}` : "$0"} USD/ month`}
            </button>

            <div className="bg-[rgba(198,241,255,0.4)] rounded-7px px-4 sm:px-9 py-3 flex flex-col gap-2 sm:gap-1 items-center w-full sm:w-fit max-w-full">
              <Feature
                icon={AI_icon}
                text="Unlimited Access to Startups & Assets"
              />
              <Feature
                icon={Handshake_icon}
                text="Full Search Results, No Limits"
              />
              <Feature icon={News_icon} text="Unlimited Use of Insights AI" />
              <Feature
                icon={Pill_icon}
                text="Connect with Investors & Partners"
              />
              <Feature
                icon={Search_icon}
                text="Stay Ahead with Real-Time News"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-primaryBlue-900 text-sm font-medium">
                Loading offer...
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex gap-2 items-center w-full sm:w-[314px] max-w-full">
      <img src={icon} alt="" className="w-5 h-5" />
      <span className="text-textColor-secondary text-sm">{text}</span>
    </div>
  );
}
