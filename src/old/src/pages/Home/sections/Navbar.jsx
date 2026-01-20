import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import logo from "@/assets/svg/LOGO.svg";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "@/data/context";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/context/AuthContext";
import UserButtonAndList from "../components/UserButtonAndList";
import axios from "axios";
import ai_icon from "@/assets/svg/navbar/AI.svg";
import { usePromo } from "@/context/PromoContext";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_Effect_API;

const AuthLoadingIndicator = ({ className = "" }) => (
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
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [IsUserBtnOpen, SetUserBtnOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const [user, setUser] = useContext(UserContext);
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
    // 如果是首次登入(reasonForUse 是空的) 又沒有在 onboarding 流程中，就讓他直接登出
    if (
      userData &&
      Array.isArray(userData.reasonForUse) &&
      userData.reasonForUse.length === 0 &&
      sessionStorage.getItem("user_firstTime_login") !== "true"
    ) {
      toast.error("You have been logged out, please log in again.");
      logout();
    }

    // when you first log in, you have to setup your user profile,
    // or you will always in userprofile page.
    if (
      JSON.parse(sessionStorage.getItem("user_firstTime_login")) === true &&
      location.pathname.endsWith("account/onboarding") === false
    ) {
      navigate("/account/onboarding");
    }
  }, [location, userData, token]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control burger menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleMenuClickOutside = (event) => {
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

  // Insights AI(ChatDND) 行為取代 handler
  const handleGoToChatDND = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/account/login");
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/api/ChatDND/Go`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 假設回傳即為連結，必要時調整為 response.data.url
      const result =
        typeof response.data === "string" ? response.data : response.data.url;
      if (typeof result === "string" && result.startsWith("http")) {
        window.location.href = result;
      } else {
        alert("unexpected response format");
      }
    } catch (error) {
      logout();
      navigate("/account/login");
    }
  };

  const logOutHandler = () => {
    logout();
  };

  return (
    <>
      <header
        className="fixed top-4 inset-x-0 flex justify-center md:flex-nowrap z-100 w-full 
    before:absolute before:inset-0 before:max-w-[1200px] before:mx-8 before:md:mx-16 before:lg:mx-20 before:xl:mx-28 before:2xl:mx-auto before:rounded-full before:bg-white before:flex before:justify-center before:shadow-[0px_4px_5px_0px_rgba(0,0,0,0.10)] before:backdrop-blur-md"
      >
        <nav className="relative max-w-[1200px] w-full py-2 px-6 flex items-center justify-between xl:py-4 mx-8 md:mx-16 lg:mx-20 xl:mx-28">
          {/* 這邊 mx 要和 header before:mx 同步數值，不然會跑版 */}
          <div className="flex items-center gap-4 xl:gap-6">
            {/* burger menu */}
            <div className="xl:hidden">
              <button
                ref={menuButtonRef}
                type="button"
                className="hs-collapse-toggle size-8 flex justify-center items-center text-sm1 font-semibold rounded-full disabled:pointer-events-none"
                id="hs-navbar-floating-dark-collapse"
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
              {/* Logo */}
              <a
                className="w-[123px] xl:w-[153px] flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
                href="/"
                aria-label="Preline"
              >
                <img src={logo} alt="logo" />
              </a>
              {/* End Logo */}
            </div>

            {/*left Collapse */}
            <div
              id="hs-navbar-floating-dark"
              className={`whitespace-nowrap hs-collapse hidden xl:contents overflow-hidden transition-all duration-300 basis-full grow `}
              aria-labelledby="hs-navbar-floating-dark-collapse"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-y-3 py-2 lg:gap-x-2 xl:gap-x-3 md:py-0">
                {/* Dropdown */}
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
                    <div
                      className="absolute top-17 p-2 w-48 bg-white shadow-[0px_4px_5px_0px_rgba(0,0,0,0.10)] rounded-2xl z-10 flex flex-col gap-y-2"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        to={"/database/search/assets/clinical-trial"}
                        className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
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
                        className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                        to={"/company-home"}
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
                        className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
                        target="_blank"
                        to={"https://dealsearch.biodnd.com/scraping"}
                      >
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 relative"
                          preserveAspectRatio="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.75 3.375C3.75 2.33979 4.58979 1.5 5.625 1.5H10.5C13.0859 1.5 15.5658 2.52723 17.3943 4.35571C19.2228 6.18419 20.25 8.66414 20.25 11.25V20.625C20.25 21.6602 19.4102 22.5 18.375 22.5H5.625C4.58979 22.5 3.75 21.6602 3.75 20.625V3.375ZM18.75 11.625C18.75 10.9288 18.4734 10.2611 17.9812 9.76884C17.4889 9.27656 16.8212 9 16.125 9H14.625C14.1277 9 13.6508 8.80246 13.2992 8.45083C12.9475 8.09919 12.75 7.62228 12.75 7.125V5.625C12.75 4.92881 12.4734 4.26113 11.9812 3.76884C11.4889 3.27656 10.8212 3 10.125 3H5.625C5.41821 3 5.25 3.16821 5.25 3.375V20.625C5.25 20.8318 5.41821 21 5.625 21H18.375C18.5818 21 18.75 20.8318 18.75 20.625V11.625ZM13.7575 3.67034C14.0779 4.2658 14.25 4.93653 14.25 5.625V7.125C14.25 7.22446 14.2895 7.31984 14.3598 7.39016C14.4302 7.46049 14.5255 7.5 14.625 7.5H16.125C16.8135 7.5 17.4842 7.67212 18.0797 7.99251C17.6702 7.03985 17.081 6.16379 16.3336 5.41637C15.5862 4.66895 14.7102 4.07976 13.7575 3.67034ZM7.5 15C7.5 14.5858 7.83579 14.25 8.25 14.25H15.75C16.1642 14.25 16.5 14.5858 16.5 15C16.5 15.4142 16.1642 15.75 15.75 15.75H8.25C7.83579 15.75 7.5 15.4142 7.5 15ZM7.5 18C7.5 17.5858 7.83579 17.25 8.25 17.25H12C12.4142 17.25 12.75 17.5858 12.75 18C12.75 18.4142 12.4142 18.75 12 18.75H8.25C7.83579 18.75 7.5 18.4142 7.5 18Z"
                            fill="#827F7F"
                          />
                        </svg>

                        <span>Deal Search</span>
                      </Link>

                      <Link
                        to={"/about"}
                        className="flex items-center gap-x-2 py-2 px-3 text-sm1 font-medium text-text-color-gray hover:bg-secondery-color-c rounded-lg"
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
                </div>

                <button
                  type="button"
                  className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden flex items-center gap-x-1"
                  onClick={handleGoToChatDND}
                  aria-current="page"
                >
                  Insights
                  <img src={ai_icon} alt="ai icon" />
                </button>

                <Link
                  className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                  to="/event"
                >
                  Event
                </Link>

                <Link
                  className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                  to="/subscribe"
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
                      to={"/database/search/assets/clinical-trial"}
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
                      to={"/company-home"}
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
                      to={"/about"}
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
                  to="/event"
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
                  to="/contact"
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
                      to="/account/login"
                      data-property-1="Default"
                      className="self-stretch px-3 py-2 hover:bg-secondery-color-c rounded-lg inline-flex justify-start items-center gap-2"
                    >
                      <span className="justify-start text-text-color-gray text-sm1 font-medium leading-relaxed">
                        Login
                      </span>
                    </Link>

                    <Link
                      to="/account/register"
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

          {/* right Collapse */}
          <div className=" items-center lg:gap-x-2 xl:gap-x-3 hidden xl:flex">
            {canShowPromoButton && (
              <button
                type="button"
                onClick={handlePricingClick}
                className={`py-2.5 px-4 text-sm1 font-medium focus:outline-hidden flex items-center rounded-full gap-1 border border-Purple-500 text-Purple-500 hover:bg-Purple-50 hover:text-Purple-600`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1764 2.6729C14.0194 1.73608 16.058 1.24851 18.1255 1.25C18.4703 1.25025 18.7497 1.5297 18.75 1.87451C18.7516 3.94215 18.2641 5.98085 17.3273 7.82408C16.4512 9.54792 15.2053 11.055 13.6805 12.2389C13.7919 12.9375 13.7708 13.6522 13.6168 14.3453C13.4326 15.1738 13.0634 15.95 12.5367 16.6155C12.01 17.2811 11.3395 17.8189 10.5755 18.1885C9.81145 18.5582 8.97367 18.7501 8.12491 18.75C7.77977 18.75 7.5 18.4701 7.5 18.125V14.6818C7.49239 14.6763 7.48489 14.6706 7.4775 14.6647C6.68392 14.0354 5.96539 13.3169 5.33611 12.5233C5.33004 12.5157 5.32417 12.5079 5.31849 12.5H1.875C1.52987 12.5 1.25006 12.2203 1.25 11.8751C1.24985 11.0263 1.44181 10.1884 1.81151 9.42425C2.18122 8.66013 2.71907 7.98959 3.38476 7.46288C4.05044 6.93617 4.82671 6.56696 5.65538 6.38291C6.34852 6.22895 7.0633 6.20789 7.762 6.31947C8.94573 4.79482 10.4527 3.54902 12.1764 2.6729ZM6.94301 7.49962C6.60234 7.49433 6.26113 7.52883 5.9264 7.60317C5.28189 7.74632 4.67812 8.03349 4.16037 8.44315C3.64261 8.85281 3.22428 9.37434 2.93673 9.96866C2.74051 10.3742 2.60866 10.8065 2.54474 11.25H5.37452C5.6986 9.92463 6.22839 8.65929 6.94301 7.49962ZM6.49421 11.9666C6.95935 12.5254 7.47451 13.0406 8.0333 13.5058C9.69133 13.1642 11.256 12.4702 12.6227 11.4705L12.6237 11.4698C14.1356 10.3685 15.3655 8.92518 16.213 7.25772C16.9634 5.78123 17.3951 4.16609 17.4831 2.5169C15.8341 2.60502 14.2191 3.0368 12.7428 3.78721C11.0754 4.6347 9.63224 5.86455 8.53101 7.37633L8.53029 7.37732C7.53075 8.74385 6.83596 10.309 6.49421 11.9666ZM8.75 14.6256V17.4552C9.1934 17.3913 9.6256 17.2595 10.0311 17.0633C10.6253 16.7758 11.1468 16.3575 11.5565 15.8399C11.9661 15.3222 12.2533 14.7185 12.3965 14.0741C12.4709 13.7395 12.5054 13.3984 12.5002 13.0579C11.3405 13.7724 10.0754 14.3017 8.75 14.6256ZM12.5 6.875C12.3342 6.875 12.1753 6.94085 12.0581 7.05806C11.9408 7.17527 11.875 7.33424 11.875 7.5C11.875 7.66576 11.9408 7.82473 12.0581 7.94195C12.1753 8.05915 12.3342 8.125 12.5 8.125C12.6658 8.125 12.8247 8.05916 12.9419 7.94195C13.0592 7.82473 13.125 7.66576 13.125 7.5C13.125 7.33424 13.0592 7.17527 12.9419 7.05806C12.8247 6.94085 12.6658 6.875 12.5 6.875ZM11.1742 6.17418C11.5258 5.82255 12.0027 5.625 12.5 5.625C12.9973 5.625 13.4742 5.82255 13.8258 6.17418C14.1775 6.52581 14.375 7.00272 14.375 7.5C14.375 7.99728 14.1775 8.4742 13.8258 8.82583C13.4742 9.17746 12.9973 9.375 12.5 9.375C12.0027 9.375 11.5258 9.17746 11.1742 8.82583C10.8225 8.4742 10.625 7.99728 10.625 7.5C10.625 7.00272 10.8225 6.52581 11.1742 6.17418ZM4.5107 13.4937C4.71667 13.7707 4.6591 14.1622 4.38211 14.3682C3.92544 14.7078 3.57037 15.1659 3.35537 15.6928C3.20156 16.0697 3.12362 16.4717 3.12421 16.8757C3.52831 16.8762 3.93027 16.7982 4.30724 16.6443C4.83417 16.4292 5.2922 16.074 5.63171 15.6172C5.83761 15.3401 6.22912 15.2825 6.50616 15.4884C6.7832 15.6943 6.84086 16.0858 6.63496 16.3628C6.15939 17.0027 5.51781 17.5002 4.77972 17.8016C4.04162 18.1029 3.23515 18.1966 2.44764 18.0724C2.17991 18.0302 1.96991 17.8202 1.92764 17.5525C1.80334 16.765 1.89684 15.9586 2.19801 15.2205C2.49917 14.4824 2.99653 13.8408 3.63622 13.3651C3.91321 13.1592 4.30473 13.2167 4.5107 13.4937Z"
                    fill="#5C51B1"
                  ></path>
                </svg>
                {pricingLabel}
              </button>
            )}

            <Link
              to="/contact"
              className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
            >
              Contact Sales
            </Link>

            {showAuthLoading ? (
              <div className="flex items-center lg:gap-x-2 xl:gap-x-3">
                <AuthLoadingIndicator />
              </div>
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
                  (token && userData?.subscriptionLevel === "Pro")
                }
                showPromoButton={canShowPromoButton}
                pricingLabel={pricingLabel}
              />
            ) : (
              // login/sign up
              <div className="flex items-center lg:gap-x-2 xl:gap-x-3">
                <Link
                  to="/account/login"
                  className="p-1 text-sm1 font-medium text-text-color-gray hover:text-text-color-hover focus:outline-hidden "
                >
                  Log in
                </Link>

                <Link
                  className="px-5 py-3 font-medium text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
                  to="/account/register"
                >
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>

          {/* user button */}
          <div className="xl:hidden">
            {showAuthLoading ? (
              <div className="flex justify-end">
                <AuthLoadingIndicator />
              </div>
            ) : (
              token && (
                <UserButtonAndList
                  userData={userData}
                  IsUserBtnOpen={IsUserBtnOpen}
                  SetUserBtnOpen={SetUserBtnOpen}
                  logOutHandler={logOutHandler}
                  onPricingClick={handlePricingClick}
                  disablePricing={
                    !hasPromo ||
                    promoLoading ||
                    (token && userData?.subscriptionLevel === "Pro")
                  }
                  showPromoButton={canShowPromoButton}
                  pricingLabel={pricingLabel}
                />
              )
            )}
          </div>
        </nav>
      </header>
      {/* page layout */}
      <Outlet />
    </>
  );
};
export default Navbar;
