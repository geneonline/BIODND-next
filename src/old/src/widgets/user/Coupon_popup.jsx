import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import loadingImg from "@/assets/img/loading.png";

const Coupon_popup = () => {
  const [handleCouponState, setHandleCouponState] = useState("");

  const { t } = useTranslation();
  const couponHandler = (e) => {
    if (e.target.value.length >= 20) {
      setHandleCouponState("loading");
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/redeem_coupon.json?code=${
            e.target.value
          }`,
          {},
          {
            withCredentials: true,
            headers: {
              Accept: "application/json", // 添加 Accept header
              // "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setHandleCouponState("success");
        })
        .catch((err) => {
          if (err.response.status === 422) {
            setHandleCouponState("error");
          } else {
            setHandleCouponState("wrong");
          }
          console.log(err.response.status);
          console.log(err.response.data.error);
        });
    } else {
      setHandleCouponState("");
    }
  };

  return (
    <div className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50">
      <div
        className="w-[360px] absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px px-10 pb-14 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col mt-12.5 mr-1.5 items-center">
          <svg
            width={315}
            height={308}
            viewBox="0 0 315 308"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-5 w-20 h-20 relative "
            preserveAspectRatio="none"
          >
            <path
              d="M91.875 218.334L149.796 218.141L276.216 95.7111C281.177 90.8601 283.907 84.4178 283.907 77.5648C283.907 70.7118 281.177 64.2695 276.216 59.4185L255.399 39.0648C245.477 29.3628 228.165 29.4141 218.321 39.0263L91.875 161.482V218.334ZM236.841 57.2111L257.696 77.5263L236.736 97.8286L215.919 77.4878L236.841 57.2111ZM118.125 172.185L197.269 95.5315L218.085 115.885L138.954 192.513L118.125 192.577V172.185Z"
              fill="#07BBD3"
            />
            <path
              d="M65.625 269.5H249.375C263.852 269.5 275.625 257.988 275.625 243.833V132.594L249.375 158.261V243.833H107.074C106.732 243.833 106.378 243.962 106.037 243.962C105.604 243.962 105.171 243.846 104.724 243.833H65.625V64.1667H155.492L181.742 38.5H65.625C51.1481 38.5 39.375 50.0115 39.375 64.1667V243.833C39.375 257.988 51.1481 269.5 65.625 269.5Z"
              fill="#07BBD3"
            />
          </svg>

          <div className="relative flex flex-col items-center">
            <label
              className="pb-2 text-center text-24px font-semibold"
              htmlFor="coupon"
            >
              {t("user.first_setting.profile.invitation_code.label")}
            </label>
            <p className=" text-base overflow-auto pb-2 max-h-[80vh] leading-normal break-words text-center">
              {t("user.first_setting.profile.invitation_code.description")}
            </p>
            {handleCouponState === "error" && (
              <span className="text-warning top-10 text-center">
                {t("user.first_setting.profile.invitation_code.error")}
              </span>
            )}
            {handleCouponState === "wrong" && (
              <span className="text-warning top-10 text-center">
                {"something went wrong, please refresh and try again later :("}
              </span>
            )}
            <div className="relative flex items-center">
              <input
                id="coupon"
                maxLength={20}
                type="text"
                placeholder={t(
                  "user.first_setting.profile.invitation_code.placeholder"
                )}
                onChange={couponHandler}
                disabled={handleCouponState === "success" ? true : false}
                className={` py-2 pr-3.5 rounded-5px text-base font-medium xl:w-64 border placeholder:text-main-text-gray  
                   focus:border-main-color  focus:ring-main-color border-main-text-gray
                    ${
                      handleCouponState === "success"
                        ? "pointer-events-none"
                        : "pointer-events-auto"
                    }`}
              />

              <div className="absolute right-0 ml-2 w-8">
                {handleCouponState === "loading" ? (
                  <img className="animate-spin" src={loadingImg} alt="" />
                ) : handleCouponState === "success" ? (
                  <svg
                    width={27}
                    height={22}
                    viewBox="0 0 27 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M24.9287 0L27 2.28184L9.39427 21.6775L7.32301 19.3957L24.9287 0Z"
                      fill="#07BBD3"
                    />
                    <path
                      d="M0 11.9628L2.07126 9.681L11.1821 19.7182L9.11086 22L0 11.9628Z"
                      fill="#07BBD3"
                    />
                  </svg>
                ) : handleCouponState === "error" ||
                  handleCouponState === "wrong" ? (
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M22.0973 0.000205054L24 1.92019L2.11851 24L0.215771 22.08L22.0973 0.000205054Z"
                      fill="#D30000"
                    />
                    <path
                      d="M0 1.91998L1.90274 0L23.7842 22.0798L21.8815 23.9998L0 1.91998Z"
                      fill="#D30000"
                    />
                  </svg>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-5">
            <Link
              to="/user/companyprofile_setting"
              className="w-50 bg-db-search text-white hover:bg-main-color rounded-full text-center py-3"
            >
              {handleCouponState === "success"
                ? t(
                    "user.first_setting.profile.invitation_code.button.continue"
                  )
                : t("user.first_setting.profile.invitation_code.button.skip")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon_popup;
