"use client";

import { useCallback, useMemo } from "react";
import { InstantSearch, Configure, Pagination } from "react-instantsearch";
import { useUser } from "@/hooks/useUser";
import { createSearchkitClient } from "@/lib/searchkitClient";
import PromoTrialCard from "@/components/Database/PromoTrialCard";
import SearchControls from "./SearchControls";
import FilterPanel from "./FilterPanel";
import FilterTags from "./FilterTags";
import ResultsToolbar from "./ResultsToolbar";
import AssetResultsTable from "./AssetResultsTable";
import { useAssetSearchParams } from "../hooks/useAssetSearchParams";
import { useAssetFilters } from "../hooks/useAssetFilters";
import { useAssetSelection } from "../hooks/useAssetSelection";
import { useAssetLockStatus } from "../hooks/useAssetLockStatus";
import {
  ASSET_OPTIONS,
  CLINICAL_TRIAL_DATE_FIELD_OPTIONS,
  DEVICE_DATE_FIELD_OPTIONS,
  DRUG_DATE_FIELD_OPTIONS,
  getAssetColumns,
  getAssetFilters,
} from "@/config/assetConfig";

const MAX_COMPARE_SELECTION = 10;

const AssetSearch = () => {
  // In Next.js, we should be careful with localStorage access during hydration.
  // useUser handles token internally or we pass it?
  // Let's assume useUser works for now (it was migrated).
  // But we need the token string for useAssetLockStatus.
  // Ideally useUser provides it.
  const { userData, token } = useUser(); // Ensure useUser returns token if available

  const {
    searchParams,
    searchParamsString,
    commitSearchParams,
    resolvedAssetOption,
    handleAssetNavigate,
  } = useAssetSearchParams();

  const filterConfig = useMemo(
    () => getAssetFilters(resolvedAssetOption.value),
    [resolvedAssetOption.value]
  );

  const tableColumns = useMemo(
    () => getAssetColumns(resolvedAssetOption.value),
    [resolvedAssetOption.value]
  );

  const primaryField =
    resolvedAssetOption.primaryField ?? tableColumns[0]?.field ?? "id";

  const facetAttributes = useMemo(() => {
    const attributeMap = new Map();

    const addAttribute = ({ attribute, field, type = "string" }: any) => {
      if (!attribute || !field) return;
      if (attributeMap.has(attribute)) return;
      attributeMap.set(attribute, { attribute, field, type });
    };

    filterConfig.forEach((filter) => {
      if (filter.field) {
        addAttribute({
          attribute: filter.field,
          field: filter.facetField ?? `${filter.field}.keyword`,
          type: filter.type === "number" ? "numeric" : "string",
        });
      }

      if (filter.type === "milestone-date") {
        filter.options?.forEach?.((option) => {
          if (!option?.value) return;
          addAttribute({
            attribute: option.value,
            field: option.value,
            type: "date",
          });
        });
      }
    });

    return Array.from(attributeMap.values());
  }, [filterConfig]);

  const sortingConfig = useMemo(() => {
    let options: any[] = [];
    if (resolvedAssetOption.value === "drug") {
      options = DRUG_DATE_FIELD_OPTIONS;
    } else if (resolvedAssetOption.value === "clinical-trial") {
      options = CLINICAL_TRIAL_DATE_FIELD_OPTIONS;
    } else if (resolvedAssetOption.value === "device") {
      options = DEVICE_DATE_FIELD_OPTIONS;
    }

    if (!options.length) return null;

    return options.reduce((acc, option) => {
      if (!option?.value) return acc;
      acc[`_${option.value}_desc`] = [{ field: option.value, order: "desc" }];
      return acc;
    }, {} as Record<string, any>);
  }, [resolvedAssetOption.value]);

  const searchSettings = useMemo(() => {
    const baseSettings: any = {
      search_attributes: ["*"],
      result_attributes: ["*"],
      facet_attributes: facetAttributes,
      index: resolvedAssetOption.indexName,
    };
    if (sortingConfig) baseSettings.sorting = sortingConfig;
    return baseSettings;
  }, [facetAttributes, resolvedAssetOption.indexName, sortingConfig]);

  const searchClient = useMemo(
    () => createSearchkitClient({ searchSettings }),
    [searchSettings]
  );

  const {
    filterSelections,
    filterString,
    filterTags,
    handleFilterSelection,
    handleTagRemove,
    handleResetFilters,
    resetSignal,
  } = useAssetFilters({
    filterConfig,
    searchParams,
    searchParamsString,
    commitSearchParams,
  });

  const activeDateField = useMemo(() => {
    const assetValue = resolvedAssetOption.value;
    if (assetValue === "drug") {
      return filterSelections?.drug_date?.field ?? null;
    }
    if (assetValue === "clinical-trial") {
      return filterSelections?.clinical_trial_date?.field ?? null;
    }
    if (assetValue === "device") {
      return filterSelections?.device_date?.field ?? null;
    }
    return null;
  }, [resolvedAssetOption.value, filterSelections]);

  const instantSearchIndexName = useMemo(
    () =>
      activeDateField
        ? `${resolvedAssetOption.indexName}_${activeDateField}_desc`
        : resolvedAssetOption.indexName,
    [activeDateField, resolvedAssetOption.indexName]
  );

  const { selected, toggleSelect, clearSelection } = useAssetSelection({
    maxSelections: MAX_COMPARE_SELECTION,
  });

  const subscriptionLevel =
    userData?.subscribeLevel ?? userData?.subscriptionLevel ?? null;

  const { isLocked, forcePromoResult, handleUserLocked, handlePromoMaskClose } =
    useAssetLockStatus({
      token: token ?? null, // useUser might return null or undefined
      subscriptionLevel,
      assetKey: resolvedAssetOption.value,
      onLock: clearSelection,
    });

  const initialQuery = useMemo(
    () => searchParams?.get("q") || "",
    [searchParams]
  );

  const handleQueryCommit = useCallback(
    (nextQuery: string) => {
      commitSearchParams((params) => {
        if (nextQuery) params.set("q", nextQuery);
        else params.delete("q");
      });
    },
    [commitSearchParams]
  );

  const handleResetAll = useCallback(() => {
    handleResetFilters();
    clearSelection();
  }, [handleResetFilters, clearSelection]);

  const compare = useCallback(() => {
    if (selected.length < 2) return;
    const baseUrl = `/database/compare/assets/${
      resolvedAssetOption.value
    }?ids=${selected.join(",")}`;
    const query = searchParams?.toString();
    window.open(query ? `${baseUrl}&${query}` : baseUrl, "_blank");
  }, [resolvedAssetOption.value, selected, searchParams]);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={instantSearchIndexName}
      routing={false} // We handle routing manually via useAssetFilters
    >
      <main className="px-4 pt-6 lg:pt-16 pb-20 flex justify-center text-sm1">
        <div className="bg-interface-background w-full">
          {isLocked && <PromoTrialCard onClose={handlePromoMaskClose} />}
          <div className=" mx-auto">
            <h1 className="text-[28px] md:text-[36px] font-bold mb-8 leading-tight text-text-primary-color">
              Explore Biotech Assets to Accelerate Strategic Decisions
            </h1>

            <div className="bg-white rounded-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)] flex flex-col gap-6">
              <SearchControls
                assetOptions={ASSET_OPTIONS}
                currentAssetOption={resolvedAssetOption}
                onAssetSelect={(value) => {
                  handleAssetNavigate(value);
                  clearSelection();
                }}
                initialQuery={initialQuery}
                resetSignal={resetSignal}
                onSearchLocked={handleUserLocked}
                onQueryCommit={handleQueryCommit}
                onReset={handleResetAll}
              />

              <FilterPanel
                filterConfig={filterConfig}
                filterSelections={filterSelections}
                handleFilterSelection={handleFilterSelection}
              />
            </div>

            <FilterTags tags={filterTags} onRemove={handleTagRemove} />
          </div>

          <Configure hitsPerPage={25} filters={filterString || undefined} />
          <div className="w-full mx-auto bg-white mt-6">
            <ResultsToolbar
              selectedCount={selected.length}
              maxSelection={MAX_COMPARE_SELECTION}
              onCompare={compare}
            />
            <AssetResultsTable
              selected={selected}
              toggleSelect={toggleSelect}
              columns={tableColumns}
              primaryField={primaryField}
              assetType={resolvedAssetOption.value}
              forcePromoResult={forcePromoResult}
              maxSelection={MAX_COMPARE_SELECTION}
            />
          </div>
          <div className="flex justify-center pt-6">
            <Pagination
              classNames={{
                root: "flex justify-end",
                list: "flex space-x-1",
                item: "rounded py-2 px-4 text-Gray-950",
                selectedItem: "text-primary-hovered bg-primaryBlue-100",
              }}
            />
          </div>
        </div>
      </main>
    </InstantSearch>
  );
};

export default AssetSearch;
