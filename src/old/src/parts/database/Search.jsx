/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  Outlet,
  Link,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useUser, searchCompaniesLink, searchAssetsLink } from "@/data/api";

import {
  continentTranslation,
  locationOptions_en,
  locationOptions_zh,
} from "@/data/database/companies/locationOptions";
import {
  mainTherapeuticAreasOptions_en,
  mainTherapeuticAreasOptions_zh,
} from "@/data/database/companies/mainTherapeuticAreasOptions";
import {
  companyTypesTranslation,
  companyTypesOptions_en,
  companyTypesOptions_zh,
} from "@/data/database/companies/companyTypesOptions";
import {
  assetstypesTranslation,
  assetsTypes_en,
  assetsTypes_zh,
} from "@/data/database/assets/assetsTypes";
import {
  therapeuticSectorOptions_en,
  therapeuticSectorOptions_zh,
} from "@/data/database/assets/therapeuticSector";
import {
  developmentPhaseOptions_en,
  developmentPhaseOptions_zh,
} from "@/data/database/assets/developmentPhase";

import employeesOptions from "@/data/database/companies/employeesOptions.json";

import AutoComplete from "@/widgets/database/AutoComplete";
import MultipleSelect_2layers from "@/widgets/database/MultipleSelect_2layers";
import MultipleSelect_1Layer from "@/widgets/database/MultipleSelect_1Layer";

//暫時拿掉 assets type 的 services & technologies
const { Services, Technologies, ...filterAssetstypesTranslation } =
  assetstypesTranslation;
const {
  Services: Services_en,
  Technologies: Technologies_en,
  ...filterAssetsTypes_en
} = assetsTypes_en;
const {
  Services: Services_zh,
  Technologies: Technologies_zh,
  ...filterAssetsTypes_zh
} = assetsTypes_zh;

