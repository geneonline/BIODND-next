import { useState, useRef, useEffect } from "react";

const Select_useform = ({
  options,
  registerName,
  setValue,
  placeholder,
  error,
  clearErrors,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
      setValue(registerName, defaultValue, { shouldValidate: true });
    }
  }, [defaultValue, registerName, setValue]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setValue(registerName, value);
    if (value) {
      clearErrors(registerName);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleBlur = (event) => {
      // 檢查點擊事件的目標是否在元件外
      if (!wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleBlur);
    } else {
      window.removeEventListener("click", handleBlur);
    }

    return () => {
      window.removeEventListener("click", handleBlur);
    };
  }, [isOpen, wrapperRef]);

  return (
    <div
      className={`w-full xl:w-64 relative ${
        isOpen
          ? "rounded-t-7px shadow-search-select z-80"
          : "rounded-t-none shadow-none z-50"
      }`}
      ref={wrapperRef}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full rounded-t-7px bg-white font-medium pl-4 pr-10 py-3.5 text-left cursor-default border-0.3px leading-6 focus:outline-none sm:text-sm ${
          error
            ? "focus:border-warning ring-warning border-warning ring-1"
            : "ring-0"
        } ${selectedOption ? "text-black" : "text-main-text-gray"}
          ${
            isOpen
              ? " rounded-b-none border-white"
              : " rounded-b-7px border-main-text-gray"
          }
        `}
      >
        {selectedOption || placeholder}
        <span className="absolute inset-y-0 right-3 flex items-center pr-2 pointer-events-none">
          <svg
            className={`${isOpen ? "rotate-180" : "rotate-0"}`}
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
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 pl-2 pr-7.5 w-full bg-white shadow-lg  rounded-b-7px py-1 text-base  focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option[1]}
              className="w-full p-2 my-0.5 rounded-7px hover:bg-main-color hover:text-white text-left"
              onClick={() => handleOptionSelect(option[1])}
            >
              <label className="ml-3 block text-sm font-medium">
                {option[0]}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select_useform;
