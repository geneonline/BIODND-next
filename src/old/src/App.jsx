import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Bowser from "bowser";
import { updateHistory } from "./data/api";
import { useUser } from "./hooks/useUser";
import Cookies from "js-cookie";

import Navbar from "./pages/Home/sections/Navbar";
import HomePage from "./pages/Home/HomePage";

// Database
import Database from "./pages/Database";

import AssetSearch from "./pages/database/search/AssetSearch";
import ClinicalTrialDetail from "./pages/database/data/ClinicalTrialDetail";
import DrugDetail from "./pages/database/data/DrugDetail";
import DeviceDetail from "./pages/database/data/DeviceDetail";
import ClinicalTrialCompare from "./pages/database/compare/ClinicalTrialCompare";
import DrugCompare from "./pages/database/compare/DrugCompare";
import DeviceCompare from "./pages/database/compare/DeviceCompare";
/* import AssetSearch from "./pages/database/search/AssetSearch"; */
import CompanySearch from "./pages/database/search/CompanySearch";

// Chatbot
import { AuthProvider } from "./pages/chatbot/AuthContext";
import Layout from "./pages/chatbot/Layout";
import Document from "./pages/chatbot/components/Document_TEST";
import Help from "./pages/chatbot/components/Help";

// User
import User from "./pages/User";
import UserProfile from "./pages/userPage/UserProfile";
import MyCompanyProfile from "./pages/userPage/MyCompanyProfile";
import MyList from "./pages/userPage/MyList";

import Eventtest from "./pages/Eventtest";

import Subscribe from "./pages/userPage/Subscribe";
import Subscribe_manage from "./pages/userPage/Subscribe_manage";

import { UserAuthProvider } from "./context/AuthContext";
import { PromoProvider } from "./context/PromoContext";

//v2.1 login
import LoginPage from "./pages/userPage/LoginPage";
import RegisterPage from "./pages/userPage/RegisterPage";
import VerifyPage from "./pages/userPage/VerifyPage";
import ResendPasswordPage from "./pages/userPage/ResendPasswordPage";
import ResetPasswordPage from "./pages/userPage/ResetPasswordPage";
import OnboardingPage from "./pages/userPage/Onboarding";
import VerifyPromptPage from "./pages/userPage/VerifyPromptPage";
import LogoutPage from "./pages/userPage/LogoutPage";

//payment
import PaymentSuccess from "./pages/userPage/PaymentSuccess";
import PaymentFailed from "./pages/userPage/PaymentFailed";

// Other
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./pages/PrivateRoute";

import Notfound from "./pages/Notfound";
// import Footer from "./parts/main/Footer";
import Footer from "./pages/Home/sections/Footer";

import {
  SearchContext,
  UserContext,
  demandSearchContext,
  messageInfoContext,
  SearchEngineContext,
} from "@/data/context";

import Reference from "./widgets/Reference";
import ScrollToTop from "./components/ScrollToTop";

// Event
import Event from "./pages/event/Event";
import EventDetails from "./pages/event/EventDetails";
import Thermo from "./pages/event/Thermo";
import Thermo_lab from "./pages/event/Thermo_lab";

//crunchbase companies
import CB_page from "./pages/elasticSearch/CBcompany/CB_page/CB_page";
import CB_page_financials from "./pages/elasticSearch/CBcompany/CB_page/CB_page_financials";
import CB_page_people from "./pages/elasticSearch/CBcompany/CB_page/CB_page_people";
import CB_page_news from "./pages/elasticSearch/CBcompany/CB_page/CB_page_news";
import CB_page_similarCompany from "./pages/elasticSearch/CBcompany/CB_page/CB_page_similarCompany";
import CB_home from "./pages/elasticSearch/CBcompany/CB_home/CB_home";

