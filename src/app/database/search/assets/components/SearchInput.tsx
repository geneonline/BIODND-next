import { useEffect, useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch";
import {
  checkAndLockUser,
  isLockedResponse,
  storeAssetSearchRequest,
} from "@/services/queryAssetService";

interface SearchInputProps {
  initialQuery?: string;
  resetSignal?: number;
  onLock?: () => void;
  onQueryCommit?: (query: string) => void;
}

const SearchInput = ({
  initialQuery = "",
  resetSignal,
  onLock,
  onQueryCommit,
}: SearchInputProps) => {
  const { refine } = useSearchBox();
  const [value, setValue] = useState(initialQuery);
  const lastAppliedQueryRef = useRef<string | null>(null);

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
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  return (
    <input
      className="text-sm1 leading-tight w-full p-0 border-0 focus:ring-0 placeholder:text-text-color-gray"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Type keywords: treatment, disease condition, study trial, trial number, ..."
    />
  );
};

export default SearchInput;
