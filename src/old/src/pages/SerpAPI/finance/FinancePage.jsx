// FinancePage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FinancialStatement from "./FinancialStatement"; // Import the new component
import DiscoverMore from "./DiscoverMore"; // Import the DiscoverMore component
import NewsSection from "./NewsSection";

import deletesearch_icon from "@/assets/svg/database/deletesearch_icon.svg";
import search_icon from "@/assets/svg/database/search_icon.svg";
import FinanceArrowSVG from "@/widgets/database/finance/FinanceArrowSVG";
import finance_loading from "@/assets/webp/search/financepage_loading.webp";

// 防抖函數
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const FinancePage = () => {
  const { page_query } = useParams();
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for data fetch
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300); // 防抖，延遲 300ms

  // 輔助函數：將匹配的部分加粗
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index} className="font-bold text-black">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // Fetch initial data based on page_query
  useEffect(() => {
    if (page_query) {
      handleSearch(page_query);
    }
  }, [page_query]);

  // Fetch autocomplete suggestions when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setAutocompleteResults([]);
      return;
    }

    let cancelTokenSource = axios.CancelToken.source();

    const fetchAutocomplete = async () => {
      try {
        const response = await axios.get(
          `https://serpapi.biodnd.com/search.json?engine=google_finance&q=${debouncedQuery}`,
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        // 假設 response.data.futures_chain 是搜尋建議
        setAutocompleteResults(response.data.futures_chain || []);
      } catch (error) {
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
      if (autocompleteResults.length > 0) {
        // 導航到第一個建議的頁面
        navigate(`/financepage/${autocompleteResults[0].stock}`);
      } else {
        handleSearch(query);
      }
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Start loading
    axios
      .get(
        `https://serpapi.biodnd.com/search.json?engine=google_finance&q=${searchQuery}`
      )
      .then((response) => {
        setResult(response.data);
        setIsLoading(false); // Data fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Stop loading on error
      });
  };

  if (isLoading) {
    return (
      <div className="mt-15 xl:mt-19 w-full relative bg-finance-bg overflow-hidden">
        {/* Loading Screen */}
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="flex justify-between w-[135px] h-[50px]">
            <div className="w-7 h-7 bg-white rounded-full animate-bounce1"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce2"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce3"></div>
          </div>
        </div>

        <img className=" w-full scale-105" src={finance_loading} alt="" />
      </div>
    );
  }

  return (
    <div className="mt-15 xl:mt-19 w-full relative bg-finance-bg">
      <div className="py-4 pl-30 pr-18 flex justify-between">
        <h1 className="text-32px font-semibold">
          {result?.summary?.title || "No Title"}
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
            <div className="absolute bg-white mt-2 w-[792px] z-10 right-0 shadow-finance-autocomplete">
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

      <div className="px-30 bg-main-color text-white flex flex-col">
        <div className=" grid grid-cols-4 gap-x-15 border-b border-white">
          {result?.knowledge_graph?.key_stats?.stats
            .slice(0, 4)
            .map((stat, index) => (
              <div key={index} className="py-5 w-68 flex flex-col">
                <p className="text-xl font-medium pb-1">{stat.label}</p>
                <p className="text-30px font-semibold">{stat.value || "-"}</p>
              </div>
            ))}
        </div>
        <div className=" grid grid-cols-4 gap-x-15 ">
          {result?.knowledge_graph?.key_stats?.stats
            .slice(4)
            .map((stat, index) => (
              <div key={index} className="py-5 w-68 flex flex-col">
                <p className="text-xl font-medium pb-1">{stat.label}</p>
                <p className="text-30px font-semibold">{stat.value || "-"}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="flex">
        {/* Left side */}
        <div className="w-[449px] pl-30 pt-6 pr-12 bg-white flex flex-col">
          {result?.knowledge_graph?.about?.length > 0 ? (
            <div>
              <h4 className="text-24px font-semibold pb-5">About</h4>
              <p className="text-base text-main-text-gray">
                {result.knowledge_graph.about[0].description?.snippet ||
                  "No description available."}
              </p>

              <div className="space-y-5 my-10">
                {result.knowledge_graph.about[0].info?.map((item, index) => (
                  <div key={index}>
                    <h4 className="text-24px font-semibold pb-2">
                      {item.label}
                    </h4>
                    <p className="text-base text-main-text-gray">
                      {item.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base text-main-text-gray">
              No about information available.
            </p>
          )}
        </div>

        {/* Right side */}
        <div className="pt-8 pl-6 pr-18 flex-1">
          {/* Top Section */}
          <div className="flex font-medium items-center whitespace-nowrap mb-6">
            {/* Tags */}
            <div className="flex space-x-3">
              {result?.knowledge_graph?.key_stats?.tags?.map((tag, index) => (
                <p
                  key={index}
                  className="py-1 px-3 border border-black rounded-full bg-white"
                >
                  {tag.text}
                </p>
              ))}
            </div>
            <p className="pl-9">
              CDP Climate Change Score:{" "}
              {result?.knowledge_graph?.key_stats?.climate_change?.score ||
                "N/A"}
            </p>
          </div>

          {/* News Section */}
          <NewsSection newsResults={result?.news_results} />

          {/* Financials Section */}
          <div>
            <h2 className="text-24px font-semibold mb-4">Financials</h2>

            {/* Income Statement */}
            {result?.financials?.[0] && (
              <FinancialStatement
                title="Income Statement"
                financialData={result.financials[0]}
              />
            )}

            {/* Balance Sheet */}
            {result?.financials?.[1] && (
              <FinancialStatement
                title="Balance Sheet"
                financialData={result.financials[1]}
              />
            )}

            {/* Cash Flow */}
            {result?.financials?.[2] && (
              <FinancialStatement
                title="Cash Flow"
                financialData={result.financials[2]}
              />
            )}
          </div>

          {/* Discover more */}
          <div className="mt-10 w-full">
            <DiscoverMore data={result?.discover_more} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
