import { useState, useEffect, useContext, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext, messageInfoContext } from "@/data/context";
import { useTranslation } from "react-i18next";

import { mutate } from "swr";
import { updateHistory } from "@/data/api";
import { useAuth } from "@/context/AuthContext";

import { useUser } from "@/hooks/useUser";

import MessageSending from "../message/MessageSending";
import Messaging from "../message/Messaging";

import NeedToPay_popup from "@/widgets/NeedToPay_popup";
import Signup_popup from "@/widgets/user/Signup_popup";

import logo_white from "@/assets/svg/LOGO_white.svg";

import DatabaseBtn from "./nav/DatabaseBtn";
import MobileNav from "./nav/MobileNav";
import axios from "axios";

const baseURL = import.meta.env.VITE_Effect_API;

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  // const [messageInfo, setMessageInfo] = useContext(messageInfoContext);
  const [IsMenuOpen, setMenuOpen] = useState(false);
  const [IsUserBtnOpen, SetUserBtnOpen] = useState(false);
  const [IsHomePage, setIsHomePage] = useState(true);
  const [inWhichUserPage, setInWhichUserPage] = useState("no");
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [prevLocation, setPrevLocation] = useState("");
  // const [messageUnreadIcon, setMessageUnreadIcon] = useState(false);
  const [IsNeedtopayPopup, setIsNeedtopayPopup] = useState(false);
  const [isSignupPopup, setIsSignupPopup] = useState(false);
  const { token, logout } = useAuth();
  const { userData } = useUser(token);

  useEffect(() => {
    // 更新前一個路由狀態
    return () => {
      setPrevLocation(location.pathname);
    };
  }, [location]);

  //change location
  useEffect(() => {
    console.log("change location.");
    window.scrollTo(0, 0);
    setIsHomePage(location.pathname === "/");

    updateHistory({
      userData: userData || {},
      event: "change location",
      eventData: {
        routerURL: location.pathname,
      },
    });

    // 如果是首次登入(reasonForUse 是空的) 又沒有在 onboarding 流程中，就讓他直接登出
    if (
      userData &&
      Array.isArray(userData.reasonForUse) &&
      userData.reasonForUse.length === 0 &&
      sessionStorage.getItem("user_firstTime_login") !== "true"
    ) {
      logout();
    }

    //when leave login page...
    if (prevLocation === "/user/login" && location.pathname !== "/user/login") {
      console.log("Leaving /user/login");
      sessionStorage.removeItem("login_to_where");
    }

    //just render user button ui
    if (
      location.pathname.endsWith("/user/profile") ||
      location.pathname.endsWith("/user/userprofile_setting")
    ) {
      console.log("i am in userprofile.");
      // mutate(
      //   `${import.meta.env.VITE_API_URL}/user_profiles/${userData?.id}.json`
      // );

      setInWhichUserPage("user profile");
      if (JSON.parse(sessionStorage.getItem("user_firstTime_login")) === true) {
        // dosomething
      }
    } else if (
      location.pathname.endsWith("/user/companyprofile") ||
      location.pathname.endsWith("/user/companyprofile_setting")
    ) {
      setInWhichUserPage("my company profile");
    } else if (location.pathname.endsWith("/user/mylist")) {
      setInWhichUserPage("my list");
    } else if (location.pathname.endsWith("/subscribe")) {
      setInWhichUserPage("subscribe");
    } else if (location.pathname.includes("/user/editneeds")) {
      // if (userData?.user_id !== 1) {
      //   navigate("/user/profile");
      // }
    } else {
      setInWhichUserPage("no");
    }

    // when you first log in, you have to setup your user profile,
    // or you will always in userprofile page.
    if (
      JSON.parse(sessionStorage.getItem("user_firstTime_login")) === true &&
      location.pathname.endsWith("account/onboarding") === false
    ) {
      navigate("/account/onboarding");
    }
  }, [location, prevLocation, userData]);

  // ChatDND 行為取代 handler
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
      alert("API error, please try again later.");
    }
  };

  const logOutHandler = (e) => {
    e.preventDefault();
    SetUserBtnOpen(false);
    logout();
    navigate("/");
  };

  const changeLanguageHandler = () => {
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === "en" ? "zh" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="relative">
      {/* nav */}
      <div
        className={`fixed top-0 w-full h-15 xl:h-19 bg-black duration-300 flex items-center md:justify-between xl:justify-between md:text-sm1 xl:text-sm1 z-100`}
      >
        <div className="flex items-center h-full">
          {/* logo */}
          <Link to="/" className="ml-6 md:ml-15 xl:ml-21 md:mr-10 xl:mr-15">
            <img
              className="md:min-w-[110px] xl:min-w-[170px]"
              src={logo_white}
              alt="logo"
            />
          </Link>

          {/* main link list */}
          <ul className=" list-none h-full hidden md:flex items-center min-w-[1/3] md:ml-0 xl:ml-19 ">
            <li className="h-full">
              <DatabaseBtn
                userData={userData}
                popUp={isSignupPopup}
                setPopUp={setIsSignupPopup}
              />
            </li>

            <li className="h-full">
              <button
                type="button"
                className={`group flex items-center md:px-3.5 xl:px-5 h-full 
                   text-white border-white
                 hover:text-main-blue transition-colors duration-300`}
                onClick={handleGoToChatDND}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                {t("nav.chatbot")}
                <span
                  className={`ml-1 rounded-full leading-140 text-xs px-2 border transition-colors duration-300 
                      text-white border-white
                   group-hover:text-main-blue group-hover:border-main-blue`}
                >
                  BETA
                </span>
              </button>
            </li>

            {/* <li className="h-full">
              <Link
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full ${
                  IsHomePage ? "text-main-text-gray" : "text-white"
                } hover:text-main-blue duration-300`}
                to="/connect/demand"
              >
                {t("nav.bridging")}
              </Link>
            </li> */}

            {/* <li className="h-full">
              <a
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full ${
                  IsHomePage ? "text-main-text-gray" : "text-white"
                } hover:text-main-blue duration-300`}
                href="https://www.geneonline.com/?utm_source=biodnd&utm_medium=homepage"
              >
                {t("nav.news")}
              </a>
            </li> */}
            {/* <li>
              <Link
                className={` md:px-3.5 xl:px-7.5 ${
                  IsHomePage ? "text-main-text-gray" : "text-white"
                } hover:text-main-blue duration-300`}
                to="/member-network"
              >
                {t("nav.member_network")}
              </Link>
            </li> */}
            <li className="h-full">
              <Link
                className={`flex items-center md:px-3.5 xl:px-5 h-full  text-white
                 hover:text-main-blue duration-300`}
                to="/event"
              >
                {t("nav.event")}
              </Link>
            </li>
          </ul>
        </div>

        {/* login and trainslate */}
        <ul className="hidden md:flex justify-end items-center min-w-1/5 md:mr-12 xl:mr-20 ">
          {/* user button */}
          <li className="md:mr-7 xl:mr-12">
            {token ? (
              <div className="flex items-center space-x-7">
                <div className="relative flex items-center">
                  <button
                    data-testid="user-button"
                    id="user-button"
                    onClick={() => SetUserBtnOpen(!IsUserBtnOpen)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 relative  hover:fill-main-color ${
                        IsUserBtnOpen ? "fill-main-color" : "fill-white"
                      }`}
                      preserveAspectRatio="none"
                    >
                      <g clipPath="url(#clip0_835_17208)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.3346 7.49935C13.3346 8.3834 12.9834 9.23125 12.3583 9.85637C11.7332 10.4815 10.8854 10.8327 10.0013 10.8327C9.11725 10.8327 8.2694 10.4815 7.64428 9.85637C7.01916 9.23125 6.66797 8.3834 6.66797 7.49935C6.66797 6.61529 7.01916 5.76745 7.64428 5.14233C8.2694 4.5172 9.11725 4.16602 10.0013 4.16602C10.8854 4.16602 11.7332 4.5172 12.3583 5.14233C12.9834 5.76745 13.3346 6.61529 13.3346 7.49935ZM11.668 7.49935C11.668 7.94138 11.4924 8.3653 11.1798 8.67786C10.8673 8.99042 10.4433 9.16602 10.0013 9.16602C9.55927 9.16602 9.13535 8.99042 8.82279 8.67786C8.51023 8.3653 8.33464 7.94138 8.33464 7.49935C8.33464 7.05732 8.51023 6.6334 8.82279 6.32084C9.13535 6.00828 9.55927 5.83268 10.0013 5.83268C10.4433 5.83268 10.8673 6.00828 11.1798 6.32084C11.4924 6.6334 11.668 7.05732 11.668 7.49935Z"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0007 0.833008C4.93815 0.833008 0.833984 4.93717 0.833984 9.99967C0.833984 15.0622 4.93815 19.1663 10.0007 19.1663C15.0631 19.1663 19.1673 15.0622 19.1673 9.99967C19.1673 4.93717 15.0631 0.833008 10.0007 0.833008ZM2.50065 9.99967C2.50065 11.7413 3.09482 13.3447 4.09065 14.618C4.79001 13.6996 5.69223 12.9553 6.72684 12.4433C7.76146 11.9312 8.90044 11.6653 10.0548 11.6663C11.1943 11.6653 12.3189 11.9243 13.3431 12.4237C14.3673 12.923 15.264 13.6496 15.9648 14.548C16.6869 13.601 17.173 12.4957 17.3831 11.3235C17.5931 10.1513 17.521 8.94595 17.1727 7.80716C16.8244 6.66837 16.21 5.62888 15.3802 4.77471C14.5504 3.92053 13.5292 3.27622 12.401 2.8951C11.2727 2.51397 10.07 2.40698 8.8922 2.58299C7.71442 2.75899 6.59548 3.21292 5.62796 3.90722C4.66044 4.60152 3.87216 5.51623 3.32834 6.57567C2.78452 7.63511 2.5008 8.80881 2.50065 9.99967ZM10.0007 17.4997C8.27894 17.5023 6.60921 16.91 5.27398 15.823C5.81143 15.0536 6.52677 14.4254 7.35914 13.9919C8.19152 13.5584 9.11631 13.3323 10.0548 13.333C10.9816 13.3323 11.8952 13.5527 12.7198 13.9759C13.5443 14.3991 14.256 15.0129 14.7956 15.7663C13.4501 16.8886 11.7528 17.5021 10.0007 17.4997Z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_835_17208">
                          <rect width="20" height="20" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </button>

                  {/* userlist */}
                  {IsUserBtnOpen && (
                    <>
                      <div
                        className="fixed left-0 top-0 w-full h-screen z-50"
                        onClick={() => SetUserBtnOpen(false)}
                      />
                      <div className="min-w-[180px] absolute top-8 -left-10 xl:-left-4 h-60 z-50 bg-white text-main-text-gray text-sm1 shadow-[0px_0px_10px_0px_rgba(105,116,127,0.30)] rounded-10px">
                        <div
                          className="mt-3.5 mx-3 mb-4 bg-profile-button-bg pt-2 px-3.5 pb-2.5 rounded-lg
                    before:content-[''] before:absolute before:-top-4 before:left-[42px] xl:before:left-4.5 
                    before:border-8 before:border-solid 
                    before:border-x-transparent before:border-t-transparent before:border-b-white
                    
                    "
                        >
                          <h5 className="">{`Hi, ${
                            userData?.firstName || "user"
                          }`}</h5>
                          <p className="text-xs">
                            {userData?.email || (
                              <Link
                                onClick={() => SetUserBtnOpen(false)}
                                to={"user/profile"}
                                className="underline hover:text-main-color"
                              >
                                {t("nav.null_info")}
                              </Link>
                            )}
                          </p>
                        </div>
                        <ul className="pl-4 pb-4.5 space-y-3.5">
                          <li>
                            <Link
                              onClick={() => SetUserBtnOpen(false)}
                              to={"user/profile"}
                              className={`${
                                inWhichUserPage === "user profile"
                                  ? "font-medium text-black pointer-events-none"
                                  : "font-normal text-main-text-gray hover:text-main-color pointer-events-auto"
                              }`}
                            >
                              {t("nav.user_button.view_user_profile")}
                            </Link>
                          </li>

                          <li>
                            <Link
                              onClick={() => SetUserBtnOpen(false)}
                              to={"/user/companyprofile"}
                              className={`${
                                inWhichUserPage === "my company profile"
                                  ? "font-medium text-black pointer-events-none"
                                  : "font-normal text-main-text-gray hover:text-main-color pointer-events-auto"
                              }`}
                            >
                              {t("nav.user_button.view_company_profile")}
                            </Link>
                          </li>

                          <li>
                            <Link
                              onClick={() => SetUserBtnOpen(false)}
                              to={"/user/mylist"}
                              className={`${
                                inWhichUserPage === "my list"
                                  ? "font-medium text-black pointer-events-none"
                                  : "font-normal text-main-text-gray hover:text-main-color pointer-events-auto"
                              }`}
                            >
                              {t("nav.user_button.view_my_list")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => SetUserBtnOpen(false)}
                              to={"/subscribe?checkpro=1"}
                              className={`${
                                inWhichUserPage === "subscribe"
                                  ? "font-medium text-black pointer-events-none"
                                  : "font-normal text-main-text-gray hover:text-main-color pointer-events-auto"
                              }`}
                            >
                              {t("nav.user_button.subscribe")}
                            </Link>
                          </li>
                          <li>
                            <button
                              className="hover:text-main-color"
                              onClick={logOutHandler}
                            >
                              {t("nav.user_button.log_out")}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                {/* message button */}
                {/* <button
                  onClick={() => {
                    if (
                      userData?.subscription_level === "pro" ||
                      userData?.subscription_level === "silver" ||
                      userData?.subscription_level === "test" ||
                      userData?.user_id === 1
                    ) {
                      setMessageInfo({
                        ...messageInfo,
                        messaging: {
                          isShow: true,
                          isOpen: !messageInfo?.messaging?.isOpen,
                        },
                      });
                    } else {
                      setIsNeedtopayPopup(true);
                    }
                  }}
                >
                  {messageUnreadIcon ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      fill="none"
                      style={{
                        width: 18.42,
                        height: 18.39,
                        position: "relative",
                      }}
                      preserveAspectRatio="none"
                    >
                      <circle
                        cx="13.915"
                        cy="2.915"
                        r="2.915"
                        fill="#07BBD3"
                      ></circle>
                      <g
                        className={`hover:fill-main-color ${
                          messageInfo?.messaging?.isOpen
                            ? "fill-main-color"
                            : "fill-white"
                        }`}
                      >
                        <path d="M9.19 10.104a.917.917 0 100-1.834.917.917 0 000 1.834zm3.664 0a.917.917 0 100-1.833.917.917 0 000 1.833zm-7.336 0a.917.917 0 100-1.833.917.917 0 000 1.833z"></path>
                        <path
                          fillRule="evenodd"
                          d="M10.685.11c-.21-.036-.414-.046-.633-.067A9.175 9.175 0 004.03 1.571 9.184 9.184 0 00.365 6.588a9.206 9.206 0 00.383 6.202 1 1 0 01.078.586L.02 17.253a.966.966 0 00.016.449l.117.243.117.143.086.075.219.126a.909.909 0 00.36.064h.187l3.922-.788c.195-.024.398.005.586.082a9.171 9.171 0 006.203.377 9.172 9.172 0 005.015-3.665 9.14 9.14 0 001.524-6.022c-.086-.929-.336-1.806-.696-2.655A4.467 4.467 0 0116.1 6.707l.07.228a7.313 7.313 0 01.258 3.434 7.287 7.287 0 01-.5 1.72 6.827 6.827 0 01-.742 1.32 7.363 7.363 0 01-2.445 2.193 7.344 7.344 0 01-6.398.34L5.92 15.8a2.974 2.974 0 00-.72-.095l-.515.046-2.586.522.524-2.584a2.818 2.818 0 00-.196-1.66 7.403 7.403 0 01-.562-3.236 7.35 7.35 0 01.906-3.157 7.372 7.372 0 012.196-2.447 7.41 7.41 0 011.187-.677 7.17 7.17 0 013.883-.605A4.458 4.458 0 0110.685.11z"
                          clipRule="evenodd"
                        ></path>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      preserveAspectRatio="none"
                      className={`w-5.5 h-5.5 relative  hover:fill-main-color ${
                        messageInfo?.messaging?.isOpen
                          ? "fill-main-color"
                          : "fill-white"
                      }`}
                    >
                      <path d="M11.003 11.917a.917.917 0 100-1.834.917.917 0 000 1.834zm3.664 0a.917.917 0 100-1.833.917.917 0 000 1.833zm-7.337 0a.917.917 0 100-1.834.917.917 0 000 1.834z"></path>
                      <path d="M17.482 4.519A9.166 9.166 0 002.559 14.602a.972.972 0 01.082.587l-.806 3.878a.917.917 0 00.554 1.035.917.917 0 00.362.064h.184l3.923-.788c.2-.024.401.005.587.083A9.166 9.166 0 0017.528 4.537l-.046-.018zm.76 7.663A7.333 7.333 0 018.16 17.756a2.99 2.99 0 00-1.146-.239 3.144 3.144 0 00-.514.046l-2.585.523.523-2.585a2.832 2.832 0 00-.193-1.66 7.334 7.334 0 1113.998-1.659z"></path>
                    </svg>
                  )}
                </button> */}
              </div>
            ) : (
              // login/sign up
              <div className="font-semibold">
                <Link
                  className={` text-white
                   hover:text-main-blue duration-300`}
                  to="account/login"
                >
                  {t("nav.login")}
                </Link>
                <span
                  className={`text-white
                  `}
                >
                  /
                </span>
                <Link
                  className={` text-white
                   hover:text-main-blue duration-300`}
                  to="account/register"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </li>

          {!userData && (
            <li className="md:mr-7 xl:mr-12">
              <Link
                to="/subscribe"
                className={`text-white
                 hover:text-main-blue duration-300`}
              >
                {t("nav.subscribe")}
              </Link>
            </li>
          )}

          <li className="md:mr-7 xl:mr-12">
            <Link
              to={"/trial_account_apply"}
              className="text-center text-sm1 bg-search-home-placeholder leading-140 px-4 py-0.5 rounded-full"
            >
              TRY FOR FREE
            </Link>
          </li>

          {/* translate button */}
          {/* <li>
            <button
              onClick={changeLanguageHandler}
              className={`${
                IsHomePage ? "text-main-text-gray" : "text-white"
              } hover:text-main-blue duration-300`}
              // eslint-disable-next-line i18next/no-literal-string
            >
              ENG｜中文
            </button>
          </li> */}
        </ul>
      </div>

      {/* mobile size menu button */}
      <button
        className="fixed top-0 right-0 mt-5 mr-8 z-[110] w-5 h-5 flex md:hidden flex-col space-y-1.5 justify-center items-center"
        onClick={() => setMenuOpen(!IsMenuOpen)}
      >
        <div
          className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full ${
            IsMenuOpen
              ? "rotate-45 translate-y-1 bg-white"
              : `rotate-0 translate-y-0 bg-white
                `
          }`}
        ></div>
        <div
          className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full ${
            IsMenuOpen
              ? "-rotate-45  -translate-y-[3.5px] bg-white"
              : `rotate-0 translate-y-0 bg-white 
                `
          }`}
        ></div>
      </button>

      {/* mobile size navbar*/}
      <MobileNav IsMenuOpen={IsMenuOpen} setMenuOpen={setMenuOpen} />

      {/* page layout */}
      <Outlet context={{ isSignupPopup, setIsSignupPopup }} />

      {/* message */}
      {/* <div className="fixed bottom-0 w-full flex justify-end items-end pr-50 space-x-10 pointer-events-none z-50">
        <MessageSending />
        <Messaging userData={userData} setUnreadIcon={setMessageUnreadIcon} />
      </div> */}

      <NeedToPay_popup
        popUp={IsNeedtopayPopup}
        setPopUp={setIsNeedtopayPopup}
      />
      <Signup_popup popUp={isSignupPopup} setPopUp={setIsSignupPopup} />
    </div>
  );
};

export default Nav;
