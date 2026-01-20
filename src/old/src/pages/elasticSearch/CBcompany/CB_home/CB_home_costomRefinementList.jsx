// CB_home_costomRefinementList.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useRefinementList } from "react-instantsearch";
import industriesData from "@/data/database/elastic/CB_industries.json"; // 根據實際路徑調整
import classNames from "classnames";

const CB_home_costomRefinementList = ({ setIsRefinementListChecked }) => {
  const { items, refine } = useRefinementList({
    attribute: "industries.value.keyword",
    limit: 50,
  });

  // 建立子項目到父項目的映射，並使用 useMemo 以避免每次渲染都重新創建
  const childToParentMap = useMemo(() => {
    const map = {};
    Object.entries(industriesData).forEach(([parent, children]) => {
      children.forEach((child) => {
        map[child] = parent;
      });
    });
    return map;
  }, []);

  // 將 items 按照父項目分組，並使用 useMemo
  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const parent = childToParentMap[item.label];
      if (parent) {
        if (!groups[parent]) {
          groups[parent] = [];
        }
        groups[parent].push(item);
      }
    });
    return groups;
  }, [items, childToParentMap]);

  const [expandedParents, setExpandedParents] = useState({});

  // 初始化所有父項目為收縮狀態
  useEffect(() => {
    const initialExpanded = {};
    Object.keys(industriesData).forEach((parent) => {
      initialExpanded[parent] = false;
    });
    setExpandedParents(initialExpanded);
  }, []);

  // 偵測勾選狀態並更新 setState
  useEffect(() => {
    const hasRefinedItems = items.some((item) => item.isRefined);
    setIsRefinementListChecked(hasRefinedItems);
  }, [items, setIsRefinementListChecked]);

  // 建立 refs 用於設定 indeterminate 狀態
  const parentRefs = useRef({});

  useEffect(() => {
    Object.entries(groupedItems).forEach(([parent, children]) => {
      const allRefined = children.every((child) => child.isRefined);
      const someRefined = children.some((child) => child.isRefined);

      if (parentRefs.current[parent]) {
        parentRefs.current[parent].indeterminate = someRefined && !allRefined;
      }
    });
  }, [groupedItems]);

  // 處理父項目的 checkbox 變更
  const handleParentChange = (parent, children) => {
    const allRefined = children.every((child) => child.isRefined);
    if (allRefined) {
      // 取消選擇所有子項目
      children.forEach((child) => refine(child.value));
    } else {
      // 選擇所有子項目
      children.forEach((child) => {
        if (!child.isRefined) {
          refine(child.value);
        }
      });
    }
  };

  // 處理父項目的展開/收縮
  const toggleParent = (parent) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parent]: !prev[parent],
    }));
  };

  // 處理清空所有選項
  const clearAll = () => {
    items
      .filter((item) => item.isRefined) // 篩選出已勾選的項目
      .forEach((item) => refine(item.value)); // 取消勾選每個項目
  };

  return (
    <>
      <div className="items-center flex py-6 pl-9 pr-12 border-b border-search-home-placeholder">
        <h3 className="whitespace-nowrap text-24px font-semibold leading-140 mr-10">
          Industry category
        </h3>

        <button
          onClick={clearAll}
          className="text-main-color-gb leading-140 font-semibold underline whitespace-nowrap"
        >
          Clear all
        </button>
      </div>

      <div>
        <ul className="w-full pl-9 pr-12 pt-5 pb-30 space-y-7">
          {Object.entries(groupedItems).map(([parent, children]) => {
            // 確定父項目的 checkbox 狀態
            const allRefined = children.every((child) => child.isRefined);
            const someRefined = children.some((child) => child.isRefined);

            return (
              <li key={parent} className="mb-2">
                {/* 父項目 */}
                <div className="flex items-start justify-start cursor-pointer">
                  <div>
                    <input
                      type="checkbox"
                      ref={(el) => (parentRefs.current[parent] = el)}
                      className="w-6 h-6 border-main-text-gray border-2 text-main-text-gray peer checked:text-main-color-gb focus:ring-0 mr-3 rounded"
                      checked={allRefined}
                      onChange={() => handleParentChange(parent, children)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleParent(parent)}
                    className="w-full flex justify-between items-start focus:outline-none"
                  >
                    <span className="font-semibold leading-140 text-start pr-1">
                      {parent}
                    </span>
                    <span className="flex-shrink-0 inline-block w-6 h-6">
                      <svg
                        className={`w-full h-full mr-2 transition-transform ${
                          expandedParents[parent] ? "-rotate-90" : "rotate-90"
                        }`}
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
                    </span>
                  </button>
                </div>

                {/* 子項目 */}
                {expandedParents[parent] && (
                  <ul className="ml-6 mt-2">
                    {children.map((child) => (
                      <li
                        key={child.label}
                        className="pb-2 pt-1 text-main-text-gray font-semibold"
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 border-main-text-gray border-2 text-main-text-gray peer checked:text-main-color-gb focus:ring-0 mr-3 rounded"
                            checked={child.isRefined}
                            onChange={() => refine(child.value)}
                          />
                          <span className="text-sm1 peer-checked:text-main-color-gb">
                            {child.label}
                          </span>
                          <span className="ml-3 m-1 px-3 py-0.5 text-xs3 rounded-full peer-checked:text-main-color-gb text-main-text-gray border peer-checked:border-main-color-gb border-main-text-gray">
                            {child.count}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CB_home_costomRefinementList;