import Version from "./pages/Version";
import TermsConditions from "./pages/TermsConditions";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WebsiteRoutes() {
  const [searchValue, setSearchValue] = useState();
  const [user, setUser] = useState();

  const location = useLocation();
  const token = localStorage.getItem("token");
  const { userData, userError, userLoading, userIsValidating } = useUser(token);
  const hasUpdatedHistory = useRef(false);
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

  const isRoot = location.pathname === "/";

  useEffect(() => console.log(location), [location]);

  // user tracking function to update history
  useEffect(() => {
    if (
      !userIsValidating &&
      (userData || userError) &&
      !hasUpdatedHistory.current
    ) {
      hasUpdatedHistory.current = true; // 設置為已執行

      const browser = Bowser.getParser(window.navigator.userAgent);

      // 獲取現有的訪問次數
      let count = parseInt(Cookies.get("visitCount") || "0", 10);

      // 增加訪問次數
      count += 1;

      // 更新 Cookie
      Cookies.set("visitCount", count, { expires: 365 });

      // 呼叫 API
      updateHistory({
        userData: userData || {},
        event: "visit",
        eventData: {
          browser: browser.getBrowserName(),
          os: browser.getOSName(),
          device: browser.getPlatformType(),
          visitCount: count, // 紀錄 cookie visit count
          routerURL: location.pathname,
        },
      });

      console.log("Browser Info:", browser.getResult());
    }
  }, [userIsValidating, userData, userError]);

  return (
    <GoogleOAuthProvider clientId="730369258526-2ucddps35tju9akeinui8c29n68299k6.apps.googleusercontent.com">
      <UserAuthProvider>
        <UserContext.Provider value={[user, setUser]}>
          <SearchContext.Provider value={[searchValue, setSearchValue]}>
            <demandSearchContext.Provider
              value={[demandSearch, setDemandSearch]}
            >
              <messageInfoContext.Provider
                value={[messageInfo, setMessageInfo]}
              >
                <SearchEngineContext.Provider
                  value={[searchEngine, setSearchEngine]}
                >
                  <PromoProvider
                    token={token}
                    userLoading={userLoading}
                    userData={userData}
                  >
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<HomePage />} />

                      <Route element={<Navbar />}>
                        <Route path="subscribe">
                          <Route index element={<Subscribe />} />
                          <Route path="manage" element={<Subscribe_manage />} />
                        </Route>
                        {/* v2.4 assets database remake - require login under PrivateRoute */}
                        <Route element={<PrivateRoute />}>
                          <Route
                            path="database/"
                            element={<Database />}
                            exact={false}
                          >
                            <Route
                              index
                              element={
                                <Navigate
                                  to="search/assets/clinical-trial"
                                  replace
                                />
                              }
                            />
                            <Route
                              path="search/assets/:assetType"
                              element={<AssetSearch />}
                            />
                            <Route
                              path="search/companies"
                              element={<CompanySearch />}
                            />

                            <Route
                              path="data/assets/clinical-trial/:id"
                              element={<ClinicalTrialDetail />}
                            />
                            <Route
                              path="data/assets/drug/:id"
                              element={<DrugDetail />}
                            />
                            <Route
                              path="data/assets/device/:id"
                              element={<DeviceDetail />}
                            />
                            <Route
                              path="compare/assets/clinical-trial"
                              element={<ClinicalTrialCompare />}
                            />
                            <Route
                              path="compare/assets/drug"
                              element={<DrugCompare />}
                            />
                            <Route
                              path="compare/assets/device"
                              element={<DeviceCompare />}
                            />
                            <Route
                              path="*"
                              element={
                                <Navigate
                                  to="search/assets/clinical-trial"
                                  replace
                                />
                              }
                            />
                          </Route>

                          <Route path="company-home" element={<CB_home />} />
                          <Route
                            path="company-page/:uuid"
                            element={<CB_page />}
                          >
                            <Route
                              path="financials"
                              element={<CB_page_financials />}
                            />
                            <Route path="people" element={<CB_page_people />} />
                            <Route path="news" element={<CB_page_news />} />
                            <Route
                              path="similarCompany"
                              element={<CB_page_similarCompany />}
                            />
                          </Route>

                          <Route path="user" element={<User />}>
                            <Route path="profile" element={<UserProfile />} />
                            <Route
                              path="companyprofile"
                              element={<MyCompanyProfile />}
                            />
                            <Route path="mylist" element={<MyList />} />
                          </Route>
                        </Route>

                        <Route path="terms" element={<TermsConditions />} />
                        <Route path="about" element={<About />} />
                        <Route path="event">
                          <Route index element={<Event />} />
                          <Route
                            path=":eventId/details"
                            element={<EventDetails />}
                          />
                          <Route
                            path="Thermo-Fisher-Scientific-Indonesia"
                            element={<Thermo />}
                          />
                          <Route
                            path="Thermo-Fisher-Lab-Indonesia"
                            element={<Thermo_lab />}
                          />
                        </Route>
                        <Route path="contact" element={<Contact />} />

                        <Route path="version" element={<Version />} />

                        <Route path="*" element={<Notfound />} />
                      </Route>

                      {/* v2.1 login */}
                      <Route path="account">
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="verifyEmail" element={<VerifyPage />} />
                        <Route
                          path="resendPassword"
                          element={<ResendPasswordPage />}
                        />
                        <Route
                          path="resetPassword"
                          element={<ResetPasswordPage />}
                        />
                        <Route path="onboarding" element={<OnboardingPage />} />
                        <Route path="logout" element={<LogoutPage />} />
                        <Route
                          path="verify-prompt"
                          element={<VerifyPromptPage />}
                        />
                      </Route>

                      {/* v2.2 subscribe */}
                      <Route
                        path="payment-success"
                        element={<PaymentSuccess />}
                      />
                      <Route path="payment-fail" element={<PaymentFailed />} />

                      <Route path="/reference" element={<Reference />} />
                    </Routes>
                    <Footer token={token} />
                  </PromoProvider>
                </SearchEngineContext.Provider>
              </messageInfoContext.Provider>
            </demandSearchContext.Provider>
          </SearchContext.Provider>
        </UserContext.Provider>
      </UserAuthProvider>
    </GoogleOAuthProvider>
  );
}

function ChatbotRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="document" element={<Document />} />
          <Route path="document/:id" element={<Document />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function App() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div
      className={`m-0 p-0 box-border ${
        currentLanguage === "en" ? "font-Inter" : "font-Noto"
      } w-full bg-white leading-tight min-w-[320px]`}
    >
      <ToastContainer position="top-center" hideProgressBar />
      <Routes>
        <Route path="/chatbot/*" element={<ChatbotRoutes />} />
        <Route path="/*" element={<WebsiteRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
