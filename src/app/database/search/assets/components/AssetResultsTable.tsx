import { useState, useEffect, useRef } from "react";
import PromoTrialInline from "@/components/Database/PromoTrialInline";
import useGlobalHorizontalScrollbar from "@/hooks/useGlobalHorizontalScrollbar";
import { useHits, useInstantSearch } from "react-instantsearch";
import { normalizeSelectionValue } from "../utils/filterUtils";

interface AssetResultsTableProps {
  selected: string[];
  toggleSelect: (id: string) => void;
  columns: any[];
  primaryField: string;
  assetType: string;
  forcePromoResult: boolean;
  maxSelection?: number;
}

const renderCellContent = (column: any, rawValue: any) => {
  if (Array.isArray(rawValue)) {
    const items = rawValue
      .flatMap((item) => {
        if (item === null || item === undefined) return [];

        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          const text = String(item).trim();
          return text ? [text] : [];
        }

        if (typeof item === "object") {
          return Object.values(item)
            .flatMap((value) => {
              if (
                value === null ||
                value === undefined ||
                typeof value === "object"
              ) {
                return [];
              }
              const text = String(value).trim();
              return text ? [text] : [];
            })
            .filter(Boolean);
        }

        return [];
      })
      .filter(Boolean);

    if (!items.length) return "-";

    // Limit array display to avoid huge rows
    const displayItems = items.slice(0, 5);
    const hasMore = items.length > 5;

    return (
      <ul className="list-disc pl-4 space-y-1 text-sm1 leading-6 text-textColor-Tertiary">
        {displayItems.map((item: any, idx: number) => (
          <li key={`${column.id}-${idx}`}>{item}</li>
        ))}
        {hasMore && <li className="text-Gray-500 italic">...</li>}
      </ul>
    );
  }

  if (
    rawValue === null ||
    rawValue === undefined ||
    (typeof rawValue === "string" && rawValue.trim() === "")
  ) {
    return "-";
  }

  return rawValue;
};

