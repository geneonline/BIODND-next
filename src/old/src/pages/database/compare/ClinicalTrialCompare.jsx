import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { executeSearchkitQuery } from "@/services/searchkitClient";
import PrintButton from "@/pages/database/data/widgets/PrintButton";
import ShareButton from "@/pages/database/data/widgets/ShareButton";
import ExportButton from "@/pages/database/data/widgets/ExportButton";
import { useGlobalHorizontalScrollbar } from "@/hooks/useGlobalHorizontalScrollbar";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import {
  TableBlockA,
  TableBlock,
  renderFieldValue,
  createPlaceholderData,
  alignResultsWithIds,
  useComparePageLayout,
} from "./compareComponents";

const INDEX_NAME = "clinical_trial_db_schema";

const summaryRows = [
  { label: "Trial Number", field: "trial_number_id" },
  { label: "Study Title", field: "study_title", useTooltip: true },
];

const table1 = [
  { label: "Trial Phase", field: "trial_phase" },
  { label: "Trial Status", field: "trial_status" },
  { label: "Disease Condition", field: "conditions" },
  { label: "Organization", field: "organization" },
  { label: "Region / Country", field: "locations" },
  { label: "Trial Registry", field: "trial_registry" },
  { label: "Brief Summary", field: "brief_summary" },
  { label: "Study Type", field: "study_type" },
];

const table2 = [
  { label: "Enrolment", field: "enrollment" },
  { label: "Age", field: "age" },
  { label: "Sex", field: "sex" },
  { label: "Prospective Retrospective", field: "prospective_retrospective" },
  { label: "Study Design", field: "study_design" },
  { label: "Main Objective", field: "main_objective" },
  { label: "Primary Outcome Measures", field: "primary_outcome_measures" },
  { label: "Secondary Objectives", field: "secondary_objectives" },
  { label: "Secondary Outcome Measures", field: "secondary_outcome_measures" },
  { label: "Inclusion Criteria", field: "inclusion_criteria" },
  { label: "Exclusion Criteria", field: "exclusion_criteria" },
  { label: "Ethics Approval", field: "ethics_approval" },
];

const table3 = [
  { label: "Study Start", field: "start_date" },
  { label: "Study Completion", field: "completion_date" },
  { label: "Primary Completion", field: "primary_completion_date" },
  { label: "First Post", field: "first_posted" },
  { label: "Last Update Post", field: "last_update_posted" },
  { label: "Register Date", field: "register_date" },
];

const table4 = [
  { label: "Contact Organization", field: "contact_organization" },
  { label: "Funder", field: "funder" },
  { label: "Funding Body Type", field: "funding_body_type" },
  { label: "Contact Name", field: "contact_name" },
  { label: "Phone", field: "contact_phone" },
  { label: "Mobile", field: "contact_mobile" },
  { label: "Email", field: "contact_email" },
  { label: "Address", field: "contact_address" },
  { label: "Postcode", field: "contact_postcode" },
];

