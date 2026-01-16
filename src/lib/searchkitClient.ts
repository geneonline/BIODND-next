import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";

const DEFAULT_HOST = `${process.env.NEXT_PUBLIC_API_URL}/api/QueryAsset`;

const buildHeaders = (headers: Record<string, string> = {}) => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    ...authHeaders,
    ...headers,
  };
};

export const createSearchkitClient = ({
  searchSettings,
  connection = {},
  ...config
}: {
  searchSettings: any;
  connection?: any;
  [key: string]: any;
}) => {
  if (!searchSettings) {
    throw new Error(
      "searchSettings is required to creating a Searchkit client"
    );
  }

  const sk = new Searchkit({
    connection: {
      host: connection.host ?? DEFAULT_HOST,
      ...connection,
      headers: buildHeaders(connection.headers),
    },
    search_settings: searchSettings,
    ...config,
  });

  const rawClient = Client(sk);

  const emptyResults = {
    hits: [],
    nbHits: 0,
    page: 0,
    nbPages: 0,
    hitsPerPage: 0,
    exhaustiveNbHits: false,
    query: "",
    params: "",
  };

  const wrappedClient = {
    ...rawClient,
    search(requests: any[]) {
      return rawClient.search(requests).catch((err: any) => {
        const status =
          err?.status ??
          err?.response?.status ??
          err?.details?.status ??
          err?.httpStatus;

        if (status === 401) {
          const unauthorizedError: any = new Error("Unauthorized");
          unauthorizedError.status = 401;
          unauthorizedError.originalError = err;
          throw unauthorizedError;
        }

        console.error("Searchkit search failed", err);
        return Promise.resolve({
          results: requests.map(() => emptyResults),
        });
      });
    },
  };

  return wrappedClient;
};

export const executeSearchkitQuery = async ({
  requests,
  ...options
}: {
  requests: any[];
  [key: string]: any;
}) => {
  if (!Array.isArray(requests) || requests.length === 0) {
    throw new Error("requests must be a non-empty array");
  }

  const client = createSearchkitClient({
    searchSettings: options.searchSettings,
    ...options,
  });
  return client.search(requests);
};
