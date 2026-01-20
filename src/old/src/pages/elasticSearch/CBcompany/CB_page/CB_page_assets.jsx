import { useMemo, useEffect, useState } from "react";
import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";
import {
  InstantSearch,
  Hits,
  Stats,
  useInstantSearch,
} from "react-instantsearch";

import Elastic_Loading from "@/pages/elasticSearch/widget/Elastic_Loading";

import CB_page_assets_queryAssets from "./CTandAssets/CB_page_assets_queryAssets";
import CB_page_assets_hitView from "./CTandAssets/CB_page_assets_hitView";

import noresults_icon from "@/assets/svg/database/noresults_icon.svg";

const CB_page_assets = ({ data, loading, error }) => {
  // Create the Searchkit client
  const searchClient = useMemo(() => {
    if (!data?.name) return null; // 如果 data.name 沒有值，回傳 null
    const sk = new Searchkit({
      connection: {
        host: import.meta.env.VITE_Effect_API + "/api/ElasticSearch",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      },
      search_settings: {
        search_attributes: ["*"], // The field to search
        result_attributes: ["*"], // 顯示的欄位
      },
    });

    return Client(sk, {
      getQuery: (query, search_attributes) => {
        // 返回自定義的查詢，包含 filter 和 must
        return {
          bool: {
            filter: [
              {
                query_string: {
                  query: "*", // 查詢所有結果
                },
              },
            ],
            must: {
              multi_match: {
                query: query || "", // 使用傳入的查詢字串
                fields: search_attributes, // 搜尋指定欄位
                type: "best_fields",
                operator: "and",
              },
            },
          },
        };
      },
    });
  }, [data?.name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.name) return <p>請提供搜尋關鍵字。</p>;

  return (
    <div>
      <InstantSearch indexName="biodnd_assets" searchClient={searchClient}>
        <div className="p-10">
          <CB_page_assets_queryAssets companyName={data.name} />
          <CostomResults />
          {/* Display search results */}
        </div>
      </InstantSearch>
    </div>
  );
};

export default CB_page_assets;

// 子組件：搜尋狀態顯示
const CostomResults = () => {
  const { status, results } = useInstantSearch(); // 判斷搜尋是否停滯中
  const [debouncedStatus, setDebouncedStatus] = useState(status);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStatus(status);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [status]);

  //have results
  if (debouncedStatus === "idle" && results?.nbHits) {
    return (
      <>
        <Stats className="pb-7 text-24px font-semibold leading-140" />
        <Hits hitComponent={CB_page_assets_hitView} />
      </>
    );
  }

  //no results
  if (
    !results?.nbHits &&
    (debouncedStatus !== "loading" || debouncedStatus !== "stalled")
  ) {
    return (
      <div className="flex items-center ">
        <div className="flex-shrink-0 w-8 h-8 mr-3">
          <img className="w-full h-full" src={noresults_icon} alt="" />
        </div>
        <h2 className=" text-main-color-gb text-24px font-semibold leading-140">
          No results found
        </h2>
      </div>
    );
  }

  // loading
  return (
    <div className="pt-10">
      <Elastic_Loading />
      <div className="w-full mb-3 border border-search-border overflow-hidden">
        <div className="h-15 py-4 px-7 bg-sub-color text-white flex justify-between"></div>
        <div className="h-50 w-full flex flex-wrap pt-5 px-7 pb-8 bg-white space-y-5"></div>
      </div>

      <div className="w-full mb-3 border border-search-border overflow-hidden">
        <div className="h-15 py-4 px-7 bg-sub-color text-white flex justify-between"></div>
        <div className="h-50 w-full flex flex-wrap pt-5 px-7 pb-8 bg-white space-y-5"></div>
      </div>

      <div className="w-full mb-3 border border-search-border overflow-hidden">
        <div className="h-15 py-4 px-7 bg-sub-color text-white flex justify-between"></div>
        <div className="h-50 w-full flex flex-wrap pt-5 px-7 pb-8 bg-white space-y-5"></div>
      </div>
    </div>
  );
};
