import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import ContactDetailMask from "@/parts/database/ContactDetailMask";

export const useTooltipCoords = () => {
  const triggerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
  }, []);

  return useMemo(
    () => ({
      triggerRef,
      isVisible,
      setIsVisible,
      updatePosition,
      coords,
    }),
    [coords, isVisible, updatePosition]
  );
};

export const StudyTitleCell = ({ value }) => {
  const { triggerRef, isVisible, setIsVisible, updatePosition, coords } =
    useTooltipCoords();
  const tooltipRoot =
    typeof document !== "undefined" ? document.body : null;

  const showTooltip = useCallback(() => {
    if (!value) return;
    updatePosition();
    setIsVisible(true);
  }, [setIsVisible, updatePosition, value]);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  useEffect(() => {
    if (!isVisible) return;
    updatePosition();
    const handleReposition = () => updatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isVisible, updatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={value ? 0 : -1}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="block"
      >
        <span className="line-clamp-3 overflow-hidden">{value ?? "-"}</span>
      </span>
      {isVisible &&
        value &&
        tooltipRoot &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] flex max-w-sm flex-col items-center gap-1 rounded-md bg-[#0a0d12] p-3 text-xs3 font-medium leading-[18px] text-[#d5d7da] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, calc(-100% - 8px))",
            }}
          >
            <span className="whitespace-pre-line text-start">{value}</span>
            <span className="block h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0a0d12]" />
          </div>,
          tooltipRoot
        )}
    </>
  );
};

export const renderFieldValue = (value) => {
  if (value === null || value === undefined) return "-";

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";

    return value.map((item, idx) => {
      if (item === null || item === undefined) {
        return <p key={idx}>-</p>;
      }

      if (typeof item === "object" && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length === 0) {
          return <p key={idx}>-</p>;
        }

        return (
          <Fragment key={idx}>
            <ul className="list-disc list-inside">
              {entries.map(([k, v]) => (
                <li key={k}>
                  {k}：
                  {typeof v === "object" && v !== null
                    ? JSON.stringify(v)
                    : String(v)}
                </li>
              ))}
            </ul>
            {idx < value.length - 1 && <br />}
          </Fragment>
        );
      }

      return (
        <p key={idx}>
          {typeof item === "object" && item !== null
            ? JSON.stringify(item)
            : String(item)}
        </p>
      );
    });
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "-";

    return (
      <ul className="list-disc list-inside">
        {entries.map(([k, v]) => (
          <li key={k}>
            {k}：
            {typeof v === "object" && v !== null
              ? JSON.stringify(v)
              : String(v)}
          </li>
        ))}
      </ul>
    );
  }

  return String(value);
};

const LABEL_COLUMN_WIDTH = 200;
const VALUE_COLUMN_WIDTH = 340;

const getTableStyle = (columnCount) => {
  const count = Math.max(columnCount, 1);
  const width = LABEL_COLUMN_WIDTH + count * VALUE_COLUMN_WIDTH;
  return {
    minWidth: `${width}px`,
    width: `${width}px`,
  };
};

const labelCellStyle = {
  width: `${LABEL_COLUMN_WIDTH}px`,
  minWidth: `${LABEL_COLUMN_WIDTH}px`,
  maxWidth: `${LABEL_COLUMN_WIDTH}px`,
};

const valueCellStyle = {
  width: `${VALUE_COLUMN_WIDTH}px`,
  minWidth: `${VALUE_COLUMN_WIDTH}px`,
  maxWidth: `${VALUE_COLUMN_WIDTH}px`,
};

