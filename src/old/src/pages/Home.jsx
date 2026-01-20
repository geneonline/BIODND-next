import { useState, useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import big_logo from "@/assets/svg/homepage/big_logo.svg";
import whyicon_purple from "@/assets/svg/homepage/WhyIcon_purple.svg";
import whyicon_green from "@/assets/svg/homepage/WhyIcon_green.svg";
import whyicon_blue from "@/assets/svg/homepage/WhyIcon_blue.svg";

import { useInView, animated } from "@react-spring/web";
import AniAppearComp from "@/animation/AniAppearComp";
import AniAppearCompN from "@/animation/AniAppearCompNoT";
import { useUser } from "@/data/api";
import PageHelmet from "@/widgets/PageHelmet";

import { countNumber } from "@/animation/aniCountNumber";
import Map_svg from "@/widgets/home/Map_svg";
// import PieChart from "@/widgets/home/PieChart";
import EChart from "@/widgets/home/EChart";
import Searchbar from "@/widgets/home/Searchbar";
import DemoSection from "@/parts/home/DemoSection";

import GCP_logo from "@/assets/webp/home/GCP_logo.webp";
import nvidia_logo from "@/assets/webp/home/nvidia_logo.webp";

import learnMore_arrow from "@/assets/svg/database/companiesHits_arrow.svg";
import laptop from "@/assets/webp/home/laptop.webp";

import trial_account_img from "@/assets/webp/home/trial_account_img.webp";

const Trial_account_svg = () => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM8.5 16.5L14.5 23L25 12.5L22.5 10L14.5 18L11 14L8.5 16.5Z"
      fill="#009BAF"
    />
  </svg>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { userData, userLoading } = useUser();
  const { setIsSignupPopup } = useOutletContext();

  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#about-div") {
      document.getElementById("about-div").scrollIntoView();
    }
  }, [location]);

  const [discription_inViewRef, discription_inView] = useInView({
    threshold: 0.3,
  });
  // const [demoSection_inViewRef, demoSection_inView] = useInView({
  //   threshold: 0.3,
  // });
  const [countNumber_inViewRef, countNumber_inView] = useInView({
    threshold: 0.3,
  });
  const [Whybio_inViewRef, Whybio_inView] = useInView({
    threshold: 0.3,
  });
  // const [aboutUs_inViewRef, aboutUs_inView] = useInView({
  //   threshold: 0.3,
  // });
  // const [partnership_inViewRef, partnership_inView] = useInView({
  //   threshold: 0.3,
  // });

  const [introPJ_inViewRef, introPJ_inView] = useInView({
    threshold: 0.3,
  });

  const [trailaccount_inViewRef, trailaccount_inView] = useInView({
    threshold: 0.3,
  });

  const [joinUs_inViewRef, joinUs_inView] = useInView({
    threshold: 0.3,
  });

  const countNumArr = [
    { startNum: 0, finalNum: 90 },
    { startNum: 0, finalNum: 100000 },
    { startNum: 0, finalNum: 90000 },
    { startNum: 0, finalNum: 350000 },
  ];

  const countNumbers = countNumber(countNumArr, countNumber_inView);

  const handleIsLoginLink = (e) => {
    if (!userData) {
      e.preventDefault();
      setIsSignupPopup(true);
    }
  };

  return (
    <div>
      <PageHelmet
        pageTitle={t("head.home.title")}
        pageDescription={t("head.home.description")}
      />
      <div className="xl:mt-19">
        {/* ----------------- home search part ------------ */}
        <section className="relative flex flex-col items-center py-34 w-full bg-home-search-bg bg-cover text-center">
          <h1 className="w-[663px] text-5xl text-white text-center font-bold leading-140">
            Explore Biotech Possibilities with BIODND.
          </h1>

          <div className="flex space-x-4 md:space-x-5.5 xl:space-x-7 mt-12.5 xl:mt-12 text-xs3 md:text-sm2 xl:text-base">
            <Link
              onClick={handleIsLoginLink}
              className={`w-[519px] py-4 bg-main-color hover:bg-main-color-gb shadow-main-blue-glow hover:shadow-main-gb-glow text-24px text-white text-center font-semibold leading-140 rounded-full duration-150`}
              to="searchhome"
            >
              Search by assets
            </Link>

            <Link
              onClick={handleIsLoginLink}
              className={`w-[519px] py-4 bg-main-color hover:bg-main-color-gb shadow-main-blue-glow hover:shadow-main-gb-glow text-24px text-white text-center font-semibold leading-140 rounded-full duration-150`}
              to="company-home"
            >
              Search by companies
            </Link>
          </div>
        </section>

        {/* ---------- our partners part ------------ */}

        <section className="bg-white py-15 flex items-center justify-center">
          <p className="mr-14 font-semibold text-32px leading-140">
            {t("home.our_partners")}
          </p>
          <div className="flex space-x-10 md:flex-row justify-center items-center">
            <div className="w-80 xl:w-96 bg-white flex items-center">
              <img src={GCP_logo} alt="" />
            </div>

            <div className="w-[262px] flex items-center">
              <img src={nvidia_logo} alt="" />
            </div>
          </div>
        </section>

        {/* ----------- demo section ---------------- */}
        <DemoSection />
        {/* <DemoSectionSwiper /> */}

        {/* -------------- Why bio ------------------ */}
        <section
          ref={Whybio_inViewRef}
          className="relative bg-home-map bg-cover pt-28 md:pt-32 xl:pt-38 "
        >
          <div className="flex flex-col items-center">
            <h2 className="flex items-center pb-11 font-semibold text-32px leading-140">
              <AniAppearComp
                element="span"
                inView={Whybio_inView}
                delay={0}
                className="pr-5 text-white whitespace-nowrap"
              >
                {t("home.why_bio.title")}
              </AniAppearComp>

              <AniAppearComp
                element="span"
                inView={Whybio_inView}
                delay={1000}
                className="text-white text-5xl font-bold"
              >
                BIODND
              </AniAppearComp>
            </h2>

            {/* three rect */}
            <div className="w-full  pb-8 flex justify-center items-center relative md:top-0 space-x-5 overflow-auto md:overflow-visible">
              {/* purple */}
              <AniAppearCompN
                z={10}
                element="div"
                inView={Whybio_inView}
                delay={1300}
              >
                <div
                  className=" pt-8 pb-10 px-6 xl:px-9  h-[356px] 
              bg-white  rounded-10px flex flex-col flex-shrink-0 items-center justify-start transition-all"
                >
                  <div className="flex pb-5 mb-5 space-x-5 border-b border-search-home-bg">
                    <div className="bg-sub-color p-2.5 rounded-5px leading-140">
                      <img className="" src={whyicon_purple} alt="" />
                    </div>
                    <h3 className="w-[219px] text-base xl:text-24px font-black text-sub-color text-left">
                      {t("home.why_bio.description_title.0")}
                    </h3>
                  </div>

                  <p
                    className={`w-[300px] pb-5 text-left text-main-text-gray text-base font-medium leading-140`}
                  >
                    {t("home.why_bio.description_content.0")}
                  </p>
                </div>
              </AniAppearCompN>

              {/* green */}
              <AniAppearCompN
                z={8}
                element="div"
                inView={Whybio_inView}
                delay={1400}
              >
                <div
                  className=" pt-8 pb-10 px-6 xl:px-9 h-[356px] 
              bg-white rounded-10px flex flex-col flex-shrink-0 items-center justify-start transition-all"
                >
                  <div className="flex pb-5 mb-5 space-x-5 border-b border-search-home-bg">
                    <div className="bg-sub-color p-2.5 rounded-5px leading-140">
                      <img className="" src={whyicon_green} alt="" />
                    </div>
                    <h3 className="w-[219px] text-base xl:text-24px font-black text-sub-color text-left">
                      {t("home.why_bio.description_title.1")}
                    </h3>
                  </div>

                  <p
                    className={`w-[300px] pb-5 text-left text-main-text-gray text-base font-medium leading-140`}
                  >
                    <Trans i18nKey="home.why_bio.description_content.1">
                      bla bla bla..
                      <span className="font-bold ">bla bla bla..</span>
                    </Trans>
                  </p>
                </div>
              </AniAppearCompN>

              {/* blue */}
              <AniAppearCompN
                z={8}
                element="div"
                inView={Whybio_inView}
                delay={1500}
              >
                <div
                  className=" pt-8 pb-10 px-6 xl:px-9 h-[356px]
              bg-white  rounded-10px flex flex-col flex-shrink-0 items-center justify-start transition-all"
                >
                  <div className="flex pb-5 mb-5 space-x-5 border-b border-search-home-bg">
                    <div className="bg-sub-color p-2.5 rounded-5px leading-140">
                      <img className="" src={whyicon_blue} alt="" />
                    </div>
                    <h3 className="w-[219px] text-base xl:text-24px font-black text-sub-color text-left">
                      {t("home.why_bio.description_title.2")}
                    </h3>
                  </div>

                  <p
                    className={`w-[300px] pb-5 text-left text-main-text-gray text-base font-medium leading-140`}
                  >
                    <Trans i18nKey="home.why_bio.description_content.2">
                      bla bla bla..
                      <span className="font-bold ">bla bla bla..</span>
                    </Trans>
                  </p>
                </div>
              </AniAppearCompN>
            </div>

            <AniAppearComp
              element="div"
              inView={Whybio_inView}
              delay={200}
              className={`w-full mt-5 pt-11 pb-16 bg-sub-color-40%`}
            >
              <div className="flex space-x-15 justify-center items-center">
                <div className="flex flex-col text-white">
                  <div className="w-[82px] flex text-4xl font-bold leading-140">
                    <animated.p className="">{countNumbers[0]}</animated.p>
                    {"+"}
                  </div>

                  <p className="text-base font-semibold">Worldwide Data</p>
                </div>

                <div className="flex flex-col text-white">
                  <div className="w-[195px] flex text-4xl font-bold leading-140">
                    <animated.p className="">{countNumbers[1]}</animated.p>
                    {"+"}
                  </div>

                  <p className="text-base font-semibold">
                    Clinical Information
                  </p>
                </div>

                <div className="flex flex-col text-white">
                  <div className="w-[174px] flex text-4xl font-bold leading-140">
                    <animated.p className="">{countNumbers[2]}</animated.p>
                    {"+"}
                  </div>

                  <p className="text-base font-semibold">Licensed Drugs</p>
                </div>

                <div className="flex flex-col text-white">
                  <div className="w-[200px] flex text-4xl font-bold leading-140">
                    <animated.p className="">{countNumbers[3]}</animated.p>
                    {"+"}
                  </div>

                  <p className="text-base font-semibold">Company Status</p>
                </div>

                <div>
                  <Link
                    to={"/about"}
                    className="flex items-center py-3.5 pl-8 pr-7.5 h-full w-full whitespace-nowrap bg-white text-24px font-semibold leading-140 text-main-color-gb rounded-full "
                  >
                    Learn more
                    <span className="inline-block">
                      <img src={learnMore_arrow} alt="" />
                    </span>
                  </Link>
                </div>
              </div>
            </AniAppearComp>
          </div>
        </section>

        {/* ----------------------------partnership-------------------------- */}
        {/* <div
        ref={partnership_inViewRef}
        className="bg-bg-gray  pt-10 pb-14 md:pt-14 md:pb-15 xl:pt-21 xl:pb-28"
      > */}
        {/* text */}
        {/* <div className="flex flex-col items-center">
          <AniAppearComp
            element="h1"
            inView={partnership_inView}
            delay={0}
            className="text-3xl md:text-4xl xl:text-64px  pb-2 md:pb-3 xl:pb-7  font-extrabold"
          >
            {t("home.partnership_section.title")}
          </AniAppearComp>
          <AniAppearComp
            element="h1"
            inView={partnership_inView}
            delay={200}
            className="text-sm1 md:text-sm2 xl:text-xl w-[209px] md:w-[294px] xl:w-[471px]  pb-9 md:pb-14  text-center "
          >
            {t("home.partnership_section.description")}
          </AniAppearComp>
        </div> */}

        {/* logos */}
        {/* <div className="flex flex-col xl:space-y-3"> */}
        {/* first marquee */}
        {/* <div className="relative flex overflow-x-hidden">
            <div className="py-2 animate-marquee whitespace-nowrap flex  space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>

            <div className="absolute top-0 py-2 animate-marquee2 whitespace-nowrap flex space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>
          </div> */}

        {/* second marquee */}
        {/* <div className="relative flex overflow-x-hidden">
            <div className="py-2 animate-marquee_r whitespace-nowrap flex  space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>

            <div className="absolute top-0 py-2 animate-marquee2_r whitespace-nowrap flex space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>
          </div> */}

        {/* third marquee */}
        {/* <div className="relative flex overflow-x-hidden  md:hidden">
            <div className="py-2 animate-marquee whitespace-nowrap flex  space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>

            <div className="absolute top-0 py-2 animate-marquee2 whitespace-nowrap flex space-x-4 pr-4 xl:space-x-7.5 xl:pr-7.5">
              {partner_Logos.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-24 xl:w-60 xl:h-44  bg-white shadow-companies-logo  rounded-10px"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

        {/* ---------- product introduciton ------------ */}
        <section
          ref={introPJ_inViewRef}
          className="relative bg-white pt-19 pb-[100px] "
        >
          <div className="flex flex-col items-center">
            <h2 className="flex flex-col items-center pb-11  leading-140">
              <AniAppearComp
                element="span"
                inView={introPJ_inView}
                delay={0}
                className="text-4xl font-bold leading-140 whitespace-nowrap"
              >
                Product introduction
              </AniAppearComp>

              <AniAppearComp
                element="span"
                inView={introPJ_inView}
                delay={100}
                className="text-base font-semibold"
              >
                A Precise Life Science Database
              </AniAppearComp>
            </h2>
          </div>

          <AniAppearComp
            element="div"
            inView={introPJ_inView}
            delay={100}
            className="w-full flex justify-center "
          >
            <iframe
              className="border border-img-border"
              width="999"
              height="562"
              src="https://www.youtube.com/embed/ES7r3wNC47o?si=12U6Y-eBABdCIm5w"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </AniAppearComp>
        </section>

        {/* ---------- trial account apply ------------ */}
        <section
          ref={trailaccount_inViewRef}
          className="flex items-center justify-center space-x-12 bg-finance-tabble-even pt-34 pb-26 bg-home-trailaccount-bg bg-cover bg-center"
        >
          <AniAppearComp
            element="div"
            inView={trailaccount_inView}
            delay={0}
            className="flex flex-col items-center"
          >
            <img className="pb-12" src={trial_account_img} alt="" />
            <Link
              to="/trial_account_apply"
              className="text-center w-[480px] font-semibold leading-140 text-white text-24px py-4 rounded-full bg-main-color-gb"
            >
              Try BIODND Free
            </Link>
          </AniAppearComp>

          <AniAppearComp
            element="div"
            inView={trailaccount_inView}
            delay={100}
            className=""
          >
            <h2 className="w-[484px] text-5xl text-main-text-gray font-bold leading-120 pb-7 border-b border-main-text-gray">
              START YOUR 7-DAY FREE TRIAL
            </h2>
            <ul className="pt-8 flex flex-col space-y-3">
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"CHATDND (BETA)"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Clinical Information & Licensed Drugs"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Market Information"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Company & Funding history"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Company products & Technologies"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Financial Report"}
                </p>
              </li>
              <li className="flex">
                <Trial_account_svg />
                <p className="pl-3 text-24px text-main-text-gray font-semibold leading-140">
                  {"Signals & News"}
                </p>
              </li>
            </ul>
          </AniAppearComp>
        </section>

        {/* -------------- join us ------------------- */}
        <section
          ref={joinUs_inViewRef}
          className="w-full bg-join-bg bg-cover bg-center"
        >
          <div className="w-fit flex space-x-18 items-center mx-auto  pt-28  pb-26 ">
            <AniAppearComp
              element="img"
              inView={joinUs_inView}
              delay={0}
              className=" xl:w-[491px]"
              src={laptop}
              alt="laptop"
            />

            <div>
              <AniAppearComp
                element="img"
                inView={joinUs_inView}
                delay={0}
                className="pb-6 w-[397px]"
                src={big_logo}
                alt="logo"
              />
              <AniAppearComp
                element="h2"
                inView={joinUs_inView}
                delay={200}
                className="  text-white font-semibold text-30px pb-6"
              >
                Unlock your possibilities towards
                <br />
                global biopharma industry
              </AniAppearComp>
              <AniAppearComp
                element="button"
                inView={joinUs_inView}
                delay={400}
                className=""
              >
                <Link
                  to={"/subscribe"}
                  className="inline-block w-[480px] py-4 bg-main-color text-white font-semibold text-24px leading-140 rounded-full "
                >
                  Get Started with BIODND
                </Link>
              </AniAppearComp>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
