import { useEffect, useState } from "react";

const AssetTypeDropdown = ({ options, currentOption, onSelect }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [currentOption?.value]);

  return (
    <div className="relative lg:max-w-[200px] min-w-[180px] w-full">
      <button
        type="button"
        className="h-12 w-full border border-Gray-500 rounded-lg bg-white px-4 text-sm1 text-textColor-primary flex items-center justify-between focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        {currentOption?.label || "Select Asset Type"}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
        <ul className="absolute py-6 px-4 z-50 mt-1 w-full bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] border border-gray-100 space-y-3">
          {options.map((opt) => {
            const isSelected = currentOption?.value === opt.value;
            return (
              <li
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={`flex justify-between items-center px-3 py-2 cursor-pointer text-sm1 font-medium font-['Inter',_sans-serif] text-[#827f7f] rounded-lg ${
                  isSelected ? "bg-Gray-250" : "hover:bg-Gray-250"
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AssetTypeDropdown;