export const TableBlockA = ({ rows, data }) => {
  const columnCount = data.length;
  const tableStyle = getTableStyle(columnCount);

  return (
    <div
      className="table-scroll-container overflow-x-auto overflow-y-visible scrollbar-hide border border-Gray-500"
      data-scroll-container="true"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <table className="border-collapse table-fixed" style={tableStyle}>
        <tbody>
          {rows.map(({ label, field, render, useTooltip }) => (
            <tr key={field} className="border-b border-Gray-500">
              <th
                className="bg-[powderblue] sticky left-0 z-10 text-textColor-secondary font-medium text-[16px] p-4 text-left align-top"
                style={labelCellStyle}
              >
                {label}
              </th>
              {data.map((item, i) => (
                <td
                  key={i}
                  className="bg-primaryBlue-100 p-4 text-text-primary-color text-[16px] font-medium border-l border-Gray-500 align-top"
                  style={valueCellStyle}
                >
                  {render ? (
                    render(item?.[field], item)
                  ) : useTooltip ? (
                    <StudyTitleCell value={item?.[field]} />
                  ) : (
                    renderFieldValue(item?.[field])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TableBlock = ({ title, rows, data, id, maskContact }) => {
  const columnCount = data.length;
  const tableStyle = getTableStyle(columnCount);

  return (
    <div id={id} className="border border-Gray-500 rounded-lg relative">
      <div
        className="bg-primary-default text-white text-[20px] font-medium px-4 py-2 rounded-t-lg table-titlebar"
        data-table-id={id}
      >
        {title}
      </div>
      <div
        className="table-scroll-container overflow-x-auto overflow-y-visible scrollbar-hide"
        data-scroll-container="true"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <table className="border-collapse table-fixed" style={tableStyle}>
          <tbody>
            {rows.map(({ label, field, render }) => (
              <tr key={field ?? label} className="border-b border-Gray-500">
                <th
                  className="bg-gray-100 sticky left-0 z-10 text-textColor-secondary font-medium p-4 text-left align-top"
                  style={labelCellStyle}
                >
                  {label}
                </th>
                {data.map((item, i) => (
                  <td
                    key={i}
                    className="bg-white p-4 text-text-primary-color border-l border-Gray-500 align-top"
                    style={valueCellStyle}
                  >
                    {render
                      ? render(item?.[field], item)
                      : renderFieldValue(item?.[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {maskContact && (
        <div className="absolute inset-0">
          <ContactDetailMask />
        </div>
      )}
    </div>
  );
};

export const createPlaceholderData = (length) =>
  Array.from({ length }, () => ({}));

export const alignResultsWithIds = (ids, hits, idField) => {
  if (!Array.isArray(ids) || !Array.isArray(hits)) return [];
  const lookup = new Map();
  hits.forEach((hit) => {
    const value = hit?.[idField];
    if (value === null || value === undefined) return;
    lookup.set(String(value), hit);
  });

  return ids.map((id) => lookup.get(String(id)) ?? {});
};

export const useComparePageLayout = (tabsContainerRef, deps = []) => {
  useEffect(() => {
    const summaryBlock = document.querySelector(
      `[data-compare-summary="true"]`
    );
    const titleBars = document.querySelectorAll(".table-titlebar");
    if (!summaryBlock || !titleBars.length) return;

    const onScroll = () => {
      const summaryBottom = summaryBlock.getBoundingClientRect().bottom;
      titleBars.forEach((bar) => {
        const parentBlock = bar.closest(".border");
        if (!parentBlock) return;
        const blockRect = parentBlock.getBoundingClientRect();
        if (summaryBottom <= 0 && blockRect.bottom > bar.offsetHeight) {
          bar.style.position = "fixed";
          bar.style.top = "96px";
          bar.style.left = `${blockRect.left}px`;
          bar.style.width = `${blockRect.width}px`;
          bar.style.zIndex = "100";
        } else {
          bar.style.position = "";
          bar.style.top = "";
          bar.style.left = "";
          bar.style.width = "";
          bar.style.zIndex = "";
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, deps);

  return useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const tabsContainer = tabsContainerRef.current;
      const tabsRect = tabsContainer?.getBoundingClientRect();
      const stickyTopValue = tabsContainer
        ? parseFloat(window.getComputedStyle(tabsContainer).top || "0")
        : 0;
      const stickyTop = Number.isFinite(stickyTopValue) ? stickyTopValue : 0;
      const offset = stickyTop + (tabsRect?.height ?? 0);
      const elementTop = el.getBoundingClientRect().top + window.scrollY - 8;
      const targetPosition = Math.max(elementTop - offset, 0);

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    },
    [tabsContainerRef]
  );
};
