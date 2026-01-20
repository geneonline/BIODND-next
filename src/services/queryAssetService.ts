import axios from "axios";

const QUERY_ASSET_BASE = `/api/proxy/api/QueryAsset`;

// No manual keys needed, cookie is automatic via proxy

export const checkAndLockUser = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${QUERY_ASSET_BASE}/CheckAndLockUser`,
      {},
    );
    return response?.data?.status === "Locked";
  } catch (error) {
    console.error("checkAndLockUser error", error);
    return false;
  }
};

export const storeAssetSearchRequest = async (
  payload: unknown
) => {
  return axios.post(`${QUERY_ASSET_BASE}/StoreRequest`, payload);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLockedResponse = (error: any): boolean => {
  if (!error) return false;
  const statusCode =
    error.status ?? error.response?.status ?? error.details?.status ?? null;
  if (statusCode === 423) return true;
  const payloadStatus =
    error.data?.status ?? error.response?.data?.status ?? null;
  return payloadStatus === "Locked";
};
