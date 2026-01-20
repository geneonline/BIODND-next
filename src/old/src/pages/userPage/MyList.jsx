import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { mutate } from "swr";
import { searchCompaniesLink, useMyList, useUser } from "@/data/api";

import LoginToContinue from "@/parts/LoginToContinue";
import NeedToPay from "@/parts/NeedToPay";
import ComingSoon_popup from "@/widgets/ComingSoon_popup";

import Types_content from "@/widgets/database/Types_content";
import Description_content from "@/widgets/database/Description_content";
import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import SelectWithIcon from "@/widgets/SelectWithIcon";
import loadingImg from "@/assets/img/loading.png";

const MyList = () => {
  const { t } = useTranslation();

  //get link's params
  const [searchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  const { myListData: data, myListLoading } = useMyList();
  const { userData, userLoading } = useUser();

  ////// change page thing...  ///////
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [getPageData, setPageData] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);

  const [comingSoonPopup, setComingSoonPopup] = useState(false);

  useEffect(() => setCurrentPage(1), [data]);

  //   set getPageData
  useEffect(() => {
    if (data) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPageData(data.slice(startIndex, endIndex));
    }
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //set pageNumbers
  useEffect(() => {
    if (data) {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setPageNumbers(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [data, itemsPerPage]);

  ///-----   select checkbox -----
  const [selected, setSelected] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    if (isAllChecked) {
      // 如果全選 checkbox 被選中，將所有的 id 加入到陣列中
      setSelected(data.map((item) => item.id));
    } else {
      // 如果全選 checkbox 被取消選中，清空陣列
      setSelected([]);
    }
  }, [isAllChecked, data]);

  const selectChangeHandler = (id, isChecked) => {
    // 如果 checkbox 被選中，將 id 加入到陣列中
    // 如果 checkbox 被取消選中，將 id 從陣列中移除
    setSelected((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((item) => item !== id);
      }
    });
  };

  const deleteHandler = () => {
    console.log(selected);
    Promise.all(
      selected.map((id) => {
        const formData = new FormData();
        formData.append("_method", "delete");
        return axios
          .post(`${import.meta.env.VITE_API_URL}/companies/${id}/favorite`, formData, {
            withCredentials: true,
          })
          .then(() => {
            console.log("remove", id);
          })
          .catch((err) => {
            console.log(err);
          });
      })
    ).then(() => {
      mutate(`${import.meta.env.VITE_API_URL}/favorites.json`); // 當所有請求都完成後，重新獲取數據
    });
  };

  //  select options widget on the top

  const [optionSelect, setOptionSelect] = useState(0);
  const options = [
    {
      text: t("my_list.options.companies"),
      icon: (
        <svg
          width={14}
          height={12}
          viewBox="0 0 14 12"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M10.5082 7.98571H9.19466V9.31667H10.5082M10.5082 5.32381H9.19466V6.65476H10.5082M11.8217 10.6476H6.56762V9.31667H7.88114V7.98571H6.56762V6.65476H7.88114V5.32381H6.56762V3.99286H11.8217M5.25409 2.6619H3.94057V1.33095H5.25409M5.25409 5.32381H3.94057V3.99286H5.25409M5.25409 7.98571H3.94057V6.65476H5.25409M5.25409 10.6476H3.94057V9.31667H5.25409M2.62705 2.6619H1.31352V1.33095H2.62705M2.62705 5.32381H1.31352V3.99286H2.62705M2.62705 7.98571H1.31352V6.65476H2.62705M2.62705 10.6476H1.31352V9.31667H2.62705M6.56762 2.6619V0H0V11.9786H13.1352V2.6619H6.56762Z" />
        </svg>
      ),
    },
    {
      text: t("my_list.options.people"),
      icon: (
        <svg
          width={13}
          height={14}
          viewBox="0 0 13 14"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M6.5 0.82959C7.36195 0.82959 8.1886 1.172 8.7981 1.78149C9.40759 2.39099 9.75 3.21764 9.75 4.07959C9.75 4.94154 9.40759 5.76819 8.7981 6.37769C8.1886 6.98718 7.36195 7.32959 6.5 7.32959C5.63805 7.32959 4.8114 6.98718 4.2019 6.37769C3.59241 5.76819 3.25 4.94154 3.25 4.07959C3.25 3.21764 3.59241 2.39099 4.2019 1.78149C4.8114 1.172 5.63805 0.82959 6.5 0.82959ZM6.5 2.45459C6.06902 2.45459 5.6557 2.62579 5.35095 2.93054C5.04621 3.23529 4.875 3.64861 4.875 4.07959C4.875 4.51057 5.04621 4.92389 5.35095 5.22864C5.6557 5.53338 6.06902 5.70459 6.5 5.70459C6.93098 5.70459 7.3443 5.53338 7.64905 5.22864C7.9538 4.92389 8.125 4.51057 8.125 4.07959C8.125 3.64861 7.9538 3.23529 7.64905 2.93054C7.3443 2.62579 6.93098 2.45459 6.5 2.45459ZM6.5 8.14209C8.66938 8.14209 13 9.22271 13 11.3921V13.8296H0V11.3921C0 9.22271 4.33063 8.14209 6.5 8.14209ZM6.5 9.68584C4.08687 9.68584 1.54375 10.8721 1.54375 11.3921V12.2858H11.4563V11.3921C11.4563 10.8721 8.91313 9.68584 6.5 9.68584Z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (optionSelect === 1) {
      setComingSoonPopup(true);
      setOptionSelect(0);
    }
  }, [optionSelect]);

  return (
    <div>
      {!userData && !userLoading ? (
        <LoginToContinue />
      ) : (!userData?.subscription_level && userData?.id !== 1) ||
        userData?.subscription_level === "basic" ? (
        <NeedToPay />
      ) : (
        <div className="w-full overflow-auto mb-28">
          <ComingSoon_popup
            popUp={comingSoonPopup}
            setPopUp={setComingSoonPopup}
          />

          {/* top section */}
          <section className="flex justify-between items-center mt-15 mb-2 mx-48">
            {/* left */}
            <div className="flex items-center">
              <h1 className="text-xl font-medium pr-3.5">
                {t("my_list.title")}
              </h1>
              <SelectWithIcon
                selected={optionSelect}
                setSelected={setOptionSelect}
                options={options}
                width={"w-[154px]"}
              />
            </div>

            {/* right */}
            <div className="flex">
              <button
                onClick={deleteHandler}
                className="w-[135px] py-2.5 mr-2 rounded-full flex justify-center items-center text-sm1 font-medium bg-main-text-gray hover:bg-main-color text-white"
              >
                <svg
                  className="w-3 mr-1.5"
                  width={13}
                  height={14}
                  viewBox="0 0 13 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2.4375 14C1.99063 14 1.60794 13.8476 1.28944 13.5427C0.970937 13.2378 0.811958 12.8717 0.8125 12.4444V2.33333H0V0.777778H4.0625V0H8.9375V0.777778H13V2.33333H12.1875V12.4444C12.1875 12.8722 12.0283 13.2386 11.7098 13.5434C11.3913 13.8483 11.0088 14.0005 10.5625 14H2.4375ZM10.5625 2.33333H2.4375V12.4444H10.5625V2.33333ZM4.0625 10.8889H5.6875V3.88889H4.0625V10.8889ZM7.3125 10.8889H8.9375V3.88889H7.3125V10.8889Z"
                    fill="white"
                  />
                </svg>
                {t("my_list.actions.delete")}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setComingSoonPopup(true);
                }}
                className="w-[135px] py-2.5  rounded-full flex justify-center items-center text-sm1 font-medium bg-nav-bg hover:bg-main-color  text-white"
              >
                <svg
                  className="w-3 mr-1.5"
                  width={12}
                  height={14}
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4.66667 14V12.7273H1.33333C0.966668 12.7273 0.652668 12.6025 0.391334 12.3531C0.130001 12.1036 -0.000443312 11.8041 1.13186e-06 11.4545V2.54545C1.13186e-06 2.19545 0.130668 1.89573 0.392001 1.64627C0.653334 1.39682 0.967112 1.2723 1.33333 1.27273H4.66667V0H6V14H4.66667ZM1.33333 10.8182H4.66667V7L1.33333 10.8182ZM7.33333 12.7273V7L10.6667 10.8182V2.54545H7.33333V1.27273H10.6667C11.0333 1.27273 11.3473 1.39745 11.6087 1.64691C11.87 1.89636 12.0004 2.19588 12 2.54545V11.4545C12 11.8045 11.8693 12.1043 11.608 12.3537C11.3467 12.6032 11.0329 12.7277 10.6667 12.7273H7.33333Z"
                    fill="white"
                  />
                </svg>
                {t("my_list.actions.compare")}
              </button>
            </div>
          </section>
          {/* table display */}
          {myListLoading ? (
            <div className="w-full h-[80vh] flex justify-center items-center">
              <img className=" animate-spin" src={loadingImg} alt="" />
            </div>
          ) : (
            <>
              {getPageData.length > 0 && (
                <table className="w-[1228px] text-sm2 mx-auto mt-2.5 rounded-t-lg border-collapse">
                  <thead className="text-main-text-gray bg-db-table-color font-medium  ">
                    <tr className="border border-footer-text rounded-10px">
                      <th className="w-[50px] py-3.5 ">
                        <input
                          className="focus:ring-0 checked:text-main-color"
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={(e) => setIsAllChecked(e.target.checked)}
                        />
                      </th>
                      <th className="w-[267px] py-3.5 ">
                        {t("my_list.table_headers.company_name")}
                      </th>
                      <th className="w-[141px] py-3.5 ">
                        {t("my_list.table_headers.headquarters")}
                      </th>
                      <th className="w-[160px] py-3.5 ">
                        {t("my_list.table_headers.company_types")}
                      </th>
                      <th className="w-[219px] py-3.5 ">
                        {t("my_list.table_headers.main_therapeutic_area")}
                      </th>
                      <th className="w-[241px] py-3.5 ">
                        {t("my_list.table_headers.description")}
                      </th>
                      <th className="w-[200px] py-3.5 ">
                        {t("my_list.table_headers.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPageData.map((item) => (
                      <tr className="border border-footer-text" key={item.id}>
                        {/* checkbox */}
                        <td>
                          <div className="flex justify-center">
                            <input
                              className="focus:ring-0 checked:text-main-color"
                              type="checkbox"
                              checked={selected.includes(item.id)}
                              onChange={(e) =>
                                selectChangeHandler(item.id, e.target.checked)
                              }
                            />
                          </div>
                        </td>

                        {/* company name */}
                        <td className=" px-2 ">
                          <div className="flex items-center py-7.5">
                            <Link
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
                            CanClick={false}
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
                            CanClick={false}
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
                            <button className="w-[153px] py-2 rounded-full text-white bg-nav-bg hover:bg-main-color-gb font-medium">
                              <Link to={`/database/${item.id}`}>
                                View Full Profile
                              </Link>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* pages buttons */}
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-between items-center pt-7.5">
            {/* previos page button*/}
            {pageNumbers && currentPage !== 1 && (
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
            {pageNumbers && currentPage > 2 && (
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

            {pageNumbers &&
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
            {pageNumbers && currentPage < pageNumbers.length - 1 && (
              <>
                <span
                  className={`select-none ${
                    currentPage === pageNumbers.length - 2 ? "hidden" : "inline"
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
            {pageNumbers.length !== 0 && currentPage !== pageNumbers.length && (
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

          {getPageData.length === 0 && (
            <div className="mx-auto mt-20 h-[50vh]">
              <h2 className="text-xl pt-40 text-center font-bold">
                {t("my_list.no_data_message")}
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyList;
