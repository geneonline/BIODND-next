import { useState, useEffect } from "react";
import { useParams, useLocation, Outlet, Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { executeSearchkitQuery } from "@/services/searchkitClient";

import CB_page_preload_CT from "./CTandAssets/CB_page_preload_CT";
import CB_page_preload_assets from "./CTandAssets/CB_page_preload_assets";
import ViewMore from "../../widget/ViewMore";

import indicesNaming from "@/data/database/elastic/indices_naming.json";

import Elastic_Loading from "@/pages/elasticSearch/widget/Elastic_Loading";

import logo_facebook from "@/assets/svg/database/logo_facebook.svg";
import logo_linkedin from "@/assets/svg/database/logo_linkedin.svg";
import logo_twitter from "@/assets/svg/database/logo_twitter.svg";

import default_company_icon from "@/assets/webp/search/default_company_icon.webp";

import NeedToPay_popup from "@/widgets/NeedToPay_popup";

const formatValue = (value) => {
  // 將字串轉換為數字
  const num = parseFloat(value);

  // 如果無法轉換為數字，返回原始字串
  if (isNaN(num)) {
    return value;
  }

  // 進行數值格式化，處理正數和負數
  const absNum = Math.abs(num); // 取絕對值來進行比較
  let formattedNum;

  if (absNum >= 1e9) {
    // 大於或等於十億，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  } else if (absNum >= 1e6) {
    // 大於或等於百萬，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
  } else if (absNum >= 1e3) {
    // 大於或等於千，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e3).toFixed(2).replace(/\.?0+$/, "") + "K";
  } else {
    // 如果數字小於千，保留最多四位小數並移除尾隨零
    formattedNum = num.toFixed(4).replace(/\.?0+$/, "");
  }

  return formattedNum;
};

const CB_page = () => {
  const { uuid } = useParams();
  const location = useLocation();

  // 定義自定義顯示名稱的映射表
  const displayMap = {
    "": "Summary",
    financials: "Financials",
    people: "People",
    news: "Signals & News",
    similarCompany: "Similar Companies",
  };

  // 解析最後的路徑段
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1] || "";

  // 根據映射表設定顯示名稱，默認為 "Summary"
  const displayValue = displayMap[lastSegment] || "Summary";

  const [jsonData, setJsonData] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popUp, setPopUp] = useState(false);

  const token = localStorage.getItem("token");
  const { userData } = useUser(token);

  const [CTdata, setCTdata] = useState(null);
  const [ctLoading, setctLoading] = useState(false);

  const [haveAssetsData, setHaveAssetsData] = useState(false);

  const [canShowCTandAsset, setCanShowCTandAsset] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await executeSearchkitQuery({
          searchSettings: {
            search_attributes: ["*"],
            result_attributes: ["*"],
            facet_attributes: [
              {
                attribute: "uuid.keyword",
                field: "uuid.keyword",
                type: "string",
              },
            ],
          },
          requests: [
            {
              indexName: indicesNaming.cb_company || "crunchbase_company", // 依照 indices_naming.json 使用對應 indexName
              params: {
                query: "",
                facetFilters: [[`uuid.keyword:${uuid}`]], // 使用 facetFilters 確保過濾生效
                hitsPerPage: 1,
              },
            },
          ],
        });

        // console.log(result);
        if (result?.results?.[0]?.hits?.length > 0) {
          setData(result.results[0].hits[0]);
        } else {
          setError("can't find data");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  useEffect(() => {
    const buckets = CTdata?.aggregations?.base_indices_count?.buckets || [];

    // 獲取 indices_naming 的所有子項目集合
    const allIndices = Object.values(indicesNaming).flat();

    // 檢查是否有匹配的 key
    const hasMatchingKey = buckets.some((bucket) =>
      allIndices.includes(bucket.key)
    );

    console.log(hasMatchingKey);
    console.log(haveAssetsData);

    if (hasMatchingKey || haveAssetsData) {
      setCanShowCTandAsset(true);
    } else {
      setCanShowCTandAsset(false);
    }
  }, [haveAssetsData, CTdata]);

  const handleCanNav = (e) => {
    e.stopPropagation();
    if (
      userData.subscriptionLevel === "Pro" ||
      userData.subscriptionLevel === "Test"
    ) {
      setPopUp(false);
    } else {
      setPopUp(true);
      e.preventDefault();
    }
  };

  // 載入中顯示
  if (loading)
    return (
      <div className=" w-full relative bg-finance-bg">
        <Elastic_Loading />

        <div className="h-[81px] bg-main-color-gb pt-30 pl-24 pr-19 py-6"></div>

        <div className="flex pt-7 pb-19 px-26 space-x-6">
          <ul className="flex flex-col min-w-56"></ul>
          <div className="w-full">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <section className="h-[130px] py-5 px-7 flex bg-white items-center border border-search-home-bg"></section>

                <section className="h-[204px] w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg"></section>

                <div className="flex gap-2">
                  <section className="max-w-[350px] w-full pt-5 pb-9 pl-8 pr-5 flex flex-col bg-white items-center border border-search-home-bg"></section>

                  <div className="w-full flex flex-col gap-2">
                    <section className="h-[340px] w-full pt-5 pb-6 pl-7 pr-12 flex flex-col bg-white items-center border border-search-home-bg"></section>
                    <section className="h-[182px] w-full pt-5 pb-6 pl-7 pr-12 flex flex-col bg-white items-center border border-search-home-bg"></section>
                  </div>
                </div>

                <section className="h-[334px] w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg"></section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // 錯誤顯示
  if (error)
    return <div className="mt-15 xl:mt-19 w-full relative">error: {error}</div>;

  // 資料顯示
  return (
    <div className=" w-full relative bg-finance-bg">
      <NeedToPay_popup popUp={popUp} setPopUp={setPopUp} />
      <div className="w-full bg-main-color-gb pt-34 pl-24 pr-19 py-6">
        <h1 className="text-white text-24px font-semibold leading-140">
          {displayValue}
          {" / "}
          {data?.name}
        </h1>
      </div>

      <div className="flex pt-7 pb-19 px-26 space-x-6">
        {/* nav */}
        <ul className="flex flex-col min-w-56">
          <Link
            className={`text-xl font-semibold leading-140 py-4 ${
              displayValue === "Summary"
                ? "text-main-color-gb"
                : "text-search-home-placeholder"
            }`}
            to={`/company-page/${uuid}`}
          >
            Summary
          </Link>

          <Link
            onClick={handleCanNav}
            className={`text-xl font-semibold leading-140 py-4 ${
              displayValue === "Financials"
                ? "text-main-color-gb"
                : "text-search-home-placeholder"
            }`}
            to={`/company-page/${uuid}/financials`}
          >
            Financials
          </Link>

          <Link
            onClick={handleCanNav}
            className={`text-xl font-semibold leading-140 py-4 ${
              displayValue === "Signals & News"
                ? "text-main-color-gb"
                : "text-search-home-placeholder"
            }`}
            to={`/company-page/${uuid}/news`}
          >
            Signals & News
          </Link>

          {(data?.people_highlights?.num_current_advisor_positions > 0 ||
            data?.num_employee_profiles?.length > 0) && (
            <Link
              onClick={handleCanNav}
              className={`text-xl font-semibold leading-140 py-4 ${
                displayValue === "People"
                  ? "text-main-color-gb"
                  : "text-search-home-placeholder"
              }`}
              to={`/company-page/${uuid}/people`}
            >
              People
            </Link>
          )}

          <Link
            className={`text-xl font-semibold leading-140 py-4 pointer-events-none ${
              displayValue === "Similar Companies"
                ? "text-main-color-gb"
                : "text-search-home-bg"
            }`}
            to={`/company-page/${uuid}/similarCompany`}
          >
            Similar Companies
          </Link>
        </ul>

        {/* content */}
        <div className="w-full">
          {displayValue === "Summary" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <section className="py-5 px-7 flex bg-white items-center border border-search-home-bg">
                  <div className="mr-5 h-[88px] w-[88px] rounded-5px overflow-hidden border border-search-home-bg">
                    <img
                      className="w-full"
                      src={data?.image || default_company_icon}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-16px leading-140 text-main-text-gray">
                      ORGANIZATION
                    </p>
                    <h2 className="text-32px font-semibold leading-140">
                      {data?.name}
                    </h2>
                  </div>
                </section>

                {(data?.stock_symbol ||
                  data?.num_acquisitions ||
                  data?.num_investments ||
                  data?.num_exits ||
                  data?.funds_total) && (
                  <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg">
                    <div className="w-full flex justify-start items-center space-x-2">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.0003 0.677734L15.2612 7.5115L22.7682 8.50106L17.2766 13.7141L18.6552 21.1595L12.0003 17.5476L5.34539 21.1595L6.72404 13.7141L1.23242 8.50106L8.7394 7.5115L12.0003 0.677734ZM12.0003 5.32179L10.077 9.35249L5.64918 9.93615L8.88825 13.0109L8.07509 17.4024L12.0003 15.272L15.9255 17.4024L15.1124 13.0109L18.3514 9.93615L13.9237 9.35249L12.0003 5.32179Z"
                          fill="#009BAF"
                        />
                      </svg>
                      <h3 className="w-full text-24px font-semibold leading-140">
                        Highlights
                      </h3>
                    </div>

                    <div className="w-full gap-x-12 pt-7 pb-6 flex">
                      <div className="w-[170px] gap-1">
                        <p className="text-main-text-gray leading-140">
                          Stock Symbol
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.stock_symbol || "-"}
                        </p>
                      </div>

                      <div className="w-[170px] gap-1">
                        <p className="text-main-text-gray leading-140">
                          Acquisitions
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.num_acquisitions || "-"}
                        </p>
                      </div>

                      <div className="w-[170px] gap-1">
                        <p className="text-main-text-gray leading-140">
                          Investments
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.num_investments || "-"}
                        </p>
                      </div>

                      <div className="w-[170px] gap-1">
                        <p className="text-main-text-gray leading-140">Exits</p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.num_exits || "-"}
                        </p>
                      </div>
                    </div>

                    {/* <div className="w-full pt-6 flex">
                      <div className="gap-1">
                        <p className="text-main-text-gray leading-140">
                          Total Funding Amount
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.funds_total || "-"}
                        </p>
                      </div>
                    </div> */}
                  </section>
                )}

                <div className="flex gap-2">
                  <section className="max-w-[350px] w-full pt-5 pb-9 pl-8 pr-5 flex flex-col bg-white items-center border border-search-home-bg">
                    <p className="w-full text-main-text-gray leading-140 pb-5 border-b border-[rgba(0,0,0,0.12)] line-clamp-[10] overflow-hidden">
                      <ViewMore
                        content={data?.full_description}
                        maxCharacters={200}
                        labelName={data?.name}
                      />
                    </p>

                    <div className="w-full gap-x-4 py-4 flex border-b border-[rgba(0,0,0,0.12)]">
                      <p className="text-main-text-gray leading-140">
                        Stock Symbol
                      </p>
                      <p className="text-main-color-gb font-semibold leading-140">
                        {data?.stock_symbol || "-"}
                      </p>
                    </div>

                    <div className="w-full pt-4 flex flex-col gap-2">
                      <p className="text-main-text-gray leading-140">
                        Industries
                      </p>
                      <div className="pt-3 flex flex-wrap gap-2">
                        {data?.industries &&
                          data?.industries
                            ?.filter(
                              (industry) => industry.id && industry.value
                            ) // 過濾掉 id 或 value 為空的項目
                            .map((industry) => (
                              <div
                                key={industry.id}
                                className="text-main-color-gb border-main-color border font-semibold leading-140 py-1 px-4 rounded-full"
                              >
                                {industry.value}
                              </div>
                            ))}
                      </div>
                    </div>
                  </section>

                  <div className="w-full flex flex-col gap-2">
                    <section className="w-full pt-5 pb-6 pl-7 pr-12 flex flex-col bg-white items-center border border-search-home-bg">
                      <div className="w-full gap-x-5 pb-5 flex border-b border-[rgba(0,0,0,0.12)]">
                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Founded Date
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.founded_date?.split("-")[0] || "-"}
                          </p>
                        </div>

                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Operating Status
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.operating_status || "-"}
                          </p>
                        </div>

                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Legal Name
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.legal_name || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="w-full pt-4 pb-5 flex flex-col gap-y-1 border-b border-[rgba(0,0,0,0.12)]">
                        <p className="text-main-text-gray leading-140">
                          Headquarters Regions
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.headquarters_regions
                            ?.filter((region) => region.id && region.value) // 過濾掉沒有 id 或 value 的資料
                            .sort((a, b) => a.id.localeCompare(b.id)) // 根據 id 排序
                            .map((region) => region.value) // 提取 value
                            .join(", ") || "-"}{" "}
                        </p>
                      </div>

                      <div className="w-full pt-4 pb-5 flex flex-col gap-y-1 border-b border-[rgba(0,0,0,0.12)]">
                        <p className="text-main-text-gray leading-140">
                          Founders
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.founders
                            ?.filter((region) => region.id && region.value) // 過濾掉沒有 id 或 value 的資料
                            .sort((a, b) => a.id.localeCompare(b.id)) // 根據 id 排序
                            .map((region) => region.value) // 提取 value
                            .join(", ") || "-"}{" "}
                        </p>
                      </div>

                      <div className="w-full pt-4 pb-10 flex flex-col gap-y-1">
                        {/* <p className="text-main-text-gray leading-140">
                          Related Hubs
                        </p>
                        <p className="text-main-color-gb font-semibold leading-140">
                          {data?.related_hubs
                            ?.sort((a, b) => a.id.localeCompare(b.id)) // 根據 id 排序
                            .map((region) => region.value) // 提取 value
                            .join(", ") || "-"}
                        </p> */}
                      </div>
                    </section>

                    <section className="w-full h-full pt-5 pb-6 px-7 flex flex-col bg-white items-center border border-search-home-bg">
                      <div className="w-full gap-x-5 pb-5 flex border-b border-[rgba(0,0,0,0.12)]">
                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Last Funding Type
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.funding_rounds?.last_funding_type?.replace(
                              /_/g,
                              " "
                            ) || "-"}
                          </p>
                        </div>

                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Company Type
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.company_type?.replace(/_/g, " ") || "-"}
                          </p>
                        </div>

                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Number of Exits
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.num_exits || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="w-full gap-x-5 pt-4 flex">
                        <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Phone Number
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.contact_phone || "-"}
                          </p>
                        </div>

                        {/* <div className="w-[165px] gap-1">
                          <p className="text-main-text-gray leading-140">
                            Contact Email
                          </p>
                          <p className="text-main-color-gb font-semibold leading-140">
                            {data?.contact_emailv || "-"}
                          </p>
                        </div> */}

                        {/* {data?.social_media_links && (
                          <div className="flex items-center gap-x-3 w-[165px] gap-1">
                            {data?.social_media_links?.map((link) => {
                              const domain = new URL(link).hostname; // 解析域名
                              const name = domain.includes("facebook")
                                ? "facebook"
                                : domain.includes("linkedin")
                                ? "linkedin"
                                : domain.includes("twitter")
                                ? "twitter"
                                : "null";

                              // Icon 映射表
                              const logoMap = {
                                facebook: logo_facebook,
                                linkedin: logo_linkedin,
                                twitter: logo_twitter,
                              };

                              // 如果無法匹配到 logo，跳過渲染
                              if (!name || !logoMap[name]) return null;

                              //之後要換成 img icon 命名要依照 name 去命名
                              return (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={link}
                                  className="inline-block w-6 h-6"
                                >
                                  <img
                                    className="w-full h-full"
                                    src={logoMap[name]}
                                    alt=""
                                  />
                                </a>
                              );
                            })}
                          </div>
                        )} */}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg">
                <div className="w-full flex justify-start items-center space-x-2 pb-5">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47717 2 2 6.47712 2 12C2 17.5228 6.47717 22 12 22C17.5229 22 22 17.5228 22 12C22 6.47712 17.5229 2 12 2ZM12 20C7.58881 20 4.00001 16.4112 4.00001 12C4.00001 7.58876 7.58876 4.00001 12 4.00001C16.4112 4.00001 20 7.58876 20 12C20 16.4112 16.4112 20 12 20ZM13.2522 8C13.2522 8.72506 12.7243 9.25001 12.0101 9.25001C11.2671 9.25001 10.7522 8.72501 10.7522 7.98612C10.7522 7.27596 11.2811 6.75003 12.0101 6.75003C12.7243 6.75003 13.2522 7.27596 13.2522 8ZM11.0022 11H13.0022V17H11.0022V11Z"
                      fill="#009BAF"
                    />
                  </svg>
                  <h3 className="w-full  text-24px font-semibold leading-140">
                    About
                  </h3>
                </div>

                {data?.about && (
                  <p className="w-full pb-6 border-b border-[rgba(0,0,0,0.12)] text-main-text-gray font-medium leading-140 ">
                    {data?.about}
                  </p>
                )}

                <div className="w-full gap-x-5 pt-6 pb-5 flex border-b border-[rgba(0,0,0,0.12)]">
                  <div className="min-w-[170px] gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 9.43767C13 8.10825 14.1023 7 15.5 7C16.8977 7 18 8.10825 18 9.43767C18 10.1461 17.6909 10.7866 17.1878 11.2359C16.6521 11.0823 16.0868 11 15.5 11C14.9132 11 14.3479 11.0823 13.8122 11.2359C13.3091 10.7866 13 10.1461 13 9.43767ZM11.933 12.1434C11.3497 11.3963 11 10.458 11 9.43767C11 6.96995 13.0317 5 15.5 5C17.9683 5 20 6.96995 20 9.43767C20 10.458 19.6503 11.3963 19.067 12.1434C20.6002 13.2308 21.6647 14.9951 21.9334 17H22V19H9V18H2V16H2.07401C2.31656 14.3704 3.14157 12.9044 4.34476 11.9876C4.12873 11.6164 4 11.1866 4 10.7188C4 9.08047 5.49067 8 7 8C8.50933 8 10 9.08047 10 10.7188C10 11.0901 9.9189 11.4375 9.77741 11.7506C10.2573 12.0566 10.6868 12.4446 11.0535 12.8923C11.3252 12.6168 11.6193 12.3659 11.933 12.1434ZM11.0889 17H19.9111C19.4884 14.6649 17.6141 13 15.5 13C13.3859 13 11.5116 14.6649 11.0889 17ZM9.81969 14.5991C9.59181 15.0405 9.40713 15.5099 9.27116 16H4.0997C4.47321 14.1829 5.83974 13 7.23529 13C8.23733 13 9.20151 13.5842 9.81969 14.5991ZM6 10.7188C6 10.4586 6.30019 10 7 10C7.69981 10 8 10.4586 8 10.7188C8 10.8211 7.96663 10.935 7.88533 11.0452C7.67323 11.0154 7.45635 11 7.23529 11C6.86962 11 6.51617 11.0412 6.17731 11.1192C6.05017 10.987 6 10.8442 6 10.7188Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.num_employees || "-"}
                    </p>
                  </div>

                  <div className="min-w-[170px] gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5 5H19V19H17V7H15V19H13V10H11V19H9V14H7V19H5V5ZM3 3H21V21H3V3Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.cb_rank || "-"}
                    </p>
                  </div>

                  <div className="min-w-[170px] gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15.5057 9.85008C15.3931 9.11826 14.9597 8.113 13.9672 7.50196C13.674 7.32144 13.3513 7.18688 13 7.10277V6H11V7.12506C10.6183 7.20838 10.2165 7.33428 9.79497 7.5056L9.72136 7.53552L9.6534 7.57669C9.13573 7.89026 8.36009 8.53103 8.09234 9.44662C7.946 9.94702 7.96038 10.5103 8.23222 11.0651C8.4929 11.5972 8.95111 12.0428 9.55132 12.4193L9.66515 12.4907L13.2351 13.5679C13.4325 13.6409 13.7125 13.7655 13.929 13.8999C13.9526 13.9146 13.9736 13.9283 13.9924 13.941C13.9823 14.0744 13.9599 14.1872 13.9109 14.2933C13.8532 14.4183 13.7111 14.638 13.2116 14.8184C12.6768 15.0116 11.7083 15.0851 10.9684 14.8656C10.6109 14.7596 10.4027 14.6136 10.2981 14.48C10.2171 14.3765 10.131 14.1994 10.1922 13.8284L8.21896 13.5026C8.07858 14.3527 8.25382 15.1133 8.72346 15.7131C9.16957 16.2828 9.80139 16.6056 10.3997 16.783C10.5944 16.8408 10.7956 16.8862 11 16.9202V18H13V16.9219C13.3262 16.87 13.6289 16.7942 13.8912 16.6994C14.8403 16.3565 15.4225 15.7911 15.727 15.1311C16.001 14.5371 16.0003 13.9593 16 13.6905L16 13.6655C16 13.1807 15.7316 12.8364 15.5695 12.6642C15.3878 12.4714 15.1713 12.3172 14.9846 12.2012C14.6062 11.9661 14.1759 11.7812 13.8912 11.6783L13.866 11.6692L10.5085 10.6561C10.1878 10.4378 10.0694 10.2692 10.0283 10.1852C9.99401 10.1153 9.99375 10.0702 10.0119 10.008C10.0371 9.92178 10.1063 9.79565 10.2439 9.64771C10.3593 9.52353 10.4968 9.41245 10.627 9.32686C11.9299 8.81546 12.5999 9.00883 12.9186 9.20506C13.2862 9.43138 13.4805 9.83916 13.5289 10.1541L15.5057 9.85008ZM14.1136 14.0355C14.1217 14.0441 14.1196 14.0433 14.1117 14.0335L14.1136 14.0355Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.funding_rounds?.last_funding_type?.replace(
                        /_/g,
                        " "
                      ) || "-"}
                    </p>
                  </div>

                  <div className="min-w-[170px] gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 3H4V21H6V14.6436C7.92592 13.8841 9.9292 14.4131 10.8032 14.8416C12.1218 15.9374 13.8993 16.0949 15.3998 15.9582C16.9712 15.8151 18.4775 15.3297 19.4046 14.9195L20 14.6561V3.36874L18.5487 4.10259C17.8947 4.43334 16.7725 4.84038 15.607 4.9573C14.4297 5.0754 13.3836 4.88404 12.6627 4.2461C11.3472 3.08203 9.63571 2.89797 8.19337 3.04266C7.41259 3.12098 6.65905 3.29965 6 3.51336V3ZM6 5.63999V12.5361C8.45947 11.8531 10.8066 12.577 11.8326 13.1218L11.9374 13.1775L12.0263 13.2561C12.7348 13.8831 13.8732 14.089 15.2184 13.9665C16.2355 13.8738 17.2407 13.6037 18 13.3283V6.47661C17.3409 6.69031 16.5874 6.86898 15.8066 6.94731C14.3643 7.092 12.6528 6.90794 11.3373 5.74387C10.6164 5.10593 9.57035 4.91457 8.39299 5.03267C7.50848 5.1214 6.64893 5.37723 6 5.63999Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.ipo_status || "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full gap-x-12 pt-6 pb-5 flex">
                  <div className=" gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.748 14C19.9125 13.3608 20 12.6906 20 12C20 11.3094 19.9125 10.6392 19.748 10H16.8973C16.9651 10.6524 17 11.3213 17 12C17 12.6787 16.9651 13.3476 16.8973 14H19.748ZM18.9297 16H16.5761C16.3181 17.1697 15.9478 18.2536 15.4799 19.2055C16.9257 18.506 18.1291 17.3841 18.9297 16ZM14.8859 14C14.9602 13.3605 15 12.6918 15 12C15 11.3082 14.9602 10.6395 14.8859 10L9.11406 10C9.03978 10.6395 9 11.3082 9 12C9 12.6918 9.03978 13.3605 9.11406 14L14.8859 14ZM9.47824 16L14.5218 16C14.0909 17.7006 13.403 19.0804 12.6 19.9778C12.4019 19.9925 12.2018 20 12 20C11.7982 20 11.5981 19.9925 11.4 19.9778C10.597 19.0804 9.90909 17.7006 9.47824 16ZM7.10274 14C7.03495 13.3476 7 12.6787 7 12C7 11.3213 7.03495 10.6524 7.10274 10H4.25203C4.08751 10.6392 4 11.3094 4 12C4 12.6906 4.08751 13.3608 4.25203 14H7.10274ZM5.07026 16H7.42393C7.68189 17.1697 8.05224 18.2536 8.52015 19.2055C7.07427 18.506 5.87089 17.3841 5.07026 16ZM15.4799 4.79445C16.9257 5.49401 18.1291 6.61594 18.9297 8H16.5761C16.3181 6.83034 15.9478 5.74639 15.4799 4.79445ZM12.6 4.02216C13.403 4.91955 14.0909 6.29935 14.5218 8L9.47824 8C9.90909 6.29935 10.597 4.91955 11.4 4.02216C11.5981 4.00747 11.7982 4 12 4C12.2018 4 12.4019 4.00747 12.6 4.02216ZM8.52015 4.79445C8.05224 5.74639 7.68189 6.83034 7.42393 8H5.07026C5.87089 6.61594 7.07427 5.49401 8.52015 4.79445ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.website || "-"}
                    </p>
                  </div>

                  <div className="gap-3 flex items-center">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.75934 14.4432L6.72598 14.406C6.6678 14.3405 6.61087 14.2739 6.55522 14.2063C6.46426 14.0958 6.37671 13.9824 6.29273 13.8664C6.27682 13.8445 6.26104 13.8224 6.24539 13.8002L6.13277 13.6593L6.14314 13.6513C5.42046 12.5685 5 11.273 5 9.88123C5 6.08083 8.13401 3 12 3C15.866 3 19 6.08083 19 9.88123C19 11.273 18.5797 12.5683 17.857 13.6511L17.8672 13.6593L17.7546 13.8002C17.739 13.8224 17.7232 13.8445 17.7073 13.8664C17.6233 13.9824 17.5358 14.0958 17.4448 14.2063C17.3891 14.2739 17.3322 14.3405 17.274 14.406L17.2407 14.4432L12 21L6.75934 14.4432ZM16.1934 12.541L16.156 12.5969L16.1551 12.598L16.1208 12.6467C16.0083 12.806 15.8862 12.9588 15.7552 13.1041L15.7154 13.1482L12 17.7967L8.28457 13.1482L8.24483 13.1041C8.11383 12.9588 7.9917 12.806 7.87919 12.6467L7.84485 12.598L7.84397 12.5969L7.80663 12.541C7.29531 11.7749 7 10.8638 7 9.88123C7 7.21753 9.20617 5 12 5C14.7938 5 17 7.21753 17 9.88123C17 10.8638 16.7047 11.7749 16.1934 12.541ZM13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
                        fill="#69747F"
                      />
                    </svg>
                    <p className="text-main-color-gb font-semibold leading-140">
                      {data?.address || "-"}
                    </p>
                  </div>
                </div>
              </section>

              {data?.featured_list[0].id && (
                <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg">
                  <div className="w-full flex justify-start items-center space-x-2 pb-5">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0459 4.77392L12.5007 4.45142L12.9556 4.77392C13.5408 5.18885 14.2554 5.38032 14.9697 5.3136L15.5249 5.26174L15.7576 5.76847C16.057 6.42043 16.58 6.94353 17.232 7.2429L17.7387 7.47559L17.6869 8.03077C17.6202 8.74507 17.8116 9.45963 18.2266 10.0449L18.5491 10.4998L18.2266 10.9546C17.8116 11.5399 17.6202 12.2544 17.6869 12.9687L17.7387 13.5239L17.232 13.7566C16.5801 14.056 16.057 14.5791 15.7576 15.231L15.5249 15.7378L14.9697 15.6859C14.2554 15.6192 13.5409 15.8107 12.9556 16.2256L12.5007 16.5481L12.0459 16.2256C11.4606 15.8107 10.746 15.6192 10.0317 15.6859L9.47656 15.7378L9.24388 15.231C8.94451 14.5791 8.42141 14.056 7.76945 13.7566L7.26272 13.5239L7.31457 12.9687C7.38129 12.2544 7.18983 11.5399 6.77489 10.9546L6.45239 10.4998L6.77489 10.0449C7.18983 9.45964 7.38129 8.74507 7.31457 8.03077L7.26272 7.47559L7.76945 7.2429C8.42141 6.94353 8.94451 6.42044 9.24388 5.76847L9.47656 5.26174L10.0317 5.3136C10.746 5.38032 11.4606 5.18885 12.0459 4.77392ZM11.9224 2.40981C12.2688 2.16418 12.7326 2.16418 13.0791 2.40981L14.1123 3.14237C14.3074 3.28068 14.5456 3.3445 14.7837 3.32226L16.0448 3.20447C16.4677 3.16498 16.8694 3.39689 17.0466 3.78285L17.5751 4.93388C17.6749 5.1512 17.8493 5.32557 18.0666 5.42536L19.2176 5.9539C19.6036 6.13112 19.8355 6.53281 19.796 6.95567L19.6782 8.21676C19.656 8.45487 19.7198 8.69305 19.8581 8.88814L20.5907 9.92138C20.8363 10.2678 20.8363 10.7317 20.5907 11.0781L19.8581 12.1114C19.7198 12.3065 19.656 12.5446 19.6782 12.7827L19.796 14.0438C19.8355 14.4667 19.6036 14.8684 19.2176 15.0456L18.0666 15.5741C17.9639 15.6213 17.8707 15.6852 17.7906 15.7623L20.7002 20.9998H17.0359L15.3769 23.4882L12.9631 18.6606C12.8127 18.7392 12.6469 18.7769 12.4818 18.7737L10.1245 23.4882L8.46555 20.9998H4.80122L7.47886 16.18L7.42634 16.0656C7.32655 15.8483 7.15218 15.6739 6.93486 15.5741L5.78382 15.0456C5.39786 14.8684 5.16595 14.4667 5.20545 14.0438L5.32324 12.7827C5.34548 12.5446 5.28166 12.3065 5.14335 12.1114L4.41079 11.0781C4.16515 10.7317 4.16515 10.2678 4.41079 9.92138L5.14335 8.88814C5.28166 8.69305 5.34548 8.45487 5.32324 8.21676L5.20545 6.95567C5.16595 6.53281 5.39787 6.13112 5.78382 5.9539L6.93486 5.42536C7.15218 5.32557 7.32655 5.1512 7.42634 4.93388L7.95487 3.78285C8.1321 3.39689 8.53378 3.16498 8.95665 3.20447L10.2177 3.32226C10.4558 3.3445 10.694 3.28068 10.8891 3.14237L11.9224 2.40981ZM14.7054 17.673L15.6245 19.5113L15.9655 18.9998H17.3012L16.5777 17.6974C16.4161 17.7766 16.2325 17.8126 16.0448 17.795L14.7837 17.6772C14.7576 17.6748 14.7315 17.6734 14.7054 17.673ZM10.2177 17.6772C10.4003 17.6602 10.583 17.6937 10.7462 17.7727L9.87693 19.5113L9.53591 18.9998H8.20025L8.86712 17.7994C8.89681 17.7993 8.92667 17.7978 8.95665 17.795L10.2177 17.6772ZM14.0007 10.4998C14.0007 11.3282 13.3292 11.9998 12.5007 11.9998C11.6723 11.9998 11.0007 11.3282 11.0007 10.4998C11.0007 9.67133 11.6723 8.99975 12.5007 8.99975C13.3292 8.99975 14.0007 9.67133 14.0007 10.4998ZM16.0007 10.4998C16.0007 12.4328 14.4337 13.9998 12.5007 13.9998C10.5677 13.9998 9.00073 12.4328 9.00073 10.4998C9.00073 8.56676 10.5677 6.99975 12.5007 6.99975C14.4337 6.99975 16.0007 8.56676 16.0007 10.4998Z"
                        fill="#009BAF"
                      />
                    </svg>
                    <h3 className="w-full  text-24px font-semibold leading-140">
                      Lists Featuring This Company
                    </h3>
                  </div>

                  <div className="w-full flex flex-col">
                    {data?.featured_list?.map((list) => (
                      <div
                        key={list.id}
                        className="w-full pt-6 pb-5 flex items-center last:border-0 border-b border-[rgba(0, 0, 0, 0.12)]"
                      >
                        <div className="mr-4 w-15 h-15 rounded-5px border border-search-home-bg">
                          <img src={default_company_icon} alt="" />
                        </div>
                        <div className="flex flex-col leading-140">
                          <p className="text-main-text-gray font-semibold">
                            {list.title || "-"}
                          </p>
                          <div className="flex divide-x-2 divide-main-text-gray">
                            <div className="flex pr-3">
                              <p className="pr-1 text-main-color-gb font-semibold">
                                {formatValue(list?.org_num) || "-"}
                              </p>
                              <p className="text-main-text-gray">
                                Number of Organizations
                              </p>
                            </div>

                            <div className="flex px-3">
                              <p className="pr-1 text-main-color-gb font-semibold">
                                $
                                {formatValue(
                                  list?.org_funding_total?.value_usd
                                ) || "-"}
                              </p>
                              <p className="text-main-text-gray">
                                Total Funding Amount
                              </p>
                            </div>

                            <div className="flex pl-3">
                              <p className="pr-1 text-main-color-gb font-semibold">
                                {formatValue(list?.org_num_investors) || "-"}
                              </p>
                              <p className="text-main-text-gray">
                                Number of Investors
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data?.num_sub_organizations && (
                <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white items-center border border-search-home-bg">
                  <div className="w-full flex justify-start items-center space-x-2 pb-7">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 5H18V19H11V5ZM20 19H21V21H2V19H3V10H9V3H20V19ZM9 19H5V12H9V19ZM16 15H13V17H16V15ZM13 11H16V13H13V11ZM16 7H13V9H16V7Z"
                        fill="#009BAF"
                      />
                    </svg>
                    <h3 className="w-full text-24px font-semibold leading-140">
                      Sub-Organizations
                    </h3>
                  </div>

                  <div className="w-full pb-6 flex space-x-4 border-b border-[rgba(0, 0, 0, 0.12)]">
                    <p className="text-main-text-gray">
                      Number of Organizations
                    </p>
                    <p className="text-main-color-gb font-semibold">
                      {data?.num_sub_organizations || "-"}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-8">
                    {data?.sub_organizations?.map((subOrg) => (
                      <div
                        className="flex items-center justify-start"
                        key={subOrg.ownee_permalink}
                      >
                        <div className="w-15 h-15 mr-4 rounded-5px border border-search-home-bg">
                          <img src={default_company_icon} alt="" />
                        </div>
                        <div className="flex flex-col leading-140 space-y-1">
                          <p className="text-main-text-gray">
                            {subOrg.ownership_type}
                          </p>
                          <p className="text-main-color-gb font-semibold">
                            {subOrg.ownee}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          <Outlet
            context={{ data, loading, error, CTdata, ctLoading, userData }}
          />
        </div>
      </div>

      {/* <button
        className="w-1 h-1"
        onClick={() => setJsonData((prev) => !prev)}
      ></button>
      {jsonData && (
        <div>
          {location.pathname === `/company-page/${uuid}` && (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      )} */}
    </div>
  );
};

export default CB_page;
