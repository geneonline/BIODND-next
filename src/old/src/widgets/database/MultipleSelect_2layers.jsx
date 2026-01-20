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

const MultipleSelect_2layers = ({
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
  const [selectedParants, setSelectedParants] = useState([]);

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

  // when delete a child tag
  useEffect(() => {
    if (clearedTag.child && clearedTag.type === name) {
      setCheckedItems(checkedItems.filter((item) => item !== clearedTag.child));
      setClearedTag({});
    }
  }, [checkedItems, clearedTag.child, clearedTag.type, name, setClearedTag]);

  // when delete a parant tag
  useEffect(() => {
    if (clearedTag.parant && clearedTag.type === name) {
      //find child items from parent
      const childItems = options.childOptions_en[clearedTag.parant].map(
        (item) => item[1]
      );
      //filter these child items
      const newCheckedItems = checkedItems.filter(
        (item) => !childItems.includes(item)
      );

      setCheckedItems(newCheckedItems);
      setClearedTag({});
    }
  }, [
    checkedItems,
    clearedTag.parant,
    clearedTag.type,
    name,
    options.childOptions_en,
    setClearedTag,
  ]);

  // 根據 checkedItems 更新 selectedParants
  useEffect(() => {
    const newSelectedParants = checkedItems
      .map((itemName) => {
        // 在所有母項目中查找包含該子項目的母項目
        return Object.keys(options.childOptions_en).find((parent) =>
          options.childOptions_en[parent].some((child) => child[1] === itemName)
        );
      })
      // 過濾掉未定義的結果並去掉
      .filter(
        (parent, index, self) => parent && self.indexOf(parent) === index
      );

    setSelectedParants(newSelectedParants);
  }, [checkedItems, options.childOptions_en]);

  const [parentSelectOpen, setparentSelectOpen] = useState(false);
  const [childSelectOpen, setChildSelectOpen] = useState(false);

  //顯示當下選擇的父項目
  const [parent, setParent] = useState("");

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // 更新打勾的子項目
    setCheckedItems((prev) => {
      const newCheckedItems = checked // 判斷是否打勾
        ? [...prev, name] // 打勾的話添加子項目到陣列
        : prev.filter((item) => item !== name); // 取消打勾的話從陣列移除子項目

      // 根據 newCheckedItems 更新 selectedParants
      const newSelectedContinents = newCheckedItems
        .map((itemName) => {
          // 在所有母項目中查找包含該子項目的母項目
          return Object.keys(options.childOptions_en).find((parent) =>
            options.childOptions_en[parent].some(
              (child) => child[1] === itemName
            )
          );
        })
        // 過濾掉未定義的結果並去掉
        .filter(
          (parent, index, self) => parent && self.indexOf(parent) === index
        );

      setSelectedParants(newSelectedContinents);

      return newCheckedItems;
    });
  };

  //update inputValue when checkedItems changed
  useEffect(() => {
    let newInputValue = { ...inputValue };

    if (checkedItems.length > 0) {
      newInputValue = { ...newInputValue, [name]: checkedItems };
    } else {
      // remove from inputValue when checkedItems is unchecked
      const { [name]: valueToRemove, ...restInputValue } = newInputValue;
      newInputValue = restInputValue;
    }

    if (selectedParants.length > 0) {
      newInputValue = {
        ...newInputValue,
        [`${name}_parants`]: selectedParants,
      };
    } else {
      // remove from inputValue when selectedParants is unchecked
      const { [`${name}_parants`]: valueToRemove, ...restInputValue } =
        newInputValue;
      newInputValue = restInputValue;
    }

    setInputValue(newInputValue);
  }, [checkedItems, name, selectedParants]);

  const parantSelectHandler = (e, option) => {
    e.preventDefault();
    setParent(option[0]);

    if (checkedItems.length == 0) {
      setSelectedParants([option[0]]);
    }

    setparentSelectOpen(false);
  };

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
      {(parentSelectOpen || childSelectOpen) && (
        <div
          className="fixed left-0 top-0 w-full h-screen z-60"
          onClick={() => {
            setparentSelectOpen(false);
            setChildSelectOpen(false);
          }}
        />
      )}

      {/* parent */}
      <section
        className={`relative w-full text-sm rounded-7px ${
          parentSelectOpen ? " shadow-search-select z-80" : "shadow-none z-50"
        } `}
      >
        <button
          data-testid="parent"
          type="button"
          className={` relative ${width} bg-white py-3 px-4.5 font-medium border-main-color 
            ${parentSelectOpen ? "rounded-t-7px z-80" : "rounded-7px z-50"} ${
            selectedParants.length > 0 ? "border" : "border-0"
          }
            `}
          name="parent"
          id=""
          onClick={(e) => {
            e.preventDefault();
            setparentSelectOpen(!parentSelectOpen);
            setChildSelectOpen(false);
          }}
        >
          {selectedParants.length > 0
            ? shortenArrayToString(selectedParants, 30)
            : label.parent_select}
        </button>

        {parentSelectOpen && (
          <ul className="z-70 w-full pl-2 pr-7.5 pb-2 shadow-search-select rounded-b-7px absolute top-10 bg-white">
            {Object.values(options.parantsOptions).map((option) => (
              <li key={option[0]} value={option[0]}>
                <button
                  className={`w-full p-1 my-0.5 rounded-5px ${
                    selectedParants?.includes(option[0])
                      ? "bg-sub-text-gray"
                      : ""
                  } hover:bg-main-color hover:text-white text-left `}
                  onClick={(e) => parantSelectHandler(e, option)}
                >
                  {currentLanguage === "en" ? option[0] : option[1]}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Child  */}
      {parent && (
        <section
          className={`relative mt-1  w-full text-sm rounded-7px ${
            childSelectOpen ? " shadow-search-select z-70" : "shadow-none z-40"
          } `}
        >
          <button
            data-testid="Country_Region"
            type="button"
            className={` relative ${width} bg-white px-4.5 py-2 font-medium border-main-color
            ${childSelectOpen ? "rounded-t-7px z-70" : "rounded-7px z-40"} ${
              checkedItems.length > 0 ? "border" : "border-0"
            }
            `}
            name="Country_Region"
            id=""
            onClick={(e) => {
              e.preventDefault();
              setChildSelectOpen(!childSelectOpen);
              setparentSelectOpen(false);
            }}
          >
            {checkedItems.length > 0
              ? shortenArrayToString(checkedItems, 30)
              : label.child_select}
          </button>

          {childSelectOpen && (
            <ul
              className={`z-60 w-full max-h-[50vh] overflow-auto pl-2 pr-1.5 pb-2 shadow-search-select rounded-b-7px absolute top-8 bg-white `}
            >
              {(currentLanguage === "en"
                ? options.childOptions_en[parent]
                : options.childOptions_zh[parent]
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
      )}
    </div>
  );
};

export default MultipleSelect_2layers;
