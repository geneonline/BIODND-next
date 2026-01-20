import { useCallback, useState } from "react";
import { normalizeSelectionValue } from "../utils/filterUtils";

export const useAssetSelection = ({ maxSelections = 5 } = {}) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = useCallback(
    (id) => {
      const normalized = normalizeSelectionValue(id);
      if (normalized === null) return;
      setSelected((prev) => {
        if (prev.includes(normalized)) {
          return prev.filter((item) => item !== normalized);
        }
        if (prev.length >= maxSelections) return prev;
        return [...prev, normalized];
      });
    },
    [maxSelections]
  );

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  return { selected, toggleSelect, clearSelection };
};
