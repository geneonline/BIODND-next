import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import footer_logo from "@/assets/svg/footer/footer_logo.svg";

import Facebook_icon from "@/assets/svg/homepage/facebook_icon.svg?react";

import Linkedin_icon from "@/assets/svg/homepage/linkedin_icon.svg?react";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-black text-white pb-20 pt-18 md:pb-10 md:pt-10 xl:pb-16 xl:pt-10">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:max-w-[925px] xl:mx-auto items-center text-center">
        {/* logo */}
        <img className="w-40  xl:w-72" src={footer_logo} alt="" />
        {/* links */}
        <div className="pt-6 md:pt-5 xl:pt-0">
          <ul className="flex flex-col items-center xl:items-start space-y-7 md:space-y-5 xl:space-y-8">
            <li className="text-sm md:text-xs xl:text-sm2 ">
              <Link to={"about"} className="hover:text-main-blue" href="">
                {t("footer.about")}
              </Link>
            </li>
            <li className="text-sm md:text-xs xl:text-sm2 ">
              <Link to={"contact"} className="hover:text-main-blue" href="">
                {t("footer.report_issue")}
              </Link>
            </li>
            {/* <li className="text-sm md:text-xs xl:text-sm2 ">
              <Link className="hover:text-main-blue" href="">
                {t("footer.contact_us")}
              </Link>
            </li> */}
            {/* <li className="text-sm md:text-xs xl:text-sm2 ">
              <Link className="hover:text-main-blue" href="">
                {t("footer.terms_of_service")}
              </Link>
            </li> */}
            <li className="flex justify-around items-center space-x-4">
              <Link
                to={"https://www.facebook.com/profile.php?id=61553977141306"}
              >
                <Facebook_icon className="fill-slate-500 hover:fill-main-color" />
              </Link>
              <Link
                to={
                  "https://www.linkedin.com/company/100426332/admin/feed/posts/"
                }
              >
                <Linkedin_icon />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-footer-text text-xxs xl:text-xs2 text-center pt-10 md:pt-12 xl:pt-8  font-normal">
        {t("footer.copyright")}
      </p>
    </div>
  );
};

export default Footer;
