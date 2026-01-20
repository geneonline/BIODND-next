import { useTranslation } from "react-i18next";

import footer_logo from "@/assets/svg/footer/footer_logo.svg";
import google_icon from "@/assets/svg/login_signup/google_icon.svg";
import linkedin_icon from "@/assets/svg/login_signup/linkedin_icon.svg";
import Facebook_icon from "@/assets/svg/login_signup/Facebook_icon.svg";

const EventAccountCreate = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div
      className={`mt-15 xl:mt-19 bg-nav-bg h-screen md:flex font-in ${
        currentLanguage === "en" ? "font-Inter" : "font-Noto"
      }`}
    >
      <div className="w-full md:flex-none md:w-1/2 h-full flex items-center justify-center">
        <div className="w-8/12">
          <img
            className="w-24 md:w-40 mb-9 mx-auto lg:mx-0"
            src={footer_logo}
            alt="logo"
          />
          <h1 className="text-white text-32px text-center lg:text-5xl lg:text-left font-bold tracking-wide mb-14">
            Create an account
          </h1>
          <input
            className="w-full h-12 pl-6 py-2 text-sm rounded-[32px] mb-9"
            id="Email"
            type="email"
            name="Email"
            placeholder="Email address"
            required
          />
          <button
            type="button"
            className="w-full h-12 pl-6 py-2 text-sm rounded-[32px] bg-main-color text-white font-semibold mb-9"
          >
            Create Your Account
          </button>
          <p className="text-sm1 text-[#B5B5B5] font-medium text-center mb-4">
            {t("login.login_page.form.or_continue_with")}
          </p>
          <div className="flex justify-center items-center space-x-[27px] mb-6">
            <a href="">
              <img src={google_icon} alt="google icon" />
            </a>
            <a href="">
              <img src={linkedin_icon} alt="linkIn icon" />
            </a>
            <a href="">
              <img src={Facebook_icon} alt="facebook icon" />
            </a>
          </div>
          <p className="text-sm1 text-[#B5B5B5] mb-4.5 md:text-center lg:text-left">
            Already has an account? &nbsp;
            <a
              href="/event/account/login"
              className="text-main-color font-semibold"
              target="_self"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
      <div className="hidden md:block md:flex-grow">{/* img */}</div>
    </div>
  );
};

export default EventAccountCreate;
