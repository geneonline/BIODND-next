import { useCallback, useEffect, useState } from "react";
import {
  persistPromoResultFlag,
  readPromoResultFlag,
} from "../utils/filterUtils";
import { checkAndLockUser } from "@/services/queryAssetService";

interface UseAssetLockStatusProps {
  token: string | null;
  subscriptionLevel: string | null;
  assetKey: string;
  onLock?: () => void;
}

export const useAssetLockStatus = ({
  token,
  subscriptionLevel,
  assetKey,
  onLock,
}: UseAssetLockStatusProps) => {
  const [isLocked, setIsLocked] = useState(false);
  // Initialize state function to avoid hydration mismatch if reading from localStorage
  // But strictly, reading localStorage during render is bad for hydration.
  // We should start with false and update in useEffect.
  const [forcePromoResult, setForcePromoResult] = useState(false);

  useEffect(() => {
    setForcePromoResult(readPromoResultFlag());
  }, []);

  useEffect(() => {
    if (subscriptionLevel === "Pro") {
      persistPromoResultFlag(false);
      setForcePromoResult(false);
    }
  }, [subscriptionLevel]);

  const handleUserLocked = useCallback(() => {
    if (subscriptionLevel === "Pro") return;
    setIsLocked(true);
    setForcePromoResult(true);
    persistPromoResultFlag(true);
    onLock?.();
  }, [subscriptionLevel, onLock]);

  useEffect(() => {
    let isCancelled = false;

    const checkLockStatus = async () => {
      if (!token || subscriptionLevel === "Pro") {
        if (isCancelled) return;
        setIsLocked(false);
        setForcePromoResult(false);
        persistPromoResultFlag(false);
        return;
      }

      try {
        const locked = await checkAndLockUser(token);
        if (isCancelled) return;

        if (locked) {
          setIsLocked(true);
          setForcePromoResult(true);
          persistPromoResultFlag(true);
          onLock?.();
        } else {
          setIsLocked(false);
          setForcePromoResult(false);
          persistPromoResultFlag(false);
        }
      } catch (error) {
        console.error("checkAndLockUser on load error:", error);
      }
    };

    checkLockStatus();

    return () => {
      isCancelled = true;
    };
  }, [token, subscriptionLevel, assetKey, onLock]);

  const handlePromoMaskClose = useCallback(() => {
    setIsLocked(false);
  }, []);

  return {
    isLocked,
    forcePromoResult,
    handleUserLocked,
    handlePromoMaskClose,
  };
};
