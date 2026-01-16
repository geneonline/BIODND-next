import useSWR from "swr";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

const fetcher = (url: string, token: string, logout: any) =>
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
export function useUser(token: string | null) {
  const auth = useAuth();
  const logout = auth?.logout;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    token ? ["/api/Account", token] : null,
    ([url, token]) => fetcher(`${baseURL}${url}`, token as string, logout),
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
