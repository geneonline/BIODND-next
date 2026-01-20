import { useId, useMemo } from "react";
import SingleSelectDropdown from "./SingleSelectDropdown";

const MilestoneDateFilter = ({ label, options = [], selection, onChange }) => {
  const startId = useId();
  const endId = useId();

  const normalizedSelection = selection ?? {};
  const selectedField = normalizedSelection.field ?? "";
  const startDate = normalizedSelection.startDate ?? "";
  const endDate = normalizedSelection.endDate ?? "";

  const optionMap = useMemo(() => {
    const map = new Map();
    options.forEach((option) => {
      if (option?.value) map.set(option.value, option);
    });
    return map;
  }, [options]);

  const handleFieldChange = (nextField) => {
    if (!nextField) {
      onChange?.(null);
      return;
    }
    const option = optionMap.get(nextField) ?? {};
    onChange?.({
      field: nextField,
      label: option.label ?? nextField,
      startDate: "",
      endDate: "",
    });
  };

  const handleDateChange = (key) => (event) => {
    if (!selectedField) return;
    const option = optionMap.get(selectedField) ?? {};
    const nextValue = event.target.value;
    onChange?.({
      field: selectedField,
      label: option.label ?? selectedField,
      startDate: key === "start" ? nextValue : startDate,
      endDate: key === "end" ? nextValue : endDate,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <SingleSelectDropdown
        label={label}
        options={options}
        value={selectedField}
        onChange={handleFieldChange}
        placeholder="Select a field"
      />

      {selectedField ? (
        <div className="flex flex-col gap-3 rounded-lg border border-Gray-500/50 p-3 bg-white">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={startId}
                className="text-xs font-medium text-textColor-Tertiary uppercase tracking-wide"
              >
                Start Date
              </label>
              <input
                id={startId}
                type="date"
                className="border border-Gray-400 rounded-lg px-3 py-2 text-sm1 focus:outline-none focus:ring-0 focus:border-primary-default"
                value={startDate}
                onChange={handleDateChange("start")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={endId}
                className="text-xs font-medium text-textColor-Tertiary uppercase tracking-wide"
              >
                End Date
              </label>
              <input
                id={endId}
                type="date"
                className="border border-Gray-400 rounded-lg px-3 py-2 text-sm1 focus:outline-none focus:ring-0 focus:border-primary-default"
                value={endDate}
                onChange={handleDateChange("end")}
                min={startDate || undefined}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MilestoneDateFilter;
