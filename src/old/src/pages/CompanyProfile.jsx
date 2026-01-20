import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import { Link as Scroll_Link, Element } from "react-scroll";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { companyProfileURL, fetcher_get, useMyList } from "@/data/api";
import { useUser } from "@/hooks/useUser";

import { useSelector } from "react-redux";

import LoginToContinue from "@/parts/LoginToContinue";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";
import ComingSoon_popup from "@/widgets/ComingSoon_popup";

import earth_icon from "@/assets/svg/company_profile/earth_icon.svg";
import facebook_icon from "@/assets/svg/company_profile/facebook_icon.svg";
import linkin_icon from "@/assets/svg/company_profile/linkin_icon.svg";
import mail_icon from "@/assets/svg/company_profile/mail_icon.svg";
import phone_icon from "@/assets/svg/company_profile/phone_icon.svg";
import ad_img from "@/assets/img/profile/AD.png";
import ad_mobile_img from "@/assets/img/profile/AD_mobile.png";
import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import defaultUserImage from "@/assets/img/database/User Default Image.png";
import loadingImg from "@/assets/img/loading.png";
import lock_icon from "@/assets/svg/database/lock_icon.svg";

const CompanyProfile = () => {
  const { t } = useTranslation();
  const isEdit = useSelector((state) => state.companyProfile.isEdit);

  const { userData, userLoading } = useUser();

  const profileLink = useLocation();
  const [profileOptions, setProfileOptions] = useState(0);
  const profileOption_selectStyle = {
    mobile:
      "w-[100px] text-black text-sm py-3 bg-white border-x-main-text-gray border-t-main-text-gray border-[0.5px] translate-y-[2px]",
    mdAndXl: " bg-white text-black ",
  };
  const profileOption_unSelectStyle = {
    mobile:
      "w-[94px] text-main-text-gray text-xs3 py-2.5 bg-profile-button-bg ",
    mdAndXl: " bg-profile-button text-white ",
  };

  let { id } = useParams();

  const { data, isLoading } = useSWR(companyProfileURL(id), fetcher_get);

  const [linkedInMatch] = useState();
  const [facebookMatch] = useState();

  const date = useMemo(() => {
    const currentdate = new Date();
    const formattedDate = currentdate.toISOString().split("T")[0];
    currentdate.setFullYear(currentdate.getFullYear() - 5);
    const formattedfromDate = currentdate.toISOString().split("T")[0];
    return { to: formattedDate, from: formattedfromDate };
  }, []);

  const fetchNews = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const useNews = (d) => {
    const [newsData, setNewsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [page, setPage] = useState(1);

    //依照公司名稱 query & filter news ,當 news 達到10筆或搜尋完全部的 page 後停止 query
    useEffect(() => {
      const loadNews = async () => {
        if (!d?.Company_Name) {
          return;
        }

        setIsLoading(true);
        let accumulatedNews = [];
        let totalResults = 0;
        let currentPage = 1;

        do {
          const url = `${import.meta.env.VITE_API_URL}/news?q=${
            d?.Company_Name
          }&sortBy=publishedAt&language=en&from=${date.from}&to=${
            date.to
          }&pageSize=100&page=${currentPage}`;
          const data = await fetchNews(url);

          if (data && data.articles) {
            totalResults = data.totalResults;

            //filter news with title,description & content
            // const companyName = d.Company_Name.toLowerCase();
            // const filterNews = data.articles.filter((article) => {
            //   return (
            //     (article.title &&
            //       article.title.toLowerCase().includes(companyName)) ||
            //     (article.description &&
            //       article.description.toLowerCase().includes(companyName)) ||
            //     (article.content &&
            //       article.content.toLowerCase().includes(companyName))
            //   );
            // });

            const uniqueTitles = new Set(); // 用於跟踐已出現標題的集合

            const uniqueNews = data.articles.filter((article) => {
              const title = article.title.toLowerCase(); // 假設標題的大小寫不重要

              if (!uniqueTitles.has(title)) {
                uniqueTitles.add(title);
                return true; // 如果標題是首次出現，則保留這篇文章
              }

              return false; // 如果標題已存在，則過濾掉這篇文章
            });

            accumulatedNews = [...accumulatedNews, ...uniqueNews];
            currentPage++;
          } else {
            break;
          }
        } while (
          accumulatedNews.length < 10 &&
          currentPage <= Math.ceil(totalResults / 100) &&
          currentPage <= 10
        );

        setNewsData(accumulatedNews);
        setIsLoading(false);
      };

      loadNews();
    }, [d]);

    return { newsData, newsIsLoading: isLoading };
  };

  const { newsData, newsIsLoading } = useNews(data);

  // useEffect(() => {
  //   console.log(newsData);
  // }, [newsData]);

  //when link is in assets profile, switch the options
  useEffect(() => {
    if (profileLink.pathname.endsWith("assets") && userData) {
      setProfileOptions(1);
    } else {
      setProfileOptions(0);
    }
  }, [profileLink, userData]);

  // useEffect(() => {
  //   if (data) {
  //     const str = data.Social_Network;

  //     const regex = /(https?:\/\/[^\s]+)/g;
  //     const urls = str.match(regex);
  //     const linkedinRegex = /linkedin/g;
  //     const facebookRegex = /facebook/g;

  //     console.log(urls);

  //     for (const url of urls) {
  //       if (linkedinRegex.test(url)) {
  //         setLinkedInMatch(url);
  //       } else if (facebookRegex.test(url)) {
  //         setFacebooknMatch(url);
  //       } else {
  //         // console.log(`${url} 不是始於 LinkedIn 或 Facebook 的連結`);
  //       }
  //     }
  //   }
  // }, [data]);

  const [showFullContent, setShowFullContent] = useState(false);
  const [showFullNews, setShowFullNews] = useState(false);

  /////  ------------  add to my List --------------------

  // get my list data
  const { myListData } = useMyList();

  // const { myListData, myListError, isMylistLoading } = useSWR(
  //   "http://localhost/favorites.json",
  //   (url) =>
  //     axios
  //       .get(url, {
  //         withCredentials: true,
  //       })
  //       .then((res) => {
  //         setUser({ ...user, myList: res.data });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         // navigate("/user/userprofile_setting");
  //       })
  //   // { revalidateOnMount: true, revalidateOnFocus: false }
  // );

  const [IsNeedtopayPopup, setIsNeedtopayPopup] = useState(false);
  const [IsComingSoonPopup, setIsComingSoonPopup] = useState(false);
  //add company to my list
  const addListHandler = () => {
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/companies/${id}/favorite`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        console.log("add");
        mutate(`${import.meta.env.VITE_API_URL}/favorites.json`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //remove company to my list
  const removeListHandler = () => {
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append("_method", "delete");
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/companies/${id}/favorite`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        console.log("remove");
        mutate(`${import.meta.env.VITE_API_URL}/favorites.json`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const IpRightHandler = (e) => {
    e.preventDefault();
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    if (data && data.Company_Name) {
      const encodedCompanyName = encodeURIComponent(data.Company_Name);
      window.location.href = `https://patents.google.com/?q=${encodedCompanyName}&oq=${encodedCompanyName}`;
    }
  };

  return (
    <div>
      {isLoading && !data && (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <img className=" animate-spin" src={loadingImg} alt="" />
        </div>
      )}

      {data && !isEdit && (
        <div className="bg-profile-bg">
          <NeedToPay_popup
            popUp={IsNeedtopayPopup}
            setPopUp={setIsNeedtopayPopup}
          />
          <ComingSoon_popup
            popUp={IsComingSoonPopup}
            setPopUp={setIsComingSoonPopup}
          />

          {/* ----------top part----------- */}
          <div className="w-full bg-profile-bg flex flex-col xl:flex-row z-10">
            {/* top content */}
            <div className="flex pl-5.5 md:pl-11 xl:pl-36 pt-10 md:pt-7 xl:pt-7.5 pr-5 md:pr-72 xl:pr-85 w-full justify-between">
              <div className="relative flex ">
                <div className="absolute -bottom-3.5 h-16 w-16 md:h-[105px] md:w-[105px] xl:h-[132px] xl:w-[132px] flex shrink-0 justify-center items-center rounded-full bg-white border border-main-text-gray overflow-hidden z-20">
                  <img
                    src={
                      data?.uploaded_logo_url ||
                      // data?.Company_Logo ||
                      defaultCompanyImage
                    }
                    alt=""
                  />
                </div>

                <div className=" ml-16 md:ml-[105px] xl:ml-[132px] pl-1.5 md:pl-4.5 xl:pl-6.5 md:pt-2">
                  <div className="mb-1 md:mb-2.5 py-1 md:py-2.5 px-2.5 md:px-5 w-fit flex items-center bg-main-text-gray rounded-full">
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                      className="w-2 h-2 md:w-3 md:h-3"
                    >
                      <path
                        d="M7.47886 6.47517H6.62286V7.45862H7.47886M7.47886 4.50827H6.62286V5.49172H7.47886M8.33486 8.44207H4.91086V7.45862H5.76686V6.47517H4.91086V5.49172H5.76686V4.50827H4.91086V3.52482H8.33486M4.05486 2.54137H3.19886V1.55791H4.05486M4.05486 4.50827H3.19886V3.52482H4.05486M4.05486 6.47517H3.19886V5.49172H4.05486M4.05486 8.44207H3.19886V7.45862H4.05486M2.34286 2.54137H1.48686V1.55791H2.34286M2.34286 4.50827H1.48686V3.52482H2.34286M2.34286 6.47517H1.48686V5.49172H2.34286M2.34286 8.44207H1.48686V7.45862H2.34286M4.91086 2.54137V0.574463H0.630859V9.42553H9.19086V2.54137H4.91086Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pl-1 text-white text-xs md:text-xs3">
                      {t("company_profile.top_part.company_tag")}
                    </span>
                  </div>
                  <h1 className="max-w-lg pl-1 md:pl-0 pb-4 text-sm md:text-xl xl:text-[26px] font-semibold text-start text-white">
                    {data.Company_Name}
                  </h1>
                </div>
              </div>

              {/* add list button */}
              <div
                className={`relative flex-shrink-0  mt-14 pl-2 ${
                  profileOptions === 1
                    ? "w-[84px] md:w-[356px] pr-5 md:pr-6 xl:pr-10"
                    : "w-[84px] md:w-[178px] pr-5 md:pr-10 xl:pr-0"
                }`}
              >
                <div className="absolute right-0 bottom-5.5 flex">
                  {myListData && myListData.some((li) => li.id == id) ? (
                    <button
                      onClick={removeListHandler}
                      className=" h-fit w-21 md:w-[166px] py-2 md:py-3 bg-main-color hover:bg-black rounded-full text-white text-xs md:text-sm2 font-semibold whitespace-nowrap"
                    >
                      {t("company_profile.top_part.remove_to_list")}
                    </button>
                  ) : (
                    <button
                      onClick={addListHandler}
                      className="flex items-center justify-center h-fit w-21 md:w-[166px] py-2 md:py-3 bg-main-color hover:bg-black rounded-full text-white text-xs md:text-sm2 font-semibold whitespace-nowrap"
                    >
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="mr-1.5 hidden md:block"
                      >
                        <path
                          d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
                          fill="white"
                        />
                      </svg>
                      {t("company_profile.top_part.add_to_list")}
                    </button>
                  )}
                  {profileOptions === 1 && (
                    <button
                      // href={
                      //   data?.Company_Name &&
                      //   `https://patents.google.com/?q=${data.Company_Name}&oq=${data.Company_Name}`
                      // }
                      onClick={IpRightHandler}
                      className={`hidden md:flex ml-3 h-fit w-21 md:w-[166px] py-2 md:py-3 items-center justify-center ${
                        data?.Company_Name
                          ? "pointer-events-auto bg-main-color-gb hover:bg-black"
                          : "pointer-events-none bg-main-color-gb hover:bg-black"
                      }  rounded-full text-white text-xs md:text-sm2 font-semibold whitespace-nowrap text-center`}
                    >
                      <svg
                        width={19}
                        height={19}
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[19px] h-[19px] relative mr-1.5"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M9.5 11.875C10.8117 11.875 11.875 10.8117 11.875 9.5C11.875 8.18832 10.8117 7.125 9.5 7.125C8.18832 7.125 7.125 8.18832 7.125 9.5C7.125 10.8117 8.18832 11.875 9.5 11.875Z"
                          fill="white"
                        />
                        <path
                          d="M18.3704 9.29812C17.672 7.49173 16.4597 5.92955 14.8832 4.80468C13.3066 3.6798 11.4351 3.04153 9.49975 2.96875C7.56443 3.04153 5.69285 3.6798 4.11634 4.80468C2.53982 5.92955 1.32747 7.49173 0.629122 9.29812C0.581959 9.42858 0.581959 9.57142 0.629122 9.70188C1.32747 11.5083 2.53982 13.0704 4.11634 14.1953C5.69285 15.3202 7.56443 15.9585 9.49975 16.0312C11.4351 15.9585 13.3066 15.3202 14.8832 14.1953C16.4597 13.0704 17.672 11.5083 18.3704 9.70188C18.4175 9.57142 18.4175 9.42858 18.3704 9.29812ZM9.49975 13.3594C8.73643 13.3594 7.99026 13.133 7.35559 12.709C6.72092 12.2849 6.22626 11.6821 5.93415 10.9769C5.64204 10.2717 5.56561 9.49572 5.71453 8.74707C5.86344 7.99843 6.23101 7.31075 6.77076 6.77101C7.3105 6.23127 7.99818 5.8637 8.74682 5.71478C9.49547 5.56587 10.2715 5.6423 10.9767 5.9344C11.6819 6.22651 12.2846 6.72118 12.7087 7.35585C13.1328 7.99052 13.3591 8.73669 13.3591 9.5C13.3576 10.5231 12.9504 11.5038 12.227 12.2273C11.5036 12.9507 10.5228 13.3578 9.49975 13.3594Z"
                          fill="white"
                        />
                      </svg>
                      {t("company_profile.top_part.IP_right")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col md:flex-row md:justify-end ">
            {/* mobile options buttons */}
            <div className="h-16 bg-white border-b-main-text-gray border-[0.5px] flex md:hidden items-end">
              <div className="w-full space-x-2.5 flex justify-center items-end ">
                <Link
                  className={`rounded-t-7px text-center h-fit  ${
                    profileOptions === 0
                      ? profileOption_selectStyle.mobile
                      : profileOption_unSelectStyle.mobile
                  }`}
                  to={`/database/${id}`}
                  onClick={() => setProfileOptions(0)}
                >
                  {t("company_profile.other_info.button.overview")}
                </Link>
                <Link
                  className={`rounded-t-7px text-center h-fit ${
                    profileOptions === 1
                      ? profileOption_selectStyle.mobile
                      : profileOption_unSelectStyle.mobile
                  } ${
                    userData ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                  to={`/database/${id}/assets`}
                  onClick={() => setProfileOptions(1)}
                >
                  <span className="flex items-center justify-center">
                    {!userData && (
                      <svg
                        className=" mr-1"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: 13, height: 13, position: "relative" }}
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M14.9997 6.66671H14.1663V5.00004C14.1663 2.70004 12.2997 0.833374 9.99967 0.833374C7.69967 0.833374 5.83301 2.70004 5.83301 5.00004V6.66671H4.99967C4.08301 6.66671 3.33301 7.41671 3.33301 8.33337V16.6667C3.33301 17.5834 4.08301 18.3334 4.99967 18.3334H14.9997C15.9163 18.3334 16.6663 17.5834 16.6663 16.6667V8.33337C16.6663 7.41671 15.9163 6.66671 14.9997 6.66671ZM7.49967 5.00004C7.49967 3.61671 8.61634 2.50004 9.99967 2.50004C11.383 2.50004 12.4997 3.61671 12.4997 5.00004V6.66671H7.49967V5.00004ZM14.9997 16.6667H4.99967V8.33337H14.9997V16.6667ZM9.99967 14.1667C10.9163 14.1667 11.6663 13.4167 11.6663 12.5C11.6663 11.5834 10.9163 10.8334 9.99967 10.8334C9.08301 10.8334 8.33301 11.5834 8.33301 12.5C8.33301 13.4167 9.08301 14.1667 9.99967 14.1667Z"
                          fill="#69747F"
                        />
                      </svg>
                    )}

                    <span>{t("company_profile.other_info.button.assets")}</span>
                  </span>
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setIsComingSoonPopup(true);
                  }}
                  className={`rounded-t-7px text-center h-fit ${
                    profileOptions === 2
                      ? profileOption_selectStyle.mobile
                      : profileOption_unSelectStyle.mobile
                  } `}
                >
                  <span className="flex items-center justify-center">
                    {/* <svg
                      className=" mr-1"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: 13, height: 13, position: "relative" }}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M14.9997 6.66671H14.1663V5.00004C14.1663 2.70004 12.2997 0.833374 9.99967 0.833374C7.69967 0.833374 5.83301 2.70004 5.83301 5.00004V6.66671H4.99967C4.08301 6.66671 3.33301 7.41671 3.33301 8.33337V16.6667C3.33301 17.5834 4.08301 18.3334 4.99967 18.3334H14.9997C15.9163 18.3334 16.6663 17.5834 16.6663 16.6667V8.33337C16.6663 7.41671 15.9163 6.66671 14.9997 6.66671ZM7.49967 5.00004C7.49967 3.61671 8.61634 2.50004 9.99967 2.50004C11.383 2.50004 12.4997 3.61671 12.4997 5.00004V6.66671H7.49967V5.00004ZM14.9997 16.6667H4.99967V8.33337H14.9997V16.6667ZM9.99967 14.1667C10.9163 14.1667 11.6663 13.4167 11.6663 12.5C11.6663 11.5834 10.9163 10.8334 9.99967 10.8334C9.08301 10.8334 8.33301 11.5834 8.33301 12.5C8.33301 13.4167 9.08301 14.1667 9.99967 14.1667Z"
                        fill="#69747F"
                      />
                    </svg> */}
                    <span>
                      {t("company_profile.other_info.button.financials")}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
            {/* ----content area---- */}
            <div className=" w-full pb-5 text-sm2 md:text-base md:mb-0  bg-white relative md:rounded-se-20px">
              {/* --overview-- */}
              {profileOptions === 0 && (
                <div className="w-full flex flex-col items-center xl:items-start xl:flex-row pt-6 md:pt-10 xl:pt-15  pl-4 md:pl-8 xl:pl-[117px] space-x-5">
                  {/* mobile scroll buttons */}
                  <div className="md:hidden px-10 pb-4.5 md:pb-5.5 flex justify-center flex-wrap leading-relaxed text-sm text-main-text-gray divide-x divide-main-text-gray">
                    <Scroll_Link
                      to="About"
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.about.title")}
                    </Scroll_Link>
                    <Scroll_Link
                      to="Categorization"
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.categorization.title")}
                    </Scroll_Link>
                    <Scroll_Link
                      to="Summary of Assets"
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.summary_of_assets.title")}
                    </Scroll_Link>
                    <Scroll_Link
                      to="Contact"
                      smooth={true}
                      duration={500}
                      offset={-70}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.contact.title")}
                    </Scroll_Link>
                    <Scroll_Link
                      to="Latest News"
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.latest_news.title")}
                    </Scroll_Link>
                    <Scroll_Link
                      to="Team"
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="cursor-pointer hover:text-nav-bg hover:font-medium px-2 whitespace-nowrap"
                    >
                      {t("company_profile.overview.team")}
                    </Scroll_Link>
                  </div>

                  {/* company info */}
                  <div className="max-w-full md:max-w-[562px] xl:max-w-none flex flex-col space-y-5 pr-8 xl:pr-1/10">
                    {/* first row */}
                    <div className="  flex flex-col space-y-5 xl:space-y-0 xl:flex-row xl:space-x-5 ">
                      {/* About */}
                      <div className=" w-full xl:min-w-[480px] xl:max-w-[520px]  px-12.5 pb-7.5  rounded-10px">
                        <Element name="About" className="element" />
                        <div className="pt-8 pb-4.5">
                          <h2 className=" pb-2.5 text-xl text-profile-asset-title font-medium">
                            {t("company_profile.overview.about.title")}
                          </h2>
                          <div className="w-full h-[3px] mb-5 bg-bd-gray" />
                          <p className="leading-snug">
                            {data.Brief_Description || "N/A"}
                          </p>
                        </div>

                        <div className="pb-4">
                          <h4 className="text-input-line pb-0.5">
                            {t("company_profile.overview.about.country_region")}
                          </h4>
                          <p>{data.Country_Region || "N/A"}</p>
                        </div>

                        <div className="pb-4">
                          <h4 className="text-input-line pb-0.5">
                            {t("company_profile.overview.about.address")}
                          </h4>
                          <p>{data.Address || "N/A"}</p>
                        </div>

                        <div className="pb-4">
                          <h4 className="text-input-line pb-0.5">
                            {t("company_profile.overview.about.founded_date")}
                          </h4>
                          <p>{data.Founded_Year || "N/A"}</p>
                        </div>

                        <div className="pb-4">
                          <h4 className="text-input-line  pb-0.5">
                            {t(
                              "company_profile.overview.about.state_of_ownership"
                            )}
                          </h4>
                          <p>{data.Ownership || "N/A"}</p>
                        </div>

                        <div className="pb-4">
                          <h4 className="text-input-line pb-0.5">
                            {t(
                              "company_profile.overview.about.employees_worldwide"
                            )}
                          </h4>
                          <p>{data.Employee || "N/A"}</p>
                        </div>
                      </div>

                      {/* Categorization */}
                      <div className="xl:w-full px-12.5 pt-8 pb-9  rounded-10px">
                        <Element name="Categorization" className="element" />
                        <h2 className="text-xl text-profile-asset-title font-medium pb-2.5">
                          {t("company_profile.overview.categorization.title")}
                        </h2>
                        <div className="w-full h-[3px] mb-5 bg-bd-gray" />

                        <div className=" pt-5">
                          <p className="text-main-text-gray pb-2.5">
                            {t(
                              "company_profile.overview.categorization.main_sector"
                            )}
                          </p>
                          <div className="pl-10 flex flex-wrap">
                            {data.Company_Types
                              ? data.Company_Types.split("|").map(
                                  (i, index) => (
                                    <p
                                      key={index}
                                      className="m-1 px-5 py-2 text-db-table-text bg-bd-gray rounded-20px"
                                    >
                                      {i}
                                    </p>
                                  )
                                )
                              : "N/A"}
                          </div>
                        </div>

                        <div className=" pt-4 ">
                          <p className="text-main-text-gray pb-2.5">
                            {t(
                              "company_profile.overview.categorization.primary_therapeutic_areas"
                            )}
                          </p>
                          <div className="pl-10 flex flex-wrap">
                            {data.Primary_Therapeutic_Areas
                              ? data.Primary_Therapeutic_Areas.split("|").map(
                                  (i, index) => (
                                    <p
                                      key={index}
                                      className="m-1 px-5 py-2 text-db-table-text bg-bd-gray rounded-20px"
                                    >
                                      {i}
                                    </p>
                                  )
                                )
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary of Assets */}
                    <div className=" px-12.5 pb-9  rounded-10px">
                      <Element name="Summary of Assets" className="element" />
                      <h2 className="text-2xl font-semibold pb-2.5 pt-10">
                        {t("company_profile.overview.summary_of_assets.title")}
                      </h2>
                      <div className="w-full h-[3px] mb-5 bg-bd-gray" />

                      <p className=" pb-5 leading-normal">
                        {data.Description
                          ? data.Description.length > 300
                            ? data.Description.substring(0, 300) + "..."
                            : data.Description
                          : "null"}
                      </p>
                      <div className="flex justify-end ">
                        <button
                          onClick={() => setShowFullContent(true)}
                          className="py-2.5 px-8 rounded-20px bg-black hover:bg-white text-white hover:text-black  border-0.3px border-profile-content-bg hover:border-main-text-gray"
                        >
                          {t(
                            "company_profile.overview.summary_of_assets.learn_more_button"
                          )}
                        </button>
                      </div>

                      {/* show full description about Summary of Assets*/}
                      {showFullContent && (
                        <div
                          className="fixed w-full h-full top-0 left-0 bg-[#00000044] z-50"
                          onClick={() => setShowFullContent(false)}
                        >
                          <div
                            className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pl-10 pr-6.5 pb-14 flex"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* col 1 */}
                            <div
                              className={` w-10 h-10 bg-white border border-bd-gray rounded-full mr-3.5 mt-9 flex justify-center items-center overflow-hidden`}
                            >
                              <img
                                src={
                                  data?.uploaded_logo_url ||
                                  // data?.Company_Logo ||
                                  defaultCompanyImage
                                }
                                alt=""
                              />
                            </div>

                            {/* col 2 */}
                            <div className="flex flex-col mt-12.5 mr-1.5 ">
                              <h3 className=" text-base font-medium pb-3.5">
                                {data.Company_Name}
                              </h3>
                              <p className="w-[400px] text-sm1 overflow-auto max-h-[80vh] leading-normal">
                                {data.Description}
                              </p>
                            </div>

                            {/* col 3 */}
                            <div className="w-5">
                              <button
                                className=" mt-6 mr-8 z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
                                onClick={() => setShowFullContent(false)}
                              >
                                <div
                                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full rotate-45 translate-y-1 bg-db-grid-text`}
                                ></div>
                                <div
                                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full -rotate-45  -translate-y-[4px] bg-db-grid-text`}
                                ></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative flex flex-col xl:space-y-0 xl:flex-row">
                      <div className=" md:max-w-[550px] flex flex-col space-y-5 xl:pr-5">
                        {/* Contact */}
                        <div className=" pb-12.5 px-12.5  rounded-10px">
                          <Element name="Contact" className="element" />
                          <h2 className="pt-10 pb-2.5 text-xl text-profile-asset-title font-medium">
                            {t("company_profile.overview.contact.title")}
                          </h2>
                          <div className="w-full h-[3px] mb-5 bg-bd-gray" />

                          <ul className="space-y-5">
                            <li className="flex items-center">
                              <img
                                className="h-4 w-4 mr-2"
                                src={earth_icon}
                                alt=""
                              />
                              <a
                                className={`break-all ${
                                  data.Website &&
                                  "hover:text-main-color hover:underline"
                                }`}
                                href={data.Website}
                              >
                                {data.Website || "N/A"}
                              </a>
                            </li>
                            <li className="flex items-center">
                              <img
                                className="h-4 w-4 mr-2"
                                src={mail_icon}
                                alt=""
                              />
                              <a
                                className={`${
                                  data.Email &&
                                  "hover:text-main-color hover:underline"
                                }`}
                                href={data.Email}
                              >
                                {data.Email || "N/A"}
                              </a>
                            </li>
                            <li className="flex items-center">
                              <img
                                className="h-4 w-4 mr-2"
                                src={phone_icon}
                                alt=""
                              />
                              <span>{data.Phone || "N/A"}</span>
                            </li>
                          </ul>

                          {/* social media link */}
                          <div className="flex pt-5 space-x-2.5">
                            {linkedInMatch && (
                              <a href={linkedInMatch}>
                                <img src={linkin_icon} alt="" />
                              </a>
                            )}

                            {facebookMatch && (
                              <a href={facebookMatch}>
                                <img src={facebook_icon} alt="" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Team */}
                        <div className="xl:min-w-[440px] px-8 pt-8 pb-15   rounded-10px relative">
                          <Element name="Team" className="element" />
                          <h2 className="px-4.5 pt-9 pb-2.5 text-xl text-profile-asset-title font-medium ">
                            {t("company_profile.overview.team")}
                          </h2>
                          <div className="w-full h-[3px] mb-5 bg-bd-gray" />

                          <div className="flex flex-wrap justify-center items-center pt-6 ">
                            {/* per item */}
                            <div className="px-3.5 flex flex-col items-center pb-6">
                              <div className="w-21 h-21 rounded-full bg-white overflow-hidden">
                                <img src={defaultUserImage} alt="" />
                              </div>
                              <h5 className="pt-2 font-semibold">
                                Team Member Name
                              </h5>
                              <p className=" text-main-text-gray font-semibold">
                                Job Title
                              </p>
                            </div>
                            {/* per item */}
                            <div className="px-3.5 flex flex-col items-center pb-6">
                              <div className="w-21 h-21 rounded-full bg-white overflow-hidden">
                                <img src={defaultUserImage} alt="" />
                              </div>
                              <h5 className="pt-2 font-semibold">
                                Team Member Name
                              </h5>
                              <p className=" text-main-text-gray font-semibold">
                                Job Title
                              </p>
                            </div>
                            {/* per item */}
                            <div className="px-3.5 flex flex-col items-center pb-6">
                              <div className="w-21 h-21 rounded-full bg-white overflow-hidden">
                                <img src={defaultUserImage} alt="" />
                              </div>
                              <h5 className="pt-2 font-semibold">
                                Team Member Name
                              </h5>
                              <p className=" text-main-text-gray font-semibold">
                                Job Title
                              </p>
                            </div>
                            {/* per item */}
                            <div className="px-3.5 flex flex-col items-center pb-6">
                              <div className="w-21 h-21 rounded-full bg-white overflow-hidden">
                                <img src={defaultUserImage} alt="" />
                              </div>
                              <h5 className="pt-2 font-semibold">
                                Team Member Name
                              </h5>
                              <p className=" text-main-text-gray font-semibold">
                                Job Title
                              </p>
                            </div>
                          </div>

                          <div className="absolute top-0 right-0 w-full h-full bg-block-bg backdrop-blur-sm rounded-20px flex justify-center items-center">
                            <p className="text-center text-white text-3xl font-bold">
                              Team System
                              <br />
                              Coming Soon
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Latest News */}
                      <div className="xl:min-w-[440px] mt-5 pt-10 px-12.5 pb-14  rounded-10px">
                        <Element name="Latest News" className="element" />
                        <h2 className="text-xl text-profile-asset-title font-medium pb-2.5  ">
                          {t("company_profile.overview.latest_news.title")}
                        </h2>
                        <div className="w-full h-[3px] mb-5 bg-bd-gray" />

                        {newsIsLoading && (
                          <div className="w-full h-[80vh] flex justify-center items-center">
                            <img
                              className=" animate-spin"
                              src={loadingImg}
                              alt=""
                            />
                          </div>
                        )}

                        {!newsIsLoading && (
                          <ul className="list-disc pl-4 text-main-color-gb space-y-6.5">
                            {newsData.length !== 0 ? (
                              <>
                                {newsData.slice(0, 8).map((item) => (
                                  <li className="flex flex-col" key={item.url}>
                                    <a
                                      className="text-black hover:text-main-color-gb underline relative"
                                      href={item.url}
                                    >
                                      {item.title}

                                      <div className="absolute top-2 -left-5 w-[7px] h-[7px] rounded-full bg-main-color-gb"></div>
                                    </a>
                                    <span className="text-main-text-gray text-right text-xs3 ">
                                      {item.publishedAt.split("T")[0]}
                                    </span>
                                  </li>
                                ))}
                                <div className="flex justify-end ">
                                  <button
                                    onClick={() => setShowFullNews(true)}
                                    className="py-2.5 px-8 rounded-20px bg-black hover:bg-white text-white hover:text-black  border-0.3px border-profile-content-bg hover:border-main-text-gray"
                                  >
                                    {t(
                                      "company_profile.overview.summary_of_assets.learn_more_button"
                                    )}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p className="text-main-text-gray ">
                                {t(
                                  "company_profile.overview.latest_news.no_news"
                                )}
                              </p>
                            )}
                          </ul>
                        )}

                        {/* show full description about Summary of Assets*/}
                        {showFullNews && (
                          <div
                            className="fixed w-full h-full top-0 left-0 bg-[#00000044] z-50"
                            onClick={() => setShowFullNews(false)}
                          >
                            <div
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pb-14 flex flex-col"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* TOP */}
                              <div className="w-full h-32 pl-11 pt-8 pr-7.5 bg-profile-bg rounded-t-10px flex justify-between">
                                <div className="flex pl-3.5">
                                  <div
                                    className={` w-19 h-19 bg-profile-bg border border-bd-gray rounded-full mr-3.5 flex justify-center items-center overflow-hidden`}
                                  >
                                    <img
                                      src={
                                        data?.uploaded_logo_url ||
                                        // data?.Company_Logo ||
                                        defaultCompanyImage
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="mb-2.5 py-2.5 px-5 w-fit flex items-center bg-main-text-gray rounded-full">
                                      <svg
                                        width={12}
                                        height={12}
                                        viewBox="0 0 10 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="none"
                                      >
                                        <path
                                          d="M7.47886 6.47517H6.62286V7.45862H7.47886M7.47886 4.50827H6.62286V5.49172H7.47886M8.33486 8.44207H4.91086V7.45862H5.76686V6.47517H4.91086V5.49172H5.76686V4.50827H4.91086V3.52482H8.33486M4.05486 2.54137H3.19886V1.55791H4.05486M4.05486 4.50827H3.19886V3.52482H4.05486M4.05486 6.47517H3.19886V5.49172H4.05486M4.05486 8.44207H3.19886V7.45862H4.05486M2.34286 2.54137H1.48686V1.55791H2.34286M2.34286 4.50827H1.48686V3.52482H2.34286M2.34286 6.47517H1.48686V5.49172H2.34286M2.34286 8.44207H1.48686V7.45862H2.34286M4.91086 2.54137V0.574463H0.630859V9.42553H9.19086V2.54137H4.91086Z"
                                          fill="white"
                                        />
                                      </svg>
                                      <span className="pl-1 text-white text-xs3">
                                        {t(
                                          "company_profile.top_part.company_tag"
                                        )}
                                      </span>
                                    </div>
                                    <h3 className=" text-base font-medium pb-3.5 text-white">
                                      {data.Company_Name}
                                    </h3>
                                  </div>
                                </div>

                                {/* X button */}
                                <div className="w-5">
                                  <button
                                    className="  mr-8 z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
                                    onClick={() => setShowFullNews(false)}
                                  >
                                    <div
                                      className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full rotate-45 translate-y-1 bg-white`}
                                    ></div>
                                    <div
                                      className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full -rotate-45  -translate-y-[4px] bg-white`}
                                    ></div>
                                  </button>
                                </div>
                              </div>

                              {/* content */}
                              <div className="flex flex-col mr-1.5 pl-10 pr-6.5">
                                <div className="w-[400px] text-sm1 overflow-auto max-h-[80vh] leading-normal">
                                  <h2 className="text-24px font-semibold pt-8 pb-4">
                                    {t(
                                      "company_profile.overview.latest_news.title"
                                    )}
                                  </h2>
                                  {newsData.slice(0, 10).map((item) => (
                                    <li
                                      className="flex flex-col"
                                      key={item.url}
                                    >
                                      <a
                                        className="text-black hover:text-main-color-gb underline relative"
                                        href={item.url}
                                      >
                                        {item.title}

                                        <div className="absolute top-2 -left-5 w-[7px] h-[7px] rounded-full bg-main-color-gb"></div>
                                      </a>
                                      <span className="text-main-text-gray text-right text-xs3 ">
                                        {item.publishedAt.split("T")[0]}
                                      </span>
                                    </li>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* block info*/}
                      {(!userData?.subscription_level && userData?.id !== 1) ||
                        (userData?.subscription_level === "basic" && (
                          <div
                            className="h-full w-full absolute left-0 top-0 bg-block-bg backdrop-blur text-white flex flex-col
                        pt-28 px-[3%] md:px-[10%] xl:px-[12%] rounded-10px 
                        "
                          >
                            <h2 className="text-xl text-profile-asset-title font-medium xl:text-32px pb-4.5">
                              {t(
                                "company_profile.overview.subscribe_now.title"
                              )}
                            </h2>
                            <p className="text-sm2 md:text-18px font-medium pb-7 md:pr-[0%] xl:pr-[20%]">
                              {t(
                                "company_profile.overview.subscribe_now.description"
                              )}
                            </p>
                            <Link
                              to={"/subscribe"}
                              className=" flex items-start py-3 px-7 w-fit
                        rounded-full
                        xl:py-4 xl:px-11 bg-main-color-gb hover:bg-black transition-colors duration-200 text-xl xl:text-24px font-medium"
                            >
                              <img className="pr-3" src={lock_icon} alt="" />
                              {t(
                                "company_profile.overview.subscribe_now.button_text"
                              )}
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {profileOptions !== 0 && <Outlet />}
            </div>

            {/* other info area */}
            <div className=" flex flex-col bg-white">
              {/* buttons */}
              <div className="hidden md:flex flex-col rounded-b-20px bg-profile-bg pt-10 pb-12 md:px-5 xl:px-7 md:space-y-4 xl:space-y-5">
                <Link
                  className={`md:w-[182px] xl:w-[245px] text-base md:py-4.5 xl:py-6 text-center rounded-full ${
                    profileOptions === 0
                      ? profileOption_selectStyle.mdAndXl
                      : profileOption_unSelectStyle.mdAndXl
                  }`}
                  to={`/database/${id}`}
                  onClick={() => setProfileOptions(0)}
                >
                  {t("company_profile.other_info.button.overview")}
                </Link>
                <Link
                  className={`md:w-[182px] xl:w-[245px] text-base md:py-4.5 xl:py-6 text-center rounded-full  ${
                    profileOptions === 1
                      ? profileOption_selectStyle.mdAndXl
                      : profileOption_unSelectStyle.mdAndXl
                  } ${
                    userData ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                  to={`/database/${id}/assets`}
                  onClick={() => setProfileOptions(1)}
                >
                  <span className="flex items-center justify-center">
                    {!userData && (
                      <svg
                        className=" mr-1"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: 20, height: 20, position: "relative" }}
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M14.9997 6.66671H14.1663V5.00004C14.1663 2.70004 12.2997 0.833374 9.99967 0.833374C7.69967 0.833374 5.83301 2.70004 5.83301 5.00004V6.66671H4.99967C4.08301 6.66671 3.33301 7.41671 3.33301 8.33337V16.6667C3.33301 17.5834 4.08301 18.3334 4.99967 18.3334H14.9997C15.9163 18.3334 16.6663 17.5834 16.6663 16.6667V8.33337C16.6663 7.41671 15.9163 6.66671 14.9997 6.66671ZM7.49967 5.00004C7.49967 3.61671 8.61634 2.50004 9.99967 2.50004C11.383 2.50004 12.4997 3.61671 12.4997 5.00004V6.66671H7.49967V5.00004ZM14.9997 16.6667H4.99967V8.33337H14.9997V16.6667ZM9.99967 14.1667C10.9163 14.1667 11.6663 13.4167 11.6663 12.5C11.6663 11.5834 10.9163 10.8334 9.99967 10.8334C9.08301 10.8334 8.33301 11.5834 8.33301 12.5C8.33301 13.4167 9.08301 14.1667 9.99967 14.1667Z"
                          fill="#ffffff"
                        />
                      </svg>
                    )}

                    <span>{t("company_profile.other_info.button.assets")}</span>
                  </span>
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setIsComingSoonPopup(true);
                  }}
                  className={`md:w-[182px] xl:w-[245px] text-base md:py-4.5 xl:py-6 text-center rounded-full  ${
                    profileOptions === 2
                      ? profileOption_selectStyle.mdAndXl
                      : profileOption_unSelectStyle.mdAndXl
                  } `}
                >
                  <span className="flex items-center justify-center">
                    {/* <svg
                      className=" mr-1"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: 20, height: 20, position: "relative" }}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M14.9997 6.66671H14.1663V5.00004C14.1663 2.70004 12.2997 0.833374 9.99967 0.833374C7.69967 0.833374 5.83301 2.70004 5.83301 5.00004V6.66671H4.99967C4.08301 6.66671 3.33301 7.41671 3.33301 8.33337V16.6667C3.33301 17.5834 4.08301 18.3334 4.99967 18.3334H14.9997C15.9163 18.3334 16.6663 17.5834 16.6663 16.6667V8.33337C16.6663 7.41671 15.9163 6.66671 14.9997 6.66671ZM7.49967 5.00004C7.49967 3.61671 8.61634 2.50004 9.99967 2.50004C11.383 2.50004 12.4997 3.61671 12.4997 5.00004V6.66671H7.49967V5.00004ZM14.9997 16.6667H4.99967V8.33337H14.9997V16.6667ZM9.99967 14.1667C10.9163 14.1667 11.6663 13.4167 11.6663 12.5C11.6663 11.5834 10.9163 10.8334 9.99967 10.8334C9.08301 10.8334 8.33301 11.5834 8.33301 12.5C8.33301 13.4167 9.08301 14.1667 9.99967 14.1667Z"
                        fill="#ffffff"
                      />
                    </svg> */}
                    <span>
                      {t("company_profile.other_info.button.financials")}
                    </span>
                  </span>
                </Link>
              </div>

              {/* ad & viewed */}
              <div className="h-full flex flex-col-reverse bg-com-profile-bg rounded-20px md:flex-col md:mt-3 xl:mt-4.5 md:mb-5">
                {/* ad */}
                <div className="flex justify-center items-center pt-4.5 pb-4.5 md:pt-10 md:pb-14">
                  <Link to={"/subscribe"}>
                    <picture>
                      <source media="(min-width: 768px)" srcSet={ad_img} />
                      <img src={ad_mobile_img} alt="" />
                    </picture>
                  </Link>
                </div>

                {/* viewed */}
                {/* <div className="h-full flex flex-col items-center ">
                  <p className="pt-7 pb-5.5 md:pt-11 md:pb-6.5">
                    {t("company_profile.other_info.recently_viewed")}
                  </p>

                  <div className="px-4 md:px-0 flex flex-wrap flex-row md:flex-col justify-center md:justify-start">
                  
                    <div className="flex flex-col md:flex-row items-center pb-4">
                      <div className="h-12.5 w-12.5 bg-slate-400 rounded-full overflow-hidden">
                        <img src={defaultUserImage} alt="" />
                      </div>
                      <p className="text-center md:text-left w-[105px] md:pl-3 text-xs3 ">
                        Lexicon Pharmaceuticals
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center pb-4">
                      <div className="h-12.5 w-12.5 bg-slate-400 rounded-full overflow-hidden">
                        <img src={defaultUserImage} alt="" />
                      </div>
                      <p className="text-center md:text-left w-[105px] md:pl-3 text-xs3 ">
                        BGI Group
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center pb-4">
                      <div className="h-12.5 w-12.5 bg-slate-400 rounded-full overflow-hidden">
                        <img src={defaultUserImage} alt="" />
                      </div>
                      <p className="text-center md:text-left w-[105px] md:pl-3 text-xs3 ">
                        Lifebit
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center pb-4">
                      <div className="h-12.5 w-12.5 bg-slate-400 rounded-full overflow-hidden">
                        <img src={defaultUserImage} alt="" />
                      </div>
                      <p className="text-center md:text-left w-[105px] md:pl-3 text-xs3 ">
                        Formula
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center pb-4">
                      <div className="h-12.5 w-12.5 bg-slate-400 rounded-full overflow-hidden">
                        <img src={defaultUserImage} alt="" />
                      </div>
                      <p className="text-center md:text-left w-[105px] md:pl-3 text-xs3 ">
                        Syapse
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="hidden md:block md:w-3 xl:w-[46px] bg-white rounded-ss-20px" />
          </div>
        </div>
      )}

      {!userData && !userLoading && <LoginToContinue />}

      {/* <Link to="/database/search">back</Link>
      <Link
        to={`/database/${id}/edit`}
        onClick={() => dispatch(setIsEdit(true))}
      >
        edit
      </Link> */}
    </div>
  );
};

export default CompanyProfile;
