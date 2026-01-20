import { useState, useMemo, useEffect, useRef } from "react";

const formatValue = (value) => {
  // 檢查是否為百分比
  if (value.endsWith("%")) {
    return value; // 如果是百分比，直接返回
  }

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

const FinancialStatement = ({ title, financialData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Quarterly");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize selectedDate when financialData changes
  useEffect(() => {
    if (!financialData) return;

    const dates = financialData.results
      .filter((f) => f.period_type === selectedPeriod)
      .map((r) => r.date);

    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
    setIsLoading(false);
  }, [financialData, selectedPeriod]);

  // Compute available dates based on selectedPeriod
  const availableDates = useMemo(() => {
    if (!financialData) return [];
    return financialData.results
      .filter((f) => f.period_type === selectedPeriod)
      .map((r) => r.date);
  }, [financialData, selectedPeriod]);

  // Compute filtered financial data based on selectedDate and selectedPeriod
  const filteredFinancials = useMemo(() => {
    if (!financialData) return [];
    const selectedResult = financialData.results.find(
      (r) => r.date === selectedDate && r.period_type === selectedPeriod
    );
    return selectedResult?.table || [];
  }, [financialData, selectedPeriod, selectedDate]);

  // Handle period change
  const handlePeriodChange = (period) => {
    setIsLoading(true);
    setSelectedPeriod(period);
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white mb-6 pb-9 drop-shadow-gray-solid">
      <h3 className="pt-8 px-10 text-main-color-gb text-24px font-semibold mb-4">
        {title}
      </h3>

      <div className="px-10 flex justify-between">
        {/* Period Type Switch */}
        <div className="w-fit flex items-center mb-4 p-1 space-x-1 rounded-10px bg-sub-color">
          <button
            className={`w-72 py-1.5 text-xl font-semibold rounded-10px ${
              selectedPeriod === "Quarterly"
                ? "bg-white text-sub-color"
                : "bg-sub-color text-white"
            }`}
            onClick={() => handlePeriodChange("Quarterly")}
          >
            Quarterly
          </button>
          <button
            className={`w-72 py-1.5 text-xl font-semibold rounded-10px ${
              selectedPeriod === "Annual"
                ? "bg-white text-sub-color"
                : "bg-sub-color text-white"
            }`}
            onClick={() => handlePeriodChange("Annual")}
          >
            Annual
          </button>
        </div>

        {/* Custom Date Dropdown */}
        <div
          className="relative flex items-center mb-5 font-semibold"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="border border-main-text-gray text-main-text-gray rounded-md pl-6 pr-4 py-2 focus:border-sub-color focus:ring-sub-color flex items-center justify-between"
          >
            <span>{selectedDate || "Select Date"}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isDropdownOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul className="absolute top-full left-0 right-0 bg-white rounded-10px mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              {availableDates.map((date, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedDate(date);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 pt-3 pb-2 border-b border-[rgba(0,0,0,0.08)] cursor-pointer text-center hover:bg-gray-200 ${
                    date === selectedDate
                      ? "text-main-color-gb"
                      : "text-main-text-gray"
                  }`}
                >
                  {date}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Financial Data Table */}
      {isLoading ? (
        <p className="px-10">Loading...</p>
      ) : (
        <div className="">
          {filteredFinancials.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-sm1 font-medium text-main-text-gray border-b border-[rgba(0,0,0,0.08)]">
                  <th className="pl-10 py-2 text-left">{"(USD)"}</th>
                  <th className="py-2 text-right">{selectedDate}</th>
                  <th className="pr-10 py-2 text-right">Y/Y change</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinancials.map((item, index) => {
                  // Attempt to parse the change value to a number
                  const changeValue = parseFloat(item.change);
                  const isPositive = changeValue > 0;
                  const isNegative = changeValue < 0;
                  const isValidNumber = !isNaN(changeValue);

                  // Format the change value
                  const formattedChange = isValidNumber
                    ? isNegative
                      ? Math.abs(changeValue)
                      : changeValue
                    : null;

                  return (
                    <tr
                      key={index}
                      className="text-xl font-semibold even:bg-finance-tabble-even first:py-4"
                    >
                      <td className="pl-10 py-2 w-[350px] text-left text-base text-main-text-gray">
                        {item.title}
                      </td>
                      <td className="py-2 w-[250px] text-right">
                        {formatValue(item.value)}
                      </td>
                      <td className="pr-10 py-2 text-right">
                        {/* Conditional Rendering for Change */}
                        {isValidNumber ? (
                          <span
                            className={`flex items-center justify-end ${
                              isPositive
                                ? "text-finance-gainer"
                                : isNegative
                                ? "text-warning"
                                : "text-main-text-gray"
                            }`}
                          >
                            {/* Display Arrow Based on Change */}
                            {isPositive && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                style={{
                                  WebkitFlexGrow: "0",
                                  MsFlexGrow: "0",
                                  flexGrow: "0",
                                  WebkitFlexShrink: "0",
                                  MsFlexShrink: "0",
                                  flexShrink: "0",
                                  width: 24,
                                  height: 24,
                                  position: "relative",
                                  rotate: `90 deg`,
                                }}
                              >
                                <path
                                  fill="#00AB5E"
                                  d="M20.905 13.175l-7.779-8.964a.749.749 0 00-1.132 0l-7.776 8.964a.187.187 0 00.14.31h1.899a.38.38 0 00.283-.13l5.13-5.912V20.64a.19.19 0 00.188.188h1.407a.188.188 0 00.187-.188V7.443l5.13 5.913c.07.082.174.129.284.129h1.899a.187.187 0 00.14-.31z"
                                ></path>
                              </svg>
                            )}
                            {isNegative && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                style={{
                                  WebkitFlexGrow: "0",
                                  MsFlexGrow: "0",
                                  flexGrow: "0",
                                  WebkitFlexShrink: "0",
                                  MsFlexShrink: "0",
                                  flexShrink: "0",
                                  width: 24,
                                  height: 24,
                                  position: "relative",
                                  rotate: `180deg`,
                                }}
                              >
                                <path
                                  fill="#D30000"
                                  d="M20.905 13.175l-7.779-8.964a.749.749 0 00-1.132 0l-7.776 8.964a.187.187 0 00.14.31h1.899a.38.38 0 00.283-.13l5.13-5.912V20.64a.19.19 0 00.188.188h1.407a.188.188 0 00.187-.188V7.443l5.13 5.913c.07.082.174.129.284.129h1.899a.187.187 0 00.14-.31z"
                                ></path>
                              </svg>
                            )}
                            {/* Display the Change Value with Percentage */}
                            {formattedChange}%
                          </span>
                        ) : (
                          // Display "-" when changeValue is not a valid number
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No data available for the selected period and date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialStatement;
