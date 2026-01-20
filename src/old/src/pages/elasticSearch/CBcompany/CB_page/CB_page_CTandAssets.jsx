import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import CB_page_assets from "./CB_page_assets";

import Elastic_Loading from "@/pages/elasticSearch/widget/Elastic_Loading";
import noresults_icon from "@/assets/svg/database/noresults_icon.svg";

import axios from "axios";
import indicesNaming from "@/data/database/elastic/indices_naming.json";
import sections from "@/data/database/elastic/sections.json";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

import default_company_icon from "@/assets/webp/search/default_company_icon.webp";

// ============ 這一頁有 CT & Brugs 兩個分頁，CB_page_preload_CT.jsx 是 CT 分頁的搜尋功能(會在 CB_page 載入時就 query)，CB_page_assets.jsx 是 Assets 分頁的搜尋功能 ============

const CB_page_CTandAssets = () => {
  const {
    data,
    loading,
    error,
    CTdata: ctResults,
    ctLoading,
    userData,
  } = useOutletContext();

  const [currentTag, setCurrnetTag] = useState(
    "Clinical Information & Licensed Drugs"
  );

  const [popUp, setPopUp] = useState(false);

  const processAggregations = (buckets) => {
    const groupedBuckets = {};

    buckets.forEach((bucket) => {
      const baseName = bucket.key.replace(/\d+$/, "");
      if (!groupedBuckets[baseName]) {
        groupedBuckets[baseName] = 0;
      }
      groupedBuckets[baseName] += bucket.doc_count;
    });

    return groupedBuckets;
  };

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

  // useEffect(() => {
  //   if (data) {
  //     performSearch(data.name);
  //   }
  // }, [data]);

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>錯誤: {error}</div>;
  }

  return (
    <>
      <NeedToPay_popup popUp={popUp} setPopUp={setPopUp} />
      <div className="w-full p-5 bg-white items-center border border-search-home-bg">
        <section className="pb-8 px-2 flex items-center">
          <div className="mr-5 h-[88px] w-[88px] rounded-5px overflow-hidden border border-search-home-bg">
            <img
              className="w-full"
              src={data.image || default_company_icon}
              alt=""
            />
          </div>
          <div className="flex flex-col ">
            <p className="text-16px leading-140 text-main-text-gray">
              ORGANIZATION
            </p>
            <h2 className="text-32px font-semibold leading-140">{data.name}</h2>
          </div>
        </section>

        <section className="w-full">
          <div className="flex space-x-2 translate-y-[1px]">
            <button
              onClick={() =>
                setCurrnetTag("Clinical Information & Licensed Drugs")
              }
              className={` w-1/2 py-4.5 rounded-t-5px border border-search-home-bg text-xl font-semibold ${
                currentTag === "Clinical Information & Licensed Drugs"
                  ? "bg-white border-b-0"
                  : "bg-finance-tabble-even"
              }`}
            >
              Clinical Information & Licensed Drugs
            </button>
            <button
              onClick={() => setCurrnetTag("Assets")}
              className={`w-1/2 py-4.5 rounded-t-5px border border-search-home-bg text-xl font-semibold ${
                currentTag === "Assets"
                  ? "bg-white border-b-0"
                  : "bg-finance-tabble-even"
              }`}
            >
              Assets
            </button>
          </div>
          <div className=" border border-search-home-bg">
            {currentTag === "Clinical Information & Licensed Drugs" ? (
              <div className="w-full">
                {ctLoading ? (
                  <div className="h-[1080px]">
                    <Elastic_Loading />
                  </div>
                ) : ctResults && Object.keys(ctResults).length > 0 ? (
                  <div className="w-full">
                    {
                      // 檢查是否至少有一個 naming 存在
                      Object.entries(sections)
                        // 過濾掉 "Market Information" section
                        .filter(
                          ([sectionName, keys]) =>
                            sectionName !== "Market Information"
                        )
                        .some(([sectionName, keys]) => {
                          const groupedBuckets = processAggregations(
                            ctResults.aggregations.base_indices_count?.buckets
                          );

                          return Object.entries(groupedBuckets).some(
                            ([baseName, count]) => {
                              return (
                                keys.some((key) => baseName.startsWith(key)) &&
                                indicesNaming.some(
                                  (item) =>
                                    baseName.startsWith(item.key) && item.name
                                )
                              );
                            }
                          );
                        }) ? (
                        // 如果有至少一個 naming，渲染主要的內容
                        <div className="w-full flex flex-wrap pt-13 pb-26">
                          {ctResults.aggregations &&
                            Object.entries(sections)
                              // 過濾掉 "Market Information" section
                              .filter(
                                ([sectionName, keys]) =>
                                  sectionName !== "Market Information"
                              )
                              .map(([sectionName, keys]) => {
                                // 處理聚合資料
                                const groupedBuckets = processAggregations(
                                  ctResults.aggregations.base_indices_count
                                    ?.buckets
                                );

                                const sectionItems = Object.entries(
                                  groupedBuckets
                                )
                                  .filter(([baseName, count]) =>
                                    keys.some((key) => baseName.startsWith(key))
                                  )
                                  .map(([baseName, count]) => {
                                    const naming = indicesNaming.find((item) =>
                                      baseName.startsWith(item.key)
                                    );
                                    return naming && naming.name ? (
                                      <Link
                                        onClick={handleCanNav}
                                        to={`/searchkit/${naming.key}?query=${data.name}`}
                                        key={naming.key}
                                        className="rounded-10px w-[260px] h-[120px] flex flex-col px-6 py-4 items-center justify-center border bg-finance-tabble-even hover:bg-search-home-hover"
                                      >
                                        <h3 className=" text-main-color-gb pb-3 font-semibold leading-140 text-center">
                                          {naming.name}
                                        </h3>

                                        <p className="w-full border-t text-center border-main-text-gray pt-2 leading-140 text-main-text-gray text-base font-semibold">
                                          {count}
                                          <span className="text-sm1 font-medium">
                                            {" "}
                                            Found
                                          </span>
                                        </p>
                                      </Link>
                                    ) : null;
                                  });

                                if (sectionItems?.length > 0) {
                                  return (
                                    <div
                                      className="w-full px-10 first:pt-0 pt-12 pb-13 last:border-b-0 border-b border-[rgba(0,0,0,0.12)]"
                                      key={sectionName}
                                    >
                                      <h2 className="flex items-center mb-7 leading-140 text-24px font-semibold">
                                        {sectionName}
                                      </h2>

                                      <div className="flex flex-wrap gap-x-5 gap-y-4">
                                        {sectionItems}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return null; // 如果沒有符合的項目，則不顯示該 section
                                }
                              })}
                        </div>
                      ) : (
                        // 如果沒有任何 naming，渲染自定義的另一個元素
                        <div className="flex items-center pt-7.5 pl-11 mb-10">
                          <div className="flex-shrink-0 w-8 h-8 mr-3">
                            <img
                              className="w-full h-full"
                              src={noresults_icon}
                              alt=""
                            />
                          </div>
                          <h2 className=" text-main-color-gb text-24px font-semibold leading-140">
                            No results found
                          </h2>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  <div>no results found</div>
                )}
              </div>
            ) : (
              <CB_page_assets data={data} loading={loading} error={error} />
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default CB_page_CTandAssets;