const ClinicalTrialCompare = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idsParam = searchParams.get("ids");
  const ids = useMemo(
    () => (idsParam ? idsParam.split(",").filter(Boolean) : []),
    [idsParam]
  );
  const [data, setData] = useState([]);
  const tabsContainerRef = useRef(null);
  const { bottomScrollRef, showScrollbar, scrollbarInnerWidth } =
    useGlobalHorizontalScrollbar({ dependencies: [data, ids.length] });
  const { token } = useAuth();
  const { userData } = useUser(token);
  const shouldMaskContact = userData?.subscriptionLevel !== "Pro";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await executeSearchkitQuery({
          searchSettings: {
            search_attributes: ["*"],
            result_attributes: ["*"],
            facet_attributes: [
              {
                attribute: "trial_number_id.keyword",
                field: "trial_number_id.keyword",
                type: "string",
              },
            ],
          },
          requests: [
            {
              indexName: INDEX_NAME,
              params: {
                query: "",
                facetFilters: [
                  ids.map((id) => `trial_number_id.keyword:${id}`),
                ],
                hitsPerPage: ids.length,
              },
            },
          ],
        });

        if (result?.results?.[0]?.hits) {
          const mappedData = result.results[0].hits.map(
            (hit) => hit._source || hit
          );
          const aligned = alignResultsWithIds(
            ids.map((id) => id),
            mappedData,
            "trial_number_id"
          );
          setData(aligned);
        } else {
          setData(createPlaceholderData(ids.length));
        }
      } catch (error) {
        const status =
          error?.status ??
          error?.response?.status ??
          error?.details?.status ??
          error?.httpStatus;

        if (status === 401) {
          localStorage.removeItem("token");
          navigate("/account/login", { replace: true });
          return;
        }

        console.error("Error fetching data:", error);
      }
    };
    if (ids.length) fetchData();
  }, [ids, navigate]);

  const scrollToTable = useComparePageLayout(tabsContainerRef, [
    data,
    ids.length,
  ]);

  const placeholderData = createPlaceholderData(ids.length);

  const params = new URLSearchParams(searchParams);
  params.delete("ids");

  return (
    <main className="px-4 pt-6 lg:pt-16 flex justify-center">
      <div className="w-full bg-interface-background">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link
              to={`/database/search/assets/clinical-trial?${params.toString()}`}
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
              Compare Clinical Trial Assets
            </h1>

            <div className="flex gap-1 self-end">
              <ExportButton
                data={data}
                filename={`clinical-trial-compare-${
                  new Date().toISOString().split("T")[0]
                }.csv`}
              />
              <ShareButton title={data.study_title} url={data.url} />
              <PrintButton />
            </div>
          </div>
        </div>

        {/* Tabs & tableA */}
        <div
          ref={tabsContainerRef}
          className="my-6 sticky top-[96px] z-50 bg-interface-background"
          data-compare-summary="true"
        >
          <div className="flex border-b border-Gray-500">
            <button
              onClick={() => scrollToTable("table1")}
              className=" px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Study Information
            </button>
            <button
              onClick={() => scrollToTable("table2")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Study Design & Results
            </button>
            <button
              onClick={() => scrollToTable("table3")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Study Detail
            </button>
            <button
              onClick={() => scrollToTable("table4")}
              className="px-4 py-2 text-lg font-medium text-text-primary-color hover:bg-primaryBlue-100 border-b-2 border-interface-background hover:border-primary-default hover:text-primary-hovered"
            >
              Contact Detail
            </button>
          </div>

          {/* Table A */}
          <TableBlockA
            rows={summaryRows}
            data={data.length === ids.length ? data : placeholderData}
          />
        </div>

        <div className="space-y-6">
          {/* Table 1 */}
          <TableBlock
            id="table1"
            title="Study Information"
            rows={table1}
            data={data.length === ids.length ? data : placeholderData}
          />

          {/* Table 2 */}
          <TableBlock
            id="table2"
            title="Study Design & Results"
            rows={table2}
            data={data.length === ids.length ? data : placeholderData}
          />

          {/* Table 3 */}
          <TableBlock
            id="table3"
            title="Study Status"
            rows={table3}
            data={data.length ? data : placeholderData}
          />

          {/* Table 4 */}
          <TableBlock
            id="table4"
            title="Contact Detail"
            rows={table4}
            data={data.length === ids.length ? data : placeholderData}
            maskContact={shouldMaskContact}
          />
        </div>

        {showScrollbar && scrollbarInnerWidth > 0 && (
          <div className="sticky bottom-0 z-40 mt-4 pointer-events-none">
            <div
              ref={bottomScrollRef}
              className="pointer-events-auto overflow-x-auto overflow-y-hidden rounded-full border border-Gray-500 bg-white/90 shadow-md backdrop-blur-sm"
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

export default ClinicalTrialCompare;
