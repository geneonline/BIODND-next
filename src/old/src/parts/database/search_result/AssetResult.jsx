import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import {
  vector_assetsSearchURL,
  searchAssetsLink,
  fetcher_get,
  useUser,
} from "@/data/api";

import { fakeAssetData } from "@/data/database/fakedata";

import LoginToContinue_popup from "@/widgets/LoginToContinue_popup";

import Description_content from "@/widgets/database/Description_content";
import Types_content from "@/widgets/database/Types_content";
import loadingImg from "@/assets/img/loading.png";
import lock_icon from "@/assets/svg/database/lock_icon.svg";
const AssetResult = () => {
  const { t } = useTranslation();
  //get link's params
  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const { userData } = useUser();
  const [dataLimit, setDataLimit] = useState(5);

  ////// change page thing...  ///////
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  const [pageNumbers, setPageNumbers] = useState([]);

  //////////////    other      ////////////////////////
  const [displayListToggle] = useState(true);
  // const [sortDirectionToggle, setSortDirectionToggle] = useState(false);
  // const [orderSelected, setOrderSelected] = useState(0);
  // const orderOptions = [
  //   "Order by Company",
  //   "Order by Employees",
  //   "Order by year founded",
  // ];

  useEffect(() => setCurrentPage(1), [params]);

  const url = useMemo(() => {
    return vector_assetsSearchURL({
      ...params,
    });
  }, [params]);

  //fetch data
  const { data, isLoading } = useSWR(url, fetcher_get, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //set pageNumbers
  useEffect(() => {
    if (data?.companies) {
      // setEnd(data.companies.length - 1);
    }
    if (data?.total_pages) {
      if (data?.companies?.length === 0) {
        setPageNumbers([0]);
      } else {
        setPageNumbers(
          Array.from({ length: data.total_pages }, (_, i) => i + 1)
        );
      }
    }
  }, [data]);

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
                  <p className="text-xl text-nav-bg font-semibold pr-2.5">
                    {t("search.search_assets_results.results_found", {
                      count: data ? data?.asset_counts : 0,
                    })}
                  </p>
                  {data?.length > 0 && (
                    <p className="text-sm2 text-main-text-gray">
                      {t("search.search_assets_results.displaying_results", {
                        start: (currentPage - 1) * itemsPerPage + 1,
                        end: (currentPage - 1) * itemsPerPage + data?.length,
                      })}
                    </p>
                  )}
                </div> */}
                <div className="flex">
                  {/* display list button */}
                  {/* <button
                    className="pr-2"
                    onClick={() => {
                      setDisplayListToggle(true);
                      setItemsPerPage(10);
                    }}
                  >
                    <svg
                      width={15}
                      height={11}
                      viewBox="0 0 15 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[19px] h-[12.666px]"
                      preserveAspectRatio="none"
                    >
                      <g fill={`${displayListToggle ? "#07BBD3" : "#69747F"}`}>
                        <path d="M0.902995 2.33333C1.34022 2.33333 1.69466 1.97889 1.69466 1.54167C1.69466 1.10444 1.34022 0.75 0.902995 0.75C0.465769 0.75 0.111328 1.10444 0.111328 1.54167C0.111328 1.97889 0.465769 2.33333 0.902995 2.33333Z" />
                        <path d="M0.902995 6.29183C1.34022 6.29183 1.69466 5.93739 1.69466 5.50016C1.69466 5.06294 1.34022 4.7085 0.902995 4.7085C0.465769 4.7085 0.111328 5.06294 0.111328 5.50016C0.111328 5.93739 0.465769 6.29183 0.902995 6.29183Z" />
                        <path d="M0.902995 10.2498C1.34022 10.2498 1.69466 9.8954 1.69466 9.45817C1.69466 9.02095 1.34022 8.6665 0.902995 8.6665C0.465769 8.6665 0.111328 9.02095 0.111328 9.45817C0.111328 9.8954 0.465769 10.2498 0.902995 10.2498Z" />
                        <path d="M13.6175 4.7085H4.02249C3.6115 4.7085 3.27832 5.04167 3.27832 5.45266V5.54766C3.27832 5.95865 3.6115 6.29183 4.02249 6.29183H13.6175C14.0285 6.29183 14.3617 5.95865 14.3617 5.54766V5.45266C14.3617 5.04167 14.0285 4.7085 13.6175 4.7085Z" />
                        <path d="M13.6175 8.6665H4.02249C3.6115 8.6665 3.27832 8.99968 3.27832 9.41067V9.50567C3.27832 9.91666 3.6115 10.2498 4.02249 10.2498H13.6175C14.0285 10.2498 14.3617 9.91666 14.3617 9.50567V9.41067C14.3617 8.99968 14.0285 8.6665 13.6175 8.6665Z" />
                        <path d="M13.6175 0.75H4.02249C3.6115 0.75 3.27832 1.08317 3.27832 1.49417V1.58917C3.27832 2.00016 3.6115 2.33333 4.02249 2.33333H13.6175C14.0285 2.33333 14.3617 2.00016 14.3617 1.58917V1.49417C14.3617 1.08317 14.0285 0.75 13.6175 0.75Z" />
                      </g>
                    </svg>
                  </button> */}

                  {/* display grid button */}
                  {/* <button
                className="pr-3.5"
                onClick={() => {
                  setDisplayListToggle(false);
                  setItemsPerPage(9);
                }}
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 relative"
                  preserveAspectRatio="none"
                >
                  <g fill={`${displayListToggle ? "#69747F" : "#07BBD3"}`}>
                    <path d="M4.2857 0H0.85714C0.629812 0 0.411795 0.0903059 0.25105 0.251051C0.0903055 0.411797 0 0.629815 0 0.857143V4.28572C0 4.51304 0.0903055 4.73106 0.25105 4.89181C0.411795 5.05255 0.629812 5.14286 0.85714 5.14286H4.2857C4.51303 5.14286 4.73104 5.05255 4.89179 4.89181C5.05253 4.73106 5.14284 4.51304 5.14284 4.28572V0.857143C5.14284 0.629815 5.05253 0.411797 4.89179 0.251051C4.73104 0.0903059 4.51303 0 4.2857 0ZM0.85714 4.28572V0.857143H4.2857V4.28572H0.85714Z" />
                    <path d="M11.1431 0H7.71456C7.48723 0 7.26922 0.0903059 7.10847 0.251051C6.94773 0.411797 6.85742 0.629815 6.85742 0.857143V4.28572C6.85742 4.51304 6.94773 4.73106 7.10847 4.89181C7.26922 5.05255 7.48723 5.14286 7.71456 5.14286H11.1431C11.3704 5.14286 11.5885 5.05255 11.7492 4.89181C11.91 4.73106 12.0003 4.51304 12.0003 4.28572V0.857143C12.0003 0.629815 11.91 0.411797 11.7492 0.251051C11.5885 0.0903059 11.3704 0 11.1431 0ZM7.71456 4.28572V0.857143H11.1431V4.28572H7.71456Z" />
                    <path d="M4.2857 6.85693H0.85714C0.629812 6.85693 0.411795 6.94724 0.25105 7.10799C0.0903055 7.26873 0 7.48675 0 7.71408V11.1426C0 11.37 0.0903055 11.588 0.25105 11.7487C0.411795 11.9095 0.629812 11.9998 0.85714 11.9998H4.2857C4.51303 11.9998 4.73104 11.9095 4.89179 11.7487C5.05253 11.588 5.14284 11.37 5.14284 11.1426V7.71408C5.14284 7.48675 5.05253 7.26873 4.89179 7.10799C4.73104 6.94724 4.51303 6.85693 4.2857 6.85693ZM0.85714 11.1426V7.71408H4.2857V11.1426H0.85714Z" />
                    <path d="M11.1431 6.85693H7.71456C7.48723 6.85693 7.26922 6.94724 7.10847 7.10799C6.94773 7.26873 6.85742 7.48675 6.85742 7.71408V11.1426C6.85742 11.37 6.94773 11.588 7.10847 11.7487C7.26922 11.9095 7.48723 11.9998 7.71456 11.9998H11.1431C11.3704 11.9998 11.5885 11.9095 11.7492 11.7487C11.91 11.588 12.0003 11.37 12.0003 11.1426V7.71408C12.0003 7.48675 11.91 7.26873 11.7492 7.10799C11.5885 6.94724 11.3704 6.85693 11.1431 6.85693ZM7.71456 11.1426V7.71408H11.1431V11.1426H7.71456Z" />
                  </g>
                </svg>
              </button> */}
                </div>
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
                        className={`text-nav-bg font-normal text-sm1 mx-2`}
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
                          } text-sm1 mx-2`}
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
                        className={`text-nav-bg font-normal text-sm1 mx-2`}
                        onClick={() => handlePageChange(pageNumbers.length)}
                      >
                        {pageNumbers.length}
                      </button>
                    </>
                  )}

                  {/* next page button */}
                  {pageNumbers.length !== 0 &&
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
                    )}
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
                  <table className="w-[1783px] text-sm2 mx-4 mt-2.5 rounded-t-lg border-collapse">
                    <thead className="text-main-text-gray bg-profile-viewed-bg  font-normal">
                      <tr className="border border-footer-text rounded-10px">
                        <th className="w-[148px] py-3.5 xl:hidden table-cell"></th>
                        <th className="w-[238px] py-3.5 ">
                          {t(
                            "search.search_assets_results.table_headers.product_name"
                          )}
                        </th>
                        <th className="w-[136px] py-3.5 ">
                          {" "}
                          {t(
                            "search.search_assets_results.table_headers.company_name"
                          )}
                        </th>
                        <th className="w-[165px] py-3.5 ">
                          {t(
                            "search.search_assets_results.table_headers.assets_types"
                          )}
                        </th>
                        <th className="w-[240px] py-3.5 ">
                          {t(
                            "search.search_assets_results.table_headers.main_therapeutic_area"
                          )}
                        </th>
                        <th className="w-[225px] py-3.5 ">
                          {t(
                            "search.search_assets_results.table_headers.description"
                          )}
                        </th>
                        {/* <th className="w-[214px] py-3.5 ">Administration Mode</th> */}
                        <th className="w-[190px] py-3.5 ">
                          {t(
                            "search.search_assets_results.table_headers.development_phase"
                          )}
                        </th>
                        {/* <th className="w-[146px] py-3.5 ">IP Rights</th> */}
                        <th className="xl:w-[216px] py-3.5 hidden xl:table-cell"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data &&
                        data?.slice(0, dataLimit).map((item) => (
                          <tr
                            className="border border-footer-text"
                            key={item.id}
                          >
                            {/* show moblie profile button */}
                            <td className="xl:hidden table-cell px-2">
                              <div className="flex flex-col justify-center items-center">
                                <Link
                                  target="_blank"
                                  to={`/database/${item.company_id}/assets`}
                                  className="w-[113px]  my-2 py-2 border  text-sm1 rounded-full bg-nav-bg hover:bg-main-color-gb  text-white font-medium text-center"
                                >
                                  {t(
                                    "search.search_assets_results.table_headers.view_detail"
                                  )}
                                </Link>
                              </div>
                            </td>
                            {/* Product Name */}
                            <td className=" px-2 ">
                              <Link
                                target="_blank"
                                className="text-sm2 text-nav-bg font-normal hover:font-semibold"
                                to={`/database/${item.company_id}/assets`}
                              >
                                {item.product_name}
                              </Link>
                            </td>
                            {/* Company Name */}
                            <td className=" px-2">
                              <p>{`${item.company_name}`}</p>
                            </td>
                            {/* Assets types */}
                            <td className=" px-2">
                              <p>{`${item.assets_types}`}</p>
                            </td>
                            {/* Main Therapeutic Area */}
                            <td className=" px-2">
                              <Types_content
                                objs={item.main_therapeutic_sector}
                                split={"|"}
                                link={searchAssetsLink}
                                params={params}
                                searchKey={"search[main_therapeutic_sector]"}
                                haveImg={false}
                                name={item.product_name}
                                typeName={"Main Therapeutic Area"}
                              />
                              {/* <div className="flex flex-wrap">
                        {item.main_therapeutic_sector
                          ? item.main_therapeutic_sector
                              .split("\n")
                              .map((i, index) => (
                                <Link
                                  key={index}
                                  className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray hover:bg-db-Asearch rounded-20px"
                                  to={searchAssetsLink({
                                    ...params,
                                    "search[main_therapeutic_sector]": i,
                                  })}
                                >
                                  {i}
                                </Link>
                              ))
                          : "N/A"}
                      </div> */}
                            </td>
                            {/* Description */}
                            <td className="text-nav-bg pl-2 pr-5 py-1">
                              <Description_content
                                content={item.product_description || "empty"}
                                maxCharacters={110}
                                width={170}
                                companyName={item.product_name}
                                haveImg={false}
                              />
                            </td>
                            {/* Administration Mode */}
                            {/* <td className=" px-2">
                      <div className="flex flex-wrap">
                        {item.mode_of_administration
                          ? item.mode_of_administration
                              .split("\n")
                              .map((i, index) => (
                                <p
                                  key={index}
                                  className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray rounded-20px"
                                >
                                  {i}
                                </p>
                              ))
                          : "N/A"}
                      </div>
                    </td> */}
                            {/* Development Phase */}
                            <td className=" px-2 ">
                              <p
                                className={`${
                                  item.development_phase === null
                                    ? "text-center"
                                    : "text-center"
                                }`}
                              >{`${item.development_phase}`}</p>
                            </td>
                            {/* IP Rights */}
                            {/* <td className=" px-2">
                      <p>{`${item.ip_rights}`}</p>
                    </td> */}
                            {/* Actions */}
                            <td className="hidden xl:table-cell px-2">
                              <div className="flex flex-col justify-center items-center">
                                <Link
                                  target="_blank"
                                  to={`/database/${item.company_id}/assets`}
                                  className="w-[153px]  my-2 py-2 border  rounded-full bg-nav-bg hover:bg-main-color-gb  text-white font-medium text-center"
                                >
                                  {t(
                                    "search.search_assets_results.table_headers.view_detail"
                                  )}
                                </Link>
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
                      <div className="relative w-[1783px] text-sm2 mx-auto">
                        <table className="w-full rounded-t-lg border-collapse">
                          <tbody>
                            {/* fake data */}
                            {fakeAssetData &&
                              fakeAssetData?.map((item) => (
                                <tr
                                  className="border border-footer-text"
                                  key={item.id}
                                >
                                  {/* show moblie profile button */}
                                  <td className="w-[148px] xl:hidden table-cell px-2">
                                    <div className="flex flex-col justify-center items-center">
                                      <Link
                                        target="_blank"
                                        to={`/database/${item.company_id}/assets`}
                                        className="w-[113px]  my-2 py-2 border  text-sm1 rounded-full bg-nav-bg hover:bg-main-color-gb  text-white font-medium text-center"
                                      >
                                        {t(
                                          "search.search_assets_results.table_headers.view_detail"
                                        )}
                                      </Link>
                                    </div>
                                  </td>
                                  {/* Product Name */}
                                  <td className="w-[238px] px-2 ">
                                    <Link
                                      target="_blank"
                                      className="text-sm2 text-nav-bg font-normal hover:font-semibold"
                                      to={`/database/${item.company_id}/assets`}
                                    >
                                      {item.product_name}
                                    </Link>
                                  </td>
                                  {/* Company Name */}
                                  <td className="w-[136px] px-2">
                                    <p>{`${item.company_name}`}</p>
                                  </td>
                                  {/* Assets types */}
                                  <td className="w-[165px] px-2">
                                    <p>{`${item.assets_types}`}</p>
                                  </td>
                                  {/* Main Therapeutic Area */}
                                  <td className="w-[240px] px-2">
                                    <Types_content
                                      objs={item.main_therapeutic_sector}
                                      split={"|"}
                                      link={searchAssetsLink}
                                      params={params}
                                      searchKey={
                                        "search[main_therapeutic_sector]"
                                      }
                                      haveImg={false}
                                      name={item.product_name}
                                      typeName={"Main Therapeutic Area"}
                                    />
                                    {/* <div className="flex flex-wrap">
                        {item.main_therapeutic_sector
                          ? item.main_therapeutic_sector
                              .split("\n")
                              .map((i, index) => (
                                <Link
                                  key={index}
                                  className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray hover:bg-db-Asearch rounded-20px"
                                  to={searchAssetsLink({
                                    ...params,
                                    "search[main_therapeutic_sector]": i,
                                  })}
                                >
                                  {i}
                                </Link>
                              ))
                          : "N/A"}
                      </div> */}
                                  </td>
                                  {/* Description */}
                                  <td className="w-[225px] text-nav-bg pl-2 pr-5 py-1">
                                    <Description_content
                                      content={
                                        item.product_description || "empty"
                                      }
                                      maxCharacters={110}
                                      width={170}
                                      companyName={item.product_name}
                                      haveImg={false}
                                    />
                                  </td>
                                  {/* Administration Mode */}
                                  {/* <td className=" px-2">
                      <div className="flex flex-wrap">
                        {item.mode_of_administration
                          ? item.mode_of_administration
                              .split("\n")
                              .map((i, index) => (
                                <p
                                  key={index}
                                  className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray rounded-20px"
                                >
                                  {i}
                                </p>
                              ))
                          : "N/A"}
                      </div>
                    </td> */}
                                  {/* Development Phase */}
                                  <td className="w-[190px] px-2 ">
                                    <p
                                      className={`${
                                        item.development_phase === null
                                          ? "text-center"
                                          : "text-center"
                                      }`}
                                    >{`${item.development_phase}`}</p>
                                  </td>
                                  {/* IP Rights */}
                                  {/* <td className=" px-2">
                      <p>{`${item.ip_rights}`}</p>
                    </td> */}
                                  {/* Actions */}
                                  <td className="xl:w-[216px] hidden xl:table-cell px-2">
                                    <div className="flex flex-col justify-center items-center">
                                      <Link
                                        target="_blank"
                                        to={`/database/${item.company_id}/assets`}
                                        className="w-[153px]  my-2 py-2 border  rounded-full bg-nav-bg hover:bg-main-color-gb  text-white font-medium text-center"
                                      >
                                        {t(
                                          "search.search_assets_results.table_headers.view_detail"
                                        )}
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {/* block */}
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
                <div className="max-w-[374px] md:max-w-[748px] xl:max-w-[1122px] flex flex-wrap mt-10">
                  {data &&
                    data?.map((item) => (
                      <div
                        className="max-w-[350px] flex flex-col bg-white rounded-20px mx-3 my-4 pt-6 pl-5 pr-7 pb-8 shadow-xl  text-xs3"
                        key={item.id}
                      >
                        {/* 01 row */}
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className="h-14 w-14 bg-mobile-nav-text-gray rounded-full mr-2.5">
                              <img src="" alt="" />
                            </div>
                            <div className="flex flex-col">
                              <p className="max-w-[160px] text-db-grid-text text-sm2 font-medium">
                                {item.product_name}
                              </p>
                              <p className="text-toggle-color font-medium">
                                {item.City}
                              </p>
                              <p className="text-toggle-color font-medium">
                                {item.Country}
                              </p>
                            </div>
                          </div>

                          {/* save button */}
                          <button className="px-4">
                            <svg
                              width={16}
                              height={16}
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 relative"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M2 2C2 1.46957 2.21071 0.960859 2.58579 0.585786C2.96086 0.210714 3.46957 0 4 0L12 0C12.5304 0 13.0391 0.210714 13.4142 0.585786C13.7893 0.960859 14 1.46957 14 2V15.5C14 15.5904 13.9754 15.6792 13.9289 15.7568C13.8824 15.8343 13.8157 15.8979 13.736 15.9405C13.6563 15.9832 13.5664 16.0035 13.4761 15.9992C13.3858 15.9948 13.2983 15.9661 13.223 15.916L8 13.101L2.777 15.916C2.70171 15.9661 2.61423 15.9948 2.52389 15.9992C2.43355 16.0035 2.34373 15.9832 2.264 15.9405C2.18427 15.8979 2.1176 15.8343 2.07111 15.7568C2.02462 15.6792 2.00005 15.5904 2 15.5V2ZM4 1C3.73478 1 3.48043 1.10536 3.29289 1.29289C3.10536 1.48043 3 1.73478 3 2V14.566L7.723 12.084C7.80506 12.0294 7.90143 12.0003 8 12.0003C8.09857 12.0003 8.19494 12.0294 8.277 12.084L13 14.566V2C13 1.73478 12.8946 1.48043 12.7071 1.29289C12.5196 1.10536 12.2652 1 12 1H4Z"
                                fill="#69747F"
                              />
                            </svg>
                          </button>
                        </div>
                        {/* 02 row */}
                        <div className="mt-5 flex justify-between">
                          <div className="flex flex-col items-center  max-w-[140px]">
                            <p className="text-db-grid-text font-medium mb-1.5">
                              {t("search.form.company_types_label")}
                            </p>
                            <div className="flex flex-col">
                              {item.Company_Types
                                ? item.Company_Types.split("|").map(
                                    (i, index) => (
                                      <p
                                        key={index}
                                        className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray rounded-20px"
                                      >
                                        {i}
                                      </p>
                                    )
                                  )
                                : "N/A"}
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="text-db-grid-text font-medium mb-1.5">
                              {t("search.form.main_therapeutic_area_label")}
                            </p>
                            <div className="flex flex-col">
                              {item.Primary_Therapeutic_Areas
                                ? item.Primary_Therapeutic_Areas.split("|").map(
                                    (i, index) => (
                                      <p
                                        key={index}
                                        className="m-1 px-3 py-1.5 text-db-table-text bg-bg-gray rounded-20px"
                                      >
                                        {i}
                                      </p>
                                    )
                                  )
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                        {/* 03 row */}
                        <div className="mt-5 max-w-[284px] mb-5">
                          <Description_content
                            content={item.Description || "empty"}
                            maxCharacters={220}
                            width={284}
                            companyName={item.Company_Name}
                          />
                        </div>

                        {/* 04 row */}
                        <div className="flex justify-end">
                          <button
                            className="w-[122px] py-2 border rounded-full 
                    bg-white hover:bg-main-color-gb border-main-text-gray hover:border-white text-db-table-text hover:text-white font-medium mr-1"
                          >
                            <Link
                              target="_blank"
                              to={`/database/${item.company_id}/assets`}
                            >
                              {t("search.form.view_full_profile")}
                            </Link>
                          </button>
                        </div>
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
                      className={`text-nav-bg font-normal text-sm1 mx-2`}
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
                        } text-sm1 mx-2`}
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
                      className={`text-nav-bg font-normal text-sm1 mx-2`}
                      onClick={() => handlePageChange(pageNumbers.length)}
                    >
                      {pageNumbers.length}
                    </button>
                  </>
                )}

                {/* next page button */}
                {/* {pageNumbers.length !== 0 &&
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
            {data && data?.length === 0 && (
              <div className="text-center text-30px font-bold">
                {t("search.search_results.no_results")}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AssetResult;
