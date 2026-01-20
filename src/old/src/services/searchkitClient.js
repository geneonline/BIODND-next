import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";

const DEFAULT_HOST = `${import.meta.env.VITE_Effect_API}/api/QueryAsset`;

const buildHeaders = (headers = {}) => {
  const token = localStorage.getItem("token");
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
} = {}) => {
  if (!searchSettings) {
    throw new Error("searchSettings is required to create a Searchkit client");
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
    search(requests) {
      return rawClient.search(requests).catch((err) => {
        const status =
          err?.status ??
          err?.response?.status ??
          err?.details?.status ??
          err?.httpStatus;

        if (status === 401) {
          const unauthorizedError = new Error("Unauthorized");
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

export const executeSearchkitQuery = async ({ requests, ...options }) => {
  if (!Array.isArray(requests) || requests.length === 0) {
    throw new Error("requests must be a non-empty array");
  }

  const client = createSearchkitClient(options);
  return client.search(requests);
};
