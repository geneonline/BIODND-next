import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import axios from "axios";

// import user_icon from "@/assets/svg/login_signup/user_icon.svg";
import email_icon from "@/assets/svg/login_signup/email_icon.svg";
import password_icon from "@/assets/svg/login_signup/password_icon.svg";
// import invisible_icon from "@/assets/svg/login_signup/invisible_icon.svg";

import loadingImg from "@/assets/img/loading.png";
import Policy from "@/parts/user/Policy";

const Signup_comp = ({ setPopUp }) => {
  const navigate = useNavigate();
  const [IsShowPassword, setIsShowPassword] = useState(false);

  const { t } = useTranslation();
  const [inputFormData, setInputFormData] = useState({});
  const [isConfirmPWtheSame, setIsConfirmPWtheSame] = useState(true);
  const [isEmailUsed, setIsEmailUsed] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const [isSigningup, setIsSigningup] = useState(false);

  const signupHandler = (e) => {
    e.preventDefault();
    setIsSigningup(true);

    if (inputFormData.password !== inputFormData.password_confirmation) {
      setIsConfirmPWtheSame(false);
      return;
    } else {
      setIsConfirmPWtheSame(true);
    }

    const formData = new FormData();
    formData.append("user[email]", `${inputFormData.email}`);
    formData.append("user[password]", `${inputFormData.password}`);
    formData.append(
      "user[password_confirmation]",
      `${inputFormData.password_confirmation}`
    );
    formData.append("commit", "Sign up");

    axios
      .post(`${import.meta.env.VITE_API_URL}/users`, formData)
      .then(() => {
        navigate("/user/confirmation?email=" + inputFormData.email);
        setIsSigningup(false);
        setPopUp(false);
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 422) {
          setIsEmailUsed(true);
        }
        setIsSigningup(false);
      });
  };

  return (
    <div className="w-full max-w-[581px] flex flex-col leading-140">
      <div className="relative flex flex-col">
        <h1 className="text-xl mb-2 text-main-color-gb font-semibold">
          {t("signup.signup_page.title")}
        </h1>
      </div>
      <p className="mb-8 text-sm1">
        <Trans i18nKey="signup.signup_page.already_have_account">
          If you already have an account registered you can
          <Link
            onClick={() => setPopUp(false)}
            to="/user/login"
            className="text-main-color-gb font-semibold"
          >
            LOG IN
          </Link>
        </Trans>
        {/* {t("signup.signup_page.already_have_account")}
    <Link
      to="/user/login"
      className="text-[#999999] hover:text-main-color font-semibold"
    >
      link
    </Link> */}
      </p>
      <form className="flex flex-col" onSubmit={signupHandler}>
        {/* email */}
        <label className="relative text-sm1" htmlFor="Email">
          {t("signup.signup_page.form.email_label")}
          {isEmailUsed && (
            <div className="text-warning absolute right-0 top-0">
              {t("signup.signup_page.form.email_used_warning")}
            </div>
          )}
        </label>
        <div className={`relative w-full mb-10`}>
          <img
            className="absolute top-1/2 -translate-y-1/2"
            src={email_icon}
            alt="email icon"
          />
          <input
            className={`w-full pl-8 py-2 border-0 focus:shadow-input-focus shadow-input-default text-xs3 ${
              isEmailUsed ? "shadow-input-warning" : "shadow-input-default"
            }  focus:border-b-black focus:ring-0`}
            type="email"
            id="Email"
            name="Email"
            placeholder={t("signup.signup_page.form.email_placeholder")}
            required
            onChange={(e) => {
              setIsEmailUsed(false);
              setInputFormData({ ...inputFormData, email: e.target.value });
            }}
          />
        </div>

        {/* password */}
        <label className=" text-sm1" htmlFor="password">
          {t("signup.signup_page.form.password_label")}
        </label>
        <div className="relative w-full mb-10">
          <img
            className="absolute top-1/2 -translate-y-1/2"
            src={password_icon}
            alt="password icon"
          />
          <input
            className="w-full pl-8 py-2 border-0 focus:shadow-input-focus shadow-input-default text-xs3 border-b-input-line focus:border-b-black focus:ring-0 "
            type={IsShowPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder={t("signup.signup_page.form.password_placeholder")}
            required
            onChange={(e) =>
              setInputFormData({ ...inputFormData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={(e) => {
              e.preventDefault();
              setIsShowPassword(!IsShowPassword);
            }}
          >
            {/* <img
          className="h-3 w-3"
          src={invisible_icon}
          alt="invisible icon"
        /> */}
          </button>
        </div>

        {/* confirm pw */}
        <label className="relative text-sm1" htmlFor="comfirm_password">
          {t("signup.signup_page.form.confirm_password_label")}
          {!isConfirmPWtheSame && (
            <div className="absolute text-warning top-0 right-0">
              {t("signup.signup_page.form.confirm_password_warning")}
            </div>
          )}
        </label>
        <div className="relative w-full mb-12">
          <img
            className="absolute top-1/2 -translate-y-1/2"
            src={password_icon}
            alt="password icon"
          />
          <input
            className={`w-full pl-8 py-2 border-0 text-xs3 focus:shadow-input-focus ${
              isConfirmPWtheSame
                ? "shadow-input-default"
                : "shadow-input-warning"
            }  focus:border-b-black focus:ring-0`}
            type={IsShowPassword ? "text" : "password"}
            id="comfirm_password"
            name="password"
            placeholder={t(
              "signup.signup_page.form.confirm_password_placeholder"
            )}
            required
            onChange={(e) => {
              setIsConfirmPWtheSame(true);
              setInputFormData({
                ...inputFormData,
                password_confirmation: e.target.value,
              });
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={(e) => {
              e.preventDefault();
              setIsShowPassword(!IsShowPassword);
            }}
          >
            {/* <img
          className="h-3 w-3"
          src={invisible_icon}
          alt="invisible icon"
        /> */}
          </button>
        </div>

        <div>
          <p className="text-sm1">
            {t("signup.signup_page.form.terms_policy_before")}
            <span
              onClick={(e) => {
                e.preventDefault();
                setShowPolicy(true);
              }}
              className="font-semibold text-main-color-gb hover:cursor-pointer"
            >
              {t("signup.signup_page.form.terms_policy_link")}
            </span>{" "}
            {t("signup.signup_page.form.terms_policy_after")}
          </p>
        </div>

        {showPolicy && <Policy setShowPolicy={setShowPolicy} />}

        <button
          className="mt-8 py-2.5 px-25 w-fit text-24px font-semibold leading-140 text-white bg-main-color-gb rounded-full"
          // onClick={signupHandler}
        >
          {isSigningup ? (
            <div className={`mx-auto w-5 flex justify-center items-center`}>
              <img className=" animate-spin" src={loadingImg} alt="" />
            </div>
          ) : (
            t("signup.signup_page.form.signup_button")
          )}
        </button>
      </form>
    </div>
  );
};
export default Signup_comp;
