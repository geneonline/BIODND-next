import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

interface PromoTrialCardProps {
  onClose?: () => void;
}

const FEATURES = [
  {
    icon: "/assets/svg/onboarding/AI.svg",
    text: "Unlimited Access to Startups & Assets",
  },
  {
    icon: "/assets/svg/onboarding/Handshake.svg",
    text: "Full Search Results, No Limits",
  },
  {
    icon: "/assets/svg/onboarding/News.svg",
    text: "Unlimited Use of Insights AI",
  },
  {
    icon: "/assets/svg/onboarding/Pill.svg",
    text: "Connect with Investors & Partners",
  },
  {
    icon: "/assets/svg/onboarding/Search.svg",
    text: "Stay Ahead with Real-Time News",
  },
];

export default function PromoTrialCard({ onClose }: PromoTrialCardProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;
      const container = modalRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll(focusableSelector);
      if (!focusables.length) return;
      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  // Ensure we are on client side for createPortal
  // Next.js handles this in useEffect generally, but strict checks are good.

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 font-Inter"
    >
      {/* Background Mask */}
      <div
        className="fixed inset-0 bg-white/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative max-h-[90vh] w-full max-w-[578px] overflow-y-auto rounded-2xl bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue p-[4px] shadow-primary-shadow">
        <div className="relative w-full rounded-xl bg-white px-4 py-10">
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute right-[16px] top-[16px] size-[24px] overflow-clip"
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

          {/* Content */}
          <div className="flex flex-col gap-6 items-center w-full">
            {/* Promo Container */}
            <div className="flex flex-col gap-2 items-center pt-4 px-8 w-full">
              <p className="text-text-primary text-24px font-bold text-center leading-140">
                Want full access to your search results?
              </p>
              <div className="flex gap-[5px] items-baseline px-2 py-1 text-center">
                <p className="text-primaryBlue-900 text-18px font-medium">
                  Try BIODND Pro free for
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-[20px] font-extrabold italic [filter:drop-shadow(1px_1px_0px_#000)]">
                  14 days.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center pb-2">
                <p className="px-3 text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-36px font-black italic [filter:drop-shadow(1px_1px_0px_#000)] leading-160">
                  $0
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-b from-Neon-Purple-light to-Neon-Blue text-base font-bold leading-160">
                  during trial!
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/subscribe"
              className="relative rounded-[50px] px-6 py-3 max-w-[400px] w-full text-18px font-medium text-white text-center
             bg-gradient-to-r from-Neon-Purple-light via-Neon-Blue to-Neon-Purple-light
             bg-[length:200%_200%] transition-all duration-300
             hover:animate-gradient-loop hover:scale-105 shadow-border-b"
            >
              Try BIODND Pro Free
            </Link>

            {/* Features */}
            <div className="bg-[rgba(198,241,255,0.4)] rounded-7px px-9 py-3 flex flex-col gap-1 items-center w-fit">
              {FEATURES.map((feature) => (
                <Feature
                  key={feature.text}
                  icon={feature.icon}
                  text={feature.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex gap-2 items-center w-[314px]">
      <Image src={icon} alt="" width={20} height={20} className="w-5 h-5" />
      <span className="text-textColor-secondary text-sm">{text}</span>
    </div>
  );
}
