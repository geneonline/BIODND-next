"use client";

import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/context/GlobalContext";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/context/AuthContext";
import UserButtonAndList from "./UserButtonAndList";
import axios from "axios";
import { usePromo } from "@/context/PromoContext";
import { toast } from "react-toastify";

// TODO: Ensure these assets are available in public/
const logo = "/assets/svg/LOGO.svg";
const ai_icon = "/assets/svg/navbar/AI.svg";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const AuthLoadingIndicator = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm1 font-medium text-text-color-gray ${className}`}
    role="status"
    aria-live="polite"
  >
    <span
      className="inline-flex size-4 animate-spin rounded-full border-2 border-primary-default border-t-transparent"
      aria-hidden="true"
    />
    Checking session...
  </div>
);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [IsUserBtnOpen, SetUserBtnOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useContext(UserContext)!; // Non-null assertion for now or better safety
  const { token, logout } = useAuth();
  const { userData, userLoading } = useUser(token);
  const { hasPromo, showPromo, isLoading: promoLoading, offer } = usePromo();
  const [authStatusResolved, setAuthStatusResolved] = useState(!token);

  const pricingLabel = useMemo(() => {
    if (!offer || typeof offer.amountCents !== "number") {
      return "Pricing";
    }
    const dollars = offer.amountCents / 100;
    const formatted = dollars.toLocaleString("en-US", {
      minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `Try $${formatted}/mo`;
  }, [offer]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    if (token) {
      setAuthStatusResolved(false);
    } else {
      setAuthStatusResolved(true);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (!userLoading) {
      setAuthStatusResolved(true);
    }
  }, [token, userLoading]);

  useEffect(() => {
    if (
      userData &&
      Array.isArray(userData.reasonForUse) &&
      userData.reasonForUse.length === 0 &&
      sessionStorage.getItem("user_firstTime_login") !== "true"
    ) {
      toast.error("You have been logged out, please log in again.");
      logout();
    }

    if (
      typeof sessionStorage !== "undefined" &&
      JSON.parse(sessionStorage.getItem("user_firstTime_login") || "false") ===
        true &&
      !pathname?.endsWith("account/onboarding")
    ) {
      router.push("/account/onboarding");
    }
  }, [pathname, userData, token, logout, router]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleMenuClickOutside = (event: any) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleMenuClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    };
  }, [isMenuOpen]);

  const handlePricingClick = useCallback(() => {
    if (!hasPromo || promoLoading) return;
    if (token && userData?.subscriptionLevel === "Pro") {
      return;
    }
    showPromo({ forceFetch: !offer })?.catch(() => {});
  }, [
    hasPromo,
    promoLoading,
    offer,
    showPromo,
    userData?.subscriptionLevel,
    token,
  ]);

  const canShowPromoButton = Boolean(token && hasPromo);
  const showAuthLoading = Boolean(token) && !authStatusResolved;

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleGoToChatDND = async (e: any) => {
    e.preventDefault();

    if (!token) {
      router.push("/account/login");
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/api/ChatDND/Go`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result =
        typeof response.data === "string" ? response.data : response.data.url;
      if (typeof result === "string" && result.startsWith("http")) {
        window.location.href = result;
      } else {
        alert("unexpected response format");
      }
    } catch (error) {
      logout();
      router.push("/account/login");
    }
  };

  const logOutHandler = () => {
    logout();
  };

  return (
    <header
      className="fixed top-4 inset-x-0 flex justify-center md:flex-nowrap z-100 w-full 
    before:absolute before:inset-0 before:max-w-[1200px] before:mx-8 before:md:mx-16 before:lg:mx-20 before:xl:mx-28 before:2xl:mx-auto before:rounded-full before:bg-white before:flex before:justify-center before:shadow-[0px_4px_5px_0px_rgba(0,0,0,0.10)] before:backdrop-blur-md"
    >
      <nav className="relative max-w-[1200px] w-full py-2 px-6 flex items-center justify-between xl:py-4 mx-8 md:mx-16 lg:mx-20 xl:mx-28">
        <div className="flex items-center gap-4 xl:gap-6">
          {/* burger menu */}
          <div className="xl:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              className="hs-collapse-toggle size-8 flex justify-center items-center text-sm1 font-semibold rounded-full disabled:pointer-events-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg
                  className=" shrink-0 size-6 stroke-text-color-hover"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  className=" shrink-0 size-6  stroke-primary-color"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center w-fit">
            <Link
              className="w-[123px] xl:w-[153px] flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
              href="/"
              aria-label="Preline"
            >
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* Left Collapse */}
          <div
            className={`whitespace-nowrap hs-collapse hidden xl:contents overflow-hidden transition-all duration-300 basis-full grow`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-y-3 py-2 lg:gap-x-2 xl:gap-x-3 md:py-0">
              <div className="relative p-1" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center w-full text-sm1 font-medium text-text-color-gray hover:text-text-color-hover"
                  onClick={toggleDropdown}
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  aria-label="Dropdown"
                >
                  BioData
                  <svg
                    className={`duration-300 shrink-0 ms-auto md:ms-1 size-4 ${
                      isDropdownOpen ? "-rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-17 p-2 w-48 bg-white shadow-[0px_4px_5px_0px_rgba(0,0,0,0.10)] rounded-2xl z-10 flex flex-col gap-y-2">
                    <Link
                      href="/database/search/assets/clinical-trial"
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <span>Asset Explore</span>
                    </Link>
                    <Link
                      href="/company-home"
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <span>Company Search</span>
                    </Link>
                    <Link
                      target="_blank"
                      href="https://dealsearch.biodnd.com/scraping"
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <span>Deal Search</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <span>About Us</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* <button
                type="button"
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden flex items-center gap-x-1"
                onClick={handleGoToChatDND}
              >
                Insights
                <img src={ai_icon} alt="ai icon" />
              </button> */}

              <Link
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                href="/event"
              >
                Event
              </Link>
              <Link
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                href="/subscribe"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Right Collapse */}
        <div className="items-center lg:gap-x-2 xl:gap-x-3 hidden xl:flex">
          {canShowPromoButton && (
            <button
              type="button"
              onClick={handlePricingClick}
              className={`py-2.5 px-4 text-sm1 font-medium flex items-center rounded-full gap-1 border border-Purple-500 text-Purple-500 hover:bg-Purple-50 hover:text-Purple-600`}
            >
              {pricingLabel}
            </button>
          )}
          <Link
            href="/contact"
            className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
          >
            Contact Sales
          </Link>

          {showAuthLoading ? (
            <AuthLoadingIndicator />
          ) : token ? (
            <UserButtonAndList
              userData={userData}
              IsUserBtnOpen={IsUserBtnOpen}
              SetUserBtnOpen={SetUserBtnOpen}
              logOutHandler={logOutHandler}
              onPricingClick={handlePricingClick}
              disablePricing={
                !hasPromo ||
                promoLoading ||
                (!!token && userData?.subscriptionLevel === "Pro")
              }
              showPromoButton={canShowPromoButton}
              pricingLabel={pricingLabel}
            />
          ) : (
            <div className="flex items-center lg:gap-x-2 xl:gap-x-3">
              <Link
                href="/account/login"
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover"
              >
                Log in
              </Link>
              <Link
                href="/account/register"
                className="px-5 py-3 font-medium text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
              >
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
