import { useCallback, useEffect, useMemo } from "react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { ASSET_OPTIONS, getAssetOption } from "@/config/assetConfig";

export const useAssetSearchParams = () => {
  const params = useParams();
  const assetType = params?.assetType as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsString = searchParams?.toString() ?? "";

  const resolvedAssetOption =
    useMemo(() => getAssetOption(assetType), [assetType]) ?? ASSET_OPTIONS[0];

  const isAssetTypeValid = useMemo(
    () => Boolean(getAssetOption(assetType)),
    [assetType]
  );

  // In Next.js, we don't need to auto-redirect invalid asset types here if the page is dynamic [assetType].
  // But strictly speaking we could. For now let's rely on valid links.

  // Helper to commit params
  const commitSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const current = new URLSearchParams(
        Array.from(searchParams?.entries() ?? [])
      );
      updater(current);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [router, pathname, searchParams]
  );

  const handleAssetNavigate = useCallback(
    (value: string) => {
      router.push(`/database/search/assets/${value}`);
    },
    [router]
  );

  return {
    assetType,
    searchParams, // ReadonlyURLSearchParams
    searchParamsString,
    commitSearchParams,
    resolvedAssetOption,
    handleAssetNavigate,
  };
};
