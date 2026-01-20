import { useState, useEffect, useRef } from "react";
import { useRefinementList } from "react-instantsearch";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

const CB_home_costomSelectFilter = ({
  label,
  attribute,
  needToPay = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const ref = useRef(null);

  const { items, refine } = useRefinementList({ attribute, limit: 50 });

  const selectedItemsCount = items.filter((item) => item.isRefined).length;

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  //確保level 高的能正常運作
  useEffect(() => {
    if (!needToPay) {
      setPopUp(false);
    }
  }, [needToPay]);

  return (
    <>
      <NeedToPay_popup popUp={popUp} setPopUp={setPopUp} />
      <div key={attribute} className="flex items-center relative" ref={ref}>
        <p className="w-[180px] font-semibold leading-140 mr-2">{label}</p>
        <button
          type="button"
          className="relative w-[160px] pl-3 pr-2 py-2 text-search-home-placeholder bg-white mb-3 flex items-center justify-between rounded-5px border-main-text-gray border"
          onClick={(event) => {
            event.stopPropagation();
            if (needToPay) {
              setPopUp(true);
            } else {
              setPopUp(false);
              setIsOpen(!isOpen);
            }
          }}
        >
          <span
            className={`whitespace-nowrap font-medium ${
              selectedItemsCount > 0
                ? `text-main-color-gb`
                : "text-search-home-placeholder"
            }`}
          >
            {selectedItemsCount > 0
              ? `${selectedItemsCount} selected`
              : "Please choose"}
          </span>
          <span className="inline-block w-6 h-6 p-0.5">
            <svg
              className={`${isOpen ? "-rotate-90" : "rotate-90"} `}
              fill="none"
              stroke="#69747F"
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

        {isOpen && (
          <div
            className="top-[52px] right-0 w-96 absolute bg-white pl-4 pr-3 pt-4 pb-7 rounded-10px z-10 shadow-finance-autocomplete"
            onClick={(event) => event.stopPropagation()} // 防止点击下拉内部关闭
          >
            <ul className="max-h-[300px] overflow-y-auto pr-3">
              {items.map((item) => (
                <li
                  key={item.label}
                  className="py-2.5 first:pt-0  text-main-text-gray font-semibold"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-6 h-6 border-main-text-gray border-2 text-main-text-gray peer checked:text-main-color-gb focus:ring-0 mr-3 rounded"
                      checked={item.isRefined}
                      onChange={() => {
                        refine(item.value);
                      }}
                    />
                    <span className="peer-checked:text-main-color-gb text-left">
                      {item.label.replace(/_/g, " ")}
                    </span>

                    <span className="ml-3 px-3 py-0.5 text-xs3 font-normal rounded-full peer-checked:text-main-color-gb text-main-text-gray border peer-checked:border-main-color-gb border-main-text-gray">
                      {item.count}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CB_home_costomSelectFilter;
