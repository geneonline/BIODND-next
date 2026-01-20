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
  const { user: userData, isLoading: userLoading } = useUser();
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
      const response = await axios.get(`/api/proxy/api/ChatDND/Go`);
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

              </div>

              <button
                type="button"
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden flex items-center gap-x-1"
                onClick={handleGoToChatDND}
              >
                Insights
                <img src={ai_icon} alt="ai icon" />
              </button>

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
              <a
                className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.geneonline.com/?utm_source=biodnd&utm_medium=homepage"
              >
                GeneOnline News
              </a>
            </div>
          </div>
          
          {/* mobile list */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className=" w-full md:w-72 px-4 py-6 left-0 top-16 absolute bg-white rounded-3xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex xl:hidden flex-col justify-start items-start"
            >
              <div className="self-stretch flex flex-col justify-center items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={isMobileDropdownOpen}
                  aria-label="Dropdown"
                  data-property-1="Hovered"
                  className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-between items-start gap-2"
                >
                  <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                    BioData
                  </span>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`flex-grow-0 flex-shrink-0 w-6 h-6 relative ${
                      isMobileDropdownOpen ? "rotate-0" : "-rotate-180"
                    }`}
                    preserveAspectRatio="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.6014 15.6013C18.8943 15.3084 18.8943 14.8335 18.6014 14.5406L12.6703 8.60956C12.6495 8.58192 12.6265 8.5554 12.6013 8.53022C12.4536 8.38248 12.2595 8.30927 12.0659 8.31057C11.8722 8.30922 11.6781 8.38244 11.5303 8.53022C11.5051 8.5554 11.4821 8.58193 11.4613 8.60957L5.53022 14.5406C5.23732 14.8335 5.23732 15.3084 5.53022 15.6013C5.82311 15.8942 6.29798 15.8942 6.59088 15.6013L12.0658 10.1264L17.5407 15.6013C17.8336 15.8942 18.3085 15.8942 18.6014 15.6013Z"
                      fill="#827F7F"
                    />
                  </svg>
                </button>

                {isMobileDropdownOpen && (
                  <div
                    className="w-full py-2 px-4 rounded-2xl z-10 flex flex-col gap-y-2"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      href={"/database/search/assets/clinical-trial"}
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M7.75 8C7.33579 8 7 8.33579 7 8.75C7 9.16421 7.33579 9.5 7.75 9.5H14.25C14.6642 9.5 15 9.16421 15 8.75C15 8.33579 14.6642 8 14.25 8H7.75Z"
                          fill="#827F7F"
                        />
                        <path
                          d="M7 11.75C7 11.3358 7.33579 11 7.75 11H14.25C14.6642 11 15 11.3358 15 11.75C15 12.1642 14.6642 12.5 14.25 12.5H7.75C7.33579 12.5 7 12.1642 7 11.75Z"
                          fill="#827F7F"
                        />
                        <path
                          d="M7.75 14C7.33579 14 7 14.3358 7 14.75C7 15.1642 7.33579 15.5 7.75 15.5H14.25C14.6642 15.5 15 15.1642 15 14.75C15 14.3358 14.6642 14 14.25 14H7.75Z"
                          fill="#827F7F"
                        />
                        <path
                          d="M7 17.75C7 17.3358 7.33579 17 7.75 17H11.25C11.6642 17 12 17.3358 12 17.75C12 18.1642 11.6642 18.5 11.25 18.5H7.75C7.33579 18.5 7 18.1642 7 17.75Z"
                          fill="#827F7F"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11 1.25C9.83401 1.25 8.8375 1.97566 8.43747 3H8C7.44772 3 7 3.44772 7 4V4.25H5C4.0335 4.25 3.25 5.0335 3.25 6V20C3.25 20.9665 4.0335 21.75 5 21.75H14.4091C14.5832 21.9189 14.7808 22.0693 15.0004 22.1961C16.4353 23.0246 18.2701 22.5329 19.0985 21.0981L22.0985 15.9019C22.9269 14.467 22.4353 12.6323 21.0004 11.8038C20.2914 11.3945 19.4847 11.3074 18.75 11.4973V6C18.75 5.0335 17.9665 4.25 17 4.25H15V4C15 3.44772 14.5523 3 14 3H13.5625C13.1625 1.97566 12.166 1.25 11 1.25ZM11 2.75C10.7185 2.75 10.4588 2.84302 10.2499 3H11.7501C11.5412 2.84302 11.2815 2.75 11 2.75ZM17.25 12.4172V6C17.25 5.86193 17.1381 5.75 17 5.75H15V6C15 6.55228 14.5523 7 14 7H8C7.44772 7 7 6.55228 7 6V5.75H5C4.86193 5.75 4.75 5.86193 4.75 6V20C4.75 20.1381 4.86193 20.25 5 20.25H13.5721C13.4143 19.5422 13.5112 18.7756 13.9023 18.0981L16.9023 12.9019C17.004 12.7259 17.1207 12.5641 17.25 12.4172ZM8.5 4.5V5.5H13.5V4.5H8.5ZM16.5048 16.5905L15.2014 18.8481C14.7872 19.5655 15.033 20.4829 15.7504 20.8971C16.4679 21.3113 17.3852 21.0655 17.7995 20.3481L19.1029 18.0905L16.5048 16.5905ZM19.8529 16.7914L20.7995 15.1519C21.2137 14.4345 20.9679 13.5171 20.2504 13.1029C19.533 12.6887 18.6156 12.9345 18.2014 13.6519L17.2548 15.2914L19.8529 16.7914Z"
                          fill="#827F7F"
                        />
                      </svg>
                      <span>Asset Explore</span>
                    </Link>

                    <Link
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                      href={"/company-home"}
                    >
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.93562 4.06543C9.93562 3.09893 10.7191 2.31543 11.6856 2.31543H19.4822C20.4487 2.31543 21.2322 3.09893 21.2322 4.06543V19.4818C21.2322 20.4483 20.4487 21.2318 19.4822 21.2318L4.06543 21.2318C3.09893 21.2318 2.31543 20.4483 2.31543 19.4818V10.5966C2.31543 9.63006 3.09893 8.84656 4.06543 8.84656H9.93562V4.06543ZM19.4822 19.7318H11.6856C11.548 19.7312 11.4356 19.6195 11.4356 19.4818V4.06543C11.4356 3.92736 11.5476 3.81543 11.6856 3.81543H19.4822C19.6203 3.81543 19.7322 3.92736 19.7322 4.06543V19.4818C19.7322 19.6199 19.6203 19.7318 19.4822 19.7318ZM9.93562 19.4818C9.93562 19.5667 9.94167 19.6501 9.95335 19.7318H4.06543C3.92736 19.7318 3.81543 19.6199 3.81543 19.4818V10.5966C3.81543 10.4585 3.92736 10.3466 4.06543 10.3466H9.93562V19.4818ZM13.6785 7.41943C13.2276 7.41943 12.8621 7.78494 12.8621 8.23582C12.8621 8.6867 13.2276 9.05221 13.6785 9.05221H17.4882C17.9391 9.05221 18.3046 8.6867 18.3046 8.23582C18.3046 7.78494 17.9391 7.41943 17.4882 7.41943H13.6785ZM12.8621 11.5015C12.8621 11.0506 13.2276 10.6851 13.6785 10.6851H17.4882C17.9391 10.6851 18.3046 11.0506 18.3046 11.5015C18.3046 11.9523 17.9391 12.3178 17.4882 12.3178H13.6785C13.2276 12.3178 12.8621 11.9523 12.8621 11.5015ZM13.6785 13.9507C13.2276 13.9507 12.8621 14.3162 12.8621 14.7671C12.8621 15.218 13.2276 15.5835 13.6785 15.5835H17.4882C17.9391 15.5835 18.3046 15.218 18.3046 14.7671C18.3046 14.3162 17.9391 13.9507 17.4882 13.9507H13.6785Z"
                          fill="#D9D9D9"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.4822 21.2318C20.4487 21.2318 21.2322 20.4483 21.2322 19.4818V4.06543C21.2322 3.09893 20.4487 2.31543 19.4822 2.31543H11.6856C10.7191 2.31543 9.93562 3.09893 9.93562 4.06543V8.84656H4.06543C3.09893 8.84656 2.31543 9.63006 2.31543 10.5966V19.4818C2.31543 20.4483 3.09893 21.2318 4.06543 21.2318L19.4822 21.2318ZM11.6856 19.7318C11.548 19.7312 11.4356 19.6195 11.4356 19.4818V4.06543C11.4356 3.92736 11.5476 3.81543 11.6856 3.81543H19.4822C19.6203 3.81543 19.7322 3.92736 19.7322 4.06543V19.4818C19.7322 19.6199 19.6203 19.7318 19.4822 19.7318H11.6856ZM9.93562 19.4818C9.93562 19.5667 9.94167 19.6501 9.95335 19.7318H4.06543C3.92736 19.7318 3.81543 19.6199 3.81543 19.4818V10.5966C3.81543 10.4585 3.92736 10.3466 4.06543 10.3466H9.93562V19.4818ZM12.8621 8.23582C12.8621 7.78494 13.2276 7.41943 13.6785 7.41943H17.4882C17.9391 7.41943 18.3046 7.78494 18.3046 8.23582C18.3046 8.6867 17.9391 9.05221 17.4882 9.05221H13.6785C13.2276 9.05221 12.8621 8.6867 12.8621 8.23582ZM13.6785 10.6851C13.2276 10.6851 12.8621 11.0506 12.8621 11.5015C12.8621 11.9523 13.2276 12.3178 13.6785 12.3178H17.4882C17.9391 12.3178 18.3046 11.9523 18.3046 11.5015C18.3046 11.0506 17.9391 10.6851 17.4882 10.6851H13.6785ZM12.8621 14.7671C12.8621 14.3162 13.2276 13.9507 13.6785 13.9507H17.4882C17.9391 13.9507 18.3046 14.3162 18.3046 14.7671C18.3046 15.218 17.9391 15.5835 17.4882 15.5835H13.6785C13.2276 15.5835 12.8621 15.218 12.8621 14.7671Z"
                          fill="#827F7F"
                        />
                      </svg>
                      <span>Company Search</span>
                    </Link>

                    <Link
                      href={"/about"}
                      className="flex items-center gap-x-2 py-2 px-3 text-sm1 text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                    >
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.5 8.75C12.5 9.16421 12.1642 9.5 11.75 9.5C11.3358 9.5 11 9.16421 11 8.75C11 8.33579 11.3358 8 11.75 8C12.1642 8 12.5 8.33579 12.5 8.75ZM11.75 10C11.3358 10 11 10.3358 11 10.75V16.25C11 16.6642 11.3358 17 11.75 17C12.1642 17 12.5 16.6642 12.5 16.25V10.75C12.5 10.3358 12.1642 10 11.75 10Z"
                          fill="#827F7F"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5ZM12.5 16.25C12.5 16.6642 12.1642 17 11.75 17C11.3358 17 11 16.6642 11 16.25V10.75C11 10.3358 11.3358 10 11.75 10C12.1642 10 12.5 10.3358 12.5 10.75V16.25ZM12.4895 8.62436C12.4964 8.66521 12.5 8.70719 12.5 8.75C12.5 9.16421 12.1642 9.5 11.75 9.5C11.3358 9.5 11 9.16421 11 8.75C11 8.70719 11.0036 8.66521 11.0105 8.62436C11.2421 8.54379 11.4909 8.5 11.75 8.5C12.0091 8.5 12.2579 8.54379 12.4895 8.62436Z"
                          fill="#827F7F"
                        />
                      </svg>
                      <span>About Us</span>
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-1"
                  onClick={handleGoToChatDND}
                >
                  <div className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                    Insights
                  </div>
                  <img src={ai_icon} alt="ai icon" />
                </button>

                <Link
                  href="/event"
                  data-property-1="Default"
                  className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-2"
                >
                  <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                    Event
                  </span>
                </Link>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.geneonline.com/?utm_source=biodnd&utm_medium=homepage"
                  data-property-1="Default"
                  className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-2"
                >
                  <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                    GeneOnline News
                  </span>
                </a>

                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-200"></div>

                <Link
                  href="/contact"
                  data-property-1="Default"
                  className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-2"
                >
                  <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                    Contact Sales
                  </span>
                </Link>

                {!token && (
                  <>
                    <Link
                      href="/account/login"
                      data-property-1="Default"
                      className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-2"
                    >
                      <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                        Login
                      </span>
                    </Link>

                    <Link
                      href="/account/register"
                      data-state="Default"
                      data-type="Primary"
                      className="self-stretch px-6 py-2 bg-primary-default hover:bg-primary-hovered rounded-[50px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center overflow-hidden"
                    >
                      <div className="justify-start text-white text-sm1 font-medium leading-relaxed">
                        Start Free Trial
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}


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
