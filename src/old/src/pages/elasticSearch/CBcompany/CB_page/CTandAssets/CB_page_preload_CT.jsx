import { useEffect } from "react";
import axios from "axios";
// 假設 sections.json 與此元件在同一目錄下
import sections from "@/data/database/elastic/sections.json";

const CB_page_preload_CT = ({ data, setCTdata, setctLoading }) => {
  const performSearch = (searchQuery) => {
    if (searchQuery) {
      setctLoading(true); // 顯示 loading 狀態

      // 定義你要搜尋的分類
      const categories = [
        "Drug Development",
        "Medical Devices",
        "Global Drugs Market",
      ];

      // 從 sections.json 取得各分類的 indices，合併後並過濾重複項目
      const validIndices = [
        ...new Set(
          categories.reduce((acc, category) => {
            const indices = sections[category] || [];
            return acc.concat(indices);
          }, [])
        ),
      ];

      axios
        .post(
          "https://bfe81a85e0a84f009f774c919c7b5225.us-central1.gcp.cloud.es.io:443/_search",
          {
            size: 0,
            query: {
              bool: {
                // 使用 multi_match 作為主要搜尋條件
                must: {
                  multi_match: {
                    query: searchQuery,
                    fields: ["*"],
                    operator: "and",
                  },
                },
                // 用 filter 限定只搜尋指定的 indices
                filter: [
                  {
                    terms: {
                      _index: validIndices,
                    },
                  },
                ],
              },
            },
            aggs: {
              base_indices_count: {
                terms: {
                  script: {
                    source: `
                      def indexName = doc['_index'].value;
                      def matcher = /^(.*?)(\\\\d+)?$/.matcher(indexName);
                      if (matcher.find()) {
                        return matcher.group(1);
                      } else {
                        return indexName;
                      }
                    `,
                    lang: "painless",
                  },
                  size: 10000, // 根據需要調整聚合項目大小
                },
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "ApiKey aXlsdDJKQUJQSUMyU1NTNS1IVnE6LW40aE1PLThSbWFLMTdXNnR6a0Y0QQ==",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setCTdata(response.data);
          setctLoading(false);
        })
        .catch((error) => {
          console.error("Error performing search:", error);
          setctLoading(false);
        });
    }
  };

  useEffect(() => {
    if (data) {
      performSearch(data.name);
    }
  }, [data]);

  return null;
};

export default CB_page_preload_CT;
