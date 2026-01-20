import { useMemo, useEffect, useState } from "react";
import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";
import {
  InstantSearch,
  Hits,
  Stats,
  useInstantSearch,
} from "react-instantsearch";

import CB_page_assets_queryAssets from "@/pages/elasticSearch/CBcompany/CB_page/CTandAssets/CB_page_assets_queryAssets";

const CB_page_preload_assets = ({ data, setHaveAssetsData }) => {
  const searchClient = useMemo(() => {
    if (!data?.name) return null; // 如果 data.name 沒有值，回傳 null
    const sk = new Searchkit({
      connection: {
        host: "https://bfe81a85e0a84f009f774c919c7b5225.us-central1.gcp.cloud.es.io:443",
        apiKey: "aXlsdDJKQUJQSUMyU1NTNS1IVnE6LW40aE1PLThSbWFLMTdXNnR6a0Y0QQ==",
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

  return (
    <InstantSearch indexName="biodnd_assets" searchClient={searchClient}>
      <CB_page_assets_queryAssets companyName={data.name} />
      <GetSatus setHaveAssetsData={setHaveAssetsData} />
    </InstantSearch>
  );
};
export default CB_page_preload_assets;

const GetSatus = ({ setHaveAssetsData }) => {
  const { results } = useInstantSearch();

  useEffect(() => {
    if (results?.nbHits > 0) {
      setHaveAssetsData(true);
    } else {
      setHaveAssetsData(false);
    }
  }, [results, setHaveAssetsData]);
};
