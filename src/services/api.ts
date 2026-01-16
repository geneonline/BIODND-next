import axios from "axios";
import useSWR from "swr";
import { useState, useEffect } from "react";

// TODO: Set these in .env.local
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/companies";
const assetURL = process.env.NEXT_PUBLIC_API_URL + "/assets";
const VITE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const companiesSearchURL = (data: any) =>
  baseURL +
  ".json?" +
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const assetsSearchURL = (data: any) =>
  assetURL +
  ".json?" +
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const vector_companiesSearchURL = (data: any) =>
  `${VITE_API_URL}/vector_companies.json?query=` +
  Object.entries(data)
    .map(([key, value]) => `${key}:${encodeURIComponent(value as string)}`)
    .join(" ");

export const vector_assetsSearchURL = (data: any) =>
  `${VITE_API_URL}/vector_assets.json?query=` +
  Object.entries(data)
    .map(([key, value]) => `${key}:${encodeURIComponent(value as string)}`)
    .join(" ");

export const companyProfileURL = (id: string) => baseURL + "/" + id + ".json";

export const companyProfileAssetsURL = (id: string) =>
  baseURL + "/" + id + "/assets" + ".json";

export const fetcher_get = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: { Accept: "application/json" },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.clear();
        }
        return null;
      }
      throw err;
    });

/////   LINK

export const searchCompaniesLink = (data: any) => {
  const keysToModify = Object.keys(data).reduce(
    (acc: any, key) => {
      if (key.endsWith("_parants")) {
        const baseKey = key.slice(0, -8);
        if (!Object.prototype.hasOwnProperty.call(data, baseKey)) {
          acc.toRename[key] = baseKey;
        } else {
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
      .filter(([key, value]) => value && !keysToModify.toRemove[key])
      .map(([key, value]) => {
        const newKey = keysToModify.toRename[key] || key;
        return `${encodeURIComponent(newKey)}=${encodeURIComponent(
          value as string
        )}`;
      })
      .join("&")
  );
};

export const searchAssetsLink = (data: any) => {
  const keysToModify = Object.keys(data).reduce(
    (acc: any, key) => {
      if (key.endsWith("_parants")) {
        const baseKey = key.slice(0, -8);
        if (!Object.prototype.hasOwnProperty.call(data, baseKey)) {
          acc.toRename[key] = baseKey;
        } else {
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
      .filter(([key, value]) => value && !keysToModify.toRemove[key])
      .map(([key, value]) => {
        const newKey = keysToModify.toRename[key] || key;
        return `${encodeURIComponent(newKey)}=${encodeURIComponent(
          value as string
        )}`;
      })
      .join("&")
  );
};

export const updateHistory = async ({
  userData = {},
  event,
  eventData,
}: any) => {
  return;
};

//  V V V  SWR custom hook  V V V
export const useUser = () => {
  // Determine userId URL
  const {
    data: userIdData,
    error: userIdError,
    mutate: mutateUserId,
  } = useSWR(`${VITE_API_URL}/user_profiles/current.json`, fetcher_get, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const isUserIdLoading =
    typeof userIdData === "undefined" && typeof userIdError === "undefined";

  const userProfileId = userIdData?.id || null;

  const {
    data: userData,
    error: userDetailsError,
    mutate: mutateUserDetails,
  } = useSWR(
    userProfileId
      ? `${VITE_API_URL}/user_profiles/${userProfileId}.json`
      : null,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  const isUserDetailsLoading =
    userProfileId &&
    typeof userData === "undefined" &&
    typeof userDetailsError === "undefined";

  const isLoading = isUserIdLoading || isUserDetailsLoading;

  const userError = userIdError || userDetailsError;
  const isLoggedIn = !!userData;

  const mutateUser = async () => {
    const updatedUserIdData = await mutateUserId();
    const updatedUserProfileId = updatedUserIdData?.id || null;
    if (updatedUserProfileId) {
      const updatedUserData = await mutateUserDetails();
      return updatedUserData;
    }
    return null;
  };

  return {
    userData,
    userError,
    isLoggedIn,
    isLoading,
    mutateUser,
  };
};

export const useMyList = () => {
  const { data, error, isLoading } = useSWR(
    `${VITE_API_URL}/favorites.json`,
    fetcher_get,
    { revalidateOnMount: false, revalidateOnFocus: false }
  );
  return { myListData: data, myListError: error, myListLoading: isLoading };
};

export const useCompanyProfile = (id: string) => {
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

export const useAssetProfile = (id: string) => {
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

export const useDemands = (id: string | undefined = undefined) => {
  const { data, error, isLoading } = useSWR(
    `${VITE_API_URL}/needs${id ? `/${id}` : ""}.json?need_type=Demand`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    demandsData: data,
    demandsError: error,
    demandsLoading: isLoading,
  };
};
export const useSupplies = (id: string | undefined = undefined) => {
  const { data, error, isLoading } = useSWR(
    `${VITE_API_URL}/needs${id ? `/${id}` : ""}.json?need_type=Supply`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    suppliesData: data,
    suppliesError: error,
    suppliesLoading: isLoading,
  };
};
export const useNeeds = (id: string) => {
  const { data, error, isLoading } = useSWR(
    `${VITE_API_URL}/needs${id ? `/${id}` : ""}.json`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  return {
    needsData: data,
    needsError: error,
    needsLoading: isLoading,
  };
};

export const useUserNeeds = (id: string) => {
  const { data, error, isLoading } = useSWR(
    `${VITE_API_URL}/needs.json`,
    fetcher_get,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );
  const filteredData = data
    ? data.filter((need: any) => need.contact_id === id)
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
    `${VITE_API_URL}/messages.json`,
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
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRetryCount((current) => current + 1);
    }

    if (retryCount >= maxRetries) {
      mutate(data, false);
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
