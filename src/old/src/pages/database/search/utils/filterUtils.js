const DATE_SELECTION_SEPARATOR = "|";

export const isMilestoneDateFilter = (filter) =>
  (filter?.type ?? "") === "milestone-date";

const deserializeMilestoneDateSelection = (filter, rawValue) => {
  if (!rawValue) return null;
  const [field = "", startDate = "", endDate = ""] = rawValue.split(
    DATE_SELECTION_SEPARATOR
  );
  if (!field) return null;
  const label =
    filter.options?.find?.((option) => option.value === field)?.label ?? field;
  return {
    field,
    label,
    startDate: startDate || "",
    endDate: endDate || "",
  };
};

export const serializeMilestoneDateSelection = (selection) => {
  if (!selection?.field) return null;
  const start = selection.startDate ?? "";
  const end = selection.endDate ?? "";
  return [selection.field, start, end].join(DATE_SELECTION_SEPARATOR);
};

export const createSelectionsFromParams = (filterConfig = [], params) => {
  const selections = {};
  filterConfig.forEach((filter) => {
    if (isMilestoneDateFilter(filter)) {
      const rawValue = params?.get?.(filter.queryParam) ?? "";
      selections[filter.id] = deserializeMilestoneDateSelection(
        filter,
        rawValue
      );
      return;
    }
    const value = params?.get?.(filter.queryParam) ?? null;
    selections[filter.id] = value ? value.split(",") : [];
  });
  return selections;
};

const buildMilestoneDateClause = (selection) => {
  if (!selection?.field) return null;
  const hasStart = Boolean(selection.startDate);
  const hasEnd = Boolean(selection.endDate);
  if (!hasStart && !hasEnd) return null;
  const lower = hasStart ? selection.startDate : "*";
  const upper = hasEnd ? selection.endDate : "*";
  return `${selection.field}:[${lower} TO ${upper}]`;
};

export const buildFilterString = (filterConfig = [], selections = {}) =>
  filterConfig
    .map((filter) => {
      if (isMilestoneDateFilter(filter)) {
        return buildMilestoneDateClause(selections[filter.id]);
      }
      const values = selections[filter.id] ?? [];
      if (!values.length) return null;
      const joined = values.map((val) => `"${val}"`).join(" OR ");
      return `${filter.field}:(${joined})`;
    })
    .filter(Boolean)
    .join(" AND ");

export const normalizeSelectionValue = (value) => {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? value : String(value);
};

const buildMilestoneTagValue = (filter, selection) => {
  if (!selection?.field) return null;
  const hasRange = selection.startDate || selection.endDate;
  if (!hasRange) return null;
  const rangeLabel = selection.startDate
    ? selection.endDate
      ? `${selection.startDate} to ${selection.endDate}`
      : `>= ${selection.startDate}`
    : `<= ${selection.endDate}`;
  const optionLabel = selection.label ?? selection.field;
  return `${filter.label}: ${optionLabel} (${rangeLabel})`;
};

export const buildFilterTags = (filterConfig = [], filterSelections = {}) =>
  filterConfig.flatMap((filter) => {
    if (isMilestoneDateFilter(filter)) {
      const selection = filterSelections[filter.id];
      const tagValue = buildMilestoneTagValue(filter, selection);
      if (!tagValue) return [];
      return [
        {
          id: `${filter.id}-${selection.field}`,
          filterId: filter.id,
          value: tagValue,
          displayLabel: tagValue,
        },
      ];
    }
    const selectedValues = filterSelections[filter.id] ?? [];
    if (!selectedValues.length) return [];
    return selectedValues.map((value) => ({
      id: `${filter.id}-${value}`,
      filterId: filter.id,
      value,
      displayLabel: `${filter.label}: ${value}`,
    }));
  });

export const PROMO_RESULT_STORAGE_KEY = "asset-search-force-promo-card";

export const readPromoResultFlag = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PROMO_RESULT_STORAGE_KEY) === "true";
};

export const persistPromoResultFlag = (value) => {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(PROMO_RESULT_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(PROMO_RESULT_STORAGE_KEY);
  }
};
