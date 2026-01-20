import { useEffect, useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch";
import {
  checkAndLockUser,
  isLockedResponse,
  storeAssetSearchRequest,
} from "@/services/queryAssetService";

const SearchInput = ({ initialQuery, resetSignal, onLock, onQueryCommit }) => {
  const { refine } = useSearchBox();
  const [value, setValue] = useState(initialQuery);
  const lastAppliedQueryRef = useRef(null);

  useEffect(() => {
    setValue(initialQuery);
    if (lastAppliedQueryRef.current === initialQuery) {
      return;
    }
    lastAppliedQueryRef.current = initialQuery;
    refine(initialQuery);
  }, [initialQuery, refine]);

  useEffect(() => {
    if (!resetSignal) return;
    setValue("");
    lastAppliedQueryRef.current = "";
    refine("");
  }, [resetSignal, refine]);

  const performSearch = async () => {
    const token = localStorage.getItem("token");

    try {
      const lockedBeforeSearch = await checkAndLockUser(token);
      if (lockedBeforeSearch) {
        onLock?.();
        return;
      }

      refine(value);
      lastAppliedQueryRef.current = value;
      onQueryCommit?.(value);

      await storeAssetSearchRequest(token, {
        queryAssetRequest: JSON.stringify({ q: value }),
      });

      const lockedAfterSearch = await checkAndLockUser(token);
      if (lockedAfterSearch) {
        onLock?.();
      }
    } catch (error) {
      console.error("performSearch error:", error);
      if (isLockedResponse(error)) {
        onLock?.();
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  return (
    <input
      className="text-sm1 leading-tight w-full p-0 border-0 focus:ring-0"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Type keywords: treatment, disease condition, study trial, trial number, ..."
    />
  );
};

export default SearchInput;
