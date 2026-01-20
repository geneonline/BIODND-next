import { useStats } from "react-instantsearch";

const ResultsCount = () => {
  const { nbHits } = useStats();

  if (!nbHits) return null;

  return (
    <div data-testid="results-count" className="text-sm1 text-textColor-Tertiary">
      {nbHits === 10000 && "More than "}
      <span className="text-primary-default font-semibold pr-1.5">
        {nbHits.toLocaleString()}
      </span>
      Results
    </div>
  );
};

const ResultsToolbar = ({ selectedCount, maxSelection, onCompare }) => {
  const disabled = selectedCount < 2;

  return (
    <div className="flex items-center justify-between py-3 px-4 ">
      <button
        className={`rounded-lg border font-medium text-sm1 leading-[20px] px-4 py-3 transition
        ${
          disabled
            ? "border-Gray-500 text-Gray-500 cursor-not-allowed bg-transparent"
            : "border-primary-default text-primary-default hover:bg-primaryBlue-100 bg-transparent"
        }`}
        disabled={disabled}
        onClick={onCompare}
      >
        Compare
        {selectedCount > 0 && ` (${selectedCount}/${maxSelection})`}
      </button>
      <ResultsCount />
    </div>
  );
};

export default ResultsToolbar;
