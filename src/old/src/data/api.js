import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { getAnonymousId } from "./function";
import { use } from "react";

const baseURL = `${import.meta.env.VITE_API_URL}/companies`;
const assetURL = `${import.meta.env.VITE_API_URL}/assets`;

export const companiesSearchURL = (data) =>
  baseURL +
  ".json?" +
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const assetsSearchURL = (data) =>
  assetURL +
  ".json?" +
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const vector_companiesSearchURL = (data) =>
  `${import.meta.env.VITE_API_URL}/vector_companies.json?query=` +
  Object.entries(data)
    .map(([key, value]) => `${key}:${encodeURIComponent(value)}`)
    .join(" ");

export const vector_assetsSearchURL = (data) =>
  `${import.meta.env.VITE_API_URL}/vector_assets.json?query=` +
  Object.entries(data)
    .map(([key, value]) => `${key}:${encodeURIComponent(value)}`)
    .join(" ");

export const companyProfileURL = (id) => baseURL + "/" + id + ".json";

export const companyProfileAssetsURL = (id) =>
  baseURL + "/" + id + "/assets" + ".json";

export const fetcher_get = (url) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: { Accept: "application/json" },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();

        return null;
      }
      throw err;
    });

/////   LINK

export const searchCompaniesLink = (data) => {
  // First, reduce to identify which "_parants" keys should potentially be renamed or removed
  const keysToModify = Object.keys(data).reduce(
    (acc, key) => {
      if (key.endsWith("_parants")) {
        const baseKey = key.slice(0, -8); // Remove "_parants" to get the base key
        if (!Object.prototype.hasOwnProperty.call(data, baseKey)) {
          // Prepare to rename this key if its base key is absent
          acc.toRename[key] = baseKey;
        } else {
          // Mark for removal if the base key exists
          acc.toRemove[key] = true;
        }
      }
      return acc;
    },
    { toRename: {}, toRemove: {} }
  );

  return (
    "/database/search/companies?" +
    Object.entries(data)
      .filter(([key, value]) => value && !keysToModify.toRemove[key]) // Skip "_parants" keys when base key exists
      .map(([key, value]) => {
        const newKey = keysToModify.toRename[key] || key; // Use the new key if it needs to be renamed
        return `${encodeURIComponent(newKey)}=${encodeURIComponent(value)}`;
      })
      .join("&")
  );
};

export const searchAssetsLink = (data) => {
  // Identify and process "_parants" keys for renaming or removal
  const keysToModify = Object.keys(data).reduce(
    (acc, key) => {
      if (key.endsWith("_parants")) {
        const baseKey = key.slice(0, -8); // Remove "_parants" to get the base key
        if (!Object.prototype.hasOwnProperty.call(data, baseKey)) {
          // Prepare to rename this key if its base key is absent
          acc.toRename[key] = baseKey;
        } else {
          // Mark for removal if the base key exists
          acc.toRemove[key] = true;
        }
      }
      return acc;
    },
    { toRename: {}, toRemove: {} }
  );

  return (
    "/database/search/assets?" +
    Object.entries(data)
      .filter(([key, value]) => value && !keysToModify.toRemove[key]) // Skip "_parants" keys when base key exists
      .map(([key, value]) => {
        const newKey = keysToModify.toRename[key] || key; // Use the new key if it needs to be renamed
        return `${encodeURIComponent(newKey)}=${encodeURIComponent(value)}`;
      })
      .join("&")
  );
};

export const updateHistory = async ({ userData = {}, event, eventData }) => {
  return;
  // 沒在維護了
};

// const companiesRequest = axios.create({
//   baseURL: "http://localhost/companies.json",
// });

// export const apiCompanySearch = (data) =>
//   companiesRequest.get(
//     "?" +
//       Object.entries(data)
//         .map(([key, value]) => `${key}=${value}`)
//         .join("&")
//   );

