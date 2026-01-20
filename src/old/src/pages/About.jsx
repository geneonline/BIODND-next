import { useTranslation } from "react-i18next";

import logo from "@/assets/svg/LOGO.svg";
import power_by_GO from "@/assets/svg/about/power_by_GO.svg";

import GCP_logo from "@/assets/webp/home/GCP_logo.webp";
import nvidia_logo from "@/assets/webp/home/nvidia_logo.webp";
import laptop from "@/assets/webp/home/laptop.webp";

import timeLine_01 from "@/assets/svg/about/Icon/01.svg";
import timeLine_02 from "@/assets/svg/about/Icon/02.svg";
import timeLine_03 from "@/assets/svg/about/Icon/03.svg";
import timeLine_04 from "@/assets/svg/about/Icon/04.svg";
import timeLine_05 from "@/assets/svg/about/Icon/05.svg";
import timeLine_06 from "@/assets/svg/about/Icon/06.svg";
import timeLine_07 from "@/assets/svg/about/Icon/07.svg";
import timeLine_08 from "@/assets/svg/about/Icon/08.svg";
import timeLine_09 from "@/assets/svg/about/Icon/09.svg";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();
  return (
    <main className="mt-15 xl:mt-19 ">
      <section className="py-18 flex items-center justify-center w-full bg-about-bg1 bg-cover bg-center text-center">
        <div className="pr-26 flex flex-col items-center">
          <div className="w-[433px]">
            <img className="w-full" src={logo} alt="" />
          </div>
          <img src={power_by_GO} alt="" />
        </div>

        <div>
          <h1 className="text-left text-4xl text-main-color-gb font-bold pb-7">
            About BIODND
          </h1>
          <p className="max-w-[636px] font-medium text-xl text-left text-main-text-gray leading-140">
            BIODND is developed by{" "}
            <span className="text-[#d32a1d]">GeneOnline Inc.,</span> Asia's most
            influential biotech media company with deep expertise in life
            sciences. With years of professional experience and valuable market
            insights, GeneOnline has created BIODND, an AI-powered biotech data
            platform.
            <br />
            <br />
            Our vision is to become the central information source for the life
            sciences industry, providing comprehensive data support and
            forward-thinking analysis to drive innovation, foster collaboration,
            and accelerate the growth of industry partners.
            <br />
            <br />
            Through BIODND, we seamlessly integrate global data, drug approval
            regulations across countries, clinical data, company registrations,
            investors, and investment types—all in one platform. From the unique
            market conditions in different regions to the latest clinical
            research advances and detailed trial results, BIODND keeps you
            informed and ahead of global trends in the life sciences sector.
            <br />
            <br />
            As an in-house product developed by GeneOnline, BIODND consolidates
            a wealth of industry information and offers precise data insights,
            serving as an invaluable tool for innovation, collaboration, and
            decision-making, while providing essential support for the
            fast-paced growth of the life sciences industry.
            <br />
            <br />
            Join our AI-powered biotech data platform for free and unlock the
            full potential of your innovation and decision-making!
          </p>
        </div>
      </section>

      <section className=" bg-finance-bg py-25 flex justify-center items-center space-x-15">
        <div className="flex flex-col items-center">
          <div className="w-[491px] pb-5">
            <img className="w-full" src={laptop} alt="" />
          </div>

          <p className="pb-3  font-medium leading-140 text-main-text-gray">
            OUR PARTNERS
          </p>

          <div className="flex space-x-6 items-center">
            <div className="w-[242px]">
              <img className="w-full" src={GCP_logo} alt="" />
            </div>

            <div className="w-[161px]">
              <img className="w-full" src={nvidia_logo} alt="" />
            </div>
          </div>
        </div>

        <div className="flex flex-col leading-140 space-y-10">
          <div className="flex space-x-12">
            <div className="w-[200px] flex flex-col">
              <p className="text-main-color-gb text-4xl font-bold">350,000+</p>
              <p className="text-main-text-gray font-semibold">Company Data</p>
            </div>

            <p className="w-[388px] font-medium leading-140 text-main-text-gray">
              Comapny introduction，employee,Publicly Listed or Registered
              Companies,Investors and Investment Types.
            </p>
          </div>

          <div className="flex space-x-12">
            <div className="w-[200px] flex flex-col">
              <p className="text-main-color-gb text-4xl font-bold">100,000+</p>
              <p className="text-main-text-gray font-semibold">
                Clinical Information
              </p>
            </div>

            <p className="w-[388px] font-medium leading-140 text-main-text-gray">
              Offers a comprehensive overview of results, saving valuable time
              by centralizing information in one location.
            </p>
          </div>

          <div className="flex space-x-12">
            <div className="w-[200px] flex flex-col">
              <p className="text-main-color-gb text-4xl font-bold">90,000+</p>
              <p className="text-main-text-gray font-semibold">
                Licensed Drugs
              </p>
            </div>

            <p className="w-[388px] font-medium leading-140 text-main-text-gray">
              You can efficiently analyze and compare countries that permit the
              same licensed drugs.
            </p>
          </div>

          <div className="flex space-x-12">
            <div className="w-[200px] flex flex-col">
              <p className="text-main-color-gb text-4xl font-bold">100,000+</p>
              <p className="text-main-text-gray font-semibold">
                Financial Report
              </p>
            </div>

            <p className="w-[388px] font-medium leading-140 text-main-text-gray">
              With over 18,000+ listed companies, you can access specific market
              information and early financial reports for OTC companies.
            </p>
          </div>

          <div className="flex space-x-12">
            <div className="w-[200px] flex flex-col">
              <p className="text-main-color-gb text-4xl font-bold">90+</p>
              <p className="text-main-text-gray font-semibold">
                Worldwide Data
              </p>
            </div>

            <p className="w-[388px] font-medium leading-140 text-main-text-gray">
              The data encompasses various regions, providing insights into
              their unique conditions and characteristics.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center pt-17 pb-30 bg-about-bg2 bg-cover bg-center">
        <h2 className="mb-15 text-4xl font-bold text-main-text-gray">
          BIODND Timeline
        </h2>

        {/* time line */}
        <div className="relative">
          <svg
            width={1187}
            height={537}
            viewBox="0 0 1187 537"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[215px] w-[1183px] h-[536.61px]"
            preserveAspectRatio="none"
          >
            <path
              d="M6 20H1133C1160.61 20 1183 42.3858 1183 70V210C1183 237.614 1160.61 260 1133 260H178.5"
              stroke="#69747F"
              strokeWidth={8}
            />
            <path
              d="M343 260H56C28.3858 260 6 282.386 6 310V450C6 477.614 28.3858 500 56 500H343"
              stroke="#69747F"
              strokeWidth={8}
            />
            <circle
              cx={20}
              cy={20}
              r={16}
              transform="rotate(-90 20 20)"
              fill="white"
              stroke="#69747F"
              strokeWidth={8}
            />
            <circle
              cx={440}
              cy={20}
              r={10}
              transform="rotate(-90 440 20)"
              fill="#69747F"
            />
            <circle
              cx={162}
              cy={260}
              r={10}
              transform="rotate(-90 162 260)"
              fill="#69747F"
            />
            <circle
              cx={162}
              cy={500}
              r={10}
              transform="rotate(-90 162 500)"
              fill="#69747F"
            />
            <circle
              cx={996}
              cy={20}
              r={10}
              transform="rotate(-90 996 20)"
              fill="#69747F"
            />
            <circle
              cx={718}
              cy={260}
              r={10}
              transform="rotate(-90 718 260)"
              fill="#69747F"
            />
            <circle
              cx={996}
              cy={260}
              r={10}
              transform="rotate(-90 996 260)"
              fill="#69747F"
            />
            <circle
              cx={162}
              cy={20}
              r={10}
              transform="rotate(-90 162 20)"
              fill="#69747F"
            />
            <circle
              cx={718}
              cy={20}
              r={10}
              transform="rotate(-90 718 20)"
              fill="#69747F"
            />
            <circle
              cx={440}
              cy={260}
              r={10}
              transform="rotate(-90 440 260)"
              fill="#69747F"
            />
            <path
              d="M338.65 475.654L379.614 499.304L338.65 522.955L338.65 475.654Z"
              fill="#69747F"
            />
          </svg>

          <div className="pl-6 w-[1142px] flex justify-around pb-8 pt-10">
            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_01} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Bionest
                <br />
                development
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2023/05
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_02} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Renaming
                <br />
                BIODND
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2023/09
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_03} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Company & Funding
                <br />
                history 20000+
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2023/11
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_04} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Company products &
                <br />
                Technologies 50000+
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2023/12
              </p>
            </div>
          </div>

          <div className="pl-6 w-[1134px] flex justify-around pb-8 pt-10">
            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_08} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Increase 80000+
                <br />
                Licensed Drugs
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2024/08
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_07} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Increase 90000+
                <br />
                Clinical Information
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2024/07
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_06} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Join Nvidia
                <br />
                Inception Program
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2024/06
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_05} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Selected
                <br />
                Google Cloud
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2024/05
              </p>
            </div>
          </div>

          <div className="pl-20 w-[1142px] flex justify-start pb-8 pt-10">
            <div className="flex flex-col items-center">
              <div className="w-18">
                <img src={timeLine_09} alt="" className="w-full pb-2" />
              </div>
              <p className="font-semibold leading-140 pb-2 text-center text-main-text-gray">
                Increase 100000+
                <br />
                Financial Report
              </p>
              <p className="bg-main-color-gb rounded-full py-0.5 px-8 text-white font-semibold leading-140 text-xl">
                2024/09
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-main-text-gray py-15 flex flex-col items-center">
        <h2 className="text-30px font-semibold text-white leading-140 pb-7">
          Explore Biotech Possibilities with BIODND.
        </h2>
        <Link
          to={"/subscribe"}
          className="text-24px font-semibold text-white bg-main-color py-4 px-24 rounded-full"
        >
          Get Started with BIODND
        </Link>
      </section>
    </main>
  );
};

export default About;
