"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserAuthProvider, useAuth } from "@/context/AuthContext";
import { PromoProvider } from "@/context/PromoContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/hooks/useUser";
import { useState, ReactNode } from "react";
import {
  SearchContext,
  UserContext,
  demandSearchContext,
  messageInfoContext,
  SearchEngineContext,
} from "@/context/GlobalContext";

// Replace with actual Client ID or env var
const GOOGLE_CLIENT_ID =
  "730369258526-2ucddps35tju9akeinui8c29n68299k6.apps.googleusercontent.com";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserAuthProvider>
        <StatefulProviders>{children}</StatefulProviders>
        <ToastContainer position="top-center" hideProgressBar />
      </UserAuthProvider>
    </GoogleOAuthProvider>
  );
}

function StatefulProviders({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  // Global State
  const [user, setUser] = useState<any>();
  const [searchValue, setSearchValue] = useState<any>();
  const [demandSearch, setDemandSearch] = useState({
    currentTag: "All Companies",
    currentPage: 1,
    searchTerm: "",
  });
  const [messageInfo, setMessageInfo] = useState({
    messaging: {
      isOpen: false,
      isShow: true,
    },
    isOpen: false,
    isShow: true,
    to: "", //company name for now
    message: {
      company_id: "",
      receiver_id: "",
    },
  });
  const [searchEngine, setSearchEngine] = useState(
    "biodnd-companies-search-engine"
  );

  // Fetch user data based on token from AuthContext
  const { userData, userLoading } = useUser(token);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <SearchContext.Provider value={[searchValue, setSearchValue]}>
        <demandSearchContext.Provider value={[demandSearch, setDemandSearch]}>
          <messageInfoContext.Provider value={[messageInfo, setMessageInfo]}>
            <SearchEngineContext.Provider
              value={[searchEngine, setSearchEngine]}
            >
              <PromoProvider
                token={token}
                userLoading={userLoading}
                userData={userData}
              >
                {/* ScrollToTop should be implemented as a hook or component here if needed */}
                {children}
              </PromoProvider>
            </SearchEngineContext.Provider>
          </messageInfoContext.Provider>
        </demandSearchContext.Provider>
      </SearchContext.Provider>
    </UserContext.Provider>
  );
}
