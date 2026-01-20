import { useState, useRef, useEffect } from "react";

const Select = ({ selected, setSelected, options, width, hidden }) => {
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
    <div className={`relative flex flex-col h-fit ${hidden}  z-30`}>
      {/* select */}
      <button
        className={`flex items-center justify-between ${width}
         py-2 pl-3 pr-3 border rounded-t-10px ${
           selectOpen ? "rounded-b-0" : "rounded-b-10px"
         } border-bd-gray 
         bg-white
          focus:border-main-color focus:ring-main-color focus:rounded-t-10px`}
        onClick={() => setSelectOpen(!selectOpen)}
      >
        <span className="flex pr-3">
          <span className="pr-1 fill-main-color-gb">
            {options[selected].icon}
          </span>
          <span className="text-main-color-gb text-xs3 font-medium">
            {options[selected].text}
          </span>
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
        <div
          className={`absolute top-[33px] ${width} flex flex-col border border-t-0 rounded-b-10px border-bd-gray bg-white`}
        >
          {options.map((item, index) => (
            <button
              key={index}
              className="py-2 px-3 text-main-text-gray font-medium text-xs3 text-left border-t  border-bd-gray hover:bg-bg-gray last:rounded-b-10px"
              onClick={() => {
                setSelected(index);
                setSelectOpen(false);
              }}
            >
              <span className="flex">
                <span className="pr-1 fill-main-text-gray">{item.icon}</span>
                <span>{item.text}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
