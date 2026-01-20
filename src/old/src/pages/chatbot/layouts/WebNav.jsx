import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo_white from "@/assets/svg/LOGO_white.svg";
import { useUser } from "@/hooks/useUser";

import DatabaseBtn from "@/parts/main/nav/DatabaseBtn";

export default function WebNav() {
  const [isChatbotDropdownOpen, setIsChatbotDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const { userData } = useUser(token);

  const [isSignupPopup, setIsSignupPopup] = useState(false);

  return (
    <div className="relative">
      {/* nav */}
      <div
        className={`shadow-md fixed top-0 w-full h-15 xl:h-19 bg-black duration-300 flex items-center md:justify-between xl:justify-between md:text-sm1 xl:text-sm1 z-100`}
      >
        <div className="flex items-center h-full">
          {/* logo */}
          <Link to="/" className="ml-6 md:ml-15 xl:ml-21">
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

            <li className="">
              <div
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full text-white hover:text-main-blue duration-300 cursor-default`}
                onMouseEnter={() => setIsChatbotDropdownOpen(true)}
                onMouseLeave={() => setIsChatbotDropdownOpen(false)}
              >
                {isChatbotDropdownOpen && (
                  <div
                    className={`w-full absolute left-0 top-15 xl:top-19 bg-black text-white shadow-md`}
                  >
                    <div className="w-full flex justify-center space-x-20 pt-3 pb-10 ps-[calc(100%/7)]">
                      <ul className="w-full px-3.5 xl:px-7.5 xl:ml-[3rem]">
                        <li className="pb-3">
                          {location.pathname.startsWith("/chatbot/document") ? (
                            <button
                              className="hover:text-main-blue"
                              onClick={() => setIsChatbotDropdownOpen(false)}
                            >
                              Document
                            </button>
                          ) : (
                            <Link
                              className="hover:text-main-blue"
                              to="/chatbot/document/1"
                              onClick={() => setIsChatbotDropdownOpen(false)}
                            >
                              Document
                            </Link>
                          )}
                        </li>
                        <li
                          className="pb-3"
                          onClick={() => setIsChatbotDropdownOpen(false)}
                        >
                          <Link
                            className="hover:text-main-blue"
                            to="/chatbot/help"
                          >
                            Help
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {/* <Link
                      to={"/database/search"}
                      onClick={() => setIsSearchDropdownOpen(false)}
                    > */}
                <div
                  className={`group flex items-center md:px-3.5 xl:px-7.5 h-full 
                     "text-main-text-gray border-main-text-gray"
                     "text-white border-white"
                 hover:text-main-blue transition-colors duration-300`}
                >
                  {t("nav.chatbot")}

                  <span
                    className={`ml-1 rounded-full leading-140 text-xs px-2 border transition-colors duration-300 
                              text-white border-white
                              group-hover:text-main-blue group-hover:border-main-blue`}
                  >
                    BETA
                  </span>
                </div>
                {/* </Link> */}
              </div>
            </li>
            {/* <li className="h-full">
              <Link
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full text-main-text-gray hover:text-main-blue duration-300`}
                to="/connect/demand"
              >
                {t("nav.bridging")}
              </Link>
            </li> */}

            {/* <li className="h-full">
              <a
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full text-main-text-gray hover:text-main-blue duration-300`}
                href="https://www.geneonline.com/?utm_source=biodnd&utm_medium=homepage"
              >
                {t("nav.news")}
              </a>
            </li> */}

            <li className="h-full">
              <Link
                className={`flex items-center md:px-3.5 xl:px-7.5 h-full text-main-text-gray hover:text-main-blue duration-300`}
                to="/event"
              >
                {t("nav.event")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* mobile size menu*/}
      {/* <div
            className={` fixed top-0 z-100 w-full min-h-screen bg-black md:-translate-y-full pt-20 pl-14 transition-transform duration-300 ease-out ${
              IsMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >

            <ul className="mb-20">
              <li className="mb-12 ">
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  onClick={() => setMenuOpen(false)}
                >
                  ENG/中文
                </Link>
              </li>
              <li className=" mb-5 ">
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  to="/connect/demand"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.bridging")}
                </Link>
              </li>
              <li className=" mb-5 ">
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  to="/database/search"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.database")}
                </Link>
              </li>
              <li className=" mb-5 ">
                <a
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  href="https://www.geneonline.com/?utm_source=biodnd&utm_medium=homepage"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.news")}
                </a>
              </li>
              <li className=" mb-5 ">
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  to="/event"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.event")}
                </Link>
              </li>
              <li className=" mb-5 ">
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  to="user/login"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <span className="text-white font-extrabold text-sm"> / </span>
                <Link
                  className="text-white font-extrabold text-sm hover:text-main-blue"
                  to="user/signup"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.signup")}
                </Link>
              </li>
              <li className=" mb-5 ">
                <Link className="text-white font-extrabold text-sm hover:text-main-blue">
                  {t("nav.about")}
                </Link>
              </li>
              <li className=" mb-5 ">
                <Link className="text-white font-extrabold text-sm hover:text-main-blue">
                  {t("nav.contact_us")}
                </Link>
              </li>
            </ul>
    
            <ul>
              <li className="mb-2 ">
                <Link className="text-mobile-nav-text-gray text-xs font-normal hover:text-main-blue">
                  {"Facebook"}
                </Link>
              </li>
              <li className="mb-2 ">
                <Link className="text-mobile-nav-text-gray text-xs font-normal hover:text-main-blue">
                  {"LinkedIn"}
                </Link>
              </li>
              <li className="mb-2 ">
                <Link className="text-mobile-nav-text-gray text-xs font-normal hover:text-main-blue">
                  {"X(Twitter)"}
                </Link>
              </li>
            </ul>
          </div> */}

      {/* page layout */}
      <Outlet />
    </div>
  );
}
