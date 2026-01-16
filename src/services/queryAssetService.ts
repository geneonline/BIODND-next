import axios from "axios";

const QUERY_ASSET_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/QueryAsset`;

const buildAuthHeaders = (token: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const checkAndLockUser = async (token: string): Promise<boolean> => {
  if (!token) return false;
  try {
    const response = await axios.post(
      `${QUERY_ASSET_BASE}/CheckAndLockUser`,
      {},
      { headers: buildAuthHeaders(token) }
    );
    return response?.data?.status === "Locked";
  } catch (error) {
    console.error("checkAndLockUser error", error);
    return false;
  }
};

export const storeAssetSearchRequest = async (
  token: string,
  payload: unknown
) => {
  if (!token) return null;
  return axios.post(`${QUERY_ASSET_BASE}/StoreRequest`, payload, {
    headers: buildAuthHeaders(token),
  });
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
