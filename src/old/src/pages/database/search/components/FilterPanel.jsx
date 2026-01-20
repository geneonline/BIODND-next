import MultiSelectDropdown from "../widgets/MultiSelectDropdown";
import MilestoneDateFilter from "../widgets/MilestoneDateFilter";

const FilterPanel = ({ filterConfig, filterSelections, handleFilterSelection }) => {
  return (
    <div className="px-6 pb-9 flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start justify-start">
        {filterConfig.map((filter) => {
          if (filter.type === "milestone-date") {
            return (
              <MilestoneDateFilter
                key={filter.id}
                label={filter.label}
                options={filter.options ?? []}
                selection={filterSelections[filter.id] ?? null}
                onChange={handleFilterSelection(filter)}
              />
            );
          }

          return (
            <MultiSelectDropdown
              key={filter.id}
              label={filter.label}
              options={filter.options ?? []}
              selected={filterSelections[filter.id] ?? []}
              setSelected={handleFilterSelection(filter)}
              showSearch={Boolean(filter.searchable)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
