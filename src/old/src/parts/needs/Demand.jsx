import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import needsOptions_data from "@/data/database/companies/needsOptions.json";
import { demandSearchContext } from "@/data/context";
import { useTranslation } from "react-i18next";
import { useDemands, useUser } from "@/data/api";
import NeedItem from "@/widgets/needs/NeedItem";

import search_icon from "@/assets/svg/homepage/search_icon.svg";
import Loading from "@/widgets/Loading";

const Demand = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [demandSearch, setDemandSearch] = useContext(demandSearchContext);
  const { demandsData, demandsLoading } = useDemands();
  const { userData } = useUser();
  const [currentItems, setCurrentItems] = useState(demandsData || []);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let filteredData = demandsData || [];
    if (demandSearch.currentTag !== "All Companies") {
      filteredData = demandsData.filter(
        (demand) => demand.tag === demandSearch.currentTag
      );
    }

    if (demandSearch.searchTerm) {
      filteredData = filteredData.filter(
        (demand) =>
          demand.title
            .toLowerCase()
            .includes(demandSearch.searchTerm.toLowerCase()) ||
          demand.description
            .toLowerCase()
            .includes(demandSearch.searchTerm.toLowerCase())
      );
    }

    const newTotalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (demandSearch.currentPage - 1) * itemsPerPage;
    const newCurrentItems = filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setTotalPages(newTotalPages); // 更新總頁數狀態
    setCurrentItems(newCurrentItems); // 假設你也有這個狀態來儲存當前頁面項目
  }, [demandSearch, demandsData]);

  const filterTagHandler = (tag) => {
    setDemandSearch({ ...demandSearch, currentTag: tag, currentPage: 1 });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [demandSearch.currentPage]);

  return (
    <main className="pt-7.5 pb-15 pl-12 md:pr-10 xl:pr-50">
      <section className="flex justify-between items-center ml-2 mb-7.5">
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-6">
            {t("connect.demand.title")}
          </h1>
          <div className="relative w-fit">
            <input
              type="text"
              className="w-96 py-2 px-10 pr-3 rounded-full text-sm bg-com-profile-bg border-0.2px border-main-text-gray focus:border-main-color focus:ring-0"
              placeholder={t("connect.demand.placeholder")}
              value={demandSearch.searchTerm}
              onChange={(e) =>
                setDemandSearch({
                  ...demandSearch,
                  searchTerm: e.target.value,
                  currentPage: 1,
                })
              }
            />
            <img
              src={search_icon}
              alt="search icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 "
            />

            {demandSearch.searchTerm && (
              <button
                onClick={() =>
                  setDemandSearch({
                    ...demandSearch,
                    searchTerm: "",
                    currentPage: 1,
                  })
                }
                className="absolute scale-75 right-3 top-1/2 -translate-y-1/2 fill-db-Asearch hover:fill-main-color"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  preserveAspectRatio="none"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.017 11.903l7.682 7.682a1.358 1.358 0 001.92-1.92l-7.682-7.682 7.682-7.682a1.358 1.358 0 00-1.92-1.92l-7.682 7.682L2.335.381a1.358 1.358 0 00-1.92 1.92l7.682 7.682-7.682 7.682a1.357 1.357 0 101.92 1.92l7.682-7.682z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        <Link
          to={"/user/addneeds"}
          className="py-2 px-8 bg-black hover:bg-main-color text-white rounded-full flex items-center text-sm"
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                fill="#fff"
                d="M13 8H8v5c0 .55-.45 1-1 1s-1-.45-1-1V8H1c-.55 0-1-.45-1-1s.45-1 1-1h5V1c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"
              ></path>
            </svg>
          </span>
          {t("connect.demand.new_needs")}
        </Link>
      </section>

      {/* tags */}
      <section className="mb-9 flex flex-wrap space-x-2 space-y-2 ">
        <button
          className={`mt-2 ml-2 py-3 px-4 rounded-full border-0.2px text-sm hover:bg-main-color hover:text-white ${
            demandSearch.currentTag === "All Companies"
              ? "bg-main-text-gray text-white"
              : "bg-white text-db-table-text"
          }`}
          onClick={() => filterTagHandler("All Companies")}
        >
          {t("connect.demand.all_companies_tag")}
        </button>

        {(currentLanguage === "en"
          ? needsOptions_data["en"]
          : needsOptions_data["zh"]
        ).map((option) => (
          <button
            key={option[1]}
            className={`py-3 px-4 rounded-full border-0.2px text-sm hover:bg-main-color hover:text-white ${
              option[1] === demandSearch.currentTag
                ? "bg-main-text-gray text-white"
                : "bg-white text-db-table-text"
            }`}
            onClick={() => filterTagHandler(option[1])}
          >
            {option[0]}
          </button>
        ))}
      </section>

      {/* display */}
      <section>
        {demandsLoading ? (
          <Loading height={"50vh"} />
        ) : (
          <div className="w-fit flex flex-col items-center">
            <div className="flex flex-wrap justify-center xl:justify-start">
              {currentItems?.map((demand) => (
                <NeedItem key={demand.id} demand={demand} userData={userData} />
              ))}
            </div>

            {/* pages */}
            <div className="w-fit flex space-x-3 mt-15">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    className={`text-sm2 ${
                      demandSearch.currentPage === number
                        ? " text-main-color font-semibold pointer-events-none"
                        : " text-black font-normal pointer-events-auto"
                    }`}
                    key={number}
                    onClick={() =>
                      setDemandSearch({ ...demandSearch, currentPage: number })
                    }
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Demand;
