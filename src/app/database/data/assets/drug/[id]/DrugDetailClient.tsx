"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShareButton from "../../components/widgets/ShareButton";
import PrintButton from "../../components/widgets/PrintButton";
import DrugDetailTabs from "../../components/DrugDetailTabs";
import { executeSearchkitQuery } from "@/lib/searchkitClient";

const INDEX_NAME = "drug_db_schema";
const PRIMARY_FIELD = "drug_id";

const buildBackToSearchUrl = (searchParams: URLSearchParams) => {
  const queryString = searchParams.toString();
  return `/database/search/assets/drug${queryString ? `?${queryString}` : ""}`;
};

const normalizeValue = (value: any): string => {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value)) {
    const flattened = value
      .flat()
      .map((item) => {
        if (item === null || item === undefined) return null;
        if (typeof item === "object") {
          return Object.values(item ?? {})
            .filter(
              (nested) =>
                nested !== null &&
                nested !== undefined &&
                typeof nested !== "object"
            )
            .map((nested) => String(nested).trim())
            .filter(Boolean)
            .join(", ");
        }
        const text = String(item).trim();
        return text || null;
      })
      .filter(Boolean);

    return flattened.length ? flattened.join(", ") : "-";
  }
  if (typeof value === "object") {
    return Object.values(value)
      .map((nested) => normalizeValue(nested))
      .filter((text) => text && text !== "-")
      .join(", ");
  }
  const text = String(value).trim();
  return text || "-";
};

const requestConfig = (id: string) => ({
  searchSettings: {
    search_attributes: ["*"],
    result_attributes: ["*"],
    facet_attributes: [
      {
        attribute: `${PRIMARY_FIELD}.keyword`,
        field: `${PRIMARY_FIELD}.keyword`,
        type: "string",
      },
    ],
  },
  requests: [
    {
      indexName: INDEX_NAME,
      params: {
        query: "",
        facetFilters: [[`${PRIMARY_FIELD}.keyword:${id}`]],
        hitsPerPage: 1,
      },
    },
  ],
});

export default function DrugDetailClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const result = await executeSearchkitQuery(requestConfig(id));

        const hit = result?.results?.[0]?.hits?.[0] ?? null;
        if (!isMounted) return;
        setData(hit);
      } catch (error) {
        console.error("Error fetching drug detail:", error);
        if (isMounted) {
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const backToSearchUrl = useMemo(
    () => buildBackToSearchUrl(searchParams),
    [searchParams]
  );

  const infoRows = useMemo(() => {
    const rows = [
      {
        label: "Drug Number",
        value: normalizeValue(data?.drug_id),
      },
      {
        label: "ATC code",
        value: normalizeValue(data?.atc_code),
      },
      {
        label: "Generic Name",
        value: normalizeValue(data?.generic_name),
      },
      {
        label: "Trade Name",
        value: normalizeValue(data?.trade_name),
      },

      {
        label: "Region / Country",
        value: normalizeValue(data?.region_country),
      },
      {
        label: "Organization",
        value: normalizeValue(data?.organization),
      },
      {
        label: "Manufacturing",
        value: normalizeValue(data?.manufacturing),
      },
      {
        label: "Drug Registry",
        value: normalizeValue(data?.drug_registry_T),
        href: data?.registry_url,
      },
      {
        label: "Disease Condition",
        value: normalizeValue(data?.conditions),
      },
    ];

    return rows.filter(({ value }) => value && value !== "-");
  }, [data]);

  return (
    <main className="px-4 md:px-16 lg:px-20 flex justify-center">
      <div className="w-full max-w-[1216px] flex flex-col pt-16 pb-20 space-y-6">
        <Link
          href={backToSearchUrl}
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

        <article className="flex flex-col gap-4 ">
          {isLoading ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                  {[...Array(2)].map((_, idx) => (
                    <div
                      key={`loading-tag-${idx}`}
                      className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm text-gray-600"
                    >
                      Loading...
                    </div>
                  ))}
                </div>
                <div className="flex gap-2" />
              </div>
              <h2 className="text-xl font-medium text-textColor-primary leading-160">
                Loading...
              </h2>
              <hr className="border-gray-300" />
              <div className="flex flex-col gap-2 leading-160">
                {[...Array(7)].map((_, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-40 text-textColor-Tertiary">Loading</div>
                    <div className="text-textColor-primary font-medium">
                      Loading...
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : data ? (
            <>
              <div className="bg-white flex flex-col gap-4 p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-wrap">
                    {data.marketing_status && (
                      <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm text-gray-600">
                        {data.marketing_status}
                      </div>
                    )}
                    {data.drug_class && (
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm text-gray-600">
                        {normalizeValue(data.dosage_form)}
                      </span>
                    )}
                    {data.drug_category && (
                      <span className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-400 text-sm text-purple-600">
                        {normalizeValue(data.drug_category)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <ShareButton
                      title={normalizeValue(data.drug_name)}
                      url={data.url ?? data.source_url}
                    />
                    <PrintButton />
                  </div>
                </div>
                <h2 className="text-xl font-medium text-textColor-primary leading-160">
                  {normalizeValue(data.drug_name)}
                </h2>
                <hr className="border-gray-300" />
                <dl className="flex flex-col gap-3 leading-160">
                  {infoRows.map(({ label, value, href }) => (
                    <div key={label} className="flex gap-6 flex-wrap">
                      <dt className="w-40 text-textColor-Tertiary">{label}</dt>
                      <dd className="text-textColor-primary font-medium break-words">
                        {href && value !== "-" ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-default underline"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-8">
                <DrugDetailTabs data={data} />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-xl font-semibold text-textColor-primary">
                No drug data found
              </h2>
              <p className="text-textColor-Tertiary leading-160">
                We could not locate a drug asset for this identifier. Return to
                the asset search page and try a different result.
              </p>
              <Link
                href={backToSearchUrl}
                className="inline-flex items-center gap-2 px-4 py-2.5 font-medium text-sm1 text-primary-default border border-primary-default rounded-50px hover:bg-primaryBlue-200"
              >
                Back to Asset Search
              </Link>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
