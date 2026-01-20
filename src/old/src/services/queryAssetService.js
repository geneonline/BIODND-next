import axios from "axios";

const QUERY_ASSET_BASE = `${import.meta.env.VITE_Effect_API}/api/QueryAsset`;

const buildAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const checkAndLockUser = async (token) => {
  if (!token) return false;
  const response = await axios.post(
    `${QUERY_ASSET_BASE}/CheckAndLockUser`,
    {},
    { headers: buildAuthHeaders(token) }
  );
  return response?.data?.status === "Locked";
};

export const storeAssetSearchRequest = async (token, payload) => {
  if (!token) return null;
  return axios.post(`${QUERY_ASSET_BASE}/StoreRequest`, payload, {
    headers: buildAuthHeaders(token),
  });
};

export const isLockedResponse = (error) => {
  if (!error) return false;
  const statusCode =
    error.status ?? error.response?.status ?? error.details?.status ?? null;
  if (statusCode === 423) return true;
  const payloadStatus =
    error.data?.status ?? error.response?.data?.status ?? null;
  return payloadStatus === "Locked";
};