const Search = () => {
  // let [searchParams, setSearchParams] = useSearchParams();

  // const params = Object.fromEntries(searchParams.entries());

  // console.log(params);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryLink = useLocation();

  const { userData } = useUser();

  // useEffect(() => {
  //   if (userData) {
  //     setUser({ ...user, data: userData });
  //   }
  // }, [userData]);

  // 用于筛选参数的函数
  function filterParams(params, keysToUpdate) {
    return Object.keys(params)
      .filter((key) => keysToUpdate.includes(key))
      .reduce((obj, key) => {
        // 检查值是否包含逗号，如果是，则将其转换为数组
        const value = params[key];
        obj[key] = value.includes(",") ? value.split(",") : value;
        return obj;
      }, {});
  }

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // 根据不同的路径名决定要更新的键
    let keysToUpdate = [];
    if (queryLink.pathname.endsWith("companies")) {
      keysToUpdate = [
        "search",
        "Company_Name",
        "Country_Region_parants",
        "Company_Types_parants",
      ]; // 适用于“companies”路径的键
      const filteredParams = filterParams(params, keysToUpdate);
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        ...filteredParams,
      }));
      setBtnSelect(0);
    } else if (queryLink.pathname.endsWith("assets")) {
      keysToUpdate = [
        "product_keyword",
        "product_name",
        "assets_types_parants",
      ]; // 适用于“assets”路径的键
      const filteredParams = filterParams(params, keysToUpdate);
      setAssetsInputValue((prevInputValue) => ({
        ...prevInputValue,
        ...filteredParams,
      }));
      setBtnSelect(1);
    }
  }, [searchParams, queryLink.pathname]);

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(true);

  //  0=companies  1=assets  2=teams
  const [btnSelect, setBtnSelect] = useState(0);
  const handleClick = useCallback((index) => {
    setBtnSelect(index);
  }, []);

  const btnDefaultStyle = "w-[163px] bg-white text-main-color-gb";

  const btnSelectStyle = "w-[230px] bg-db-Asearch text-db-search";

  // trigger no matter true or false
  const [searchCleared, setSearchCleared] = useState(false);

  const [inputValue, setInputValue] = useState({
    search: "",
    Company_Name: "",
  });
  const [assetsInputValue, setAssetsInputValue] = useState({
    product_keyword: "",
    product_name: "",
  });

  //tags to be cleared
  const [clearedTag, setClearedTag] = useState({});
  const setClearTagsHandler = (tag, isParent = false, type) => {
    isParent
      ? setClearedTag({ parant: tag, type })
      : setClearedTag({ child: tag, type });
  };

  // useEffect(() => console.log(inputValue), [inputValue]);
  // useEffect(() => console.log(clearedTag), [clearedTag]);

  //companies search input
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  //assets search input
  const onChangeAssetHandler = (e) => {
    const { name, value } = e.target;
    setAssetsInputValue({ ...assetsInputValue, [name]: value });
  };

  // AutoComplete
  const [isTyping, setIsTyping] = useState("");
  const onFocusHandler = (e) => {
    setIsTyping(e.target.name);
  };
  const onBlurHandler = () => {
    setIsTyping("");
  };

  //companies clear search
  const clearSearchHandler = () => {
    setInputValue({ search: "", Company_Name: "" });
    setSearchParams({});
    setSearchCleared((prev) => !prev);
  };

  //assets clear search
  const clearAssetsSearchHandler = () => {
    setAssetsInputValue({ product_keyword: "", product_name: "" });
    setSearchParams({});
    setSearchCleared((prev) => !prev);
  };

  const checkInputValue = (inputValue, btnSelect) => {
    const companiesChecks = {
      search: "",
      Company_Name: "",
    };

    const assetsChecks = {
      product_keyword: "",
      product_name: "",
    };

    let checks; // 将根据 btnSelect 使用的检查对象

    switch (btnSelect) {
      case 0:
        checks = companiesChecks;
        break;
      case 1:
        checks = assetsChecks;
        break;
      default:
        return true; // 如果 btnSelect 不是期望的值，则默认返回 true
    }

    // 检查 inputValue 中的键是否全部符合 checks 中定义的期望值
    const isEveryKeyValid = Object.keys(checks).every(
      (key) =>
        Object.prototype.hasOwnProperty.call(inputValue, key) &&
        inputValue[key] === checks[key]
    );

    // 检查 inputValue 中是否存在 checks 中未定义的额外键
    const isNoExtraKey = Object.keys(inputValue).every((key) =>
      Object.prototype.hasOwnProperty.call(checks, key)
    );

    // 两个条件都必须满足：没有不符合期望的键，且没有额外的键
    return !(isEveryKeyValid && isNoExtraKey);
  };

  // for Enter key search
  const handleSubmit = (e) => {
    e.preventDefault(); // 防止表單的默認提交行為
    if (btnSelect === 0) {
      // 只有當 btnSelect 為 0 (即公司搜索) 時，才執行導航
      const path = searchCompaniesLink(inputValue);
      navigate(path); // 使用程式導航跳轉到指定的路徑
    } else if (btnSelect === 1) {
      const path = searchAssetsLink(assetsInputValue);
      navigate(path); // 使用程式導航跳轉到指定的路徑
      console.log("gooooooooood");
    }
  };

  return (
    <div className="ease-in-out duration-500 transition-all">
      {/* -------------------- search input part------------------ */}
      {/* <div className="bg-db-search h-16 flex justify-center items-center">
        <NormalSearchBar />
      </div> */}

      {/* ------------------ advance search input part------------- */}
      <div className="flex flex-col xl:flex-row ">
        <div
          className={`flex flex-col md:flex-row ease-in-out duration-500 transition-all ${
            (btnSelect === 0 && checkInputValue(inputValue, btnSelect)) ||
            (btnSelect === 1 && checkInputValue(assetsInputValue, btnSelect))
              ? "xl:w-[62%]"
              : "xl:w-full"
          }`}
        >
          {/* option buttons part */}
          <div className="relative bg-main-color-gb w-full md:w-3/10 xl:w-[35%] flex flex-col items-center md:items-end">
            <button
              className="flex items-center text-white font-medium pb-3 pt-6 pr-7 pointer-events-none"
              // onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            >
              <span className={`pr-1.5 `}>{t("search.button")}</span>
              <svg
                className={`w-[12.64px] h-[12.64px] relative ${
                  isAdvancedSearch ? "rotate-180" : "rotate-0"
                }`}
                width={14}
                height={13}
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_537_1310)">
                  <path
                    d="M6.86661 2.73978L13.1855 9.47998L0.547673 9.47998L6.86661 2.73978Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clippath id="clip0_537_1310">
                    <rect
                      width="12.6379"
                      height="12.6379"
                      fill="white"
                      transform="matrix(-1 0 0 -1 13.1855 12.8501)"
                    />
                  </clippath>
                </defs>
              </svg>
            </button>
            <ul className="right-0 hidden md:flex flex-col items-start text-sm2 w-52 space-y-1.5 mb-9">
              {/* companies */}
              <li
                className={`${
                  isAdvancedSearch
                    ? "block"
                    : btnSelect === 0
                    ? "block"
                    : "hidden"
                }`}
              >
                <button
                  className={` flex items-center pl-8 py-3 text-sm2 font-medium rounded-full ${
                    btnSelect === 0 ? btnSelectStyle : btnDefaultStyle
                  } `}
                  onClick={() => handleClick(0)}
                >
                  <svg
                    className="w-[14px]"
                    width={14}
                    height={12}
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M10.5082 7.98571H9.19466V9.31667H10.5082M10.5082 5.32381H9.19466V6.65476H10.5082M11.8217 10.6476H6.56762V9.31667H7.88114V7.98571H6.56762V6.65476H7.88114V5.32381H6.56762V3.99286H11.8217M5.25409 2.6619H3.94057V1.33095H5.25409M5.25409 5.32381H3.94057V3.99286H5.25409M5.25409 7.98571H3.94057V6.65476H5.25409M5.25409 10.6476H3.94057V9.31667H5.25409M2.62705 2.6619H1.31352V1.33095H2.62705M2.62705 5.32381H1.31352V3.99286H2.62705M2.62705 7.98571H1.31352V6.65476H2.62705M2.62705 10.6476H1.31352V9.31667H2.62705M6.56762 2.6619V0H0V11.9786H13.1352V2.6619H6.56762Z"
                      fill={`${btnSelect === 0 ? "#3A4550" : "#009BAF"}`}
                    />
                  </svg>
                  <span className="pl-2">{t("search.options.companies")}</span>
                </button>
              </li>

              {/* assets */}
              <li
                className={`${
                  isAdvancedSearch
                    ? "block"
                    : btnSelect === 1
                    ? "block"
                    : "hidden"
                }`}
              >
                <button
                  className={`w-[163px] flex items-center pl-8 py-3 text-sm2 font-medium rounded-full transition-colors
                ${
                  btnSelect === 1
                    ? btnSelectStyle
                    : `w-[163px] bg-white  ${
                        userData
                          ? "pointer-events-auto text-main-color-gb"
                          : "pointer-events-none text-db-search"
                      }`
                } 
               `}
                  onClick={() => handleClick(1)}
                >
                  {userData ? (
                    <svg
                      width={13}
                      height={13}
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2.70833 0C1.99004 0 1.30116 0.285341 0.793252 0.793252C0.285341 1.30116 0 1.99004 0 2.70833V10.2917C0 11.01 0.285341 11.6988 0.793252 12.2067C1.30116 12.7147 1.99004 13 2.70833 13H10.2917C11.01 13 11.6988 12.7147 12.2067 12.2067C12.7147 11.6988 13 11.01 13 10.2917V2.70833C13 1.99004 12.7147 1.30116 12.2067 0.793252C11.6988 0.285341 11.01 0 10.2917 0H2.70833ZM1.08333 2.70833C1.08333 2.27736 1.25454 1.86403 1.55928 1.55928C1.86403 1.25454 2.27736 1.08333 2.70833 1.08333H10.2917C10.7226 1.08333 11.136 1.25454 11.4407 1.55928C11.7455 1.86403 11.9167 2.27736 11.9167 2.70833V10.2917C11.9167 10.7226 11.7455 11.136 11.4407 11.4407C11.136 11.7455 10.7226 11.9167 10.2917 11.9167H2.70833C2.27736 11.9167 1.86403 11.7455 1.55928 11.4407C1.25454 11.136 1.08333 10.7226 1.08333 10.2917V2.70833ZM3.25 3.25C3.10634 3.25 2.96857 3.30707 2.86698 3.40865C2.7654 3.51023 2.70833 3.64801 2.70833 3.79167C2.70833 3.93533 2.7654 4.0731 2.86698 4.17468C2.96857 4.27627 3.10634 4.33333 3.25 4.33333H9.75C9.89366 4.33333 10.0314 4.27627 10.133 4.17468C10.2346 4.0731 10.2917 3.93533 10.2917 3.79167C10.2917 3.64801 10.2346 3.51023 10.133 3.40865C10.0314 3.30707 9.89366 3.25 9.75 3.25H3.25Z"
                        fill={`${btnSelect === 1 ? "#3A4550" : "#009BAF"}`}
                      />
                    </svg>
                  ) : (
                    <svg
                      width={11}
                      height={14}
                      viewBox="0 0 11 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M9.625 4.66667H8.9375V3.33333C8.9375 1.49333 7.3975 0 5.5 0C3.6025 0 2.0625 1.49333 2.0625 3.33333V4.66667H1.375C0.61875 4.66667 0 5.26667 0 6V12.6667C0 13.4 0.61875 14 1.375 14H9.625C10.3813 14 11 13.4 11 12.6667V6C11 5.26667 10.3813 4.66667 9.625 4.66667ZM3.4375 3.33333C3.4375 2.22667 4.35875 1.33333 5.5 1.33333C6.64125 1.33333 7.5625 2.22667 7.5625 3.33333V4.66667H3.4375V3.33333ZM9.625 12.6667H1.375V6H9.625V12.6667ZM5.5 10.6667C6.25625 10.6667 6.875 10.0667 6.875 9.33333C6.875 8.6 6.25625 8 5.5 8C4.74375 8 4.125 8.6 4.125 9.33333C4.125 10.0667 4.74375 10.6667 5.5 10.6667Z"
                        fill="#3A4550"
                      />
                    </svg>
                  )}

                  <span className="pl-2">{t("search.options.assets")}</span>
                </button>
              </li>

              {/* teams */}
              {/* <li
                className={`${
                  isAdvancedSearch
                    ? "block"
                    : btnSelect === 2
                    ? "block"
                    : "hidden"
                }`}
              >
                <button
                  className={`w-[163px] flex items-center pl-8 py-3 text-sm2 font-medium rounded-full  bg-white  text-db-search`}
                  onClick={() => handleClick(2)}
                  disabled
                >
                  <svg
                    className="w-[15px]"
                    width={15}
                    height={12}
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 0.486492C0 0.357466 0.049386 0.233725 0.137294 0.142491C0.225201 0.051256 0.34443 9.93797e-07 0.46875 9.93797e-07H5.15438C6.13313 9.93797e-07 6.995 0.518924 7.49875 1.30639C7.75511 0.904423 8.1035 0.574693 8.51273 0.34671C8.92197 0.118726 9.37928 -0.000396958 9.84375 9.93797e-07H14.5312C14.6556 9.93797e-07 14.7748 0.051256 14.8627 0.142491C14.9506 0.233725 15 0.357466 15 0.486492V10.2572C14.9998 10.3213 14.9875 10.3847 14.9637 10.4439C14.9399 10.503 14.9051 10.5568 14.8612 10.6019C14.8174 10.6471 14.7654 10.6829 14.7083 10.7072C14.6511 10.7315 14.5899 10.7439 14.5281 10.7437L9.72688 10.7099C9.4785 10.7081 9.23226 10.7575 9.00244 10.8553C8.77262 10.953 8.5638 11.0972 8.38812 11.2794L7.83187 11.8574C7.78834 11.9026 7.73666 11.9385 7.67976 11.9629C7.62287 11.9874 7.56189 12 7.50031 12C7.43873 12 7.37775 11.9874 7.32086 11.9629C7.26397 11.9385 7.21228 11.9026 7.16875 11.8574L6.605 11.273C6.43101 11.0921 6.22437 10.9487 5.9969 10.8509C5.76943 10.753 5.5256 10.7027 5.27937 10.7028H0.46875C0.34443 10.7028 0.225201 10.6515 0.137294 10.5603C0.049386 10.4691 0 10.3453 0 10.2163L0 0.486492ZM7.96875 10.3668C8.47076 9.95474 9.0931 9.73257 9.73312 9.73695L14.0625 9.76744V0.972982H9.84375C9.34647 0.972982 8.86956 1.178 8.51792 1.54294C8.16629 1.90788 7.96875 2.40284 7.96875 2.91894V10.3668ZM7.02938 2.917C7.02888 2.40124 6.83111 1.90677 6.47954 1.54225C6.12796 1.17774 5.65133 0.972982 5.15438 0.972982H0.9375V9.72981H5.27937C5.91562 9.72981 6.53312 9.95425 7.03125 10.3655L7.02938 2.917Z"
                      fill={`${btnSelect === 2 ? "#3A4550" : "#3A4550"}`}
                    />
                  </svg>
                  <span className="pl-2">{t("search.options.teams")}</span>
                </button>
              </li> */}
            </ul>
          </div>
          {/* select part */}
          <div className="bg-db-Asearch md:w-7/10 xl:w-[65%] md:pl-3 xl:px-10 pt-6 md:pt-6.5 xl:pt-10 z-10">
            {/* Componies */}
            {btnSelect === 0 && (
              <form
                onSubmit={handleSubmit}
                className="md:max-w-[510px] xl:max-w-[665px] px-1/20 sm:px-1/10 md:px-0 "
              >
                {/* general_search */}
                <input
                  className="w-full text-sm2 mx-1 px-4.5 py-3 border-0 rounded-10px focus:ring-main-color"
                  type="text"
                  placeholder={t("search.form.general_search_placeholder")}
                  name="search"
                  onChange={onChangeHandler}
                  value={inputValue.search}
                />

                {/* without general search button */}
                <div className="flex w-fit flex-col items-end mb-6.5 md:mb-6 xl:mb-9">
                  {/* select area */}
                  <div className="relative flex flex-wrap justify-between md:justify-start pt-3 pb-4.5 md:pb-3 xl:pb-0">
                    {/* Company_Name */}
                    <div className="flex flex-col px-1 pt-3">
                      <label
                        className={`text-select-label pb-2 pl-1 text-sm2 ${
                          isAdvancedSearch ? "block" : "hidden"
                        }`}
                        htmlFor="Company_Name"
                      >
                        {t("search.form.company_name_label")}
                      </label>
                      <div className="releative">
                        <input
                          data-testid="Company_Types"
                          className="py-2 pr-3.5 rounded-10px text-sm2 font-medium w-40 border-0 focus:ring-main-color"
                          name="Company_Name"
                          value={inputValue.Company_Name}
                          onChange={onChangeHandler}
                          onFocus={onFocusHandler}
                          onBlur={onBlurHandler}
                        />
                        {isTyping === "Company_Name" && (
                          <AutoComplete
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            type={isTyping}
                          />
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <MultipleSelect_2layers
                      width={"w-56"}
                      label={{
                        label: t("search.form.location_label"),
                        parent_select: t(
                          "search.form.select.continent.defult_continent"
                        ),
                        child_select: t(
                          "search.form.select.continent.defult_country"
                        ),
                      }}
                      options={{
                        parantsOptions: continentTranslation,
                        childOptions_en: locationOptions_en,
                        childOptions_zh: locationOptions_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"Country_Region"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />

                    {/* company types */}
                    <MultipleSelect_2layers
                      width={"w-56"}
                      label={{
                        label: t("search.form.company_types_label"),
                        parent_select: t(
                          "search.form.select.company_types.defult_main_type"
                        ),
                        child_select: t(
                          "search.form.select.company_types.defult_sub_type"
                        ),
                      }}
                      options={{
                        parantsOptions: companyTypesTranslation,
                        childOptions_en: companyTypesOptions_en,
                        childOptions_zh: companyTypesOptions_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"Company_Types"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />

                    {/* Primary Therapeutic Area */}
                    <MultipleSelect_1Layer
                      width={"w-75"}
                      label={{
                        label: t("search.form.main_therapeutic_area_label"),
                        select: t(
                          "search.form.select.main_therapeutic_area.defult"
                        ),
                      }}
                      options={{
                        options_en: mainTherapeuticAreasOptions_en,
                        options_zh: mainTherapeuticAreasOptions_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"Primary_Therapeutic_Areas"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />

                    {/* Founded (year) */}
                    {/* <div className="flex flex-col px-1 pt-3">
                    <label
                      className={`text-select-label pb-2 pl-1 text-sm2 ${
                        isAdvancedSearch ? "block" : "hidden"
                      }`}
                      htmlFor="Founded_Year"
                    >
                      {t("search.form.founded_year_label")}
                    </label>
                    <select
                      data-testid="Founded_Year"
                      className="py-2 pr-3.5 rounded-10px text-sm2 font-medium w-40 border-0 focus:ring-main-color"
                      name="founded"
                      // name="Founded_Year"
                      id=""
                      onChange={onChangeHandler}
                    >
                      <option className="text-gray-600" value="">
                        {"--- select ---"}
                      </option>
                      <option value="In 5 years">In 5 years</option>
                      <option value="5 to 10 years">5 to 10 years</option>
                      <option value="10 to 20 years">10 to 20 years</option>
                      <option value="over 20 years">over 20 years</option>
                    </select>
                  </div> */}

                    {/* Employees */}
                    <MultipleSelect_1Layer
                      width={"w-60"}
                      label={{
                        label: t("search.form.employees_label"),
                        select: t("search.form.select.employees.defult"),
                      }}
                      options={{
                        options_en: employeesOptions["en"],
                        options_zh: employeesOptions["zh"],
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"Employee"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />
                  </div>

                  {/* search & search clean */}
                  <div className=" flex items-end xl:pt-5">
                    <button>
                      <Link
                        className={`${isAdvancedSearch ? "block" : "hidden"} ${
                          Object.keys(inputValue).length === 0
                            ? "pointer-events-none"
                            : "pointer-events-auto"
                        } h-fit bg-db-search hover:bg-nav-bg text-white text-sm2 font-medium py-2.5 px-12.5 rounded-full mr-2`}
                        to={searchCompaniesLink(inputValue)}
                      >
                        {t("search.form.search_button")}
                      </Link>
                    </button>

                    <Link
                      className="h-fit flex justify-center items-center text-sm2 text-white font-medium py-2.5 px-4 bg-toggle-color hover:bg-main-text-gray rounded-full"
                      onClick={clearSearchHandler}
                      to={"/database/search"}
                    >
                      {t("search.form.clear_search_button")}
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* Assets */}
            {btnSelect === 1 && (
              <form
                onSubmit={handleSubmit}
                className="md:max-w-[504px] xl:max-w-[665px] px-1/20 sm:px-1/10 md:px-0
            mb-6.5 md:mb-6 xl:mb-9"
              >
                {/* general_search */}
                <input
                  className="w-full text-sm2 mx-1 px-4.5 py-3 border-0 focus:ring-main-color rounded-10px"
                  type="text"
                  placeholder={t("search.form.general_search_placeholder")}
                  name="product_keyword"
                  onChange={onChangeAssetHandler}
                  value={assetsInputValue["product_keyword"]}
                />

                <div className="flex w-fit flex-col xl:flex-row items-end ">
                  {/* select area */}
                  <div className="flex flex-wrap justify-between md:justify-start pt-3 xl:pr-2.5 pb-4.5 md:pb-2.5 xl:pb-0">
                    {/*Assets Name*/}
                    <div className="flex flex-col px-1 pt-3">
                      <label
                        className={`text-select-label pb-2 pl-1 text-sm2 ${
                          isAdvancedSearch ? "block" : "hidden"
                        }`}
                        htmlFor="product_name"
                      >
                        {t("search.form.asset_name_label")}
                      </label>
                      <input
                        className="py-2 pr-3.5 rounded-10px text-sm2 font-medium w-40 border-0 focus:ring-main-color"
                        name="product_name"
                        id=""
                        onChange={onChangeAssetHandler}
                        value={assetsInputValue.product_name}
                      />
                    </div>

                    {/* assets_types */}
                    <MultipleSelect_2layers
                      width={"w-56"}
                      label={{
                        label: t("search.form.assets_types_label"),
                        parent_select: t(
                          "search.form.select.assets_types.defult_main_type"
                        ),
                        child_select: t(
                          "search.form.select.assets_types.defult_sub_type"
                        ),
                      }}
                      // 把這些 options 先裁掉
                      options={{
                        parantsOptions: filterAssetstypesTranslation,
                        childOptions_en: filterAssetsTypes_en,
                        childOptions_zh: filterAssetsTypes_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"assets_types"}
                      inputValue={assetsInputValue}
                      setInputValue={setAssetsInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />

                    {/*Therapeutic sector*/}
                    <MultipleSelect_1Layer
                      width={"w-68"}
                      label={{
                        label: t("search.form.therapeutic_sector_label"),
                        select: t(
                          "search.form.select.therapeutic_sector.defult"
                        ),
                      }}
                      options={{
                        options_en: therapeuticSectorOptions_en,
                        options_zh: therapeuticSectorOptions_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"main_therapeutic_sector"}
                      inputValue={assetsInputValue}
                      setInputValue={setAssetsInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />

                    {/* Development phase */}
                    <MultipleSelect_1Layer
                      width={"w-68"}
                      label={{
                        label: t("search.form.development_phase_label"),
                        select: t(
                          "search.form.select.development_phase.defult"
                        ),
                      }}
                      options={{
                        options_en: developmentPhaseOptions_en,
                        options_zh: developmentPhaseOptions_zh,
                      }}
                      isAdvancedSearch={isAdvancedSearch}
                      currentLanguage={currentLanguage}
                      name={"development_phase"}
                      inputValue={assetsInputValue}
                      setInputValue={setAssetsInputValue}
                      searchCleared={searchCleared}
                      clearedTag={clearedTag}
                      setClearedTag={setClearedTag}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end items-start xl:pt-5">
                  <button>
                    <Link
                      className={`${isAdvancedSearch ? "block" : "hidden"} ${
                        Object.keys(assetsInputValue).length === 0
                          ? "pointer-events-none"
                          : "pointer-events-auto"
                      } h-fit bg-db-search hover:bg-nav-bg text-white text-sm2 font-medium py-2.5 px-12.5 rounded-full mr-2`}
                      to={searchAssetsLink(assetsInputValue)}
                    >
                      {t("search.form.search_button")}
                    </Link>
                  </button>

                  <Link
                    className="h-fit flex justify-center items-center text-sm2 text-white font-medium py-2.5 px-4 bg-toggle-color hover:bg-main-text-gray rounded-full"
                    onClick={clearAssetsSearchHandler}
                    to={"/database/search"}
                  >
                    {t("search.form.clear_search_button")}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* tags */}

        {/* companies */}
        {btnSelect === 0 && (
          <div
            className={`bg-search-tag-bg  overflow-hidden ease-in-out duration-500 transition-all ${
              checkInputValue(inputValue, btnSelect)
                ? "md:h-auto md:py-8 xl:w-[38%] px-9"
                : "md:h-0 md:py-0 xl:py-8 xl:h-auto xl:w-0 px-0"
            }`}
          >
            <div className="flex flex-col space-y-5">
              {/* keyword */}
              <div>
                <span className="text-sm2 text-toggle-color mr-2">Keyword</span>
                <span className="text-sm2 text-db-table-text">
                  {inputValue?.search ? inputValue.search : "N/A"}
                </span>
              </div>

              {/* Company_Name */}
              <div>
                <span className="text-sm2 text-toggle-color mr-2">
                  Company Name
                </span>
                <span className="text-sm2 text-db-table-text">
                  {inputValue?.Company_Name ? inputValue.Company_Name : "N/A"}
                </span>
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center">
                  <span className="text-sm2 text-toggle-color mr-2 ">
                    Location
                  </span>

                  {/* continents */}
                  {inputValue?.Country_Region_parants &&
                    (Array.isArray(inputValue.Country_Region_parants)
                      ? inputValue.Country_Region_parants
                      : [inputValue.Country_Region_parants]
                    ).map((tag) => (
                      <div
                        key={tag}
                        className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                      >
                        <span className="mr-1.5 text-db-table-text">{tag}</span>
                        <button
                          onClick={() =>
                            setClearTagsHandler(tag, true, "Country_Region")
                          }
                        >
                          <svg
                            width={9}
                            height={9}
                            viewBox="0 0 9 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                            preserveAspectRatio="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>

                {/* country */}
                <div className="flex flex-wrap items-center">
                  {inputValue?.Country_Region?.map((tag) => (
                    <div
                      key={tag}
                      className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                    >
                      <span className="mr-1.5 text-db-table-text">{tag}</span>
                      <button
                        onClick={() =>
                          setClearTagsHandler(tag, false, "Country_Region")
                        }
                      >
                        <svg
                          width={9}
                          height={9}
                          viewBox="0 0 9 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                          preserveAspectRatio="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/*Main Company Types */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Main Company Types
                </span>

                {inputValue?.Company_Types_parants &&
                  (Array.isArray(inputValue.Company_Types_parants)
                    ? inputValue.Company_Types_parants
                    : [inputValue.Company_Types_parants]
                  ).map((tag) => (
                    <div
                      key={tag}
                      className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                    >
                      <span className="mr-1.5 text-db-table-text">{tag}</span>
                      <button
                        onClick={() =>
                          setClearTagsHandler(
                            tag,
                            true,
                            "Primary_Therapeutic_Areas"
                          )
                        }
                      >
                        <svg
                          width={9}
                          height={9}
                          viewBox="0 0 9 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                          preserveAspectRatio="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>

              {/*Sub Company Types */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Sub Company Types
                </span>

                {inputValue?.Company_Types?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(tag, false, "Company_Types")
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Main Therapeutic Area */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Main Therapeutic Area
                </span>

                {inputValue?.Primary_Therapeutic_Areas?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mt-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(
                          tag,
                          false,
                          "Primary_Therapeutic_Areas"
                        )
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Employees */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Employees
                </span>

                {inputValue?.Employee?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mt-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(tag, false, "Employee")
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* assets */}
        {btnSelect === 1 && (
          <div
            className={`bg-search-tag-bg  overflow-hidden ease-in-out duration-500 transition-all ${
              checkInputValue(assetsInputValue, btnSelect)
                ? "md:h-auto md:py-8 xl:w-[38%] px-9"
                : "md:h-0 md:py-0 xl:py-8 xl:h-auto xl:w-0 px-0"
            }`}
          >
            <div className="flex flex-col space-y-5">
              {/* keyword */}
              <div>
                <span className="text-sm2 text-toggle-color mr-2">Keyword</span>
                <span className="text-sm2 text-db-table-text">
                  {assetsInputValue?.["product_keyword"]
                    ? assetsInputValue["product_keyword"]
                    : "N/A"}
                </span>
              </div>

              {/* Assets Name */}
              <div>
                <span className="text-sm2 text-toggle-color mr-2">
                  Asset Name
                </span>
                <span className="text-sm2 text-db-table-text">
                  {assetsInputValue?.["product_name"]
                    ? assetsInputValue["product_name"]
                    : "N/A"}
                </span>
              </div>

              {/*Main assets Types */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Main Asset Type
                </span>

                {assetsInputValue?.["assets_types_parants"] &&
                  (Array.isArray(assetsInputValue["assets_types_parants"])
                    ? assetsInputValue["assets_types_parants"]
                    : [assetsInputValue["assets_types_parants"]]
                  ).map((tag) => (
                    <div
                      key={tag}
                      className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                    >
                      <span className="mr-1.5 text-db-table-text">{tag}</span>
                      <button
                        onClick={() =>
                          setClearTagsHandler(tag, true, "assets_types")
                        }
                      >
                        <svg
                          width={9}
                          height={9}
                          viewBox="0 0 9 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                          preserveAspectRatio="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>

              {/*Sub Asset Types */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Sub Asset Types
                </span>

                {assetsInputValue?.["assets_types"]?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mb-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(tag, false, "assets_types")
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Main Therapeutic Sector */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Therapeutic Sector
                </span>

                {assetsInputValue?.["main_therapeutic_sector"]?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mt-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(
                          tag,
                          false,
                          "main_therapeutic_sector"
                        )
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Development phase */}
              <div className="flex flex-wrap items-center">
                <span className="text-sm2 text-toggle-color mr-2 ">
                  Development Phase
                </span>

                {assetsInputValue?.["development_phase"]?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white w-fit rounded-full text-sm2 py-2 px-3 mr-1.5 mt-1.5 flex items-center"
                  >
                    <span className="mr-1.5 text-db-table-text">{tag}</span>
                    <button
                      onClick={() =>
                        setClearTagsHandler(tag, false, "development_phase")
                      }
                    >
                      <svg
                        width={9}
                        height={9}
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[9px] h-[9px] fill-main-text-gray hover:fill-main-color-gb"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.50751 5.35656L7.96439 8.81344C8.07965 8.92476 8.23401 8.98635 8.39423 8.98496C8.55445 8.98357 8.70772 8.9193 8.82102 8.806C8.93432 8.6927 8.99859 8.53943 8.99998 8.37921C9.00137 8.21899 8.93978 8.06463 8.82846 7.94938L5.37158 4.49249L8.82846 1.03561C8.93978 0.920355 9.00137 0.765994 8.99998 0.605771C8.99859 0.445548 8.93432 0.292281 8.82102 0.178982C8.70772 0.0656823 8.55445 0.0014154 8.39423 2.31005e-05C8.23401 -0.0013692 8.07965 0.0602243 7.96439 0.171538L4.50751 3.62842L1.05062 0.171538C0.934855 0.0629759 0.78139 0.00371372 0.622703 0.00629052C0.464016 0.00886732 0.312556 0.0730811 0.200372 0.185344C0.0881881 0.297608 0.0240814 0.449112 0.0216168 0.607801C0.0191523 0.76649 0.0785231 0.919913 0.187167 1.03561L3.64344 4.49249L0.186556 7.94938C0.128191 8.00574 0.0816379 8.07318 0.0496117 8.14773C0.0175856 8.22228 0.000728148 8.30247 2.30726e-05 8.38361C-0.000682003 8.46475 0.0147793 8.54521 0.045505 8.62031C0.0762306 8.69541 0.121605 8.76364 0.178981 8.82102C0.236357 8.87839 0.304586 8.92377 0.379685 8.95449C0.454785 8.98522 0.535252 9.00068 0.616391 8.99998C0.69753 8.99927 0.777716 8.98241 0.85227 8.95039C0.926824 8.91836 0.994254 8.87181 1.05062 8.81344L4.50751 5.35656Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Outlet />

      {/* <Link
        className="p-2 border  text-main-text-gray hover:text-main-blue"
        to={`/database/${search}`}
      >
        Search
      </Link> */}
    </div>
  );
};

export default Search;
