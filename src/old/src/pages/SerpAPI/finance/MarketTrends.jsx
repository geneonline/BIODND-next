// MarketTrends.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FinanceArrowSVG from "@/widgets/database/finance/FinanceArrowSVG";

import deletesearch_icon from "@/assets/svg/database/deletesearch_icon.svg";
import search_icon from "@/assets/svg/database/search_icon.svg";
import finance_loading from "@/assets/webp/search/financepage_loading.webp";

import {
  MostActiveIcon,
  GainersIcon,
  LosersIcon,
} from "@/pages/SerpAPI/finance/marketTrends_icons";

// 防抖函數
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// 高亮匹配函數
const highlightMatch = (text, highlight) => {
  if (!highlight) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <strong key={index} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const trendDescriptions = {
  "most-active":
    "The stocks or funds with the highest trading volume (in shares) during the current trading session",
  gainers:
    "The top gaining stocks or funds (by percent change) during the current trading session",
  losers:
    "The top losing stocks or funds (by percent change) during the current trading session",
};

const MarketTrends = () => {
  const [trend, setTrend] = useState("most-active"); // 初始趨勢
  const [initialResults, setInitialResults] = useState(null); // 市場趨勢資料
  const [query, setQuery] = useState(""); // 搜尋輸入
  const [autocompleteResults, setAutocompleteResults] = useState([]); // 自動完成建議
  const [loading, setLoading] = useState(false); // 載入狀態
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300); // 防抖，延遲 300ms

  // Fetch initial market trends based on trend
  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();

    const fetchMarketTrends = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://serpapi.biodnd.com/search.json?engine=google_finance_markets&trend=${trend}&h1=en`,
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        setInitialResults(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Market trends fetch canceled");
        } else {
          console.error("Error fetching market trends:", error);
          setLoading(false);
        }
      }
    };

    fetchMarketTrends();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [trend]);

  // Fetch autocomplete suggestions when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setAutocompleteResults([]);
      return;
    }

    let cancelTokenSource = axios.CancelToken.source();

    const fetchAutocomplete = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://serpapi.biodnd.com/search.json?engine=google_finance&q=${debouncedQuery}`,
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        // 假設 response.data.futures_chain 是搜尋建議
        setAutocompleteResults(response.data.futures_chain || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        if (axios.isCancel(error)) {
          console.log("Autocomplete fetch canceled");
        } else {
          console.error("Error fetching autocomplete data:", error);
        }
      }
    };

    fetchAutocomplete();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [debouncedQuery]);

  // Handle search when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setInitialResults(null);
      setAutocompleteResults([]);
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}:3001/search.json`, {
        params: {
          engine: "google_finance",
          query: searchQuery,
          h1: "en",
        },
      })
      .then((response) => {
        setInitialResults(response.data);
        setAutocompleteResults([]); // 清空搜尋建議
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching search data:", error);
        setLoading(false);
      });
  };

  const renderTrendButtons = () => {
    // 定義每個趨勢對應的圖示組件
    const trendIcons = {
      "most-active": MostActiveIcon,
      gainers: GainersIcon,
      losers: LosersIcon,
    };

    return (
      <div className="w-full flex">
        {["most-active", "gainers", "losers"].map((item) => {
          const IconComponent = trendIcons[item];
          const isActive = trend === item;

          return (
            <button
              key={item}
              className={`w-1/3 py-5 flex items-center justify-center space-x-2 leading-140 text-30px font-semibold border-b-[7px]  ${
                isActive
                  ? " text-main-color-gb cursor-default border-main-color-gb"
                  : " text-main-text-gray border-[rgba(0,0,0,0.16)]"
              }`}
              onClick={() => setTrend(item)}
              disabled={isActive} // 禁用當前活動按鈕
            >
              {/* 渲染對應的圖示，並根據狀態更改顏色 */}
              <IconComponent
                className={`w-9 h-9 ${
                  isActive ? "text-main-color-gb" : "text-main-text-gray"
                }`}
              />
              {/* 按鈕文本 */}
              <span>
                {item
                  .replace("-", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-15 xl:mt-19 w-full relative finance-bg">
      {/* Loading Screen */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="flex justify-between w-[135px] h-[50px]">
            <div className="w-7 h-7 bg-white rounded-full animate-bounce1"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce2"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce3"></div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="py-4 pl-30 pr-18 flex justify-between items-center bg-main-color">
        <h1 className="text-32px font-semibold text-white">
          Explore market trends
        </h1>
        {/* Search bar */}
        <div className="relative w-[451px]">
          <input
            className="w-full placeholder:text-search-home-placeholder text-main-text-gray hover:bg-search-home-bg hover:focus:bg-white
            rounded-full py-3 pl-13 pr-7 text-xl
            border-main-color border-4 focus:ring-0 focus:border-main-color
            "
            type="text"
            placeholder={"Search..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="w-fit h-fit py-2 absolute left-7 top-1/2 -translate-y-1/2">
            <img className="" src={search_icon} alt="search icon" />
          </div>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-fit h-fit absolute right-6 top-1/2 -translate-y-1/2"
            >
              <img
                className=""
                src={deletesearch_icon}
                alt="search delete icon"
              />
            </button>
          )}

          {/* 自動完成建議 */}
          {autocompleteResults.length > 0 && (
            <div className="absolute bg-white rounded-10px mt-2 w-full z-10 shadow-finance-autocomplete">
              <p className="pt-6 pl-9 pb-4 text-xl font-semibold leading-140 text-main-color-gb">
                About these suggestions
              </p>
              {autocompleteResults.map((item, index) => (
                <Link
                  to={`/financepage/${item.stock}`}
                  key={index}
                  className="px-9 py-3 flex items-center justify-between hover:bg-finance-search-hover border-b border-[rgba(0,0,0,0.12)] cursor-pointer "
                >
                  <div className="flex flex-col text-main-text-gray">
                    <p className="font-semibold">
                      {highlightMatch(item.date, query)}
                    </p>
                    <p className="text-sm1 font-medium">
                      {highlightMatch(item.stock.split(":")[0], query)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-fit text-base font-semibold px-4 border-r-2 border-search-home-placeholder ">
                      {item.price}
                    </p>

                    <p
                      className={`w-21 ml-2 flex justify-end text-base font-semibold text-right ${
                        item.price_movement.movement === "Up"
                          ? "text-finance-gainer"
                          : "text-warning"
                      }`}
                    >
                      <span className="w-15">
                        {item.price_movement.percentage}%
                      </span>
                      {item.price_movement.movement === "Up" ? (
                        <FinanceArrowSVG color="#00AB5E" />
                      ) : (
                        <FinanceArrowSVG color="#D30000" rotate="180" />
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trend Description */}
      <div className="w-full px-30 mt-6">
        <p className="px-15 text-sm1 font-medium leading-140 text-main-text-gray">
          {trendDescriptions[trend]}
        </p>
      </div>

      {/* Market Trends Section */}
      <div className="w-full pt-7.5 px-30">
        <div className="flex justify-between items-center mb-6">
          {renderTrendButtons()}
        </div>
        <p className="px-15 text-sm1 font-medium leading-140 text-main-text-gray">
          {trendDescriptions[trend]}
        </p>
        <div className="bg-white py-6 px-10 drop-shadow-gray-solid">
          {initialResults?.market_trends?.[0]?.results ? (
            initialResults.market_trends[0].results.map((item, index) => (
              <Link
                to={`/financepage/${item.stock}`}
                className="px-9 py-3 flex justify-between items-center even:bg-finance-tabble-even hover:bg-gray-100 transition"
                key={index}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-[90px] py-0.5 bg-main-color-gb text-white text-center rounded-5px">
                    {item.stock.split(":")[0]}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-main-text-gray">
                      {item.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-base font-semibold ">{item.price}</p>
                  <p
                    className={`text-base font-semibold flex items-center ${
                      item.price_movement.movement === "Up"
                        ? "text-finance-gainer"
                        : "text-warning"
                    }`}
                  >
                    <span className="mr-1">
                      {item.price_movement.percentage}%
                    </span>
                    {item.price_movement.movement === "Up" ? (
                      <FinanceArrowSVG color="#00AB5E" />
                    ) : (
                      <FinanceArrowSVG color="#D30000" rotate="180" />
                    )}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>No initial results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
