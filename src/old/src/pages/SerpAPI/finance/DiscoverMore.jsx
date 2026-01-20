import { useState } from "react";
import { Link } from "react-router-dom";
import FinanceArrowSVG from "@/widgets/database/finance/FinanceArrowSVG";

const DiscoverMore = ({ data }) => {
  if (!data) return null;

  // 過濾出 title 為 "People also search for" 的 sections
  const filteredSections = data.filter(
    (section) => section.title === "People also search for"
  );

  if (filteredSections.length === 0) return null; // 如果沒有符合的 sections，可以返回 null 或顯示其他內容

  // 初始化每個過濾後的 section 的 currentIndex 為 0
  const [currentIndices, setCurrentIndices] = useState(
    filteredSections.map(() => 0)
  );

  const visibleCount = 8; // 每個 section 顯示的卡片數量

  const handleScrollLeft = (sectionIndex) => {
    setCurrentIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      if (newIndices[sectionIndex] > 0) {
        newIndices[sectionIndex] -= 8;
      }
      return newIndices;
    });
  };

  const handleScrollRight = (sectionIndex, itemsLength) => {
    setCurrentIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      if (newIndices[sectionIndex] < itemsLength - visibleCount) {
        newIndices[sectionIndex] += 8;
      }
      return newIndices;
    });
  };

  return (
    <div>
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
            d="M4 20V3H18V8.25204C17.3608 8.08751 16.6906 8 16 8V5H6V18H8.25204C8.43466 18.7095 8.71218 19.381 9.07026 20H4ZM14 7H8V9H14V7ZM8 10H11V12H8V10ZM16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12ZM10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16Z"
            fill="#009BAF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17 15V13H15V15H13V17H15V19H17V17H19V15H17Z"
            fill="#009BAF"
          />
        </svg>
        <h2 className="text-24px font-semibold ">Discover more</h2>
      </div>

      {filteredSections.map((section, index) => {
        const currentIndex = currentIndices[index];
        const showLeftButton = currentIndex > 0;
        const showRightButton =
          currentIndex < section.items.length - visibleCount;
        const visibleItems = section.items.slice(
          currentIndex,
          currentIndex + visibleCount
        );

        return (
          <div
            key={index}
            className="section mb-10 pt-5 pb-7 px-6 flex items-center justify-between bg-finance-tabble-even"
          >
            {/* 左箭頭按鈕 */}
            <button
              className={`flex-shrink-0 mr-7 h-10 w-10 rounded-full ${
                showLeftButton ? "block" : "invisible"
              } bg-no-repeat bg-center bg-cover bg-finance-left-arrow-btn hover:bg-finance-left-arrow-btn-h`}
              onClick={() => handleScrollLeft(index)}
              aria-label="Scroll Left"
            ></button>

            <div className="w-full">
              <h3 className="text-xl text-main-color-gb font-semibold mb-4">
                {section.title}
              </h3>

              <div className="w-full flex items-center">
                {/* 卡片容器 */}
                <div className="w-full grid grid-cols-4 grid-rows-2 gap-3">
                  {visibleItems.map((item, idx) => (
                    <Link
                      to={`/financepage/${item.stock}`}
                      key={idx}
                      className="min-w-[170px] h-[200px] bg-white hover:bg-finance-search-hover border-2 border-main-text-gray rounded-10px flex flex-col items-center text-center overflow-hidden"
                    >
                      <p className="w-full py-3 px-8 text-xl font-semibold text-center bg-main-text-gray text-white truncate">
                        {item.stock.split(":")[0]}
                      </p>

                      <div className="py-4 px-8 w-full h-full">
                        <p className="h-10 leading-140 text-base font-bold text-left text-main-text-gray line-clamp-2">
                          {item.name}
                        </p>

                        <p className="w-fit leading-140 text-24px pb-1 font-semibold text-left border-black truncate">
                          {item.price}
                        </p>

                        <p
                          className={`flex leading-140 pl-4 pr-3 py-1 w-fit items-center font-medium border-2 rounded-full text-left ${
                            item.price_movement.movement === "Up"
                              ? "text-finance-gainer border-finance-gainer"
                              : "text-warning border-warning"
                          }`}
                        >
                          <span>{item.price_movement.percentage}%</span>
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
            </div>

            {/* 右箭頭按鈕 */}
            <button
              className={`flex-shrink-0 ml-7 h-10 w-10 rounded-full ${
                showRightButton ? "block" : "invisible"
              } rotate-180 bg-no-repeat bg-center bg-cover bg-finance-left-arrow-btn hover:bg-finance-left-arrow-btn-h`}
              onClick={() => handleScrollRight(index, section.items.length)}
              aria-label="Scroll Right"
            ></button>
          </div>
        );
      })}
    </div>
  );
};

export default DiscoverMore;
