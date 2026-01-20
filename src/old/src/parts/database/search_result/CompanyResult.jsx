import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { useTranslation } from "react-i18next";
import {
  searchCompaniesLink,
  vector_companiesSearchURL,
  fetcher_get,
  useUser,
  useMyList,
} from "@/data/api";

import Description_content from "@/widgets/database/Description_content";

import { continentTranslation } from "@/data/database/companies/locationOptions";
import { fakeData } from "@/data/database/fakedata";

import LoginToContinue_popup from "@/widgets/LoginToContinue_popup";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import loadingImg from "@/assets/img/loading.png";
import Types_content from "@/widgets/database/Types_content";
import axios from "axios";
import lock_icon from "@/assets/svg/database/lock_icon.svg";
import lock_icon2 from "@/assets/svg/database/lock_icon2.svg";

const useFetchMultipleUrls = (urls, params) => {
  const { data, error, isValidating } = useSWR(
    urls,
    () => Promise.all(urls.map((url) => fetcher_get(url))),
    { revalidateOnFocus: false }
  );

  const regionNames = params.Country_Region?.split(",");
  const continentNames = Object.values(continentTranslation).flat();
  console.log(regionNames);
  let isContinent = false;

  if (
    !regionNames ||
    regionNames.some((region) => continentNames.includes(region))
  ) {
    isContinent = true;
  }

  let processedData = [];

  if (data) {
    // 建立一個新的 Set 來存儲已經處理過的 id
    const seenIds = new Set();

    processedData = data
      .flat()
      .filter((item) => {
        if (isContinent) {
          // 如果是洲名，不進行過濾
          return true;
        } else {
          // 如果不是洲名，則進行國家過濾
          return regionNames?.includes(item?.Country_Region);
        }
      })
      .filter((item) => {
        if (!item || seenIds.has(item.id)) {
          // 如果 id 已經存在於 Set 中，則過濾掉這個項目
          return false;
        }
        // 將新的 id 加入到 Set 中
        seenIds.add(item.id);
        return true;
      });
  }

  return {
    data: processedData,
    isLoading: !error && !data,
    isError: error,
    isValidating,
  };
};

