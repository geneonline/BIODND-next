"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { executeSearchkitQuery } from "@/lib/searchkitClient";
import ShareButton from "@/app/database/data/assets/components/widgets/ShareButton";
import PrintButton from "@/app/database/data/assets/components/widgets/PrintButton";
import ExportButton from "@/app/database/data/assets/components/widgets/ExportButton";
import { useGlobalHorizontalScrollbar } from "@/hooks/useGlobalHorizontalScrollbar";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/context/AuthContext";
import {
  TableBlock,
  TableBlockA,
  alignResultsWithIds,
  createPlaceholderData,
  useComparePageLayout,
} from "../../components/compareComponents";

const INDEX_NAME = "drug_db_schema";
const ID_FIELD = "drug_id";

const renderLink = (value: string) =>
  value ? (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="text-primary-default underline break-words"
    >
      {value}
    </a>
  ) : (
    "-"
  );

const summaryRows = [
  { label: "Drug Number", field: "drug_id" },
  { label: "Drug Name", field: "drug_name", useTooltip: true },
];

const baseInfoRows = [
  { label: "ATC code", field: "atc_code" },
  { label: "Generic Name", field: "generic_name" },
  { label: "Region / Country", field: "region_country" },
  { label: "Organization", field: "organization" },
  {
    label: "Drug Registry",
    field: "drug_registry_T",
    render: (_value: any, item: any) => renderLink(item?.registry_url),
  },
  { label: "Disease Condition", field: "conditions" },
  { label: "Brief Summary", field: "brief_summary" },
  { label: "Drug Class", field: "drug_class" },
  { label: "Drug Category", field: "drug_category" },
];

const ingredientsRows = [
  { label: "Dosage Form", field: "dosage_form" },
  { label: "Route / Spec", field: "route" },
  { label: "Active Ingredients", field: "active_ingredients" },
  { label: "Substance Name", field: "substance_name" },
  { label: "Package Spec.", field: "package_specification" },
];

const reviewRows = [
  { label: "Application ID", field: "application_id" },
  { label: "Submission Type", field: "submission_type" },
  { label: "Application Type", field: "application_type" },
  { label: "Product NDC", field: "product_ndc" },
  { label: "Package NDC", field: "package_ndc" },
  { label: "Reference Drug", field: "reference_drug" },
  { label: "Reference Standard", field: "reference_standard" },
  { label: "TE Code", field: "te_code" },
  { label: "RxCUI", field: "rxcui" },
  { label: "UNII", field: "unii" },
  { label: "SPL ID", field: "spl_id" },
  { label: "SPL SET ID", field: "spl_set_id" },
  { label: "Pharm Class EPC", field: "pharm_class_epc" },
  { label: "Pharm Class MOA", field: "pharm_class_moa" },
  { label: "Submission Number", field: "submission_number" },
  { label: "Submission Status", field: "submission_status" },
  { label: "Submission Class Code", field: "submission_class_code" },
  {
    label: "Submission Class Code Description",
    field: "submission_class_code_description",
  },
  {
    label: "Application Docs",
    field: "application_url",
    render: (value: any) => renderLink(value),
  },
  { label: "Additional Monitoring", field: "additional_monitoring" },
  { label: "Generic", field: "generic" },
  { label: "Biosimilar", field: "biosimilar" },
  { label: "Conditional Approval", field: "conditional_approval" },
  { label: "Exceptional Circumstances", field: "exceptional_circumstances" },
  { label: "Accelerated Assessment", field: "accelerated_assessment" },
  { label: "Orphan Medicine", field: "orphan_medicine" },
  { label: "Advanced Therapy", field: "advanced_therapy" },
  { label: "Prime Medicine", field: "prime_medicine" },
];

const progressRows = [
  { label: "Submission Status Date", field: "submission_status_date" },
  { label: "Opinion Date", field: "opinion_date" },
  { label: "Authorization Date", field: "application_date" },
  { label: "First Published", field: "first_published" },
  { label: "Last Update Date", field: "last_update_date" },
  { label: "Commission Decision Date", field: "commission_decision_date" },
];

const contactRows = [
  { label: "License Holder", field: "organization" },
  { label: "License Holder Address", field: "license_holder_address" },
  { label: "License Type", field: "license_type" },
  { label: "Manufacturing", field: "manufacturing" },
  { label: "Manufacturing Address", field: "manufacturing_address" },
];

const DrugCompareClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");
  const ids = useMemo(
    () => (idsParam ? idsParam.split(",").filter(Boolean) : []),
    [idsParam]
  );
  const [data, setData] = useState<any[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const { bottomScrollRef, showScrollbar, scrollbarInnerWidth } =
    useGlobalHorizontalScrollbar({ dependencies: [data, ids.length] });
  const { token } = useAuth();
  const { userData } = useUser(token);
  const shouldMaskContact = userData?.subscriptionLevel !== "Pro";
  const scrollToTable = useComparePageLayout(tabsContainerRef, [
    data,
    ids.length,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await executeSearchkitQuery({
          searchSettings: {
            search_attributes: ["*"],
            result_attributes: ["*"],
            facet_attributes: [
              {
                attribute: `${ID_FIELD}.keyword`,
                field: `${ID_FIELD}.keyword`,
                type: "string",
              },
            ],
          },
          requests: [
            {
              indexName: INDEX_NAME,
              params: {
                query: "",
                facetFilters: [ids.map((id) => `${ID_FIELD}.keyword:${id}`)],
                hitsPerPage: ids.length,
              },
            },
          ],
        });

        if (result?.results?.[0]?.hits) {
          const mappedData = result.results[0].hits.map(
            (hit: any) => hit._source || hit
          );
          const aligned = alignResultsWithIds(
            ids.map((id) => id),
            mappedData,
            ID_FIELD
          );
          setData(aligned);
        } else {
          setData(createPlaceholderData(ids.length));
        }
      } catch (error: any) {
        const status =
          error?.status ??
          error?.response?.status ??
          error?.details?.status ??
          error?.httpStatus;

        if (status === 401) {
          // localStorage.removeItem("token"); // Don't remove token on client unless sure
          router.replace("/account/login");
          return;
        }

        console.error("Error fetching data:", error);
        setData(createPlaceholderData(ids.length));
      }
    };
    if (ids.length) fetchData();
  }, [ids, router]);

  const displayData =
    data.length === ids.length ? data : createPlaceholderData(ids.length);
  const hasResults = displayData.some(
    (item) => Object.keys(item ?? {}).length > 0
  );

  const params = new URLSearchParams(searchParams.toString());
  params.delete("ids");

  const primaryDrugName = displayData.find(
    (item) => item?.drug_name
  )?.drug_name;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <main className="px-4 pt-6 lg:pt-16 flex justify-center">
      <div className="w-full bg-interface-background">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/database/search/assets/drug?${params.toString()}`}
              className="inline-flex items-center gap-1 px-4 py-2.5 font-medium text-sm1 text-primaryBlue-600"
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                preserveAspectRatio="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53033 2.46967C9.82322 2.76256 9.82322 3.23744 9.53033 3.53033L4.81066 8.25H15C16.7902 8.25 18.5071 8.96116 19.773 10.227C21.0388 11.4929 21.75 13.2098 21.75 15C21.75 16.7902 21.0388 18.5071 19.773 19.773C18.5071 21.0388 16.7902 21.75 15 21.75H12C11.5858 21.75 11.25 21.4142 11.25 21C11.25 20.5858 11.5858 20.25 12 20.25H15C16.3924 20.25 17.7277 19.6969 18.7123 18.7123C19.6969 17.7277 20.25 16.3924 20.25 15C20.25 13.6076 19.6969 12.2723 18.7123 11.2877C17.7277 10.3031 16.3924 9.75 15 9.75H4.81066L9.53033 14.4697C9.82322 14.7626 9.82322 15.2374 9.53033 15.5303C9.23744 15.8232 8.76256 15.8232 8.46967 15.5303L2.46967 9.53033C2.17678 9.23744 2.17678 8.76256 2.46967 8.46967L8.46967 2.46967C8.76256 2.17678 9.23744 2.17678 9.53033 2.46967Z"
                  fill="#0192A4"
                />
              </svg>
              Back to Search
            </Link>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <h1 className="text-24px lg:text-36px font-bold text-text-primary-color leading-tight">
              Compare Drug Assets
            </h1>

            <div className="flex gap-1 self-end">
              <ExportButton
                data={displayData}
                filename={`drug-compare-${new Date().toISOString().split("T")[0]
                  }.csv`}
              />
              <ShareButton
                title={primaryDrugName ?? "Compare Drug Assets"}
                url={shareUrl}
              />
              <PrintButton />
            </div>
          </div>
        </div>

        <div
          ref={tabsContainerRef}
          className="my-6 sticky top-[96px] z-50 bg-interface-background"
          data-compare-summary="true"
        >
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => scrollToTable("type-use")}
              className=" px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Basic Information
            </button>
            <button
              onClick={() => scrollToTable("ingredients")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Ingredients &amp; Form
            </button>
            <button
              onClick={() => scrollToTable("review")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Review &amp; Submissions
            </button>
            <button
              onClick={() => scrollToTable("progress")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Progress Date
            </button>
            <button
              onClick={() => scrollToTable("contact")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Contact Details
            </button>
          </div>

          <TableBlockA rows={summaryRows} data={displayData} />
        </div>

        {!hasResults && ids.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No matching drug assets were found for the selected identifiers.
            Review your selections or return to search to pick different
            results.
          </div>
        )}

        <div className="space-y-6">
          <TableBlock
            id="basic-info"
            title="Basic Information"
            rows={baseInfoRows}
            data={displayData}
          />

          <TableBlock
            id="ingredients"
            title="Ingredients & Form"
            rows={ingredientsRows}
            data={displayData}
          />

          <TableBlock
            id="review"
            title="Review & Submissions"
            rows={reviewRows}
            data={displayData}
          />

          <TableBlock
            id="progress"
            title="Progress Date"
            rows={progressRows}
            data={displayData}
          />

          <TableBlock
            id="contact"
            title="Contact Details"
            rows={contactRows}
            data={displayData}
            maskContact={shouldMaskContact}
          />
        </div>

        {showScrollbar && scrollbarInnerWidth > 0 && (
          <div className="sticky bottom-0 z-40 mt-4 pointer-events-none">
            <div
              ref={bottomScrollRef}
              className="pointer-events-auto overflow-x-auto overflow-y-hidden rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm"
            >
              <div
                style={{ width: `${scrollbarInnerWidth}px`, height: "16px" }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DrugCompareClient;
