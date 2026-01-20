import { useTranslation } from "react-i18next";
import invisible_icon from "@/assets/svg/login_signup/invisible_icon.svg";

const EventAccountSignup = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-15 xl:mt-19 w-full flex justify-center">
      <div className="w-full max-w-[429px] mx-[10vw] flex-col pt-18 pb-26">
        <h2 className="text-30px font-medium mb-14">Sign up</h2>
        <p className="text-sm2 leading-relaxed mb-12">
          If you already have an account registered <br /> you can log in{" "}
          <a
            href="/event/account/login"
            className="text-main-color font-semibold"
            target="_self"
          >
            here
          </a>
          .
        </p>
        <>
          <form className="flex flex-col">
            <label className="pb-3" htmlFor="Email">
              {t("login.login_page.form.email_label")}
            </label>
            <div className="relative w-full mb-6.5">
              <div className="h-4 w-4 absolute pl-0.5 top-1/2 -translate-y-1/2">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[16px] h-[16px] relative`}
                  preserveAspectRatio="none"
                >
                  <g clipPath="url(#clip0_1366_1321)">
                    <path d="M2.06099 3.24414H14.3409C15.063 3.24414 15.6504 3.83157 15.6504 4.55361V12.1422C15.6504 12.8642 15.063 13.4517 14.3409 13.4517H2.06099C1.33894 13.4517 0.751513 12.8642 0.751513 12.1422V4.55361C0.751513 3.83157 1.33894 3.24414 2.06099 3.24414ZM2.23188 4.11712L2.40666 4.26265L7.68141 8.65494C7.98247 8.9056 8.41949 8.9056 8.72049 8.65494L13.9952 4.26265L14.17 4.11712H2.23188ZM14.7774 4.74736L10.4797 8.32608L14.7774 11.1863V4.74736ZM2.06099 12.5787H14.3409C14.5518 12.5787 14.7282 12.4283 14.7687 12.2292L9.77971 8.90892L9.27908 9.32579C8.96673 9.58588 8.58381 9.71593 8.20092 9.71593C7.81803 9.71593 7.43514 9.58588 7.12276 9.32579L6.62214 8.90892L1.63322 12.2292C1.67367 12.4283 1.85007 12.5787 2.06099 12.5787ZM1.62449 11.1863L5.92224 8.32611L1.62449 4.74736V11.1863Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1366_1321">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="matrix(-1 0 0 1 15.6504 0.898438)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <input
                className={`w-full pl-6 py-2 border-x-0 border-t-0 border-b-2 text-sm`}
                id="Email"
                type="email"
                name="Email"
                placeholder={t("login.login_page.form.email_placeholder")}
                required
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                // onClick={(e) => {
                // e.preventDefault();
                // setIsShowPassword(!IsShowPassword);
                // }}
              >
                <img
                  className="h-3 w-3"
                  src={invisible_icon}
                  alt="invisible icon"
                />
              </button>
            </div>

            <label className="pb-3" htmlFor="password">
              {t("login.login_page.form.password_label")}
            </label>
            <div className="relative w-full mb-6.5">
              <div className="h-4 w-4 absolute pl-0.5 top-1/2 -translate-y-1/2">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[16px] h-[16px] relative`}
                  preserveAspectRatio="none"
                >
                  <g clipPath="url(#clip0_1253_16701)">
                    <path d="M11.3958 6.33605V3.97661C11.4022 2.90902 10.9758 1.8825 10.2145 1.13392C9.47861 0.401136 8.51525 0 7.49504 0C7.47924 0 7.46029 0 7.4445 0C5.26826 0.00315855 3.49947 1.78458 3.49947 3.97661V6.33605C2.67825 6.43396 2.07812 7.12253 2.07812 7.95639V13.2564C2.07812 14.1566 2.79827 14.8989 3.69846 14.8989H11.2C12.1002 14.8989 12.8203 14.1566 12.8203 13.2564V7.95639C12.8172 7.12569 12.2171 6.43396 11.3958 6.33605ZM4.12802 3.97661H4.13118C4.13118 2.13202 5.61886 0.622234 7.44766 0.622234H7.45082C8.31942 0.619076 9.15327 0.963358 9.76919 1.57612C10.4104 2.21098 10.7673 3.07643 10.761 3.97661V6.33921H10.0661V3.97661C10.0724 3.25962 9.78814 2.57106 9.27962 2.06569C8.79952 1.58559 8.14886 1.31396 7.46977 1.31396H7.45082C5.99788 1.31396 4.8229 2.50789 4.8229 3.97345V6.33921H4.12802V3.97661ZM9.43754 3.97661V6.33921H5.45777V3.97661C5.45777 2.85849 6.34848 1.94882 7.45398 1.94882H7.47293C7.98461 1.94882 8.47735 2.15413 8.84058 2.51736C9.22592 2.90271 9.44386 3.43018 9.43754 3.97661ZM12.2171 13.2659C12.2171 13.8187 11.7686 14.2672 11.2158 14.2672H3.71109C3.15835 14.2672 2.70983 13.8187 2.70983 13.2659V7.97218C2.70983 7.41943 3.15835 6.97092 3.71109 6.97092H11.2158C11.7686 6.97092 12.2171 7.41943 12.2171 7.97218V13.2659Z" />
                    <path d="M8.54169 10.423C8.40271 9.93344 7.95736 9.59863 7.44883 9.59863C6.82028 9.59863 6.30859 10.1072 6.30859 10.7389C6.30859 11.2474 6.6434 11.6928 7.13298 11.8317V12.7161C7.13298 12.8898 7.27511 13.032 7.44883 13.032C7.62255 13.032 7.76469 12.8898 7.76469 12.7161V11.8317C8.36797 11.658 8.71857 11.0263 8.54169 10.423ZM7.44883 11.2442C7.16772 11.2442 6.9403 11.0168 6.9403 10.7357C6.9403 10.4546 7.16772 10.2272 7.44883 10.2272C7.72994 10.2272 7.95736 10.4546 7.95736 10.7357C7.95736 11.0168 7.72994 11.2442 7.44883 11.2442Z" />
                  </g>
                  <defs>
                    <clippath id="clip0_1253_16701">
                      <rect width="14.8989" height="14.8989" fill="white" />
                    </clippath>
                  </defs>
                </svg>
              </div>
              <input
                className={`w-full pl-6 py-2 border-x-0 border-t-0 border-b-2 text-sm`}
                id="password"
                // type={IsShowPassword ? "text" : "password"}
                name="password"
                placeholder={t("login.login_page.form.password_placeholder")}
                required
                // onChange={(e) => {
                // setWrongEmailPw(false);
                // setNeedConfirmation(false);
                // setInputFormData({
                //     ...inputFormData,
                //     password: e.target.value,
                // });
                // }}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                // onClick={(e) => {
                // e.preventDefault();
                // setIsShowPassword(!IsShowPassword);
                // }}
              >
                <img
                  className="h-3 w-3"
                  src={invisible_icon}
                  alt="invisible icon"
                />
              </button>
            </div>

            <label className="pb-3" htmlFor="password">
              Confirm Password
            </label>
            <div className="relative w-full mb-10">
              <div className="h-4 w-4 absolute pl-0.5 top-1/2 -translate-y-1/2">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[16px] h-[16px] relative`}
                  preserveAspectRatio="none"
                >
                  <g clipPath="url(#clip0_1253_16701)">
                    <path d="M11.3958 6.33605V3.97661C11.4022 2.90902 10.9758 1.8825 10.2145 1.13392C9.47861 0.401136 8.51525 0 7.49504 0C7.47924 0 7.46029 0 7.4445 0C5.26826 0.00315855 3.49947 1.78458 3.49947 3.97661V6.33605C2.67825 6.43396 2.07812 7.12253 2.07812 7.95639V13.2564C2.07812 14.1566 2.79827 14.8989 3.69846 14.8989H11.2C12.1002 14.8989 12.8203 14.1566 12.8203 13.2564V7.95639C12.8172 7.12569 12.2171 6.43396 11.3958 6.33605ZM4.12802 3.97661H4.13118C4.13118 2.13202 5.61886 0.622234 7.44766 0.622234H7.45082C8.31942 0.619076 9.15327 0.963358 9.76919 1.57612C10.4104 2.21098 10.7673 3.07643 10.761 3.97661V6.33921H10.0661V3.97661C10.0724 3.25962 9.78814 2.57106 9.27962 2.06569C8.79952 1.58559 8.14886 1.31396 7.46977 1.31396H7.45082C5.99788 1.31396 4.8229 2.50789 4.8229 3.97345V6.33921H4.12802V3.97661ZM9.43754 3.97661V6.33921H5.45777V3.97661C5.45777 2.85849 6.34848 1.94882 7.45398 1.94882H7.47293C7.98461 1.94882 8.47735 2.15413 8.84058 2.51736C9.22592 2.90271 9.44386 3.43018 9.43754 3.97661ZM12.2171 13.2659C12.2171 13.8187 11.7686 14.2672 11.2158 14.2672H3.71109C3.15835 14.2672 2.70983 13.8187 2.70983 13.2659V7.97218C2.70983 7.41943 3.15835 6.97092 3.71109 6.97092H11.2158C11.7686 6.97092 12.2171 7.41943 12.2171 7.97218V13.2659Z" />
                    <path d="M8.54169 10.423C8.40271 9.93344 7.95736 9.59863 7.44883 9.59863C6.82028 9.59863 6.30859 10.1072 6.30859 10.7389C6.30859 11.2474 6.6434 11.6928 7.13298 11.8317V12.7161C7.13298 12.8898 7.27511 13.032 7.44883 13.032C7.62255 13.032 7.76469 12.8898 7.76469 12.7161V11.8317C8.36797 11.658 8.71857 11.0263 8.54169 10.423ZM7.44883 11.2442C7.16772 11.2442 6.9403 11.0168 6.9403 10.7357C6.9403 10.4546 7.16772 10.2272 7.44883 10.2272C7.72994 10.2272 7.95736 10.4546 7.95736 10.7357C7.95736 11.0168 7.72994 11.2442 7.44883 11.2442Z" />
                  </g>
                  <defs>
                    <clippath id="clip0_1253_16701">
                      <rect width="14.8989" height="14.8989" fill="white" />
                    </clippath>
                  </defs>
                </svg>
              </div>
              <input
                className={`w-full pl-6 py-2 border-x-0 border-t-0 border-b-2 text-sm`}
                id="password"
                // type={IsShowPassword ? "text" : "password"}
                name="password"
                placeholder={t("login.login_page.form.password_placeholder")}
                required
                // onChange={(e) => {
                // setWrongEmailPw(false);
                // setNeedConfirmation(false);
                // setInputFormData({
                //     ...inputFormData,
                //     password: e.target.value,
                // });
                // }}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                // onClick={(e) => {
                // e.preventDefault();
                // setIsShowPassword(!IsShowPassword);
                // }}
              >
                <img
                  className="h-3 w-3"
                  src={invisible_icon}
                  alt="invisible icon"
                />
              </button>
            </div>

            <p className="text-xs3 mb-8">
              People who use our service may have uploaded your contact
              information to BIODND. By clicking Sign Up, you agree to our
              Terms,{" "}
              <span className="font-semibold">
                Privacy Policy & Cookies Policy
              </span>
              . You may receive SMS Notifications from us and can opt out any
              time.
            </p>

            <button className="py-4 text-18px font-medium text-white bg-main-color rounded-full">
              Sign up
            </button>
          </form>
        </>
      </div>
    </div>
  );
};

export default EventAccountSignup;
