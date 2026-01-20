import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilterPanel from "../FilterPanel";

// Mock widgets
vi.mock("../../widgets/MultiSelectDropdown", () => ({
  default: ({ label, selected, setSelected }) => (
    <div data-testid={`multi-select-${label}`}>
      <span>{label}</span>
      <button onClick={() => setSelected(["option1"])}>Select Option 1</button>
      <span>Selected: {selected.join(", ")}</span>
    </div>
  ),
}));

vi.mock("../../widgets/MilestoneDateFilter", () => ({
  default: ({ label, selection, onChange }) => (
    <div data-testid={`date-filter-${label}`}>
      <span>{label}</span>
      <button
        onClick={() =>
          onChange({ field: "start_date", startDate: "2023-01-01" })
        }
      >
        Select Date
      </button>
      <span>
        Selection: {selection ? JSON.stringify(selection) : "None"}
      </span>
    </div>
  ),
}));

describe("FilterPanel", () => {
  const mockFilterConfig = [
    {
      id: "filter1",
      label: "Filter 1",
      type: "multi",
      options: ["option1", "option2"],
    },
    {
      id: "filter2",
      label: "Filter 2",
      type: "milestone-date",
      options: [{ value: "start_date", label: "Start Date" }],
    },
  ];

  const mockFilterSelections = {
    filter1: ["option2"],
    filter2: null,
  };

  it("renders all filters from config", () => {
    render(
      <FilterPanel
        filterConfig={mockFilterConfig}
        filterSelections={mockFilterSelections}
        handleFilterSelection={() => {}}
      />
    );

    expect(screen.getByTestId("multi-select-Filter 1")).toBeInTheDocument();
    expect(screen.getByTestId("date-filter-Filter 2")).toBeInTheDocument();
  });

  it("passes correct props to MultiSelectDropdown", () => {
    render(
      <FilterPanel
        filterConfig={mockFilterConfig}
        filterSelections={mockFilterSelections}
        handleFilterSelection={() => {}}
      />
    );

    const filter1 = screen.getByTestId("multi-select-Filter 1");
    expect(filter1).toHaveTextContent("Selected: option2");
  });

  it("handles multi-select change", () => {
    const handleFilterSelection = vi.fn(() => vi.fn()); // Curried function
    const onFilter1Change = vi.fn();
    handleFilterSelection.mockReturnValueOnce(onFilter1Change);

    render(
      <FilterPanel
        filterConfig={mockFilterConfig}
        filterSelections={mockFilterSelections}
        handleFilterSelection={handleFilterSelection}
      />
    );

    const button = screen.getByText("Select Option 1");
    fireEvent.click(button);

    expect(handleFilterSelection).toHaveBeenCalledWith(mockFilterConfig[0]);
    expect(onFilter1Change).toHaveBeenCalledWith(["option1"]);
  });

  it("handles date filter change", () => {
    const handleFilterSelection = vi.fn(() => vi.fn()); // Curried function
    const onFilter2Change = vi.fn();
    handleFilterSelection.mockReturnValue(onFilter2Change);
    // Note: mockReturnValueOnce would be consumed by the first render call for filter1 if we didn't use mockReturnValue or carefully order mocks.
    // Actually map calls it for each filter. So we need to be careful.
    // Let's just use a real implementation for the curry.
    
    const realHandleFilterSelection = (filter) => (val) => {
        if (filter.id === 'filter2') onFilter2Change(val);
    };

    render(
      <FilterPanel
        filterConfig={mockFilterConfig}
        filterSelections={mockFilterSelections}
        handleFilterSelection={realHandleFilterSelection}
      />
    );

    const button = screen.getByText("Select Date");
    fireEvent.click(button);

    expect(onFilter2Change).toHaveBeenCalledWith({
      field: "start_date",
      startDate: "2023-01-01",
    });
  });
});
