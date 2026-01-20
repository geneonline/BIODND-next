import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

import Elastic_Loading from "@/pages/elasticSearch/widget/Elastic_Loading";

import FinancialStatement from "@/pages/SerpAPI/finance/FinancialStatement"; // Import the new component
import DiscoverMore from "@/pages/SerpAPI/finance/DiscoverMore"; // Import the DiscoverMore component
import CB_page_financials_InvestmentAndFinancing from "./CB_page_financials_InvestmentAndFinancing";
import noresults_icon from "@/assets/svg/database/noresults_icon.svg";
import default_company_icon from "@/assets/webp/search/default_company_icon.webp";

import NeedToPay from "@/parts/NeedToPay";

const effectApiBaseURL = import.meta.env.VITE_Effect_API;

const CB_page_financials = () => {
  const { data, loading, error, userData } = useOutletContext();
  const [currentTag, setCurrnetTag] = useState("Investment & Financing");

  const [financialsResult, setFinancialsResult] = useState(null);
  const [financialsIsLoading, setFinancialsIsLoading] = useState(false);

  // 如果沒有股票代號會使用公司名稱搜尋，再把拿到的第一筆推薦拿來用
  const handleFinancialsSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setFinancialsResult(null);
      setFinancialsIsLoading(false);
      return;
    }

    setFinancialsIsLoading(true); // 開始加載

    try {
      // 首先進行初始搜尋
      const initialResponse = await axios.get(
        `${effectApiBaseURL}/api/SerpSearch/finance`,
        {
          params: { q: searchQuery },
        }
      );

      let finalResponseData;

      // 檢查是否存在 futures_chain 並取得 stock_symbol
      const stockSymbolFromInitial =
        initialResponse.data.futures_chain?.[0]?.stock;

      if (stockSymbolFromInitial) {
        // 使用獲取到的 stock_symbol 進行二次查詢
        const secondaryResponse = await axios.get(
          `${effectApiBaseURL}/api/SerpSearch/finance`,
          {
            params: { q: stockSymbolFromInitial },
          }
        );
        finalResponseData = secondaryResponse.data;
      } else if (data.stock_symbol) {
        // 如果 futures_chain 不存在，直接使用 stock_symbol 進行搜尋
        finalResponseData = initialResponse.data;
      } else {
        // 如果沒有找到對應的 stock_symbol 或 futures_chain
        console.error(
          "No stock symbol or futures chain found in the response."
        );
        setFinancialsResult(null);
        setFinancialsIsLoading(false);
        return;
      }

      console.log(finalResponseData);
      setFinancialsResult(finalResponseData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFinancialsResult(null);
    } finally {
      setFinancialsIsLoading(false); // 停止加載
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (data.stock_symbol) {
        // 顛倒標的&市場以符合 Serp API 格式
        const transformedSymbol = data.stock_symbol
          .split(":")
          .reverse()
          .join(":");
        await handleFinancialsSearch(transformedSymbol);
      } else if (data.name) {
        // 使用 name 進行搜尋
        await handleFinancialsSearch(data.name);
      } else {
        // 如果既沒有 stock_symbol 也沒有 name
        setFinancialsResult(null);
        setFinancialsIsLoading(false);
      }
    };

    performSearch();
  }, [data]);

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>錯誤: {error}</div>;
  }

  if (
    userData.subscriptionLevel == !"Pro" ||
    userData.subscriptionLevel == !"Test"
  ) {
    return <NeedToPay />;
  }

  return (
    <div className="w-full p-5 bg-white items-center border border-search-home-bg">
      <section className="pb-8 px-2 flex items-center">
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
          <h2 className="text-32px font-semibold leading-140">{data?.name}</h2>
        </div>
      </section>

      <section className="w-full">
        <div className="flex space-x-2 translate-y-[1px]">
          <button
            onClick={() => setCurrnetTag("Investment & Financing")}
            className={` w-1/2 py-4.5 rounded-t-5px border border-search-home-bg text-xl font-semibold ${
              currentTag === "Investment & Financing"
                ? "bg-white border-b-0"
                : "bg-finance-tabble-even"
            }`}
          >
            Investment & Financing
          </button>
          <button
            onClick={() => setCurrnetTag("Public Listed Data")}
            className={`w-1/2 py-4.5 rounded-t-5px border border-search-home-bg text-xl font-semibold ${
              currentTag === "Public Listed Data"
                ? "bg-white border-b-0"
                : "bg-finance-tabble-even"
            }`}
          >
            Public Listed Data
          </button>
        </div>
        <div className=" border border-search-home-bg">
          {currentTag === "Public Listed Data" ? (
            <div className="w-full">
              {financialsIsLoading ? (
                // Loadging...
                <div className="text-center">
                  <Elastic_Loading />
                  <div className="w-full">
                    <section className="h-[214px] w-full px-9 py-7"></section>
                    <section className="h-[86px] flex font-medium items-center whitespace-nowrap w-full px-10 py-7 border-t border-[rgba(0,0,0,0.12)]"></section>
                    <section className="h-[380px] w-full px-10 pt-10 pb-8 border-t border-[rgba(0,0,0,0.12)]"></section>
                  </div>
                </div>
              ) : financialsResult ? (
                <div className="w-full">
                  <section className="w-full px-9 py-7">
                    <div className="pb-6 grid grid-cols-4 gap-x-15 border-b border-white">
                      {financialsResult?.knowledge_graph?.key_stats?.stats
                        .slice(0, 4)
                        .map((stat, index) => (
                          <div
                            key={index}
                            className="leading-140 w-68 flex flex-col"
                          >
                            <p className="text-main-text-gray pb-1">
                              {stat.label}
                            </p>
                            <p className="text-xl text-main-color-gb font-semibold">
                              {stat.value || "-"}
                            </p>
                          </div>
                        ))}
                    </div>

                    <div className="pt-6 grid grid-cols-4 gap-x-15 border-t border-[rgba(0,0,0,0.12)]">
                      {financialsResult?.knowledge_graph?.key_stats?.stats
                        .slice(4)
                        .map((stat, index) => (
                          <div
                            key={index}
                            className="leading-140 w-68 flex flex-col"
                          >
                            <p className="text-main-text-gray pb-1">
                              {stat.label}
                            </p>
                            <p className="text-xl text-main-color-gb font-semibold">
                              {stat.value || "-"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className="flex font-medium items-center whitespace-nowrap w-full px-10 py-7 border-t border-[rgba(0,0,0,0.12)]">
                    {/* Tags */}
                    <div className="flex space-x-3">
                      {financialsResult?.knowledge_graph?.key_stats?.tags?.map(
                        (tag, index) => (
                          <p
                            key={index}
                            className="py-1 px-3 border text-sm1 leading-140 text-main-text-gray border-main-text-gray rounded-full bg-white"
                          >
                            {tag.text}
                          </p>
                        )
                      )}
                    </div>
                    <p className="pl-6 text-main-text-gray">
                      CDP Climate Change Score:{" "}
                      {financialsResult?.knowledge_graph?.key_stats
                        ?.climate_change?.score || "N/A"}
                    </p>
                  </section>

                  <section className=" w-full px-10 pt-10 pb-8 border-t border-[rgba(0,0,0,0.12)]">
                    <div className="w-full mb-4 flex justify-start items-center space-x-2">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.99998 0C4.47717 0 0 4.47712 0 9.99998C0 15.5228 4.47717 20 9.99998 20C15.5229 20 20 15.5228 20 9.99998C20 4.47712 15.5229 0 9.99998 0ZM9.99998 18C5.58881 18 2.00001 14.4112 2.00001 9.99998C2.00001 5.58876 5.58876 2.00001 9.99998 2.00001C14.4112 2.00001 18 5.58876 18 9.99998C18 14.4112 14.4112 18 9.99998 18ZM11.2522 6C11.2522 6.72506 10.7243 7.25001 10.0101 7.25001C9.26713 7.25001 8.75217 6.72501 8.75217 5.98612C8.75217 5.27596 9.28106 4.75003 10.0101 4.75003C10.7243 4.75003 11.2522 5.27596 11.2522 6ZM9.0022 8.99999H11.0022V15H9.0022V8.99999Z"
                          fill="#009BAF"
                        />
                      </svg>
                      <h3 className="text-24px font-semibold ">About</h3>
                    </div>
                    <p className="text-main-color-gb font-medium leading-140"></p>

                    {financialsResult?.knowledge_graph?.about?.length > 0 && (
                      <div>
                        {financialsResult?.knowledge_graph.about[0]?.description
                          ?.snippet && (
                          <p className="text-main-color-gb font-medium leading-140 pb-6">
                            {
                              financialsResult.knowledge_graph.about[0]
                                .description?.snippet
                            }
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-5 gap-y-12">
                          {financialsResult.knowledge_graph.about[0].info?.map(
                            (item, index) => (
                              <div className="w-[250px]" key={index}>
                                <h5 className="text-main-text-gray  pb-1">
                                  {item.label}
                                </h5>
                                <p className="font-semibold text-main-color-gb">
                                  {item.link ? (
                                    <a
                                      className="hover:underline"
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.value || "-"}
                                    </a>
                                  ) : (
                                    <>{item.value || "-"}</>
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </section>

                  <section className=" w-full px-10 pt-10 pb-8 border-t border-[rgba(0,0,0,0.12)]">
                    <div className="w-full mb-4 flex justify-start items-center space-x-2">
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
                          d="M11 5C7.68629 5 5 7.68629 5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11C17 10.8361 16.9934 10.6736 16.9805 10.513L18.6937 8.79987C18.8932 9.49887 19 10.237 19 11C19 12.8488 18.3729 14.5511 17.3197 15.9058L21.0966 19.6828L19.6824 21.097L15.9055 17.32C14.5508 18.373 12.8486 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C12.898 3 14.6417 3.66099 16.0133 4.76535L14.5881 6.19062C13.5873 5.4428 12.3454 5 11 5Z"
                          fill="#009BAF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.851 7.30859L21.6915 2.79395L17.1768 3.63443L18.1605 4.61815L12.4146 10.3639L10.2933 8.24306L7 11.5363L8.41421 12.9505L10.2935 11.0712L12.4146 13.1923L19.5747 6.03234L20.851 7.30859Z"
                          fill="#009BAF"
                        />
                      </svg>
                      <h2 className="text-24px font-semibold ">Financials</h2>
                    </div>

                    {/* Income Statement */}
                    {financialsResult?.financials?.[0] && (
                      <FinancialStatement
                        title="Income Statement"
                        financialData={financialsResult.financials[0]}
                      />
                    )}

                    {/* Balance Sheet */}
                    {financialsResult?.financials?.[1] && (
                      <FinancialStatement
                        title="Balance Sheet"
                        financialData={financialsResult.financials[1]}
                      />
                    )}

                    {/* Cash Flow */}
                    {financialsResult?.financials?.[2] && (
                      <FinancialStatement
                        title="Cash Flow"
                        financialData={financialsResult.financials[2]}
                      />
                    )}
                  </section>

                  <section className=" w-full px-10 pt-10 pb-8 border-t border-[rgba(0,0,0,0.12)]">
                    <DiscoverMore data={financialsResult?.discover_more} />
                  </section>
                </div>
              ) : (
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
              )}
            </div>
          ) : (
            <CB_page_financials_InvestmentAndFinancing
              data={data}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </section>
    </div>
  );
};
export default CB_page_financials;
