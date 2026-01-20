import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AssetResultsTable from "../AssetResultsTable";
import { useHits, useInstantSearch } from "react-instantsearch";

// Mock hooks
vi.mock("react-instantsearch", () => ({
  useHits: vi.fn(() => ({ hits: [] })),
  useInstantSearch: vi.fn(() => ({ status: "idle" })),
}));

vi.mock("@/hooks/useGlobalHorizontalScrollbar", () => ({
  useGlobalHorizontalScrollbar: vi.fn(() => ({
    bottomScrollRef: { current: null },
    showScrollbar: false,
    scrollbarInnerWidth: 0,
  })),
}));

vi.mock("@/parts/database/PromoTrialInline", () => ({
  default: () => <div data-testid="promo-trial-inline">Promo Trial</div>,
}));

describe("AssetResultsTable", () => {
  const mockColumns = [
    { id: "col1", label: "Column 1", field: "field1" },
    { id: "col2", label: "Column 2", field: "field2" },
  ];

  const mockHits = [
    { objectID: "1", field1: "Value 1", field2: "Value 2" },
    { objectID: "2", field1: "Value 3", field2: "Value 4" },
  ];

  it("renders loading state", () => {
    useInstantSearch.mockReturnValue({ status: "loading" });

    render(
      <AssetResultsTable
        selected={[]}
        toggleSelect={() => {}}
        columns={mockColumns}
        primaryField="objectID"
        assetType="drug"
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    useInstantSearch.mockReturnValue({ status: "idle" });
    useHits.mockReturnValue({ hits: [] });

    render(
      <AssetResultsTable
        selected={[]}
        toggleSelect={() => {}}
        columns={mockColumns}
        primaryField="objectID"
        assetType="drug"
      />
    );

    expect(
      screen.getByText("We couldn't find any match for your search.")
    ).toBeInTheDocument();
  });

  it("renders table with data", () => {
    useInstantSearch.mockReturnValue({ status: "idle" });
    useHits.mockReturnValue({ hits: mockHits });

    render(
      <AssetResultsTable
        selected={[]}
        toggleSelect={() => {}}
        columns={mockColumns}
        primaryField="objectID"
        assetType="drug"
      />
    );

    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Value 2")).toBeInTheDocument();
  });

  it("handles selection", () => {
    useInstantSearch.mockReturnValue({ status: "idle" });
    useHits.mockReturnValue({ hits: mockHits });
    const toggleSelect = vi.fn();

    render(
      <AssetResultsTable
        selected={[]}
        toggleSelect={toggleSelect}
        columns={mockColumns}
        primaryField="objectID"
        assetType="drug"
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(toggleSelect).toHaveBeenCalledWith("1");
  });

  it("renders promo card when forcePromoResult is true", () => {
    useInstantSearch.mockReturnValue({ status: "idle" });
    useHits.mockReturnValue({ hits: mockHits });
    
    render(
      <AssetResultsTable
        selected={[]}
        toggleSelect={() => {}}
        columns={mockColumns}
        primaryField="objectID"
        assetType="drug"
        forcePromoResult={true}
      />
    );

    expect(screen.getByTestId("promo-trial-inline")).toBeInTheDocument();
  });
});
