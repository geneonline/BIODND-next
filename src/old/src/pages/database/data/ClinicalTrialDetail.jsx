import { useEffect, useState } from "react";
import ClinicalTrialTabs from "./ClinicalTrialTabs";
import { useUser } from "@/hooks/useUser";
import ContactDetailMask from "@/parts/database/ContactDetailMask";
import { useParams, Link, useSearchParams } from "react-router-dom";
import ShareButton from "./widgets/ShareButton";
import PrintButton from "./widgets/PrintButton";
import { executeSearchkitQuery } from "@/services/searchkitClient";

const INDEX_NAME = "clinical_trial_db_schema";

const ClinicalTrialDetail = () => {
  const { id } = useParams();
  const { userdata } = useUser();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);

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
                facetFilters: [[`trial_number_id.keyword:${id}`]],
                hitsPerPage: 1,
              },
            },
          ],
        });

        if (result?.results?.[0]?.hits?.length > 0) {
          setData(result.results[0].hits[0]);
        } else {
          setData(null);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, [id]);

  return (
    <main className="px-4 md:px-16 lg:px-20 flex justify-center">
      <div className="w-full max-w-[1216px]  flex flex-col  pt-16 pb-20 space-y-6 ">
        <Link
          to={`/database/search/assets/clinical-trial?${searchParams.toString()}`}
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
          Back to search
        </Link>
        {/* 
        <h1 className="text-[36px] font-bold text-text-primary-color leading-tight">
          Explore Biotech Assets to Accelerate Strategic Decisions
        </h1> */}

        {data ? (
          <>
            <div className="bg-white flex flex-col gap-4 p-8 rounded-lg shadow-md">
              {/* Status tags */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                  {data.trial_status && (
                    <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm text-gray-600">
                      {data.trial_status}
                    </div>
                  )}
                  {data.trial_phase && (
                    <div className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-400 text-sm text-purple-600">
                      {data.trial_phase}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <ShareButton title={data.study_title} url={data.url} />
                  <PrintButton />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-medium text-textColor-primary leading-160">
                {data.study_title}
              </h2>
              <hr className="border-gray-300" />

              {/* Info list */}
              <div className="flex flex-col gap-3 leading-160">
                <div className="flex gap-6">
                  <div className="w-36 text-textColor-Tertiary">
                    Trial Number
                  </div>
                  <div className="text-textColor-primary font-medium">
                    {data.trial_number_id ? data.trial_number_id : "-"}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-36 text-textColor-Tertiary">
                    Other Number
                  </div>
                  <div className="text-textColor-primary font-medium">
                    {data.other_number ? data.other_number : "-"}
                  </div>
                </div>

                {data.locations && (
                  <div className="flex gap-6">
                    <div className="w-36 text-textColor-Tertiary">
                      Region/Country
                    </div>
                    <div className="text-textColor-primary font-medium">
                      {data.locations ? data.locations : "-"}
                    </div>
                  </div>
                )}
                {data.organization && (
                  <div className="flex gap-6">
                    <div className="w-36 text-textColor-Tertiary">
                      Organization
                    </div>
                    <div className="text-textColor-primary font-medium">
                      {data.organization ? data.organization : "-"}
                    </div>
                  </div>
                )}
                {data.trial_registry_T && (
                  <div className="flex gap-6">
                    <div className="w-36 text-textColor-Tertiary">
                      Trial Registry
                    </div>
                    <a
                      href={data.registry_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-default underline"
                    >
                      {data.trial_registry_T ? data.trial_registry_T : "-"}
                    </a>
                  </div>
                )}
                {data.url && (
                  <div className="flex gap-6">
                    <div className="w-36 text-textColor-Tertiary">Source</div>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-default underline"
                    >
                      {data.url ? data.url : "-"}
                    </a>
                  </div>
                )}
                {data.conditions && (
                  <div className="flex gap-6">
                    <div className="w-36 text-textColor-Tertiary">
                      Disease Condition
                    </div>
                    <div className="text-textColor-primary font-medium">
                      {data.conditions ? data.conditions : "-"}
                    </div>
                  </div>
                )}
              </div>
            </div>{" "}
            {/* Tabs Section */}
            <ClinicalTrialTabs data={data} userdata={userdata} />
          </>
        ) : (
          // Loading...
          <div className="bg-white flex flex-col gap-4 p-8 rounded-lg shadow-md">
            {/* Status tags */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm text-gray-600">
                  Loading...
                </div>

                <div className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-400 text-sm text-purple-600">
                  Loading...
                </div>
              </div>
              <div className="flex gap-2"></div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-medium text-textColor-primary leading-160">
              Loading...
            </h2>
            <hr className="border-gray-300" />

            {/* Info list */}
            <div className="flex flex-col gap-2 leading-160">
              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">Trial Number</div>
                <div className="text-textColor-primary font-medium">
                  Loading...
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">Other Number</div>
                <div className="text-textColor-primary font-medium">
                  Loading...
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">
                  Region/Country
                </div>
                <div className="text-textColor-primary font-medium">
                  Loading...
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">Organization</div>
                <div className="text-textColor-primary font-medium">
                  Loading...
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">
                  Trial Registry
                </div>
                <div className=" text-primary-default underline">
                  Loading...
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">Source</div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-500 underline"
                >
                  Loading...
                </a>
              </div>

              <div className="flex gap-6">
                <div className="w-36 text-textColor-Tertiary">
                  Disease Condition
                </div>
                <div className="text-textColor-primary font-medium">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keep JSON viewer */}
        {/* <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto text-sm">
          {data ? JSON.stringify(data, null, 2) : "Loading..."}
        </pre> */}
      </div>
    </main>
  );
};

export default ClinicalTrialDetail;
