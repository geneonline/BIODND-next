import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Faq from "./components/Faq";

import purple_check from "@/assets/svg/subscribe/purple_check.svg";

import Loading from "@/widgets/Loading";

const Subscribe = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [annualBilling, setAnnualBilling] = useState(false);
  const [isProPlanLoading, setIsProPlanLoading] = useState(false);

  const [isMobileListOpen, setIsMobileListOpen] = useState([
    false, // Free
    false, // Pro
    false, // Enterprise
  ]);

  const token = localStorage.getItem("token");
  const { userData, userLoading, userMutate } = useUser(token);
  const { makeStripePayment, createStripeCustomer } = useAuth();
  useEffect(() => {
    // 只有帶入 checkpro=1 的 query string 時，才自動處理 Pro 跳轉
    if (
      !userLoading &&
      userData?.subscriptionLevel === "Pro" &&
      searchParams.get("checkpro") === "1"
    ) {
      navigate("/subscribe/manage", { replace: true });
    }
  }, [userLoading, userData, navigate, searchParams]);

  const handleProPlanClick = async () => {
    if (!userData) {
      navigate("/account/login");
      return;
    }
    setIsProPlanLoading(true);
    try {
      let currentUserData = userData;
      if (!currentUserData.customerId) {
        await createStripeCustomer();
        const refreshedData = await userMutate();
        currentUserData = refreshedData || currentUserData;
        if (!currentUserData.customerId) {
          toast.error("Still missing Stripe customerId. Please try again.");
          setIsProPlanLoading(false);
          return;
        }
      }
      const priceId = annualBilling
        ? import.meta.env.VITE_STRIPE_PRICE_ID_YEAR
        : import.meta.env.VITE_STRIPE_PRICE_ID_MONTH;
      const result = await makeStripePayment({ priceId });
      if (result) {
        window.location.href = result;
      } else {
        toast.error("payment failed, please try again later");
      }
    } catch (error) {
      toast.error(error.message || "Payment failed, please try again later");
    } finally {
      setIsProPlanLoading(false);
    }
  };

  return (
    <main className="">
      <div className="bg-interface-background pt-32 lg:pt-38 pb-24">
        <div className="max-w-[1200px] flex flex-col mx-auto">
          <h1 className="max-w-[690px] text-textColor-primary px-8 text-36px font-bold leading-140 self-center max-md:max-w-full text-center">
            Power Your Strategy with the Right BIODND Plan
          </h1>
          <div className="max-w-[640px] mx-auto mt-8 px-8 text-xl text-textColor-secondary leading-140 font-normal text-center">
            From discovery to deal, access deep biotech insights, identify
            opportunities, and drive smarter decisions — all in one place.
          </div>
          {/* 付費週期 toggle */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-2 relative p-1 rounded-full border outline-none transition-shadow min-w-[200px] bg-[#D9F0F3] border-[#B0E0E6] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.02),inset_0px_2px_4px_0px_rgba(0,0,0,0.04)] cursor-pointer"
              onClick={() => setAnnualBilling((prev) => !prev)}
              tabIndex={0}
            >
              <div
                className={`${
                  annualBilling ? "left-[143px] w-[186px]" : "left-1 w-[135px]"
                } absolute bg-white z-10 rounded-full h-[45px] transition-all shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.1)]`}
              ></div>
              <span
                className={
                  "flex items-center px-8 py-2 rounded-full transition-colors z-20" +
                  (!annualBilling
                    ? " font-medium text-textColor-primary"
                    : "bg-transparent font-normal text-textColor-Tertiary") +
                  " text-[18px] font-inter leading-160"
                }
              >
                Monthly
              </span>
              <span
                className={
                  "flex items-center px-6 py-2 rounded-full transition-colors relative z-20" +
                  (annualBilling
                    ? " font-medium text-textColor-primary"
                    : "bg-transparent font-normal text-textColor-Tertiary") +
                  " text-18px font-inter leading-160"
                }
              >
                Yearly
                <span className="ml-2 py-0.5 rounded-full font-medium text-[#C10007] text-sm1 leading-[1.43] font-inter">
                  {"Save ~20%"}
                </span>
              </span>
            </button>
          </div>

          {userLoading && <Loading />}

          <section className="self-stretch mt-8 max-w-full md:max-w-full">
            <div className="flex flex-col gap-6 mx-7 px-5 lg:flex-row lg:items-stretch lg:mx-0">
              {/* Free */}
              <div className="relative flex flex-col items-center w-full ml-0 lg:w-[33%]">
                <div
                  className={`${
                    !userData?.subscriptionLevel ||
                    userData?.subscriptionLevel === "Free"
                      ? "border border-primary-default"
                      : "border-0"
                  } bg-white flex w-full h-full flex-col flex-shrink-0 mx-auto px-7 py-6 lg:py-11 rounded-2xl transition-all z-10`}
                >
                  {/* title */}
                  <div className="flex flex-col">
                    <h2 className="text-textColor-primary text-24px font-medium font-Inter text-left">
                      Free
                    </h2>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center lg:flex-col xl:items-start mt-4 lg:mt-8 gap-6 lg:gap-8">
                    <div className="flex flex-col md:w-1/2 lg:w-full">
                      {/* price and sub_title */}
                      <div className="flex flex-row flex-wrap items-baseline gap-2">
                        <h3 className="text-textColor-primary text-30px font-bold font-Inter text-left">
                          $0
                        </h3>
                        <p className="text-sm1 font-normal text-textColor-secondary font-Inter align-bottom">
                          free of charge
                        </p>
                      </div>
                      {/* description */}
                      <span className="md:min-h-13 text-textColor-Tertiary text-16px font-Inter font-normal text-left mt-2">
                        Start for free — no credit card required.
                      </span>
                    </div>
                    <div className="flex flex-row w-full md:w-1/2 lg:w-full">
                      <Link
                        to={
                          userData?.subscriptionLevel === "Free"
                            ? "/database/search"
                            : "/account/login"
                        }
                        className="w-full flex justify-center items-center border border-primary-default text-primary-default rounded-[50px] text-18px font-medium font-Inter px-6 py-3 bg-none hover:bg-primaryBlue-200 transition-colors duration-200"
                        style={{ minHeight: "48px" }}
                      >
                        Try for free
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`${
                      isMobileListOpen[0] ? "flex" : "hidden"
                    } lg:flex flex-col gap-4 lg:gap-8 mt-4 lg:mt-8`}
                  >
                    <h2 className="text-textColor-secondary text-18px font-Inter leading-160">
                      For startups and tech companies seeking partners and
                      funding
                    </h2>
                    <ul className="flex flex-col gap-4">
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Up to{" "}
                          <span className="font-semibold">5 searches</span> for
                          companies
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Up to{" "}
                          <span className="font-semibold">5 searches</span> for
                          drug assets
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Insights AI:{" "}
                          <span className="font-semibold">5 chats</span>{" "}
                          /reports, no downloads.
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Browse company, Asset, and clinical info
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          <span className="font-semibold">
                            Create your company profile
                          </span>{" "}
                          to gain visibility & attract investors.
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* mobile show plan button */}
                  <button
                    onClick={() =>
                      setIsMobileListOpen((prev) => [
                        !prev[0],
                        prev[1],
                        prev[2],
                      ])
                    }
                    className="mt-4 pt-3 w-full flex lg:hidden justify-between border-t border-t-interface-divider"
                  >
                    See
                    {isMobileListOpen[0] ? " Less" : " More"}
                    <div className="relative w-6 h-6 flex items-center justify-center ">
                      <div className="absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black rounded-full" />
                      <div
                        className={`absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black transition-all rounded-full ${
                          isMobileListOpen[0] ? "rotate-0" : "rotate-90"
                        } `}
                      />
                    </div>
                  </button>
                </div>

                <div
                  className={`${
                    !userData?.subscriptionLevel ||
                    userData?.subscriptionLevel === "Free"
                      ? "shadow-primary-shadow"
                      : "shadow-none"
                  } top-0 left-0 absolute w-full h-full rounded-2xl transition-all pointer-events-none`}
                ></div>
              </div>

              {/* Pro */}
              <div className="relative flex flex-col items-center w-full ml-0 lg:w-[33%]">
                <div
                  className={`${
                    userData?.subscriptionLevel === "Pro"
                      ? " border border-primary-default"
                      : " border-0"
                  } bg-white flex w-full h-full flex-col flex-shrink-0 mx-auto px-7 py-6 lg:py-11 rounded-2xl transition-all z-10`}
                >
                  {/* title */}
                  <div className="flex gap-2">
                    <h2 className="text-textColor-primary text-24px font-medium font-Inter text-left">
                      Pro
                    </h2>
                    {/* Pro 特有 badge */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-Purple-100 text-Purple-600">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.5 4.93795C14.7355 5.65166 15.7234 6.7259 16.3313 8.01674C16.9393 9.30759 17.1382 10.7534 16.9016 12.1605C16.6649 13.5675 16.0038 14.8687 15.007 15.8896C14.0102 16.9105 12.7252 17.6024 11.3242 17.8726C9.92318 18.1428 8.47304 17.9785 7.16805 17.4015C5.86306 16.8245 4.76554 15.8626 4.02253 14.6445C3.27952 13.4263 2.92649 12.0103 3.01076 10.5859C3.09502 9.16155 3.61254 7.79696 4.49399 6.67495C4.69599 6.41795 5.08399 6.45695 5.28699 6.71395C5.56499 7.06595 5.88099 7.38595 6.22999 7.66795C6.56199 7.93695 7.01599 7.61895 7.00299 7.19195C6.97106 6.23984 7.16717 5.29389 7.57499 4.43295C8.10872 3.30931 8.97711 2.37839 10.061 1.76794C10.308 1.62794 10.611 1.75194 10.738 2.00594C11.3499 3.23391 12.3107 4.25388 13.5 4.93795ZM14 11.9999C14 13.0608 13.5786 14.0782 12.8284 14.8284C12.0783 15.5785 11.0609 15.9999 9.99999 15.9999C8.08699 15.9999 6.47999 14.6019 6.08999 12.8179C5.99699 12.3889 6.52999 12.1749 6.90399 12.4049C7.39173 12.7041 7.93742 12.8964 8.50499 12.9689C8.80799 13.0069 9.03599 12.7289 9.01499 12.4249C8.90504 10.9113 9.37519 9.41257 10.33 8.23294C10.3806 8.16974 10.4474 8.12147 10.5233 8.09329C10.5993 8.06511 10.6814 8.05808 10.761 8.07295C11.6728 8.24983 12.4946 8.73841 13.0856 9.45491C13.6765 10.1714 13.9998 11.0712 14 11.9999Z"
                          fill="#5C51B1"
                        />
                      </svg>
                      <span className="inline-block font-medium text-sm1">
                        14 days Free Trial
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center lg:flex-col xl:items-start mt-4 lg:mt-8 gap-6 lg:gap-8">
                    <div className="flex flex-col md:w-1/2 lg:w-full">
                      {/* price and sub_title */}
                      <div className="flex flex-row flex-wrap items-baseline gap-2">
                        <h3 className="text-textColor-primary text-30px font-bold font-Inter text-left">
                          {annualBilling ? "$399" : "$499"}
                        </h3>
                        <p className="text-sm1 font-normal text-textColor-secondary font-Inter align-bottom">
                          user/month
                        </p>
                      </div>
                      {/* description */}
                      <span className="md:min-h-13 text-textColor-Tertiary text-16px font-Inter font-normal text-left mt-2">
                        Go Pro for full access and future perks.
                      </span>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2 lg:w-full gap-3">
                      {userData?.subscriptionLevel === "Pro" ? (
                        <div
                          className="w-full flex justify-center items-center bg-Gray-400 text-Gray-600 rounded-[50px] text-18px font-medium font-Inter px-6 py-3 transition-colors duration-200"
                          style={{ minHeight: "48px" }}
                        >
                          Your Current Plan
                        </div>
                      ) : (
                        <button
                          onClick={handleProPlanClick}
                          disabled={isProPlanLoading}
                          className={`w-full flex justify-center items-center border text-white rounded-[50px] text-18px font-medium font-Inter px-6 py-3 bg-primary-default hover:bg-primary-hovered transition-colors duration-200 ${
                            isProPlanLoading
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                          style={{ minHeight: "48px" }}
                          aria-busy={isProPlanLoading}
                        >
                          {isProPlanLoading
                            ? "Purchasing..."
                            : "Try 14 days for $0"}
                        </button>
                      )}
                      {userData?.subscriptionLevel === "Pro" && (
                        <Link
                          to={"/subscribe/manage"}
                          className=" w-full underline-offset-2 underline text-textColor-Tertiary  text-center"
                        >
                          Management Plan
                        </Link>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${
                      isMobileListOpen[1] ? "flex" : "hidden"
                    } lg:flex flex-col gap-4 lg:gap-8 mt-4 lg:mt-8`}
                  >
                    <h2 className="text-textColor-secondary text-18px font-Inter leading-160">
                      Ideal for investors, BD pros, analysts, and consultants.
                    </h2>
                    <ul className="flex flex-col gap-4">
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Pro plan includes all free features.
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Unlimited searches for companies and assets
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Unlimited access to Insights AI, including full report
                          downloads
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Advanced comparison and filtering tools for companies
                          and assets
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Can access data collection feature
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* mobile show plan button */}
                  <button
                    onClick={() =>
                      setIsMobileListOpen((prev) => [
                        prev[0],
                        !prev[1],
                        prev[2],
                      ])
                    }
                    className="mt-4 pt-3 w-full flex lg:hidden justify-between border-t border-t-interface-divider"
                  >
                    See
                    {isMobileListOpen[1] ? " Less" : " More"}
                    <div className="relative w-6 h-6 flex items-center justify-center ">
                      <div className="absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black rounded-full" />
                      <div
                        className={`absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black transition-all rounded-full ${
                          isMobileListOpen[1] ? "rotate-0" : "rotate-90"
                        } `}
                      />
                    </div>
                  </button>
                </div>

                <div
                  className={`${
                    userData?.subscriptionLevel === "Pro"
                      ? "shadow-primary-shadow"
                      : "shadow-none"
                  } top-0 left-0 absolute w-full h-full rounded-2xl transition-all pointer-events-none`}
                ></div>
              </div>

              {/* Enterprise */}
              <div className="flex flex-col items-center w-full ml-0 lg:w-[33%]">
                <div
                  className={`shadow-none border-0 bg-white flex w-full h-full flex-col flex-shrink-0 mx-auto px-7 py-6 lg:py-11 rounded-2xl transition-all z-10`}
                >
                  {/* title */}
                  <div className="flex flex-col">
                    <h2 className="text-textColor-primary text-24px font-medium font-Inter text-left">
                      Enterprise
                    </h2>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center lg:flex-col xl:items-start mt-4 lg:mt-8 gap-6 lg:gap-8">
                    <div className="flex flex-col md:w-1/2 lg:w-full">
                      {/* price and sub_title */}
                      <div className="flex flex-row flex-wrap items-baseline gap-2">
                        <h3 className="text-textColor-primary text-30px font-bold font-Inter text-left">
                          Contact Us
                        </h3>
                        <p className="text-sm1 font-normal text-textColor-secondary font-Inter align-bottom">
                          custom billing
                        </p>
                      </div>
                      {/* description */}
                      <span className="md:min-h-13 text-textColor-Tertiary text-16px font-Inter font-normal text-left mt-2">
                        Flexible, fully integrated solutions for organizations.
                      </span>
                    </div>
                    <div className="flex flex-row w-full md:w-1/2 lg:w-full">
                      {userData?.subscriptionLevel === "Enterprise" ? (
                        <div
                          className="w-full flex justify-center items-center border border-primary-default text-primary-default rounded-[50px] text-18px font-medium font-Inter px-6 py-3 bg-none hover:bg-primaryBlue-200 transition-colors duration-200"
                          style={{ minHeight: "48px" }}
                        >
                          Your Current Plan
                        </div>
                      ) : (
                        <Link
                          to="/contact-sales"
                          className="w-full flex justify-center items-center border border-primary-default text-primary-default rounded-[50px] text-18px font-medium font-Inter px-6 py-3 bg-none hover:bg-primaryBlue-200 transition-colors duration-200"
                          style={{ minHeight: "48px" }}
                        >
                          Talk to Sales
                        </Link>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${
                      isMobileListOpen[2] ? "flex" : "hidden"
                    } lg:flex flex-col gap-4 lg:gap-8 mt-4 lg:mt-8`}
                  >
                    <h2 className="text-textColor-secondary text-18px font-Inter leading-160">
                      For biotech, pharma, investors, and institutions.
                    </h2>
                    <ul className="flex flex-col gap-4">
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Enterprise plan includes all Pro plan features.
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Multi-person use
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Gain API access
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Consolidated invoicing
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Bulk export full BIODND dataset
                        </span>
                      </li>
                      <li className="flex flex-row items-center gap-2">
                        <img src={purple_check} alt="purple_icon" />
                        <span className="text-textColor-primary text-16px font-Inter leading-160">
                          Dedicated account team and enhanced support
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* mobile show plan button */}
                  <button
                    onClick={() =>
                      setIsMobileListOpen((prev) => [
                        prev[0],
                        prev[1],
                        !prev[2],
                      ])
                    }
                    className="mt-4 pt-3 w-full flex lg:hidden justify-between border-t border-t-interface-divider"
                  >
                    See
                    {isMobileListOpen[2] ? " Less" : " More"}
                    <div className="relative w-6 h-6 flex items-center justify-center ">
                      <div className="absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black rounded-full" />
                      <div
                        className={`absolute left-1/2 top-1/2 w-[16.5px] h-[2px] bg-black transition-all rounded-full ${
                          isMobileListOpen[2] ? "rotate-0" : "rotate-90"
                        } `}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Faq />
    </main>
  );
};

export default Subscribe;
