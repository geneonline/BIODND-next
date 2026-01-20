import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import Logo from "@/assets/svg/LOGO.svg";
import {
  companyFieldOptions,
  primaryInterestMap,
  detailInterestMap,
  reasonRadioOptions,
  rolesMap,
} from "@/data/onboardingOptions.js";

import AI_icon from "@/assets/svg/onboarding/AI.svg";
import Handshake_icon from "@/assets/svg/onboarding/Handshake.svg";
import News_icon from "@/assets/svg/onboarding/News.svg";
import Pill_icon from "@/assets/svg/onboarding/Pill.svg";
import Search_icon from "@/assets/svg/onboarding/Search.svg";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_Effect_API;

export default function OnboardingPage() {
  const { token, logout, createStripeCustomer } = useAuth();
  const navigate = useNavigate();
  const { userMutate } = useUser(token);

  // 守門邏輯：若未登入或非首次登入則導回其它頁(開發時要修改這一頁可先把 useEffect註解掉)
  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    const firstTime = sessionStorage.getItem("user_firstTime_login");
    // 未登入直接去 login
    if (!lsToken) {
      navigate("/account/login", { replace: true });
      sessionStorage.removeItem("user_firstTime_login");
      return;
    }
    // 已經不是第一次登入則導回首頁
    if (firstTime !== "true") {
      navigate("/", { replace: true });
      sessionStorage.removeItem("user_firstTime_login");
      return;
    }
  }, [navigate]);

  const [step, setStep] = useState(1);

  // Step 1 state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  // 複選：理由
  const [reasonForUse, setReasonForUse] = useState([]);
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState(""); // for "Others"

  // step1 複選 roles 合併去重
  let mergedRoles = Array.from(
    new Set(
      reasonForUse.length
        ? reasonForUse.flatMap((reason) => rolesMap[reason] || [])
        : []
    )
  );
  // 如果 mergedRoles 裡有 "Others"，先移除再 push 到最後
  const OTHERS_LABEL = "Others";
  if (mergedRoles.includes(OTHERS_LABEL)) {
    mergedRoles = mergedRoles.filter((r) => r !== OTHERS_LABEL);
    mergedRoles.push(OTHERS_LABEL);
  }

  // Step 2+
  // companyField 為自定義 code 字串
  const [companyField, setCompanyField] = useState("");
  const [primaryInterest, setPrimaryInterest] = useState([]);
  const [detailInterest, setDetailInterest] = useState([]);
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Progress Logic step1 填了會加進度條的 field
  function calcStep1Fill() {
    let filled = 0;
    if (firstName.trim()) filled += 1;
    if (lastName.trim()) filled += 1;
    if (reasonForUse.length > 0) filled += 1;
    if (role) {
      if (role === "Others") {
        if (customRole.trim()) filled += 1;
      } else {
        filled += 1;
      }
    }
    if (companyName.trim()) filled += 1;
    return filled;
  }

  // step2 填了會加進度條的 field
  function calcStep2Fill() {
    let filled = 0;
    if (companyField) filled += 1;
    if (primaryInterest.length > 0) filled += 1;
    return filled;
  }
  function getProgress() {
    // step1: 0-25%，每填1格5%；step2: 25-50%，每格12.5%；step3:75%；step4:100%
    if (step === 1) {
      const per = (calcStep1Fill() / 5) * 25;
      return Math.min(per, 25);
    }
    if (step === 2) {
      // step 2 base 25%，加必填每格12.5%，共2格
      const per = 25 + (calcStep2Fill() / 2) * 25;
      return Math.min(per, 50);
    }
    if (step === 3) {
      return 75;
    }
    if (step === 4) {
      return 100;
    }
    return 0;
  }
  // Next enable/disable logic
  function isStepValid() {
    if (step === 1) {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        reasonForUse.length === 0 ||
        !role ||
        (role === "Others" && !customRole.trim()) ||
        !companyName.trim()
      ) {
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!companyField || primaryInterest.length === 0) {
        return false;
      }
      return true;
    }
    // step 3 always valid (無必填)
    return true;
  }

  // 清理 role/state 當 mergedRoles 變化 (失去合法性)
  useEffect(() => {
    if (role && !mergedRoles.includes(role)) {
      setRole("");
      setCustomRole("");
    }
    // eslint-disable-next-line
  }, [mergedRoles]);

  // Next click handler
  const handleNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!isStepValid()) {
        setErrorMsg("Please fill all required fields.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!isStepValid()) {
        setErrorMsg("Please fill all required fields.");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
  };

  useEffect(() => {
    if (step !== 4) return;
    const updateProfile = async () => {
      setLoading(true);
      setErrorMsg("");
      // If "Others" is picked in role, use customRole for jobTitle
      const finalRole =
        role === "Others" && customRole.trim() ? customRole.trim() : role;
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jobTitle: finalRole,
        companyPrimaryField: companyField,
        company: companyName.trim() || null,
        reasonForUse,
        primaryInterest,
        detailInterest,
      };
      console.log(payload);
      try {
        await axios.post(`${baseURL}/api/Account/Update`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await axios.get(`${baseURL}/api/Account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        sessionStorage.setItem("user_firstTime_login", "false");
        setUserData(res.data);
        if (typeof userMutate === "function") {
          await userMutate();
        }
        // Stripe CreateCustomer API（移到 context 提供）
        try {
          await createStripeCustomer();
        } catch (stripeErr) {
          const msg = stripeErr.message || "Stripe customer creation failed";
          toast.error(msg);
        }
      } catch (err) {
        const apiErr = err.response?.data?.error || "Update failed";
        const status = err.response?.status;
        // setErrorMsg(apiErr);
        toast.error(apiErr);
        if (status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    updateProfile();
    // eslint-disable-next-line
  }, [step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const toggleTag = (tag, arr, setArr) => {
    if (arr.includes(tag)) {
      setArr(arr.filter((t) => t !== tag));
    } else {
      setArr([...arr, tag]);
    }
  };

  return (
    <div className="lg:min-h-screen lg:h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full lg:w-fit h-full lg:h-fit max-w-full">
        {/* Background Blur */}
        <div className="hidden lg:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />
        {/* Main content */}
        <div className="relative w-full lg:w-[920px] h-full lg:h-fit flex flex-col items-center mx-0 lg:mx-4 px-4 lg:px-34 py-10 pt-25 lg:pt-24 lg:pb-6 gap-8 bg-white rounded-none lg:rounded-10px">
          {/* Logo */}
          <div className="w-fit absolute top-8 left-8">
            <img src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </div>

          {/* Step Content - Progress/Next移除 */}
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col items-center w-full gap-9">
              {/* Title */}
              <h2 className=" font-bold text-[30px] leading-140 text-textColor-primary text-center">
                Complete your profile to tailor your insights.
              </h2>
              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="flex flex-col w-full gap-6"
                autoComplete="off"
              >
                {/* First Name + Last Name Row */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  {/* First Name */}
                  <label className="flex flex-col gap-1 w-full">
                    <span className="text-textColor-primary text-sm1 font-medium">
                      First Name<span className="">*</span>
                    </span>
                    <input
                      max={50}
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="border border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                    />
                  </label>
                  {/* Last Name */}
                  <label className="flex flex-col gap-1 w-full">
                    <span className="text-textColor-primary text-sm1 font-medium">
                      Last Name<span className="">*</span>
                    </span>
                    <input
                      max={50}
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="border border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                    />
                  </label>
                </div>
                {/* Why are you using BIODND? (multi-select, tag button style) */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="flex flex-col gap-4 w-full">
                    <span className="text-textColor-primary text-sm1 font-medium">
                      Why are you using BIODND?<span className="">*</span>
                    </span>
                    <div className="flex flex-wrap gap-4 w-fit">
                      {reasonRadioOptions.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(option, reasonForUse, setReasonForUse);
                            setRole("");
                            setCustomRole("");
                          }}
                          className={`px-5 py-3 rounded-lg border text-base font-medium transition-all
                            ${
                              reasonForUse.includes(option)
                                ? "bg-Neon-Green-light border-primaryBlue-400"
                                : "bg-white border-interface-gray-light hover:bg-interface-gray-lighter"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* What’s your role? */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <label className="flex flex-col gap-1 w-full">
                    <span className="text-textColor-primary text-sm1 font-medium">
                      What’s your role?<span className="">*</span>
                    </span>
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                      <select
                        id="role"
                        className="w-full border border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value);
                          setCustomRole("");
                        }}
                        disabled={mergedRoles.length === 0}
                        required
                      >
                        <option value="">— Please Select —</option>
                        {mergedRoles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      {role === "Others" ? (
                        <input
                          type="text"
                          className="w-full border border-interface-gray-light rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                          placeholder="Please specify your role"
                          value={customRole}
                          maxLength={48}
                          onChange={(e) => setCustomRole(e.target.value)}
                        />
                      ) : (
                        <div className="w-full hidden lg:block"></div>
                      )}
                    </div>
                  </label>
                </div>
                {/* Company */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <label className="flex flex-col gap-1 w-full">
                    <span className="text-textColor-primary text-sm1 font-medium">
                      Company<span className="">*</span>
                    </span>
                    <input
                      max={100}
                      type="text"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                    />
                  </label>
                  <div className="w-full hidden lg:block"></div>
                </div>
              </form>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-14 w-full">
              {/* 公司領域選擇 */}
              <label className="flex flex-col items-start lg:items-center gap-8 w-full">
                <p className="text-textColor-primary text-xl font-semibold">
                  What’s your company field?
                  <span className="">*</span>
                </p>
                <select
                  id="companyField"
                  className="mt-1 w-full sm:w-89 border border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                  value={companyField}
                  onChange={(e) => {
                    setCompanyField(e.target.value);
                    setPrimaryInterest([]);
                    setDetailInterest([]);
                  }}
                  required
                >
                  <option value="" disabled>
                    — Please Select —
                  </option>
                  {companyFieldOptions.map(({ code, label }) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 主興趣動態選單 */}
              <div className="flex flex-col items-start lg:items-center gap-8 w-full">
                <p className="text-textColor-primary text-xl font-semibold">
                  What’s your primary interest?
                  <span className="">*</span>
                </p>
                <div className="flex lg:max-h-[158px] overflow-y-auto scrollbar-hide justify-start lg:justify-center flex-wrap gap-4 leading-160">
                  {companyField === "" ? (
                    <span className="text-gray-400">
                      Please select a company field first.
                    </span>
                  ) : (primaryInterestMap[companyField] || []).length > 0 ? (
                    primaryInterestMap[companyField].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          toggleTag(tag, primaryInterest, setPrimaryInterest)
                        }
                        className={`px-5 py-3 rounded-lg border text-textColor-Tertiary text-base text-start lg:text-center font-medium transition-all
                            ${
                              primaryInterest.includes(tag)
                                ? "bg-Neon-Green-light  border-primaryBlue-400 "
                                : "bg-white  border-interface-gray-light hover:bg-interface-gray-lighter"
                            }`}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No primary interests for this field.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col items-start lg:items-center gap-8 w-full">
                  <p className="text-textColor-primary text-xl font-semibold">
                    Detail interest?
                  </p>
                  <div className="flex lg:max-h-[360px] overflow-y-auto scrollbar-hide justify-start lg:justify-center flex-wrap gap-4">
                    {(detailInterestMap[companyField] || []).length > 0 ? (
                      detailInterestMap[companyField].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            toggleTag(tag, detailInterest, setDetailInterest)
                          }
                          className={`px-5 py-3 rounded-lg border text-textColor-Tertiary text-base text-start lg:text-center font-medium transition-all leading-160
                            ${
                              detailInterest.includes(tag)
                                ? "bg-Neon-Green-light border-primaryBlue-400"
                                : "bg-white border-interface-gray-light hover:bg-interface-gray-lighter"
                            }`}
                        >
                          {tag}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400">
                        No detailed interests for this field.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="flex flex-col items-center w-full gap-6">
              {/* loading/error 狀態不動 */}
              {loading && (
                <p className="text-gray-500 text-center">Updating profile...</p>
              )}
              {errorMsg && (
                <p className="text-warning text-center">{errorMsg}</p>
              )}
              {/* 主要內容區 */}
              {!loading && userData && (
                <div className="w-full flex flex-col items-center gap-8">
                  {/* Title */}
                  <h2 className=" font-bold text-30px leading-140 text-textColor-primary text-center mt-2">
                    🎉 Welcome to BIODND!
                  </h2>
                  {/* Subtitle */}
                  <div className="text-base font-medium text-textColor-secondary text-center leading-160">
                    Hi{" "}
                    <span className="text-Neon-Purple">
                      {userData.firstName}
                    </span>
                    , ready to explore Data & Deals?
                    <br className="block" />
                    Try BIODND Pro free for{" "}
                    <span className="text-Neon-Purple">14 days</span>.
                  </div>
                  {/* Features */}
                  <div className="flex flex-col py-5 w-fit mx-0 lg:mx-auto">
                    <div className="flex flex-row items-center gap-2">
                      {/* Icon: Pill */}
                      <img src={Pill_icon} alt="Pill icon" />
                      <span className="text-textColor-Tertiary text-base leading-160">
                        Unlimited Access to Startups & Assets
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {/* Icon: Search */}
                      <img src={Search_icon} alt="Search icon" />

                      <span className="text-textColor-Tertiary text-base leading-160">
                        Full Search Results, No Limits
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {/* Icon: AI */}
                      <img src={AI_icon} alt="AI icon" />
                      <span className="text-textColor-Tertiary text-base leading-160">
                        Unlimited Use of Insights AI
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {/* Icon: Handshake */}
                      <img src={Handshake_icon} alt="handshake icon" />
                      <span className="text-textColor-Tertiary text-base leading-160">
                        Connect with Investors & Partners
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {/* Icon: News */}
                      <img src={News_icon} alt="News icon" />
                      <span className="text-textColor-Tertiary text-base leading-160">
                        Stay Ahead with Real-Time News
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress bar & Next 按鈕移至最下面，依據 step 驗證 */}
          <div className="w-full mt-2 h-fit">
            {/* Progress bar */}
            <div className="w-full bg-[#F7F8F9] rounded-full h-1 mb-3">
              <div
                className="bg-gradient-to-r from-[#ABA2FF] to-[#92F4D8] h-1 rounded-full transition-all"
                style={{ width: `${getProgress()}%` }}
              />
            </div>

            {/* error message（統一集中） */}
            {errorMsg && step !== 4 && (
              <p className="text-warning text-sm1 mt-1 flex items-center gap-1">
                <span>❌</span>
                {errorMsg}
              </p>
            )}

            {/* Next button：step4 隱藏 */}
            {step < 4 ? (
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  disabled={loading || !isStepValid()}
                  className="mt-4 w-full lg:w-28 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 px-5 transition-all disabled:text-textColor-disabled disabled:bg-Gray-400"
                >
                  {loading ? "Next..." : "Next"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-10 mt-10">
                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-[500px]  mx-auto justify-center">
                  <Link
                    to={"/subscribe"}
                    className=" font-medium text-[18px] text-center rounded-10px py-3 px-5 bg-primary-default text-white hover:bg-primary-hovered transition-all shadow"
                  >
                    Explore BIODND Pro
                  </Link>
                </div>
                {/* Footer Link */}
                <div className="w-full flex justify-center py-4">
                  <Link
                    to={"/database/search"}
                    className="text-sm1 text-textColor-Tertiary cursor-pointer hover:underline"
                  >
                    {"Keep Free Plan >"}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