const CompanyResult = () => {
  const { t } = useTranslation();
  //get link's params
  const [searchParams] = useSearchParams();

  // Because of the js object "pass by reference",
  // you need to use the useMemo to compare the value of the searchParams
  // and decide to update params value or not.
  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const { userData } = useUser();
  const [dataLimit, setDataLimit] = useState(5);

  ////// change page thing...  ///////
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  const [pageNumbers] = useState([]);

  //////////////    other      ////////////////////////
  const [displayListToggle] = useState(true);
  // const [sortDirectionToggle, setSortDirectionToggle] = useState(false);
  // const [orderSelected, setOrderSelected] = useState(0);
  // const orderOptions = [
  //   "Order by Company",
  //   "Order by Employees",
  //   "Order by year founded",
  // ];

  useEffect(() => {
    setCurrentPage(1);
  }, [params]);

  const urls = useMemo(() => {
    // 當 params.Country_Region 不存在時 return 一項只有其他值的陣列
    if (!params.Country_Region) return [vector_companiesSearchURL(params)];

    // 將 params.Country_Region 拆分成國家名稱陣列，然後為每個國家生成 URL
    return params.Country_Region.split(",").map((country) =>
      vector_companiesSearchURL({ ...params, Country_Region: country })
    );
  }, [params]); // 依賴於 params.Country_Region

  const { data, isLoading } = useFetchMultipleUrls(urls, params);

  //limit the data by user subscription level
  useEffect(() => {
    if (userData?.id === 1 || userData?.subscription_level === "pro") {
      setDataLimit(100);
    } else if (
      userData?.subscription_level === "test" ||
      userData?.subscription_level === "silver"
    ) {
      setDataLimit(30);
    } else {
      setDataLimit(5);
    }
  }, [userData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //set pageNumbers
  // useEffect(() => {
  //   if (data?) {
  //     setEnd(data.companies.length - 1);
  //   }
  //   if (data?.total_pages) {
  //     if (data?.length === 0) {
  //       setPageNumbers([0]);
  //     } else {
  //       setPageNumbers(
  //         Array.from({ length: data.total_pages }, (_, i) => i + 1)
  //       );
  //     }
  //   }
  // }, [data]);

  //--------- set rowRefs for block ------------------
  const [start, setStart] = useState(5); // 從第 N 個 tr 開始
  const [end, setEnd] = useState(50); // 結束於第 N 個 tr
  const rowRefs = useRef([]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, fakeData?.length);
    setEnd(fakeData?.length - 1);
    if (currentPage === 1) {
      setStart(0);
    } else {
      setStart(0);
    }
  }, [currentPage]);

  // useEffect(() => {
  //   const startRef = rowRefs.current[start];
  //   const endRef = rowRefs.current[end];

  //   if (startRef && endRef && !userData) {
  //     const startTop = startRef.offsetTop;
  //     const endBottom = endRef.offsetTop + endRef.offsetHeight;

  //     // 這裡設定遮擋元素的位置和高度
  //     const promotionBanner = document.querySelector(".promotion-banner");
  //     promotionBanner.style.top = `${startTop}px`;
  //     promotionBanner.style.height = `${endBottom - startTop}px`;
  //   }
  // }, [start, end, rowRefs, fakeData]);

  /////  ------------  add to my List --------------------

  // get my list data
  const { myListData, myListLoading } = useMyList();

  const [IsNeedtopayPopup, setIsNeedtopayPopup] = useState(false);
  //add company to my list
  const addListHandler = (id) => {
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/companies/${id}/favorite`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        mutate(`${import.meta.env.VITE_API_URL}/favorites.json`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //remove company to my list
  const removeListHandler = (id) => {
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append("_method", "delete");
    axios
      .post(`${import.meta.env.VITE_API_URL}/companies/${id}/favorite`, formData, {
        withCredentials: true,
      })
      .then(() => {
        mutate(`${import.meta.env.VITE_API_URL}/favorites.json`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* ------------------- search results area ------------------- */}
      <div className="mb-28">
        {isLoading ? (
          <div className="w-full h-[50vh] flex flex-col justify-center items-center">
            <img className=" animate-spin" src={loadingImg} alt="" />
            <p className="mt-3 text-sm2 text-toggle-color">
              Loading Search Results...
            </p>
          </div>
        ) : (
          <>
            {/* top buttons */}
            <div className="relative w-full pt-11.5 px-44 flex justify-start items-start mb-8">
              <div className="flex flex-col">
                {/* <div className="flex items-center">
                  <p
                    data-testid="result-found"
                    className="text-xl text-nav-bg font-semibold pr-2.5"
                  >
                    {t("search.search_results.results_found", {
                      count: data ? data?.company_counts : 0,
                    })}
                  </p>
                  {data?.length > 0 && (
                    <p className="text-sm2 text-main-text-gray">
                      {t("search.search_results.displaying_results", {
                        start: (currentPage - 1) * itemsPerPage + 1,
                        end: (currentPage - 1) * itemsPerPage + data?.length,
                      })}
                    </p>
                  )}
                </div> */}
              </div>

              {/* pages buttons */}

              {pageNumbers !== 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 flex justify-between items-center pt-7.5">
                  {/* previos page button*/}
                  {currentPage !== 1 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>
                      <svg
                        className="rotate-180 fill-black hover:fill-main-color"
                        width={11}
                        height={9}
                        viewBox="0 0 11 9"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.39812 0.18469L5.38782 4.17769C5.46262 4.25469 5.50002 4.34379 5.50002 4.44334C5.49915 4.54598 5.459 4.64439 5.38782 4.71834L1.22157 8.78724C1.01092 8.96159 0.82337 8.96159 0.65947 8.78724C0.49502 8.61289 0.49502 8.43359 0.65947 8.24824L4.55347 4.44334L0.83877 0.72369C0.70842 0.53504 0.72052 0.36399 0.87507 0.20944C1.02962 0.05544 1.20397 0.0471901 1.39812 0.18469ZM6.34812 0.18469L10.3378 4.17769C10.4126 4.25469 10.45 4.34379 10.45 4.44334C10.4491 4.54598 10.409 4.64439 10.3378 4.71834L6.17157 8.78724C5.96092 8.96159 5.77337 8.96159 5.60947 8.78724C5.44502 8.61289 5.44502 8.43359 5.60947 8.24824L9.50347 4.44334L5.78877 0.72369C5.65842 0.53504 5.67052 0.36399 5.82507 0.20944C5.97962 0.05544 6.15397 0.0471901 6.34812 0.18469Z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* first page */}
                  {currentPage > 2 && (
                    <>
                      <button
                        className={`text-nav-bg font-normal text-sm2 mx-2`}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                      <span
                        className={`select-none ${
                          currentPage === 3 ? "hidden" : "inline"
                        }`}
                      >
                        ...
                      </span>
                    </>
                  )}

                  {data?.total_pages !== 0 &&
                    pageNumbers
                      .slice(
                        currentPage -
                          (currentPage === pageNumbers.length
                            ? 3
                            : currentPage === 1
                            ? 1
                            : 2),
                        currentPage + (currentPage === 1 ? 2 : 1)
                      )
                      .map((pageNum) => (
                        <button
                          className={`${
                            pageNum === currentPage
                              ? "text-main-color font-semibold"
                              : "text-nav-bg font-normal"
                          } text-sm2 mx-2`}
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={pageNum === currentPage}
                        >
                          {pageNum}
                        </button>
                      ))}

                  {/* last page */}
                  {currentPage < pageNumbers.length - 1 && (
                    <>
                      <span
                        className={`select-none ${
                          currentPage === pageNumbers.length - 2
                            ? "hidden"
                            : "inline"
                        }`}
                      >
                        ...
                      </span>
                      <button
                        className={`text-nav-bg font-normal text-sm2 mx-2`}
                        onClick={() => handlePageChange(pageNumbers.length)}
                      >
                        {pageNumbers.length}
                      </button>
                    </>
                  )}

                  {/* next page button */}
                  {/* {data?.total_pages !== 0 &&
                    currentPage !== pageNumbers.length && (
                      <button onClick={() => handlePageChange(currentPage + 1)}>
                        <svg
                          className="fill-black hover:fill-main-color"
                          width={11}
                          height={9}
                          viewBox="0 0 11 9"
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.39812 0.18469L5.38782 4.17769C5.46262 4.25469 5.50002 4.34379 5.50002 4.44334C5.49915 4.54598 5.459 4.64439 5.38782 4.71834L1.22157 8.78724C1.01092 8.96159 0.82337 8.96159 0.65947 8.78724C0.49502 8.61289 0.49502 8.43359 0.65947 8.24824L4.55347 4.44334L0.83877 0.72369C0.70842 0.53504 0.72052 0.36399 0.87507 0.20944C1.02962 0.05544 1.20397 0.0471901 1.39812 0.18469ZM6.34812 0.18469L10.3378 4.17769C10.4126 4.25469 10.45 4.34379 10.45 4.44334C10.4491 4.54598 10.409 4.64439 10.3378 4.71834L6.17157 8.78724C5.96092 8.96159 5.77337 8.96159 5.60947 8.78724C5.44502 8.61289 5.44502 8.43359 5.60947 8.24824L9.50347 4.44334L5.78877 0.72369C5.65842 0.53504 5.67052 0.36399 5.82507 0.20944C5.97962 0.05544 6.15397 0.0471901 6.34812 0.18469Z"
                          />
                        </svg>
                      </button>
                    )} */}
                </div>
              )}

              {/* right buttons */}
              {/* <div className="flex flex-col">
            <Select
              selected={orderSelected}
              setSelected={setOrderSelected}
              options={orderOptions}
              width={190}
            />
            <div className="pt-2 flex items-center justify-end">
              <p className="pr-[7px] text-xs3 text-main-text-gray">
                sort direction:
              </p>
              <button
                className={`relative w-8 h-[17px] rounded-full flex items-center ${
                  sortDirectionToggle
                    ? " bg-toggle-color"
                    : " bg-mobile-nav-text-gray"
                } transition-all ease-in-out duration-300`}
                onClick={() => setSortDirectionToggle(!sortDirectionToggle)}
              >
                <div
                  className={`absolute ${
                    sortDirectionToggle ? "right-0" : "right-[15px]"
                  }  mx-0.5 w-[13px] h-[13px] rounded-full bg-white flex justify-center items-center transition-all ease-in-out duration-300`}
                >
                  <svg
                    className={`w-[7px] h-2 relative ${
                      sortDirectionToggle ? "rotate-180" : "rotate-0"
                    } transition-all ease-in-out duration-300`}
                    width={7}
                    height={8}
                    viewBox="0 0 7 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3.5 1.6001L7 5.86676H0L3.5 1.6001Z"
                      fill={`${sortDirectionToggle ? "#8797A6" : "#D9D9D9"} `}
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div> */}
            </div>

            {/* search result */}
            <div className="w-full overflow-auto">
              {/* table display */}
              {data?.length > 0 && displayListToggle && (
                <div className="relative w-fit mx-auto">
                  <table className="w-[1228px] text-sm2 mx-auto mt-2.5 rounded-t-lg border-collapse">
                    <thead className="text-main-text-gray bg-profile-viewed-bg font-normal">
                      <tr className="border border-footer-text rounded-10px">
                        <th className="w-[267px] py-3.5 ">
                          {t("search.search_results.company_name")}
                        </th>
                        <th className="w-[141px] py-3.5 ">
                          {t("search.search_results.headquarters")}
                        </th>
                        <th className="w-[160px] py-3.5 ">
                          {t("search.search_results.company_types")}
                        </th>
                        <th className="w-[219px] py-3.5 ">
                          {t("search.search_results.main_therapeutic_area")}
                        </th>
                        <th className="w-[241px] py-3.5 ">
                          {t("search.search_results.description")}
                        </th>
                        <th className="w-[200px] py-3.5 ">
                          {t("search.search_results.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data &&
                        data?.slice(0, dataLimit).map((item) => (
                          <tr
                            className="border border-footer-text"
                            key={item.id}
                          >
                            {/* company name */}
                            <td className=" px-2 ">
                              <div className="flex items-center py-7.5">
                                {/* List ID matches item ID  */}
                                {myListLoading ? (
                                  <div className="px-4 w-[21px] h-[21px] relative text-white bg-black">
                                    <img
                                      className=" animate-spin"
                                      src={loadingImg}
                                      alt=""
                                    />
                                  </div>
                                ) : myListData?.some(
                                    (li) => li.id === item.id
                                  ) ? (
                                  // remove to list button
                                  <button
                                    onClick={() => removeListHandler(item.id)}
                                    className="px-4 "
                                  >
                                    <svg
                                      width={19}
                                      height={19}
                                      viewBox="0 0 19 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`w-[21px] h-[21px] relative fill-black hover:fill-main-color`}
                                      preserveAspectRatio="none"
                                    >
                                      <path d="M7.72257 12.7941L4.17773 9.24845L5.35907 8.06711L7.72257 10.4298L12.4479 5.70361L13.6301 6.88578L7.72257 12.7924V12.7941Z" />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 9.19C0 4.11461 4.11461 0 9.19 0C14.2654 0 18.38 4.11461 18.38 9.19C18.38 14.2654 14.2654 18.38 9.19 18.38C4.11461 18.38 0 14.2654 0 9.19ZM9.19 16.7091C8.20258 16.7091 7.22483 16.5146 6.31257 16.1367C5.40031 15.7589 4.57141 15.205 3.8732 14.5068C3.17499 13.8086 2.62114 12.9797 2.24327 12.0674C1.8654 11.1552 1.67091 10.1774 1.67091 9.19C1.67091 8.20258 1.8654 7.22483 2.24327 6.31257C2.62114 5.40031 3.17499 4.57141 3.8732 3.8732C4.57141 3.17499 5.40031 2.62114 6.31257 2.24327C7.22483 1.8654 8.20258 1.67091 9.19 1.67091C11.1842 1.67091 13.0967 2.4631 14.5068 3.8732C15.9169 5.2833 16.7091 7.19581 16.7091 9.19C16.7091 11.1842 15.9169 13.0967 14.5068 14.5068C13.0967 15.9169 11.1842 16.7091 9.19 16.7091Z"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  /* Add to list button */
                                  <button
                                    onClick={() => addListHandler(item.id)}
                                    className="px-4"
                                  >
                                    <svg
                                      width={21}
                                      height={21}
                                      viewBox="0 0 21 21"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-[21px] h-[21px] relative fill-black hover:fill-main-color"
                                      preserveAspectRatio="none"
                                    >
                                      <path d="M10.5 1.3125C8.07242 1.34179 5.75252 2.31916 4.03584 4.03584C2.31916 5.75252 1.34179 8.07242 1.3125 10.5C1.34179 12.9276 2.31916 15.2475 4.03584 16.9642C5.75252 18.6808 8.07242 19.6582 10.5 19.6875C12.9276 19.6582 15.2475 18.6808 16.9642 16.9642C18.6808 15.2475 19.6582 12.9276 19.6875 10.5C19.6582 8.07242 18.6808 5.75252 16.9642 4.03584C15.2475 2.31916 12.9276 1.34179 10.5 1.3125ZM15.75 11.1562H11.1562V15.75H9.84375V11.1562H5.25V9.84375H9.84375V5.25H11.1562V9.84375H15.75V11.1562Z" />
                                    </svg>
                                  </button>
                                )}

                                <Link
                                  target="_blank"
                                  className="flex items-center font-normal hover:font-semibold"
                                  to={`/database/${item.id}`}
                                >
                                  <div className="h-[36px] w-[36px] bg-white border border-img-border rounded-full flex-shrink-0 overflow-hidden flex justify-center items-center">
                                    <img
                                      src={
                                        item?.uploaded_logo_url ||
                                        // item?.Company_Logo ||
                                        defaultCompanyImage
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <p className="px-2.5 text-nav-bg">
                                    {item.Company_Name}
                                  </p>
                                </Link>
                              </div>
                            </td>

                            {/* Headquarters */}
                            <td className=" px-2 text-center">
                              <p>{`${item.Country_Region}`}</p>
                            </td>

                            {/* Company Types */}
                            <td className=" px-2">
                              <Types_content
                                objs={item.Company_Types}
                                split={"|"}
                                link={searchCompaniesLink}
                                params={params}
                                searchKey={"Company_Types"}
                                imgURL={
                                  item?.uploaded_logo_url ||
                                  // item?.Company_Logo ||
                                  defaultCompanyImage
                                }
                                name={item.Company_Name}
                                typeName={"Company Types"}
                              />

                              {/* <div className="flex flex-wrap justify-center">
                        {item.Company_Types
                          ? item.Company_Types.split(",").map((i, index) => (
                              <Link
                                key={index}
                                className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray hover:bg-db-Asearch rounded-20px"
                                to={searchCompaniesLink({
                                  ...params,
                                  Company_Types: i,
                                })}
                              >
                                {i}
                              </Link>
                            ))
                          : "N/A"}
                      </div> */}
                            </td>

                            {/* Main Therapeutic Area */}
                            <td className=" px-2">
                              <Types_content
                                objs={item.Primary_Therapeutic_Areas}
                                split={"|"}
                                link={searchCompaniesLink}
                                params={params}
                                searchKey={"Primary_Therapeutic_Areas"}
                                imgURL={
                                  item?.uploaded_logo_url ||
                                  // item?.Company_Logo ||
                                  defaultCompanyImage
                                }
                                name={item.Company_Name}
                                typeName={"Main Therapeutic Area"}
                              />

                              {/* <div className="flex flex-wrap">
                        {item.Primary_Therapeutic_Areas
                          ? item.Primary_Therapeutic_Areas.split("\n").map(
                              (i, index) => (
                                <Link
                                  key={index}
                                  className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray hover:bg-db-Asearch rounded-20px"
                                  to={searchCompaniesLink({
                                    ...params,
                                    Primary_Therapeutic_Areas: i,
                                  })}
                                >
                                  {i}
                                </Link>
                              )
                            )
                          : "N/A"}
                      </div> */}
                            </td>

                            {/* Description */}
                            <td className="text-nav-bg pl-2 pr-5 py-1">
                              <Description_content
                                content={item.Description || "empty"}
                                maxCharacters={110}
                                width={170}
                                companyName={item.Company_Name}
                                imgURL={
                                  item?.uploaded_logo_url ||
                                  // item?.Company_Logo ||
                                  defaultCompanyImage
                                }
                              />
                            </td>

                            {/* Actions */}
                            <td className=" px-2">
                              <div className="flex flex-col justify-center items-center">
                                <Link
                                  target="_blank"
                                  to={`/database/${item.id}`}
                                  className="w-[153px] py-2 border  rounded-full bg-white hover:bg-main-color-gb border-main-text-gray hover:border-white text-db-table-text hover:text-white font-medium mb-2 text-center"
                                >
                                  {t("search.search_results.view_full_profile")}
                                </Link>

                                {myListData?.some((li) => li.id === item.id) ? (
                                  <button
                                    onClick={() => removeListHandler(item.id)}
                                    className="w-[153px] py-2 rounded-full text-white bg-toggle-color hover:bg-main-color-gb font-medium"
                                  >
                                    {t("search.search_results.added_to_list")}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => addListHandler(item.id)}
                                    className="w-[153px] py-2 rounded-full text-white bg-nav-bg hover:bg-main-color-gb font-medium"
                                  >
                                    {t("search.search_results.add_to_list")}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* fake block */}
                  {data?.length !== 0 &&
                    userData?.subscription_level !== "pro" &&
                    userData?.id !== 1 && (
                      <div className="relative w-[1228px] text-sm2 mx-auto">
                        <table className=" rounded-t-lg border-collapse">
                          <tbody>
                            {/* fakedata */}

                            {fakeData &&
                              fakeData?.map((item, index) => (
                                <tr
                                  className="border border-footer-text"
                                  key={item.id}
                                  ref={(el) => (rowRefs.current[index] = el)}
                                >
                                  {/* company name */}
                                  <td className=" px-2 ">
                                    <div className="flex items-center py-7.5">
                                      {/* List ID matches item ID  */}
                                      {myListLoading ? (
                                        <div className="px-4 w-[21px] h-[21px] relative text-white bg-black">
                                          loading...
                                        </div>
                                      ) : myListData?.some(
                                          (li) => li.id === item.id
                                        ) ? (
                                        // remove to list button
                                        <button
                                          onClick={() =>
                                            removeListHandler(item.id)
                                          }
                                          className="px-4 "
                                        >
                                          <svg
                                            width={19}
                                            height={19}
                                            viewBox="0 0 19 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-[21px] h-[21px] relative fill-black hover:fill-main-color`}
                                            preserveAspectRatio="none"
                                          >
                                            <path d="M7.72257 12.7941L4.17773 9.24845L5.35907 8.06711L7.72257 10.4298L12.4479 5.70361L13.6301 6.88578L7.72257 12.7924V12.7941Z" />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M0 9.19C0 4.11461 4.11461 0 9.19 0C14.2654 0 18.38 4.11461 18.38 9.19C18.38 14.2654 14.2654 18.38 9.19 18.38C4.11461 18.38 0 14.2654 0 9.19ZM9.19 16.7091C8.20258 16.7091 7.22483 16.5146 6.31257 16.1367C5.40031 15.7589 4.57141 15.205 3.8732 14.5068C3.17499 13.8086 2.62114 12.9797 2.24327 12.0674C1.8654 11.1552 1.67091 10.1774 1.67091 9.19C1.67091 8.20258 1.8654 7.22483 2.24327 6.31257C2.62114 5.40031 3.17499 4.57141 3.8732 3.8732C4.57141 3.17499 5.40031 2.62114 6.31257 2.24327C7.22483 1.8654 8.20258 1.67091 9.19 1.67091C11.1842 1.67091 13.0967 2.4631 14.5068 3.8732C15.9169 5.2833 16.7091 7.19581 16.7091 9.19C16.7091 11.1842 15.9169 13.0967 14.5068 14.5068C13.0967 15.9169 11.1842 16.7091 9.19 16.7091Z"
                                            />
                                          </svg>
                                        </button>
                                      ) : (
                                        /* Add to list button */
                                        <button
                                          onClick={() =>
                                            addListHandler(item.id)
                                          }
                                          className="px-4"
                                        >
                                          <svg
                                            width={21}
                                            height={21}
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-[21px] h-[21px] relative fill-black hover:fill-main-color"
                                            preserveAspectRatio="none"
                                          >
                                            <path d="M10.5 1.3125C8.07242 1.34179 5.75252 2.31916 4.03584 4.03584C2.31916 5.75252 1.34179 8.07242 1.3125 10.5C1.34179 12.9276 2.31916 15.2475 4.03584 16.9642C5.75252 18.6808 8.07242 19.6582 10.5 19.6875C12.9276 19.6582 15.2475 18.6808 16.9642 16.9642C18.6808 15.2475 19.6582 12.9276 19.6875 10.5C19.6582 8.07242 18.6808 5.75252 16.9642 4.03584C15.2475 2.31916 12.9276 1.34179 10.5 1.3125ZM15.75 11.1562H11.1562V15.75H9.84375V11.1562H5.25V9.84375H9.84375V5.25H11.1562V9.84375H15.75V11.1562Z" />
                                          </svg>
                                        </button>
                                      )}

                                      <Link
                                        target="_blank"
                                        className="flex items-center font-normal hover:font-semibold"
                                        to={`/database/${item.id}`}
                                      >
                                        <div className="h-[36px] w-[36px] bg-white border border-img-border rounded-full flex-shrink-0 overflow-hidden flex justify-center items-center">
                                          <img
                                            src={
                                              item?.uploaded_logo_url ||
                                              // item?.Company_Logo ||
                                              defaultCompanyImage
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <p className="px-2.5 text-nav-bg">
                                          {item.Company_Name}
                                        </p>
                                      </Link>
                                    </div>
                                  </td>

                                  {/* Headquarters */}
                                  <td className=" px-2 text-center">
                                    <p>{`${item.Country_Region}`}</p>
                                  </td>

                                  {/* Company Types */}
                                  <td className=" px-2">
                                    <Types_content
                                      objs={item.Company_Types}
                                      split={"|"}
                                      link={searchCompaniesLink}
                                      params={params}
                                      searchKey={"Company_Types"}
                                      imgURL={
                                        item?.uploaded_logo_url ||
                                        // item?.Company_Logo ||
                                        defaultCompanyImage
                                      }
                                      name={item.Company_Name}
                                      typeName={"Company Types"}
                                    />
                                  </td>

                                  {/* Main Therapeutic Area */}
                                  <td className=" px-2">
                                    <Types_content
                                      objs={item.Primary_Therapeutic_Areas}
                                      split={"|"}
                                      link={searchCompaniesLink}
                                      params={params}
                                      searchKey={"Primary_Therapeutic_Areas"}
                                      imgURL={
                                        item?.uploaded_logo_url ||
                                        // item?.Company_Logo ||
                                        defaultCompanyImage
                                      }
                                      name={item.Company_Name}
                                      typeName={"Main Therapeutic Area"}
                                    />
                                  </td>

                                  {/* Description */}
                                  <td className="text-nav-bg pl-2 pr-5 py-1">
                                    <Description_content
                                      content={item.Description || "empty"}
                                      maxCharacters={110}
                                      width={170}
                                      companyName={item.Company_Name}
                                      imgURL={
                                        item?.uploaded_logo_url ||
                                        // item?.Company_Logo ||
                                        defaultCompanyImage
                                      }
                                    />
                                  </td>

                                  {/* Actions */}
                                  <td className=" px-2">
                                    <div className="flex flex-col justify-center items-center">
                                      <Link
                                        target="_blank"
                                        to={`/database/${item.id}`}
                                        className="w-[153px] py-2 border  rounded-full bg-white hover:bg-main-color-gb border-main-text-gray hover:border-white text-db-table-text hover:text-white font-medium mb-2 text-center"
                                      >
                                        {t(
                                          "search.search_results.view_full_profile"
                                        )}
                                      </Link>

                                      {myListData?.some(
                                        (li) => li.id === item.id
                                      ) ? (
                                        <button
                                          onClick={() =>
                                            removeListHandler(item.id)
                                          }
                                          className="w-[153px] py-2 rounded-full text-white bg-toggle-color hover:bg-main-color-gb font-medium"
                                        >
                                          {t(
                                            "search.search_results.added_to_list"
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            addListHandler(item.id)
                                          }
                                          className="w-[153px] py-2 rounded-full text-white bg-nav-bg hover:bg-main-color-gb font-medium"
                                        >
                                          {t(
                                            "search.search_results.add_to_list"
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        {/*blur block */}
                        <div
                          className="w-full h-full top-0 absolute bg-block-bg backdrop-blur text-white flex flex-col
                     pt-1/10 px-[10%] md:px-[15%] xl:px-[20%] 
                    "
                        >
                          <>
                            <h2 className="text-24px xl:text-32px font-medium pb-4.5">
                              {t("search.subscribe_now.title")}
                            </h2>
                            <p className="text-sm2 md:text-18px font-medium pb-7 md:pr-[10%] xl:pr-[20%]">
                              {t("search.subscribe_now.description")}
                            </p>
                            <Link
                              to={"/subscribe"}
                              className=" flex items-start py-3 px-7 w-fit
                        rounded-full
                        xl:py-4 xl:px-11 bg-main-color-gb hover:bg-black transition-colors duration-200 text-xl xl:text-24px font-medium"
                            >
                              <img className="pr-3" src={lock_icon} alt="" />
                              {t("search.subscribe_now.button_text")}
                            </Link>
                          </>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {!userData && <LoginToContinue_popup />}

              {/* search result grid display */}
              {!displayListToggle && (
                <div className="max-w-[374px] md:max-w-[748px] xl:max-w-[1122px] mx-auto flex flex-wrap mt-10 ">
                  {data &&
                    data?.map((item, index) => (
                      <div
                        className="relative max-w-[350px] flex flex-col bg-white rounded-20px mx-3 my-4 pt-6 pl-5 pr-7 pb-8 shadow-search-result-grid  text-sm2"
                        key={item.id}
                      >
                        {/* 01 row */}
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className="border border-img-border h-14 w-14 bg-white flex justify-center items-center rounded-full mr-2.5 overflow-hidden">
                              <img
                                src={
                                  item?.uploaded_logo_url ||
                                  // item?.Company_Logo ||
                                  defaultCompanyImage
                                }
                                alt=""
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="max-w-[235px] text-db-grid-text text-sm2 font-medium mt-1">
                                {item.Company_Name}
                              </p>
                              <p className="text-toggle-color text-xs3 font-medium">
                                {item.Country_Region}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* 02 row */}
                        <div className="ml-6 mt-5  flex flex-col">
                          <div className="mb-4 flex flex-col  max-w-[140px]">
                            <p className="text-db-grid-text font-medium mb-1.5">
                              {t("search.search_results.company_types")}
                            </p>
                            <div className="flex flex-col">
                              {item.Company_Types
                                ? item.Company_Types.split(",")
                                    .slice(0, 5)
                                    .map((i, index) => (
                                      <p
                                        key={index}
                                        className="w-fit my-1 px-3 py-1.5 text-db-table-text bg-bd-gray rounded-20px"
                                      >
                                        {i}
                                      </p>
                                    ))
                                : "N/A"}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-db-grid-text font-medium mb-1.5">
                              {t("search.search_results.main_therapeutic_area")}
                            </p>
                            <div className="flex flex-col">
                              {item.Primary_Therapeutic_Areas
                                ? item.Primary_Therapeutic_Areas.split("|")
                                    .slice(0, 5)
                                    .map((i, index) => (
                                      <p
                                        key={index}
                                        className="w-fit m-1 px-3 py-1.5 text-db-table-text bg-bd-gray rounded-20px"
                                      >
                                        {i}
                                      </p>
                                    ))
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                        {/* 03 row */}
                        <div className="mt-5 max-w-[284px] mb-5">
                          <Description_content
                            content={item.Description || "empty"}
                            maxCharacters={220}
                            width={294}
                            companyName={item.Company_Name}
                            imgURL={item.Company_Logo}
                          />
                        </div>

                        {/* 04 row */}
                        <div className="flex justify-end">
                          <button
                            className="w-[150px] py-2 border rounded-full 
                    bg-white hover:bg-main-color-gb border-main-text-gray hover:border-white text-db-table-text hover:text-white font-medium mr-1"
                          >
                            <Link target="_blank" to={`/database/${item.id}`}>
                              {t("search.search_results.view_full_profile")}
                            </Link>
                          </button>

                          {myListData?.some((li) => li.id === item.id) ? (
                            <button
                              onClick={() => removeListHandler(item.id)}
                              className="w-[153px] py-2 rounded-full text-white bg-toggle-color hover:bg-main-color-gb font-medium"
                            >
                              {t("search.search_results.added_to_list")}
                            </button>
                          ) : (
                            <button
                              onClick={() => addListHandler(item.id)}
                              className="w-[153px] py-2 rounded-full text-white bg-nav-bg hover:bg-main-color-gb font-medium"
                            >
                              {t("search.search_results.add_to_list")}
                            </button>
                          )}
                        </div>

                        {/* first grid block */}
                        {index === start && !userData && (
                          <div
                            className="top-0 left-0 w-full h-full absolute bg-block-grid-bg backdrop-blur text-white flex flex-col
                     pt-21 px-8 rounded-20px 
                    "
                          >
                            <h2 className="text-3xl font-medium pb-4.5">
                              {t("search.subscribe_now.title")}
                            </h2>
                            <p className="text-sm2 md:text-18px font-medium pb-7 ">
                              {t("search.subscribe_now.description")}
                            </p>
                            <Link
                              to={"/subscribe"}
                              className=" flex items-start py-3 px-7 w-fit
                        rounded-full whitespace-nowrap
                        xl:py-4 xl:px-10 bg-main-color-gb hover:bg-black transition-colors duration-200 text-xl xl:text-24px font-medium"
                            >
                              <img className="pr-3" src={lock_icon} alt="" />
                              {t("search.subscribe_now.button_text")}
                            </Link>
                          </div>
                        )}

                        {/* other grid blocks */}
                        {index > start && index <= end && !userData && (
                          <div
                            className="top-0 left-0 w-full h-full absolute bg-block-grid-bg backdrop-blur text-white flex justify-center items-center
                            rounded-20px 
                         "
                          >
                            <img src={lock_icon2} alt="" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* pages buttons */}

            {pageNumbers !== 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 flex justify-between items-center pt-7.5">
                {/* previos page button*/}
                {currentPage !== 1 && (
                  <button onClick={() => handlePageChange(currentPage - 1)}>
                    <svg
                      className="rotate-180 fill-black hover:fill-main-color"
                      width={11}
                      height={9}
                      viewBox="0 0 11 9"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.39812 0.18469L5.38782 4.17769C5.46262 4.25469 5.50002 4.34379 5.50002 4.44334C5.49915 4.54598 5.459 4.64439 5.38782 4.71834L1.22157 8.78724C1.01092 8.96159 0.82337 8.96159 0.65947 8.78724C0.49502 8.61289 0.49502 8.43359 0.65947 8.24824L4.55347 4.44334L0.83877 0.72369C0.70842 0.53504 0.72052 0.36399 0.87507 0.20944C1.02962 0.05544 1.20397 0.0471901 1.39812 0.18469ZM6.34812 0.18469L10.3378 4.17769C10.4126 4.25469 10.45 4.34379 10.45 4.44334C10.4491 4.54598 10.409 4.64439 10.3378 4.71834L6.17157 8.78724C5.96092 8.96159 5.77337 8.96159 5.60947 8.78724C5.44502 8.61289 5.44502 8.43359 5.60947 8.24824L9.50347 4.44334L5.78877 0.72369C5.65842 0.53504 5.67052 0.36399 5.82507 0.20944C5.97962 0.05544 6.15397 0.0471901 6.34812 0.18469Z"
                      />
                    </svg>
                  </button>
                )}

                {/* first page */}
                {currentPage > 2 && (
                  <>
                    <button
                      className={`text-nav-bg font-normal text-sm2 mx-2`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                    <span
                      className={`select-none ${
                        currentPage === 3 ? "hidden" : "inline"
                      }`}
                    >
                      ...
                    </span>
                  </>
                )}

                {data?.total_pages !== 0 &&
                  pageNumbers
                    .slice(
                      currentPage -
                        (currentPage === pageNumbers.length
                          ? 3
                          : currentPage === 1
                          ? 1
                          : 2),
                      currentPage + (currentPage === 1 ? 2 : 1)
                    )
                    .map((pageNum) => (
                      <button
                        className={`${
                          pageNum === currentPage
                            ? "text-main-color font-semibold"
                            : "text-nav-bg font-normal"
                        } text-sm2 mx-2`}
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={pageNum === currentPage}
                      >
                        {pageNum}
                      </button>
                    ))}

                {/* last page */}
                {currentPage < pageNumbers.length - 1 && (
                  <>
                    <span
                      className={`select-none ${
                        currentPage === pageNumbers.length - 2
                          ? "hidden"
                          : "inline"
                      }`}
                    >
                      ...
                    </span>
                    <button
                      className={`text-nav-bg font-normal text-sm2 mx-2`}
                      onClick={() => handlePageChange(pageNumbers.length)}
                    >
                      {pageNumbers.length}
                    </button>
                  </>
                )}

                {/* next page button */}
                {/* {data?.total_pages !== 0 &&
                  currentPage !== pageNumbers.length && (
                    <button onClick={() => handlePageChange(currentPage + 1)}>
                      <svg
                        className="fill-black hover:fill-main-color"
                        width={11}
                        height={9}
                        viewBox="0 0 11 9"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.39812 0.18469L5.38782 4.17769C5.46262 4.25469 5.50002 4.34379 5.50002 4.44334C5.49915 4.54598 5.459 4.64439 5.38782 4.71834L1.22157 8.78724C1.01092 8.96159 0.82337 8.96159 0.65947 8.78724C0.49502 8.61289 0.49502 8.43359 0.65947 8.24824L4.55347 4.44334L0.83877 0.72369C0.70842 0.53504 0.72052 0.36399 0.87507 0.20944C1.02962 0.05544 1.20397 0.0471901 1.39812 0.18469ZM6.34812 0.18469L10.3378 4.17769C10.4126 4.25469 10.45 4.34379 10.45 4.44334C10.4491 4.54598 10.409 4.64439 10.3378 4.71834L6.17157 8.78724C5.96092 8.96159 5.77337 8.96159 5.60947 8.78724C5.44502 8.61289 5.44502 8.43359 5.60947 8.24824L9.50347 4.44334L5.78877 0.72369C5.65842 0.53504 5.67052 0.36399 5.82507 0.20944C5.97962 0.05544 6.15397 0.0471901 6.34812 0.18469Z"
                        />
                      </svg>
                    </button>
                  )} */}
              </div>
            )}

            {/* not found anything ... */}
            {data && data?.length === 0 && userData && (
              <div className="text-center text-30px font-bold">
                {t("search.search_results.no_results")}
              </div>
            )}

            {/* need to pay */}
            <NeedToPay_popup
              popUp={IsNeedtopayPopup}
              setPopUp={setIsNeedtopayPopup}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CompanyResult;
