import { useState, useRef, useEffect } from "react";

const Select = ({ selected, setSelected, options, placeholder }) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 點擊外部來關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSelectOpen(false); // 如果點擊事件的目標不是下拉選單的一部分，則關閉下拉選單
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 清理事件監聽器
    };
  }, [wrapperRef]);

  return (
    <div
      className={`relative w-full text-sm rounded-7px ${
        selectOpen ? " shadow-search-select z-80" : "shadow-none z-50"
      } `}
    >
      {/* select */}
      <button
        className={`flex items-center justify-between relative leading-6 w-full bg-white  py-3.5 px-4.5 font-medium border-0.3px 
        ${
          selectOpen
            ? "rounded-t-7px z-80 border-white "
            : "rounded-7px z-50  border-main-text-gray"
        } 
        `}
        onClick={(e) => {
          e.preventDefault();
          setSelectOpen(!selectOpen);
        }}
      >
        <span
          className={`text-sm font-medium ${
            selected ? "text-black" : "text-main-text-gray"
          }`}
        >
          {selected || placeholder}
        </span>
        <svg
          className={`${selectOpen ? "rotate-180" : "rotate-0"}`}
          width={11}
          height={6}
          viewBox="0 0 11 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M5 5.20907C4.93442 5.20981 4.86941 5.19789 4.80913 5.1741C4.74885 5.1503 4.69465 5.11515 4.65 5.0709L0.15 0.925938C-0.05 0.741717 -0.05 0.456175 0.15 0.271955C0.35 0.0877339 0.66 0.0877339 0.86 0.271955L5.01 4.09453L9.15 0.281166C9.35 0.0969449 9.66 0.0969449 9.86 0.281166C10.06 0.465386 10.06 0.750929 9.86 0.935149L5.36 5.08012C5.26 5.17223 5.13 5.21828 5.01 5.21828L5 5.20907Z"
            fill="#69747F"
          />
        </svg>
      </button>

      {/* option */}
      {selectOpen && (
        <ul className="z-70 w-full pl-2 pr-7.5 pb-2 shadow-search-select rounded-b-7px absolute top-13 bg-white">
          {options.map((option) => (
            <li key={option[0]} value={option[0]}>
              <button
                className={`w-full p-2 my-0.5 rounded-5px hover:bg-main-color hover:text-white text-left `}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(option[0]);
                  setSelectOpen(false);
                }}
              >
                {option[0]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
