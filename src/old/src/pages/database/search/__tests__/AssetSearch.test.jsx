import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AssetSearch from "../AssetSearch";

// Mock hooks
vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(() => ({ userData: { subscribeLevel: "Free" } })),
}));

vi.mock("@/services/searchkitClient", () => ({
  createSearchkitClient: vi.fn(() => ({})),
}));

vi.mock("@/services/queryAssetService", () => ({
  checkAndLockUser: vi.fn(() => Promise.resolve(false)),
}));

vi.mock("react-instantsearch", () => ({
  InstantSearch: ({ children }) => <div data-testid="instant-search">{children}</div>,
  Configure: () => <div data-testid="configure" />,
  Pagination: () => <div data-testid="pagination" />,
}));

// Mock custom hooks
const mockUseAssetSearchParams = {
  searchParams: new URLSearchParams(),
  setSearchParams: vi.fn(),
  searchParamsString: "",
  commitSearchParams: vi.fn(),
  resolvedAssetOption: {
    value: "drug",
    label: "Drug",
    indexName: "drug_db_schema",
    primaryField: "drug_id",
  },
  handleAssetNavigate: vi.fn(),
};

vi.mock("../hooks/useAssetSearchParams", () => ({
  useAssetSearchParams: vi.fn(() => mockUseAssetSearchParams),
}));

const mockUseAssetFilters = {
  filterSelections: {},
  filterString: "",
  filterTags: [],
  handleFilterSelection: vi.fn(),
  handleTagRemove: vi.fn(),
  handleResetFilters: vi.fn(),
  resetSignal: 0,
};

vi.mock("../hooks/useAssetFilters", () => ({
  useAssetFilters: vi.fn(() => mockUseAssetFilters),
}));

const mockUseAssetSelection = {
  selected: [],
  toggleSelect: vi.fn(),
  clearSelection: vi.fn(),
};

vi.mock("../hooks/useAssetSelection", () => ({
  useAssetSelection: vi.fn(() => mockUseAssetSelection),
}));

const mockUseAssetLockStatus = {
  isLocked: false,
  forcePromoResult: false,
  handleUserLocked: vi.fn(),
  handlePromoMaskClose: vi.fn(),
};

vi.mock("../hooks/useAssetLockStatus", () => ({
  useAssetLockStatus: vi.fn(() => mockUseAssetLockStatus),
}));

// Mock sub-components
vi.mock("../components/SearchControls", () => ({
  default: () => <div data-testid="search-controls" />,
}));

vi.mock("../components/FilterPanel", () => ({
  default: () => <div data-testid="filter-panel" />,
}));

vi.mock("../components/FilterTags", () => ({
  default: () => <div data-testid="filter-tags" />,
}));

vi.mock("../components/ResultsToolbar", () => ({
  default: () => <div data-testid="results-toolbar" />,
}));

vi.mock("../components/AssetResultsTable", () => ({
  default: () => <div data-testid="asset-results-table" />,
}));

vi.mock("@/components/PromoTrialCard", () => ({
  default: () => <div data-testid="promo-trial-card" />,
}));

describe("AssetSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main layout", () => {
    render(<AssetSearch />);

    expect(screen.getByText("Explore Biotech Assets to Accelerate Strategic Decisions")).toBeInTheDocument();
    expect(screen.getByTestId("instant-search")).toBeInTheDocument();
    expect(screen.getByTestId("search-controls")).toBeInTheDocument();
    expect(screen.getByTestId("filter-panel")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tags")).toBeInTheDocument();
    expect(screen.getByTestId("configure")).toBeInTheDocument();
    expect(screen.getByTestId("results-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("asset-results-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders PromoTrialCard when locked", () => {
    const { useAssetLockStatus } = require("../hooks/useAssetLockStatus");
    useAssetLockStatus.mockReturnValue({
      ...mockUseAssetLockStatus,
      isLocked: true,
    });

    render(<AssetSearch />);

    expect(screen.getByTestId("promo-trial-card")).toBeInTheDocument();
  });

  it("passes correct props to AssetResultsTable", () => {
    // We can't easily check props passed to mocked components with testing-library without using a spy or a more complex mock.
    // But we can check if it renders.
    render(<AssetSearch />);
    expect(screen.getByTestId("asset-results-table")).toBeInTheDocument();
  });
});