//  V V V  SWR custom hook  V V V
export const useUser = () => {
  // 取得當前使用者的 Profile ID
  const {
    data: userIdData,
    error: userIdError,
    mutate: mutateUserId,
  } = useSWR(
    `${import.meta.env.VITE_API_URL}/user_profiles/current.json`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  // 判斷 userId 是否還在載入中：若 data 與 error 都為 undefined
  const isUserIdLoading =
    typeof userIdData === "undefined" && typeof userIdError === "undefined";

  // 從 userIdData 中取得 userProfileId
  const userProfileId = userIdData?.id || null;

  // 取得完整的使用者資料（依賴 userProfileId）
  const {
    data: userData,
    error: userDetailsError,
    mutate: mutateUserDetails,
  } = useSWR(
    userProfileId
      ? `${import.meta.env.VITE_API_URL}/user_profiles/${userProfileId}.json`
      : null,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  // 判斷 userDetails 是否還在載入中（僅當 userProfileId 存在時）
  const isUserDetailsLoading =
    userProfileId &&
    typeof userData === "undefined" &&
    typeof userDetailsError === "undefined";

  // 若其中一個還在載入中，就視為正在載入
  const isLoading = isUserIdLoading || isUserDetailsLoading;

  const userError = userIdError || userDetailsError;
  const isLoggedIn = !!userData;

  // 修改 mutateUser：先更新 userId，再根據更新後的 userProfileId 更新完整資料，
  // 並返回更新後的完整 userData
  const mutateUser = async () => {
    const updatedUserIdData = await mutateUserId();
    const updatedUserProfileId = updatedUserIdData?.id || null;
    if (updatedUserProfileId) {
      const updatedUserData = await mutateUserDetails();
      return updatedUserData;
    }
    return null;
  };

  // 除錯日誌
  useEffect(() => {
    console.log("useUser State:", {
      userIdData,
      userProfileId,
      userData,
      isLoading,
      isLoggedIn,
      userError,
    });
  }, [userIdData, userProfileId, userData, isLoading, isLoggedIn, userError]);

  return {
    userData,
    userError,
    isLoggedIn,
    isLoading,
    mutateUser, // 新增 mutateUser 功能
  };
};

export const useMyList = () => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}/favorites.json`,
    fetcher_get,
    { revalidateOnMount: false, revalidateOnFocus: false }
  );
  return { myListData: data, myListError: error, myListLoading: isLoading };
};

export const useCompanyProfile = (id) => {
  const { data, error, isLoading } = useSWR(
    companyProfileURL(id),
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    companyProfileData: data,
    companyProfileError: error,
    companyProfileLoading: isLoading,
  };
};

export const useAssetProfile = (id) => {
  const { data, error, isLoading } = useSWR(
    companyProfileAssetsURL(id) + "?per_page=1000",
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    assetsData: data,
    assetsError: error,
    assetsLoading: isLoading,
  };
};

export const useDemands = (id = undefined) => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}/needs${
      id ? `/${id}` : ""
    }.json?need_type=Demand`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    demandsData: data,
    demandsError: error,
    demandsLoading: isLoading,
  };
};
export const useSupplies = (id = undefined) => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}/needs${
      id ? `/${id}` : ""
    }.json?need_type=Supply`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    suppliesData: data,
    suppliesError: error,
    suppliesLoading: isLoading,
  };
};
export const useNeeds = (id) => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}/needs${id ? `/${id}` : ""}.json`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    needsData: data,
    needsError: error,
    needsLoading: isLoading,
  };
};

export const useUserNeeds = (id) => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}/needs.json`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  const filteredData = data
    ? data.filter((need) => need.contact_id === id)
    : [];

  return {
    needsData: filteredData,
    needsError: error,
    needsLoading: isLoading,
  };
};

export const useMessages = () => {
  const maxRetries = 3;
  const [retryCount, setRetryCount] = useState(0);

  const { data, error, isValidating, mutate } = useSWR(
    `${import.meta.env.VITE_API_URL}/messages.json`,
    (url) =>
      axios
        .get(url, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err;
        }),
    {
      refreshInterval: retryCount < maxRetries ? 5000 : 0,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    // 监听错误并更新尝试次数
    if (error) {
      setRetryCount((current) => current + 1);
      // console.log("error message");
    }

    // 如果达到最大尝试次数，则禁用进一步的自动重新验证
    if (retryCount >= maxRetries) {
      mutate(data, false); // 使用 mutate 更新缓存数据，但不触发重新验证
    }
  }, [error, retryCount, data, mutate]);

  const resetRetries = () => {
    setRetryCount(0);
  };

  return {
    messagesData: data,
    messagesError: error,
    messagesLoading: !data && !error,
    messagesIsValidating: isValidating,
    resetRetries,
  };
};
