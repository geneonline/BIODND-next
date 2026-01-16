import { useCallback, useEffect, useMemo, useState } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";
import {
  buildFilterString,
  buildFilterTags,
  createSelectionsFromParams,
  isMilestoneDateFilter,
  serializeMilestoneDateSelection,
  FilterConfig,
} from "../utils/filterUtils";

interface UseAssetFiltersProps {
  filterConfig: FilterConfig[];
  searchParams: ReadonlyURLSearchParams | null;
  searchParamsString: string;
  commitSearchParams: (updater: (params: URLSearchParams) => void) => void;
  setSearchParams?: any; // Not used in Next.js version directly
}

export const useAssetFilters = ({
  filterConfig,
  searchParams,
  searchParamsString,
  commitSearchParams,
}: UseAssetFiltersProps) => {
  const [filterSelections, setFilterSelections] = useState(() => {
    // We need to convert ReadonlyURLSearchParams to URLSearchParams or compatible object
    return createSelectionsFromParams(
      filterConfig,
      new URLSearchParams(searchParamsString)
    );
  });

  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    setFilterSelections(createSelectionsFromParams(filterConfig, params));
  }, [filterConfig, searchParamsString]);

  const handleFilterSelection = useCallback(
    (filter: FilterConfig) => (value: any) => {
      const isDateFilter = isMilestoneDateFilter(filter);
      const nextValue = value ?? (isDateFilter ? null : []);

      setFilterSelections((prev: any) => ({
        ...prev,
        [filter.id]: nextValue,
      }));

      commitSearchParams((params: URLSearchParams) => {
        if (isDateFilter) {
          const serialized = serializeMilestoneDateSelection(nextValue);
          if (serialized) {
            params.set(filter.queryParam, serialized);
          } else {
            params.delete(filter.queryParam);
          }
          return;
        }

        if (Array.isArray(nextValue) && nextValue.length) {
          params.set(filter.queryParam, nextValue.join(","));
        } else {
          params.delete(filter.queryParam);
        }
      });
    },
    [commitSearchParams]
  );

  const filterString = useMemo(
    () => buildFilterString(filterConfig, filterSelections),
    [filterConfig, filterSelections]
  );

  const filterTags = useMemo(
    () => buildFilterTags(filterConfig, filterSelections),
    [filterConfig, filterSelections]
  );

  const handleTagRemove = useCallback(
    (filterId: string, value: string) => {
      const filter = filterConfig.find((item) => item.id === filterId);
      if (!filter) return;
      if (isMilestoneDateFilter(filter)) {
        handleFilterSelection(filter)(null);
        return;
      }
      const currentValues = filterSelections[filterId] ?? [];
      const nextValues = currentValues.filter((item: string) => item !== value);
      handleFilterSelection(filter)(nextValues);
    },
    [filterConfig, filterSelections, handleFilterSelection]
  );

  const handleResetFilters = useCallback(() => {
    // Reset filters involves clearing all filter params
    commitSearchParams((params) => {
      filterConfig.forEach((f) => {
        params.delete(f.queryParam);
      });
    });
    setResetSignal((prev) => prev + 1);
  }, [filterConfig, commitSearchParams]);

  return {
    filterSelections,
    filterString,
    filterTags,
    handleFilterSelection,
    handleTagRemove,
    handleResetFilters,
    resetSignal,
  };
};
