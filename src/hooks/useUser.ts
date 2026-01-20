import useSWR from "swr";
import axios from "axios";

// Access via proxy which attaches HttpOnly cookie
const API_URL = "/api/proxy/api/Account";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data);

export function useUser() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    API_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false, // Don't retry if 401
    }
  );

  return {
    user: data,
    userData: data, // Backward compatibility alias
    isLoading,
    userLoading: isLoading, // Backward compatibility alias
    error,
    userError: error, // Backward compatibility alias
    isValidating,
    userIsValidating: isValidating, // Backward compatibility alias
    mutate,
    userMutate: mutate, // Backward compatibility alias
  };
}
