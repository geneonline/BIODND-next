import AssetSearch from "../components/AssetSearch";
import { Suspense } from "react";
import { ASSET_OPTIONS } from "@/config/assetConfig";
import { notFound } from "next/navigation";

// Generate static params for known asset types to improve performance/SEO
export function generateStaticParams() {
  return ASSET_OPTIONS.map((asset) => ({
    assetType: asset.value,
  }));
}

export default function AssetSearchPage({
  params,
}: {
  params: { assetType: string };
}) {
  const assetType = params.assetType;
  const isValid = ASSET_OPTIONS.some((opt) => opt.value === assetType);

  if (!isValid) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssetSearch />
    </Suspense>
  );
}
