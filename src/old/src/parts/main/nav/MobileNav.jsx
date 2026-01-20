import { useState } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CTandDrugs_data from "@/data/home/CTandDrugs_data.json";
import button_arrow from "@/assets/svg/database/companiesHits_arrow.svg";
import white_button_arrow from "@/assets/svg/database/filterArrow.svg";

import Facebook_icon from "@/assets/svg/homepage/facebook_icon.svg?react";
import Linkedin_icon from "@/assets/svg/homepage/linkedin_icon.svg?react";

const MobileNav = ({ IsMenuOpen, setMenuOpen }) => {
  const { t } = useTranslation();
  const [isDBopen, setIsDBopen] = useState(false);
  const [isCTandDrugOpen, setIsCTandDrugOpen] = useState(false);

  return (
    <div
      className={` fixed top-0 z-10 w-full h-screen overflow-y-auto border-t border-[#ffffff80] bg-black md:-translate-y-full mt-15 pt-6 px-9 transition-transform duration-300 ease-out ${
        IsMenuOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link
        to={"/database/search"}
        onClick={() => setMenuOpen(false)}
        className="w-full flex justify-center mb-7 whitespace-nowrap px-14 py-2 text-xl font-semibold text-white bg-main-color-gb rounded-full"
      >
        Advanced search
      </Link>

      <ul className="flex flex-col space-y-5">
        <li>
          <button
            className="w-full flex justify-between text-base text-main-color leading-140 font-semibold"
            onClick={() => setIsDBopen((prev) => !prev)}
          >
            DATABASE
            <img
              className={`ml-5 ${isDBopen ? "-rotate-90" : "rotate-90"}`}
              src={button_arrow}
            />
          </button>
          {isDBopen && (
            <ul className="mt-3 flex flex-col gap-y-2">
              <li>
                <button
                  onClick={() => setIsCTandDrugOpen((prev) => !prev)}
                  className="flex items-center space-x-2 "
                >
                  <span className="text-left text-sm1 text-white leading-140">
                    Search by assets
                  </span>
                  <img
                    className={`ml-5 ${
                      isCTandDrugOpen ? "-rotate-90" : "rotate-90"
                    }`}
                    src={white_button_arrow}
                  />
                </button>

                {isCTandDrugOpen && (
                  <div className="">
                    <ul className="pt-4">
                      {Object.entries(CTandDrugs_data).map(
                        ([section, items], sectionIndex) => (
                          // 大項目 subtitle
                          <li className="" key={sectionIndex}>
                            {/* 子項目 Link */}
                            <p className="py-1 px-2 text-white bg-sub-black text-sm1 font-medium leading-140">
                              {section}
                            </p>
                            <ul className="pt-4 pb-6 flex flex-col space-y-3">
                              {items.map((item, index) => (
                                <li key={index}>
                                  <Link
                                    onClick={() => setMenuOpen(false)}
                                    to={`/searchkit/${item.link}`}
                                    className="inline-block text-left w-full text-xs3 text-white font-normal leading-140 "
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <Link
                  onClick={() => setMenuOpen(false)}
                  to={"/company-home"}
                  className="text-left text-sm1 text-white leading-140"
                >
                  <span className="">Search by companies</span>
                </Link>
              </li>

              <li>
                <Link
                  onClick={() => setMenuOpen(false)}
                  to={"/about"}
                  className="text-left text-sm1 text-white leading-140"
                >
                  <span className="">About BIODND</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            className={`w-full inline-block text-base text-main-color leading-140 font-semibold`}
            to="/chatbot"
          >
            {t("nav.chatbot")}
            <span
              className={`ml-1 font-normal rounded-full text-xs3 px-2 border border-main-color`}
            >
              BETA
            </span>
          </Link>
        </li>

        <li>
          <Link
            className={`w-full inline-block text-base text-main-color leading-140 font-semibold`}
            to="/event"
          >
            {t("nav.event")}
          </Link>
        </li>
      </ul>

      <div className="my-8 py-8 border-y border-[rgba(255,255,255,0.5)] ">
        <Link
          className={` w-full inline-block text-base text-main-color leading-140 font-semibold`}
          to="/contact"
        >
          REPORT AN ISSUE
        </Link>
      </div>

      <div className="flex space-x-4">
        <Link to={"https://www.facebook.com/profile.php?id=61553977141306"}>
          <Facebook_icon className="fill-slate-500 hover:fill-main-color" />
        </Link>
        <Link
          to={"https://www.linkedin.com/company/100426332/admin/feed/posts/"}
        >
          <Linkedin_icon />
        </Link>
      </div>

      <div className="pt-7 flex space-x-4">
        <Link
          to={"/subscribe"}
          className="w-1/2 text-center font-semibold text-white leading-140 px-7 py-2 rounded-full border border-white"
        >
          SUBSCRIBE
        </Link>
        <Link
          to={"/trial_account_apply"}
          className="w-1/2 text-center font-semibold bg-search-home-placeholder leading-140 px-7 py-2 rounded-full"
        >
          TRY FOR FREE
        </Link>
      </div>
    </div>
  );
};
export default MobileNav;
