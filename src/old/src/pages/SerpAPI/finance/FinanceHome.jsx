import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import search_icon from "@/assets/svg/database/search_icon.svg";

import deletesearch_icon from "@/assets/svg/database/deletesearch_icon.svg";

import noresults_img from "@/assets/webp/search/no_results.webp";
import FinanceArrowSVG from "@/widgets/database/finance/FinanceArrowSVG";

import noresults_icon from "@/assets/svg/database/noresults_icon.svg";
import doyoumean_icon from "@/assets/svg/database/finance/search_icon.svg";

// 防抖函數
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const FinanceHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trend, setTrend] = useState("most-active"); // 新增趨勢狀態
  const [initialResults, setInitialResults] = useState(null); // 初始結果
  const [query, setQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300); // 防抖，延遲 300ms

  // 輔助函數：將匹配的部分加粗
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Fetch initial data based on trend
  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();

    axios
      .get(
        `https://serpapi.biodnd.com/search.json?engine=google_finance_markets&trend=${trend}&h1=en`,
        {
          cancelToken: cancelTokenSource.token,
        }
      )
      .then((response) => {
        setInitialResults(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Initial data fetch canceled");
        } else {
          console.error("Error fetching initial data:", error);
        }
      });

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
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      return;
    }

    axios
      .get(
        `https://serpapi.biodnd.com/search.json?engine=google_finance&q=${searchQuery}`
      )
      .then((response) => {
        setSearchResults(response.data);
        setAutocompleteResults([]); // 清空搜尋建議
      })
      .catch((error) => {
        console.error("Error fetching search data:", error);
      });
  };

  // Handle navigation when searchResults 更新
  useEffect(() => {
    if (searchResults?.financials) {
      navigate(`/financepage/${searchResults.search_parameters.q}`);
    }
  }, [searchResults, navigate]);

  // 渲染趨勢切換按鈕
  const renderTrendButtons = () => (
    <div className="flex space-x-4">
      {["most-active", "gainers", "losers"].map((item) => (
        <button
          key={item}
          className={`px-5 py-1 leading-140 rounded-full border-2 border-main-color-gb ${
            trend === item
              ? "bg-main-color-gb text-white cursor-default"
              : "bg-finance-btn-bg text-main-color-gb hover:bg-gray-300"
          }`}
          onClick={() => setTrend(item)}
        >
          {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-15 xl:mt-19 w-full relative finance-bg">
      {/* Loading Screen */}
      {/* {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="flex justify-between w-[135px] h-[50px]">
            <div className="w-7 h-7 bg-white rounded-full animate-bounce1"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce2"></div>
            <div className="w-7 h-7 bg-white rounded-full animate-bounce3"></div>
          </div>
        </div>
      )} */}

      {/* search section */}
      <div className="pt-30 pb-52 pl-36 pr-[588px] w-full bg-finance-search-bg bg-cover bg-center">
        <div className="flex flex-col">
          <h1 className="w-[750px] font-bold text-white text-5xl pb-7 leading-120">
            Search by company name,
            <br />
            ETF or fund name,ticker symbol
          </h1>
          <div className="mb-5 relative w-[708px]">
            <input
              className=" w-full placeholder:text-search-home-placeholder text-main-text-gray hover:bg-search-home-bg hover:focus:bg-white
    rounded-full py-4 pl-13 pr-7 text-xl
    border-search-color border-4 focus:ring-0 focus:border-search-color
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
                        {highlightMatch(item.stock, query)}
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
          <div className="flex space-x-3 opacity-70">
            <p className="border border-white text-sm1 py-1 px-4 text-white bg-main-color-gb">
              PFIZER
            </p>
            <p className="border border-white text-sm1 py-1 px-4 text-white bg-main-color-gb">
              Astra Zeneca
            </p>
            <p className="border border-white text-sm1 py-1 px-4 text-white bg-main-color-gb">
              MRK
            </p>
            <p className="border border-white text-sm1 py-1 px-4 text-white bg-main-color-gb">
              ADIMMUNE
            </p>
          </div>
        </div>
      </div>

      {/* 渲染結果 */}
      {searchResults ? (
        searchResults?.futures_chain ? (
          <div className="w-fit mx-auto mt-14 mb-[92px]">
            <div className="flex mb-6">
              <img className="pr-3" src={doyoumean_icon} alt="" />
              <h2 className="text-main-color-gb text-4xl font-bold ">
                Did you mean?
              </h2>
            </div>
            <div className="w-[1152px] py-3">
              {searchResults.futures_chain.map((item, index) => (
                <Link
                  to={`/financepage/${item.stock}`}
                  className="px-15 py-3 border-t first:border-0 hover:bg-finance-search-hover flex justify-between space-x-2 "
                  key={index}
                >
                  <div className="flex">
                    <p className="w-[90px] py-0.5 bg-main-color-gb text-white text-center rounded-5px mr-4">
                      {item.stock.split(":")[0]}
                    </p>
                    <p className="text-main-text-gray font-semibold leading-140">
                      {item.date}
                    </p>
                  </div>

                  <div className="flex items-center leading-140">
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
          </div>
        ) : (
          <div className="w-fit mx-auto mt-14 mb-[92px]">
            <div className="flex  mb-18">
              <img className="pr-3" src={noresults_icon} alt="" />
              <h2 className="text-main-color-gb text-4xl font-bold">
                We couldn’t find any match for your search.
              </h2>
            </div>
            <div className="w-[1152px] flex justify-center">
              <img src={noresults_img} alt="" />
            </div>
          </div>
        )
      ) : initialResults ? (
        <div className="w-full pt-96 relative">
          <div className="w-full absolute -top-[155px]">
            <div className="w-[1152px] bg-white mx-auto shadow-finance-autocomplete">
              <div className="pt-6 pb-4 px-15 flex justify-between items-center border-b-3px border-[rgba(0,0,0,0.25)]">
                <h2 className="text-main-text-gray text-30px font-semibold leading-140">
                  Market trends
                </h2>
                {renderTrendButtons()}
              </div>

              {initialResults.market_trends[0]?.results ? (
                <div>
                  <div className="py-5">
                    {initialResults.market_trends[0].results
                      .slice(0, 6)
                      .map((item, index) => (
                        <Link
                          to={`/financepage/${item.stock}`}
                          className="px-15 py-2 border-t first:border-0 hover:bg-finance-search-hover flex justify-between space-x-2 "
                          key={index}
                        >
                          <div className="flex">
                            <p className="w-[90px] py-0.5 bg-main-color-gb text-white text-center rounded-5px mr-4">
                              {item.stock.split(":")[0]}
                            </p>
                            <p className="text-main-text-gray font-semibold leading-140">
                              {item.name}
                            </p>
                          </div>

                          <div className="flex items-center leading-140">
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
                  <Link
                    to="/financemarkettrends"
                    className=" w-full px-15 pt-3 pb-4 border-t border-[rgba(0,0,0,0.25)] flex justify-end items-center text-right font-semibold text-main-text-gray space-x-1"
                  >
                    <span>More</span>{" "}
                    <FinanceArrowSVG color="#69747F" rotate="90" />
                  </Link>
                </div>
              ) : (
                <div>No initial results found</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default FinanceHome;
