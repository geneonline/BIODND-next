import { useState, useEffect, useRef } from "react";

const MultiCheckboxSelect = ({
  options,
  currentLanguage,
  registerName,
  setValue,
  placeholder,
  selectedOptions,
  setSelectedOptions,
  error,
  clearErrors,
  maxSelections = 3, // 可以設定最大選擇數量
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked && selectedOptions.length >= maxSelections) {
      return; // 如果已經達到最大選項數，阻止新增
    }
    setSelectedOptions((current) => {
      const newSelectedOptions = checked
        ? [...current, value]
        : current.filter((option) => option !== value);

      // 更新表單的值
      setValue(registerName, newSelectedOptions.join("|"));

      if (newSelectedOptions.length > 0) {
        clearErrors(registerName);
      }

      return newSelectedOptions;
    });
  };

  useEffect(() => {
    // 監聽點擊事件，用於判斷點擊是否發生在組件外部
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false); // 點擊外部時關閉下拉
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div className="w-[250px] xl:w-64 relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full bg-white font-medium rounded-md pl-4 pr-10 py-3.5 text-left cursor-default border-0.3px leading-6 focus:ring-1 focus:outline-none sm:text-sm ${
          error
            ? "focus:border-warning ring-warning border-warning"
            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
        } ${selectedOptions.length > 0 ? "text-black" : "text-main-text-gray"}`}
      >
        {selectedOptions.length > 0 ? selectedOptions.join(", ") : placeholder}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {/* Dropdown Icon */}
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option[1]}
              className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value={option[1]}
                  checked={selectedOptions.includes(option[1])}
                  onChange={handleCheckboxChange}
                  disabled={
                    selectedOptions.length >= maxSelections &&
                    !selectedOptions.includes(option[1])
                  }
                  className={`focus:ring-main-color h-4 w-4 text-main-color border-main-text-gray rounded ${
                    selectedOptions.length >= maxSelections &&
                    !selectedOptions.includes(option[1])
                      ? "opacity-75 bg-main-text-gray"
                      : ""
                  }`}
                />
                <label
                  className={`ml-3 block text-sm font-medium text-gray-700 ${
                    selectedOptions.length >= maxSelections &&
                    !selectedOptions.includes(option[1])
                      ? "text-gray-500"
                      : ""
                  }`}
                >
                  {currentLanguage === "en" ? option[1] : option[0]}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiCheckboxSelect;
