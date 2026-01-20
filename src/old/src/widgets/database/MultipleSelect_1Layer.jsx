/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function shortenArrayToString(array, maxLength) {
  // 将数组转换为字符串
  let result = array.join(",");
  // 检查字符串是否超过最大长度
  if (result.length > maxLength) {
    // 如果超过，找到最后一个完整的单词，并在其后添加 "..."
    let cutOffIndex = result.lastIndexOf(",", maxLength - 3); // 留出空间给 "..."
    result =
      result.substring(0, cutOffIndex > 0 ? cutOffIndex : maxLength - 3) +
      "...";
  }
  return result;
}

const MultipleSelect_1Layer = ({
  width,
  label,
  options,
  isAdvancedSearch,
  currentLanguage,
  name,
  inputValue,
  setInputValue,
  searchCleared,
  clearedTag,
  setClearedTag,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkedItems, setCheckedItems] = useState([]);

  //根據 params 更新勾選項目(如果有的話)
  useEffect(() => {
    const obj = Object.fromEntries(searchParams.entries());
    if (obj[name]) {
      const items = obj[name].split(",");
      setCheckedItems(items);
    } else {
      setCheckedItems([]);
    }
  }, [searchParams, name, searchCleared]);

  // when delete a tag
  useEffect(() => {
    if (clearedTag.child && clearedTag.type === name) {
      setCheckedItems(checkedItems.filter((item) => item !== clearedTag.child));
      setClearedTag({});
    }
  }, [checkedItems, clearedTag.child, clearedTag.type, name, setClearedTag]);

  const [selectOpen, setSelectOpen] = useState(false);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // 更新打勾的子項目
    setCheckedItems((prev) => {
      const newCheckedItems = checked // 判斷是否打勾
        ? [...prev, name] // 打勾的話添加子項目到陣列
        : prev.filter((item) => item !== name); // 取消打勾的話從陣列移除子項目

      return newCheckedItems;
    });
  };

  useEffect(() => {
    if (checkedItems.length > 0) {
      setInputValue({ ...inputValue, [name]: checkedItems });
    } else {
      const { [name]: _, ...restInputValue } = inputValue;
      setInputValue(restInputValue);
    }
  }, [checkedItems, name]);

  return (
    <div className="flex flex-col px-1 pt-3 ">
      <label
        className={`text-select-label pb-2 pl-1 text-sm2 ${
          isAdvancedSearch ? "block" : "hidden"
        }`}
        htmlFor="parent"
      >
        {label.label}
      </label>

      {/* close select area */}
      {selectOpen && (
        <div
          className="fixed left-0 top-0 w-full h-screen z-60"
          onClick={() => {
            setSelectOpen(false);
          }}
        />
      )}

      <section
        className={`relative w-full text-sm rounded-7px ${
          selectOpen ? " shadow-search-select z-80" : "shadow-none z-40"
        } `}
      >
        <button
          data-testid="Country_Region"
          type="button"
          className={` relative ${width} bg-white px-4.5 py-3 font-medium border-main-color
        ${selectOpen ? "rounded-t-7px z-80" : "rounded-7px z-40"} ${
            checkedItems.length > 0 ? "border" : "border-0"
          }
        `}
          name="Country_Region"
          id=""
          onClick={(e) => {
            e.preventDefault();
            setSelectOpen(!selectOpen);
          }}
        >
          {checkedItems.length > 0
            ? shortenArrayToString(checkedItems, 30)
            : label.select}
        </button>

        {selectOpen && (
          <ul className="z-70 w-full max-h-[50vh] overflow-auto pl-2 pr-1.5 pb-2 shadow-search-select rounded-b-7px absolute top-10 bg-white">
            {(currentLanguage === "en"
              ? options.options_en
              : options.options_zh
            ).map((option) => (
              <li
                className="flex justify-between p-1.5 hover:bg-sub-text-gray rounded-7px"
                key={option[0]}
                value={option[1]}
              >
                {option[0]}{" "}
                <input
                  className={`focus:ring-0 rounded-sm ml-2 ${
                    !checkedItems.includes(option[1]) &&
                    checkedItems.length >= 5
                      ? "bg-mobile-nav-text-gray cursor-not-allowed" // 樣式當無法勾選時
                      : "checked:text-main-color" // 樣式當可以勾選時
                  }`}
                  type="checkbox"
                  name={option[1]}
                  checked={checkedItems.includes(option[1])}
                  onChange={handleCheckboxChange}
                  disabled={
                    !checkedItems.includes(option[1]) &&
                    checkedItems.length >= 5
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MultipleSelect_1Layer;
