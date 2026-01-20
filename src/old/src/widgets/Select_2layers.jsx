import { useState } from "react";

function shortenArrayToString(value, maxLength) {
  if (value && value.length > maxLength) {
    return value.substring(0, maxLength - 3) + "...";
  }
  return value;
}

const Select_2layers = ({ width, label, options, value, onChange }) => {
  const [parentSelectOpen, setParentSelectOpen] = useState(false);
  const [childSelectOpen, setChildSelectOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState("");

  const handleParentSelect = (parent) => {
    setSelectedParent(parent);
    setParentSelectOpen(false);
    setChildSelectOpen(true); // 可以直接打开子选择，如果需要
  };

  const handleChildSelect = (child) => {
    onChange(child); // 更新表单控制器的值
    setChildSelectOpen(false);
  };

  return (
    <div className={`flex flex-col px-1 pt-3 ${width}`}>
      <label className="text-select-label pb-2 pl-1 text-sm2">
        {label.label}
      </label>

      {/* Parent Selection */}
      <div className="relative">
        <button
          className="bg-white py-3 px-4.5 font-medium border-main-color rounded-7px"
          onClick={() => setParentSelectOpen(!parentSelectOpen)}
        >
          {selectedParent
            ? shortenArrayToString(selectedParent, 30)
            : label.parent_select}
        </button>
        {parentSelectOpen && (
          <ul className="absolute bg-white">
            {Object.entries(options.parentOptions).map(([key, option]) => (
              <li key={key}>
                <button onClick={() => handleParentSelect(option[0])}>
                  {option[0]}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Child Selection */}
      {selectedParent && childSelectOpen && (
        <div className="relative mt-1">
          <button className="bg-white px-4.5 py-2 font-medium border-main-color rounded-7px">
            {value ? shortenArrayToString(value, 30) : label.child_select}
          </button>
          <ul className="absolute bg-white">
            {options.childOptions_en[selectedParent]?.map((option) => (
              <li key={option[0]}>
                <button onClick={() => handleChildSelect(option[1])}>
                  {option[0]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select_2layers;
