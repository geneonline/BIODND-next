import { useRefinementList } from "react-instantsearch";
import React, { useEffect, useRef, useState } from "react";

const CB_home_searchTags = () => {
  // 使用 useRefinementList 取得已勾選的項目
  const { items, refine } = useRefinementList({
    attribute: "industries.value.keyword",
    limit: 50,
  });

  // 篩選出已勾選的項目
  const refinedItems = items.filter((item) => item.isRefined);

  // 控制顯示邏輯
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const [isMultiLine, setIsMultiLine] = useState(false);

  // 檢查換行邏輯
  useEffect(() => {
    const checkLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const lines = new Set();

      children.forEach((child) => {
        lines.add(child.offsetTop);
      });

      setIsMultiLine(lines.size > 1); // 判斷是否多於一行
    };

    checkLines();
    window.addEventListener("resize", checkLines);

    return () => window.removeEventListener("resize", checkLines);
  }, [refinedItems]);

  return (
    <div>
      {refinedItems.length > 0 && (
        <div className="bg-white border-b border-search-home-placeholder py-6 pl-15 pr-12 rounded shadow flex items-start">
          <h3 className="pr-6 text-xl font-semibold leading-140 whitespace-nowrap">{`Select ${refinedItems.length} conditions`}</h3>
          <div
            ref={containerRef}
            className={`flex flex-wrap gap-2 overflow-hidden transition-all ${
              isExpanded ? "max-h-full" : "max-h-9"
            }`}
          >
            {refinedItems.map((item) => (
              <div
                key={item.value}
                className="flex items-center gap-3 px-4 py-1.5 rounded-full text-base text-main-color-gb border border-main-color-gb"
              >
                <span>{item.label}</span>
                {/* 叉叉按鈕，點擊後取消勾選 */}
                <button
                  onClick={() => refine(item.value)}
                  className=" text-main-text-gray hover:text-main-color-gb focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* 展開/收縮按鈕 */}
          {isMultiLine && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className=" focus:outline-none"
            >
              <div
                className={`transition-transform w-6 h-6 ${
                  isExpanded ? "-rotate-90" : "rotate-90"
                }`}
              >
                <svg
                  className={``}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CB_home_searchTags;
