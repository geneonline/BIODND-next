import useSWR from "swr";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const baseURL = import.meta.env.VITE_Effect_API;

const fetcher = (url, token, logout) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      if (err.response?.status === 401 && typeof logout === "function") {
        logout();
      }
      throw err;
    });

//使用方式:帶入 token
export function useUser(token) {
  const { logout } = useAuth() || {};
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    token ? ["/api/Account", token] : null,
    ([url, token]) => fetcher(`${baseURL}${url}`, token, logout),
    { revalidateOnFocus: false }
  );

  return {
    userData: data,
    userError: error,
    userLoading: isLoading,
    userIsValidating: isValidating,
    userMutate: mutate, // add mutate so that consumer can manually refetch
  };
}
