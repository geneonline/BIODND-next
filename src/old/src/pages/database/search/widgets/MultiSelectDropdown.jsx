import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({
  options,
  selected,
  setSelected,
  label,
  showSearch = false,
  searchPlaceholder = "Search...",
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCount = selected.length;
  const hasSelection = selectedCount > 0;
  const buttonLabel = hasSelection ? `${label} (${selectedCount})` : label;

  const normalizedSearch = showSearch ? searchTerm.trim().toLowerCase() : "";
  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        option.toLowerCase().startsWith(normalizedSearch)
      )
    : options;
  const allVisibleSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) => selected.includes(option));

  const handleSelectAll = () => {
    if (filteredOptions.length === 0) return;

    if (allVisibleSelected) {
      setSelected(selected.filter((item) => !filteredOptions.includes(item)));
      return;
    }

    const updatedSelections = [...selected];
    filteredOptions.forEach((option) => {
      if (!selected.includes(option)) {
        updatedSelections.push(option);
      }
    });
    setSelected(updatedSelections);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <p className="text-sm1 leading-tight pb-1">{label}</p>
      {/* 按鈕顯示欄位名稱與已選數量 */}
      <button
        type="button"
        className={`border py-3 px-4 rounded-lg min-w-[160px] w-full flex justify-between items-center focus:outline-none focus:ring-0 transition gap-2 ${
          hasSelection
            ? "bg-primaryBlue-200 text-textColor-secondary "
            : "bg-interface-background text-text-primary-color"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-left text-sm1 w-full">{buttonLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute flex flex-col gap-3 py-6 px-4 z-50 mt-1 w-full bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] border border-gray-100 max-h-96">
          <div className="flex flex-col gap-3">
            {showSearch && (
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm1 focus:outline-none focus:ring-0 focus:border-main-color-gb"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}

            {normalizedSearch === "" && (
              <button
                type="button"
                className="text-sm1 font-medium text-left px-3 py-2 text-text-color-gray disabled:text-Gray-250 hover:bg-Gray-250 rounded-lg disabled:cursor-not-allowed"
                onClick={handleSelectAll}
                disabled={filteredOptions.length === 0}
              >
                {allVisibleSelected ? "Clear All" : "Select All"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-72">
            {filteredOptions.map((option) => {
              const isChecked = selected.includes(option);
              return (
                <label
                  key={option}
                  className={`flex justify-between items-center px-3 py-2 cursor-pointer text-sm1 font-medium font-['Inter',_sans-serif] text-text-color-gray rounded-lg ${
                    isChecked ? "bg-Gray-250" : "hover:bg-Gray-250"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 accent-main-color-gb border-db-table-color rounded-[2px]"
                      checked={isChecked}
                      onChange={() => toggleOption(option)}
                    />
                    {option}
                  </span>
                </label>
              );
            })}

            {filteredOptions.length === 0 && (
              <p className="text-sm text-gray-400">No options available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
