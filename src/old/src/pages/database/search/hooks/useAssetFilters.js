import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildFilterString,
  buildFilterTags,
  createSelectionsFromParams,
  isMilestoneDateFilter,
  serializeMilestoneDateSelection,
} from "../utils/filterUtils.js";

export const useAssetFilters = ({
  filterConfig,
  searchParams,
  searchParamsString,
  setSearchParams,
  commitSearchParams,
}) => {
  const [filterSelections, setFilterSelections] = useState(() =>
    createSelectionsFromParams(filterConfig, searchParams)
  );
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    setFilterSelections(createSelectionsFromParams(filterConfig, params));
  }, [filterConfig, searchParamsString]);

  const handleFilterSelection = useCallback(
    (filter) =>
      (value) => {
        const isDateFilter = isMilestoneDateFilter(filter);
        const nextValue =
          value ?? (isDateFilter ? null : []);

        setFilterSelections((prev) => ({
          ...prev,
          [filter.id]: nextValue,
        }));

        commitSearchParams((params) => {
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
    (filterId, value) => {
      const filter = filterConfig.find((item) => item.id === filterId);
      if (!filter) return;
      if (isMilestoneDateFilter(filter)) {
        handleFilterSelection(filter)(null);
        return;
      }
      const currentValues = filterSelections[filterId] ?? [];
      const nextValues = currentValues.filter((item) => item !== value);
      handleFilterSelection(filter)(nextValues);
    },
    [filterConfig, filterSelections, handleFilterSelection]
  );

  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams();
    setFilterSelections(createSelectionsFromParams(filterConfig, params));
    setSearchParams(() => params);
    setResetSignal((prev) => prev + 1);
  }, [filterConfig, setSearchParams]);

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
