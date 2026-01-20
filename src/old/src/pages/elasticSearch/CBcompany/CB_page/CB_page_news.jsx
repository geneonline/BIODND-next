import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Elastic_Loading from "@/pages/elasticSearch/widget/Elastic_Loading";

import noresults_icon from "@/assets/svg/database/noresults_icon.svg";
import noresults_news_icon from "@/assets/svg/database/finance/news_default.svg";

import NeedToPay from "@/parts/NeedToPay";

const effectApiBaseURL = import.meta.env.VITE_Effect_API;

// 計算新聞是多久以前發布
const TimeConverter = (utcDateString) => {
  if (!utcDateString) {
    return "";
  }

  // 解析 UTC 時間字串
  const utcDate = new Date(utcDateString);

  // 計算時間差
  const now = new Date();
  const diffInSeconds = Math.floor((now - utcDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`;
  }
};

const CB_page_news = () => {
  const { data, loading, error, userData } = useOutletContext();
  const [newsResult, setNewsResults] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false); // 新增狀態
  const [newsError, setNewsError] = useState(null); // 新增狀態
  const [currentPage, setCurrentPage] = useState(1); // 分頁
  const perPage = 10;

  // 獲取當前頁面的資料
  const getCurrentPageData = (data, currentPage) => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setNewsResults(null);
      return;
    }

    setNewsLoading(true); // 開始加載
    setNewsError(null); // 清除之前的錯誤

    axios
      .get(`${effectApiBaseURL}/api/SerpSearch/news`, {
        params: { q: searchQuery },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.news_results)) {
          // 對 news_results 按照 date 降序排序
          const sortedNews = response.data.news_results.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setNewsResults({ ...response.data, news_results: sortedNews });
        } else {
          setNewsResults(response.data);
        }
        setNewsLoading(false); // 加載完成
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setNewsError("no news results"); // 設置錯誤信息
        setNewsLoading(false); // 加載完成
      });
  };

  useEffect(() => {
    if (data.name) {
      handleSearch(data.name);
    } else {
      setNewsResults(null);
    }
  }, [data]);

  // const handleSearch = (nameQuery, legalNameQuery) => {
  //   if (
  //     (!nameQuery || !nameQuery.trim()) &&
  //     (!legalNameQuery || !legalNameQuery.trim())
  //   ) {
  //     setNewsResults(null);
  //     return;
  //   }

  //   setNewsLoading(true);
  //   setNewsError(null);

  //   // 準備搜尋請求，分別搜尋 data.name 以及 data.legal_name
  //   const searches = [];
  //   if (nameQuery && nameQuery.trim()) {
  //     searches.push(
  //       axios.get(`${effectApiBaseURL}/api/SerpSearch/news`, {
  //         params: {
  //           q: nameQuery,
  //         },
  //       })
  //     );
  //   }
  //   if (legalNameQuery && legalNameQuery.trim()) {
  //     searches.push(
  //       axios.get(`${effectApiBaseURL}/api/SerpSearch/news`, {
  //         params: {
  //           q: legalNameQuery,
  //         },
  //       })
  //     );
  //   }

  //   Promise.all(searches)
  //     .then((responses) => {
  //       let combinedResults = [];
  //       responses.forEach((response) => {
  //         if (response.data && Array.isArray(response.data.news_results)) {
  //           combinedResults = combinedResults.concat(
  //             response.data.news_results
  //           );
  //         }
  //       });

  //       // 過濾重複結果，這邊以 item.link 為唯一識別（根據實際資料可調整）
  //       const uniqueMap = new Map();
  //       combinedResults.forEach((item) => {
  //         if (item.link && !uniqueMap.has(item.link)) {
  //           uniqueMap.set(item.link, item);
  //         }
  //       });
  //       const uniqueResults = Array.from(uniqueMap.values());

  //       // 根據日期降序排序 (假設 date 為可轉換日期字串)
  //       uniqueResults.sort((a, b) => new Date(b.date) - new Date(a.date));

  //       setNewsResults({ news_results: uniqueResults });
  //       setNewsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setNewsError("no news results");
  //       setNewsLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   // 當 data 變更時，如果 data.name 或 data.legal_name 存在則進行搜尋
  //   if (data.name || data.legal_name) {
  //     handleSearch(data.name, data.legal_name);
  //   } else {
  //     setNewsResults(null);
  //   }
  // }, [data]);

  if (loading) {
    return <div className="text-center py-10">載入中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">錯誤: {error}</div>;
  }

  if (
    userData.subscriptionLevel == !"Pro" ||
    userData.subscriptionLevel == !"Test"
  ) {
    return <NeedToPay />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {/* 其他部分保持不變 */}
          <section className="w-full pb-10 flex flex-col bg-white border border-search-home-bg">
            {/* 省略部分代碼 */}
            <div className="w-full gap-x-12 pt-7 pb-6 border-b border-[rgba(0,0,0,0.12)] px-16">
              {/* 新增的新聞區塊 */}
              {newsLoading ? (
                <div className="text-center">
                  <Elastic_Loading />
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center py-2 border-b border-[rgba(0,0,0,0.12)]"
                    >
                      <div className="w-[100px] h-[70px] rounded-[5px] overflow-hidden shrink-0 border border-black"></div>
                      <div className="ml-5"></div>
                    </div>
                  ))}
                </div>
              ) : newsError ? (
                <div className="text-center text-red-500 py-10">
                  {newsError}
                </div>
              ) : newsResult &&
                newsResult.news_results &&
                Array.isArray(newsResult.news_results) &&
                newsResult.news_results.length > 0 ? (
                getCurrentPageData(newsResult.news_results, currentPage).map(
                  (item, index) => (
                    <div
                      key={item.position || index}
                      className="flex items-center py-2 border-b border-[rgba(0,0,0,0.12)]"
                    >
                      <div className="w-[100px] h-[70px] rounded-[5px] overflow-hidden shrink-0 border border-black">
                        <img
                          src={item?.thumbnail || noresults_news_icon}
                          alt={item?.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.onerror = null; // 防止死循環
                            e.target.src = noresults_news_icon; // 設置為替代圖片
                          }}
                        />
                      </div>
                      <div className="ml-5">
                        <Link
                          to={item?.link}
                          target="_blank"
                          rel="noopener"
                          className="block"
                        >
                          <h3 className="font-semibold text-main-text-gray text-lg underline">
                            {item?.title}
                          </h3>
                        </Link>
                        <div className="mt-2 flex items-center">
                          <p className="text-main-color-gb">
                            {item?.source?.name}
                          </p>
                          <p className="ml-3 text-main-text-gray text-sm">
                            {TimeConverter(item?.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                //no news results
                <div className="">
                  <div className="flex items-center ">
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
                </div>
              )}
            </div>

            <div className="mt-5 self-end px-16">
              {/* 只有有新聞結果時顯示分頁 */}
              {newsResult &&
                newsResult.news_results &&
                Array.isArray(newsResult.news_results) &&
                newsResult.news_results.length > 0 && (
                  <Pagination
                    total={newsResult.news_results.length}
                    perPage={perPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// 分頁
const Pagination = ({ total, perPage, currentPage, onPageChange, label }) => {
  const totalPages = Math.ceil(total / perPage);
  const groupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const totalGroups = Math.ceil(totalPages / groupSize);

  const getPageRange = () => {
    const start = currentGroup * groupSize + 1;
    const end = Math.min(start + groupSize - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-7 h-7 border border-main-text-gray rounded-[2px] flex justify-center items-center mr-3 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-main-text-gray"
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {currentGroup > 0 && (
        <button
          onClick={() =>
            onPageChange((currentGroup - 1) * groupSize + groupSize)
          }
          className="w-7 h-7 border border-main-text-gray rounded-[2px] hover:bg-gray-50"
        >
          ...
        </button>
      )}

      {getPageRange().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-7 h-7 border rounded-[2px] text-sm ${
            currentPage === pageNum
              ? "bg-main-color-gb text-white border-main-color-gb"
              : "bg-white hover:bg-gray-50 border-main-text-gray"
          }`}
        >
          {pageNum}
        </button>
      ))}

      {currentGroup < totalGroups - 1 && (
        <button
          onClick={() => onPageChange((currentGroup + 1) * groupSize + 1)}
          className="w-7 h-7 border border-main-text-gray rounded-[2px] hover:bg-gray-50"
        >
          ...
        </button>
      )}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`w-7 h-7 border border-main-text-gray rounded-[2px] flex justify-center items-center ml-3 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-main-text-gray"
        }`}
      >
        <ChevronRight size={24} />
      </button>

      <span className="ml-8 text-sm text-gray-600">
        Showing {(currentPage - 1) * perPage + 1} -{" "}
        {Math.min(currentPage * perPage, total)} of {total}
      </span>
    </div>
  );
};

export default CB_page_news;
