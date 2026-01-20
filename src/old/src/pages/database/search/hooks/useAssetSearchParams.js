import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ASSET_OPTIONS,
  DEFAULT_ASSET_TYPE,
  getAssetOption,
} from "../assetConfig";

export const useAssetSearchParams = () => {
  const { assetType } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const resolvedAssetOption =
    useMemo(() => getAssetOption(assetType), [assetType]) ??
    getAssetOption(DEFAULT_ASSET_TYPE) ??
    ASSET_OPTIONS[0];

  const isAssetTypeValid = useMemo(
    () => Boolean(getAssetOption(assetType)),
    [assetType]
  );

  useEffect(() => {
    if (isAssetTypeValid || !resolvedAssetOption) return;
    const query = searchParamsString ? `?${searchParamsString}` : "";
    navigate(`/database/search/assets/${resolvedAssetOption.value}${query}`, {
      replace: true,
    });
  }, [
    assetType,
    isAssetTypeValid,
    navigate,
    resolvedAssetOption,
    searchParamsString,
  ]);

  const commitSearchParams = useCallback(
    (updater, options) => {
      setSearchParams((currentParams) => {
        const params = new URLSearchParams(currentParams);
        updater(params);
        return params;
      }, options);
    },
    [setSearchParams]
  );

  const handleAssetNavigate = useCallback(
    (value) => {
      navigate(`/database/search/assets/${value}`);
    },
    [navigate]
  );

  return {
    assetType,
    searchParams,
    setSearchParams,
    searchParamsString,
    commitSearchParams,
    resolvedAssetOption,
    handleAssetNavigate,
  };
};