const StickyHeader = ({
  columns,
  columnWidths,
  containerMetrics,
  scrollRef,
}: any) => {
  if (!containerMetrics) return null;

  return (
    <div
      className="fixed top-[100px] z-40 overflow-hidden"
      style={{
        width: containerMetrics.width,
        left: containerMetrics.left,
      }}
      data-scroll-container="true"
      ref={scrollRef}
    >
      <table
        className="text-sm1 text-left bg-white shadow-search-result-grid"
        style={{ width: containerMetrics.scrollWidth }}
      >
        <thead className="bg-Gray-250 text-textColor-secondary text-base font-semibold">
          <tr>
            <th
              className="sticky left-0 z-20 py-3 px-2 bg-Gray-250 whitespace-nowrap"
              style={{ width: columnWidths[0], minWidth: columnWidths[0] }}
            >
              Select
            </th>
            {columns.map((column: any, index: number) => {
              const headerExtra =
                column.headerClassName ??
                column.className ??
                "whitespace-nowrap ";
              const headerClass = `py-3 px-2 ${headerExtra}`;
              const stickyClass =
                index === 0
                  ? "sticky left-16 bg-Gray-250 whitespace-nowrap"
                  : "";
              const width = columnWidths[index + 1];
              return (
                <th
                  key={column.id}
                  className={`${stickyClass} ${headerClass}`}
                  style={{ width, minWidth: width }}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
};

const AssetResultsTable = ({
  selected,
  toggleSelect,
  columns,
  primaryField,
  assetType,
  forcePromoResult,
  maxSelection = 5,
}: AssetResultsTableProps) => {
  const { hits } = useHits();
  const { status } = useInstantSearch();
  const [isSticky, setIsSticky] = useState(false);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [containerMetrics, setContainerMetrics] = useState<any>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const stickyScrollRef = useRef<HTMLDivElement>(null);

  const { bottomScrollRef, showScrollbar, scrollbarInnerWidth } =
    useGlobalHorizontalScrollbar({
      dependencies: [hits, columns, isSticky],
    });

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;
      const rect = tableRef.current.getBoundingClientRect();
      const thead = tableRef.current.querySelector("thead");
      const headerHeight = thead ? thead.getBoundingClientRect().height : 50;

      // 88px is the navbar height + offset.
      setIsSticky(rect.top < 88 && rect.bottom > 88 + headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!tableRef.current) return;

    const measure = () => {
      const table = tableRef.current;
      if (!table) return;
      const ths = table.querySelectorAll("thead th");
      const widths = Array.from(ths).map(
        (th) => th.getBoundingClientRect().width
      );
      setColumnWidths(widths);

      const container = table.parentElement;
      if (container) {
        const { width, left } = container.getBoundingClientRect();
        setContainerMetrics({ width, left, scrollWidth: table.scrollWidth });
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    const tableEl = tableRef.current;
    if (tableEl) {
      resizeObserver.observe(tableEl);
      if (tableEl.parentElement) {
        resizeObserver.observe(tableEl.parentElement);
      }
    }

    return () => resizeObserver.disconnect();
  }, [hits, columns]);

  if (forcePromoResult) {
    return (
      <div className="py-10 px-4">
        <PromoTrialInline />
      </div>
    );
  }

  if (status === "loading" || status === "stalled") {
    // Keep showing cached hits if available, or skeleton
    if (hits.length === 0) {
      return (
        <div className="py-10 text-center text-main-text-gray">Loading...</div>
      );
    }
  }

  if (!hits.length && status !== "loading" && status !== "stalled") {
    return (
      <div className="py-10 text-center text-main-text-gray">
        We couldn't find any match for your search.
      </div>
    );
  }

  return (
    <div className="relative pb-8">
      <div
        className="table-scroll-container relative overflow-x-auto overflow-y-visible scrollbar-hide"
        data-scroll-container="true"
        style={
          {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
      >
        <table
          ref={tableRef}
          className="max-w-[1200px] min-w-full text-sm1 text-left bg-white shadow-search-result-grid"
        >
          <thead
            className={`bg-Gray-250 text-textColor-secondary text-sm1 font-semibold ${
              isSticky ? "invisible" : ""
            }`}
          >
            <tr>
              <th className="sticky left-0 z-20 py-3 px-2 bg-Gray-250  whitespace-nowrap w-16">
                Select
              </th>
              {columns.map((column: any, index: number) => {
                const headerExtra =
                  column.headerClassName ??
                  column.className ??
                  "whitespace-nowrap";
                const headerClass = `py-3 px-2 ${headerExtra}`;
                const stickyClass =
                  index === 0
                    ? "sticky left-16 bg-Gray-250 whitespace-nowrap"
                    : "";
                return (
                  <th
                    key={column.id}
                    className={`${stickyClass} ${headerClass}`}
                  >
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-db-table-color text-main-text-gray">
            {hits.map((hit: any, idx: number) => {
              const rawId = hit?.[primaryField];
              const selectionValue = normalizeSelectionValue(rawId);
              const isSelectable = selectionValue !== null;
              const isSelected = isSelectable
                ? selected.includes(selectionValue as string)
                : false;

              const bgClass =
                idx % 2 === 0 ? "bg-white" : "bg-interface-background";
              const isSelectClass = isSelected
                ? "font-semibold text-textColor-primary bg-primaryBlue-100"
                : "font-normal text-textColor-Tertiary ";

              return (
                <tr
                  key={selectionValue ?? idx}
                  className={`group cursor-pointer ${bgClass} hover:bg-primaryBlue-100`}
                  onClick={() => {
                    if (!isSelectable) return;
                    const encodedId = encodeURIComponent(
                      selectionValue as string
                    );
                    window.open(
                      `/database/data/assets/${assetType}/${encodedId}`,
                      "_blank"
                    );
                  }}
                >
                  <td
                    className={`sticky left-0 z-10 p-4 text-center ${bgClass} ${isSelectClass}  group-hover:bg-primaryBlue-100`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className={`size-5 border border-Gray-500 focus:ring-0 focus:outline-none cursor-pointer
                      checked:bg-primary-default checked:border-primary-default`}
                      checked={isSelected}
                      onChange={() => {
                        if (!isSelectable) return;
                        toggleSelect(selectionValue as string);
                      }}
                      disabled={
                        (!isSelected && selected.length >= maxSelection) ||
                        !isSelectable
                      }
                    />
                  </td>

                  {columns.map((column: any, index: number) => {
                    const value = hit?.[column.field];
                    const displayValue = renderCellContent(column, value);
                    const cellExtra =
                      column.cellClassName ??
                      column.className ??
                      "whitespace-nowrap";
                    const baseClass = `py-3 px-2 ${cellExtra}`;
                    const stickyClass =
                      index === 0
                        ? `sticky left-16 z-10 ${bgClass} ${isSelectClass} group-hover:bg-primaryBlue-100`
                        : `${isSelectClass} group-hover:bg-primaryBlue-100`;

                    return (
                      <td
                        key={column.id}
                        className={`${stickyClass} ${baseClass}`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showScrollbar && scrollbarInnerWidth > 0 && (
        <div className="sticky bottom-3 z-30 mt-4 pointer-events-none">
          <div
            ref={bottomScrollRef}
            className="pointer-events-auto overflow-x-auto overflow-y-hidden rounded-full border border-Gray-500 bg-white/90 shadow-md backdrop-blur-sm"
          >
            <div
              style={{ width: `${scrollbarInnerWidth}px`, height: "16px" }}
            />
          </div>
        </div>
      )}
      {isSticky && (
        <StickyHeader
          columns={columns}
          columnWidths={columnWidths}
          containerMetrics={containerMetrics}
          scrollRef={stickyScrollRef}
        />
      )}
    </div>
  );
};

export default AssetResultsTable;
