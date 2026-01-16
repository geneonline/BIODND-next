import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectDropdownProps {
  label: string;
  options?: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

const SingleSelectDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder,
}: SingleSelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;
  const buttonLabel =
    selectedOption?.label ?? placeholder ?? label ?? "Select an option";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <p className="text-sm1 leading-tight pb-1 text-text-primary-color">
        {label}
      </p>
      <button
        type="button"
        className={`border py-3 px-4 rounded-lg min-w-[160px] w-full flex justify-between items-center focus:outline-none focus:ring-0 transition gap-2 ${selectedOption
            ? "bg-primaryBlue-200 text-textColor-secondary "
            : "bg-interface-background text-text-primary-color"
          }`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-left text-sm1 w-full truncate">
          {buttonLabel}
        </span>
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
        <div className="absolute flex flex-col gap-4 py-4 px-4 z-50 mt-1 w-full bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] border border-gray-100">
          <div className="flex flex-col gap-2">
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`text-sm1 font-medium text-left px-3 py-2 rounded-lg border transition ${isActive
                      ? "bg-primaryBlue-200 border-primary-default text-textColor-secondary"
                      : "border-transparent hover:bg-Gray-250 text-text-color-gray"
                    }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
