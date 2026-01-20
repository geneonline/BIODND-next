import { useState, useEffect, useRef } from "react";
import search_icon from "@/assets/svg/database/search_icon.svg";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

const CB_home_costomInputFilter = ({
  label,
  value,
  onChange,
  needToPay = false,
}) => {
  const [popUp, setPopUp] = useState(false);
  const inputRef = useRef(null);

  //確保level 高的能正常運作
  useEffect(() => {
    if (!needToPay) {
      setPopUp(false);
    }
  }, [needToPay]);

  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <>
      <NeedToPay_popup popUp={popUp} setPopUp={setPopUp} />
      <div className="relative flex items-center">
        <p className="w-[180px] font-semibold leading-140 mr-2">{label}</p>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onFocus={() => {
              if (needToPay) {
                setPopUp(true);
                inputRef.current?.blur();
              } else {
                setPopUp(false);
              }
            }}
            onChange={handleChange}
            placeholder="Search"
            className="w-[160px]  border-main-text-gray focus:border-main-text-gray pl-9 py-2.5 pr-3 rounded-5px focus:ring-0 placeholder:text-search-home-placeholder "
          />
          <div className="py-2 pl-3 rounded-r-10px absolute left-0 top-0.5">
            <span className="w-6 h-6 inline-block">
              <img src={search_icon} alt="search" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default CB_home_costomInputFilter;
