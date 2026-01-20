import { useState, useEffect, useRef } from "react";

const HierarchicalMultiCheckboxSelect = ({
  topLevelOptions,
  subLevelOptions,
  currentLanguage,
  registerName,
  placeholder,
  sub_placeholder,
  selectedSubOptions,
  setSelectedSubOptions,
  error,
  setValue,
  getValues,
  clearErrors,
  maxSelections = 3, // 可以設定最大選擇數量
}) => {
  const [selectedTopOption, setSelectedTopOption] = useState("");
  const [selectedTopOptions, setSelectedTopOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // 設定初始選擇的子選項
    const initialValues = getValues(registerName);
    const initialTopOptions = [];
    if (initialValues && initialValues.length > 0) {
      setSelectedSubOptions(initialValues.split("|"));

      initialValues.split("|").forEach((subOption) => {
        Object.entries(subLevelOptions).forEach(([topOption, subOptions]) => {
          if (
            subOptions.some(([subKey]) => subKey === subOption) &&
            !initialTopOptions.includes(topOption)
          ) {
            initialTopOptions.push(topOption);
          }
        });
      });
      setSelectedTopOptions(initialTopOptions);
    }
  }, [getValues, registerName, setSelectedSubOptions, subLevelOptions]);

  const handleTopLevelChange = (e) => {
    setSelectedTopOption(e.target.value);
    // setSelectedSubOptions([]);
    // setValue(registerName, "");
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked && selectedSubOptions.length >= maxSelections) {
      return; // 如果已經達到最大選項數，阻止新增
    }
    const updatedSelectedSubOptions = checked
      ? [...selectedSubOptions, value]
      : selectedSubOptions.filter((option) => option !== value);

    setSelectedSubOptions(updatedSelectedSubOptions);
    setValue(registerName, updatedSelectedSubOptions.join("|"));

    const updatedSelectedTopOptions = new Set(selectedTopOptions);
    if (checked) {
      updatedSelectedTopOptions.add(selectedTopOption);
    } else {
      const remainingSubOptions = updatedSelectedSubOptions.filter(
        (subOption) =>
          subLevelOptions[selectedTopOption]?.some(
            ([subKey]) => subKey === subOption
          )
      );
      if (remainingSubOptions.length === 0) {
        updatedSelectedTopOptions.delete(selectedTopOption);
      }
    }
    setSelectedTopOptions([...updatedSelectedTopOptions]);

    clearErrors(registerName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <select
        className={`w-full bg-white font-medium rounded-md pl-4 pr-10 py-3.5 text-left cursor-default border-0.3px leading-6 focus:ring-1 focus:outline-none sm:text-sm ${
          error
            ? "focus:border-warning ring-warning border-warning"
            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
        } ${
          selectedTopOption.length > 0 ? "text-black" : "text-main-text-gray"
        }`}
        value={selectedTopOption}
        onChange={handleTopLevelChange}
      >
        <option value="">{placeholder}</option>
        {Object.entries(topLevelOptions).map(([key, label]) => (
          <option
            className={` ${
              selectedTopOptions.find((option) => option === label[0])
                ? "bg-main-color text-white"
                : "text-black"
            }`}
            key={key}
            value={key}
          >
            {currentLanguage === "en" ? label[0] : label[1]}
          </option>
        ))}
      </select>

      {(selectedTopOption || selectedSubOptions.length > 0) && (
        <button
          className={`mt-2 w-full bg-white font-medium rounded-md pl-4 pr-10 py-3.5 text-left cursor-default border-0.3px leading-6 focus:ring-1 focus:outline-none sm:text-sm ${
            error
              ? "focus:border-warning ring-warning border-warning"
              : "focus:border-main-color focus:ring-main-color border-main-text-gray"
          } ${
            selectedSubOptions.length > 0 ? "text-black" : "text-main-text-gray"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          {selectedSubOptions.length > 0
            ? selectedSubOptions.join(", ")
            : sub_placeholder}
        </button>
      )}

      {isOpen && subLevelOptions[selectedTopOption] && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {subLevelOptions[selectedTopOption].map(([subKey, subValue]) => (
            <li
              key={subValue}
              className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={subValue}
                  value={subValue}
                  checked={selectedSubOptions.includes(subValue)}
                  onChange={handleCheckboxChange}
                  disabled={
                    selectedSubOptions.length >= maxSelections &&
                    !selectedSubOptions.includes(subValue)
                  }
                  className={`focus:ring-main-color h-4 w-4 text-main-color border-main-text-gray rounded ${
                    selectedSubOptions.length >= maxSelections &&
                    !selectedSubOptions.includes(subValue)
                      ? "opacity-75 bg-main-text-gray"
                      : ""
                  }`}
                />
                <label
                  className={`ml-3 block text-sm font-medium text-gray-700 ${
                    selectedSubOptions.length >= maxSelections &&
                    !selectedSubOptions.includes(subValue)
                      ? "text-gray-500"
                      : ""
                  }`}
                  htmlFor={subValue}
                >
                  {currentLanguage === "en" ? subValue : subKey}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HierarchicalMultiCheckboxSelect;
