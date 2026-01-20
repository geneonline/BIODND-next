import { useOutletContext } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import profile from "../../../../assets/img/CBcompany/profile.png";

import default_company_icon from "@/assets/webp/search/default_company_icon.webp";

import NeedToPay from "@/parts/NeedToPay";

// 測試資料用
const generateTestData = (originalArray, totalCount) => {
  const result = [];
  let currentIndex = 0;

  for (let i = 0; i < totalCount; i++) {
    // 計算在原始陣列中的索引位置
    currentIndex = i % originalArray.length;
    const roundNumber = Math.floor(i / 8) + 1;

    // 複製原始物件並加入id，以確保每筆資料都是唯一的
    const newItem = {
      ...originalArray[currentIndex],
      id: i + 1, // 加入唯一id
      roundNumber,
    };

    result.push(newItem);
  }

  return result;
};

const CB_page_people = () => {
  const { data, loading, error, userData } = useOutletContext();
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  // 測試資料用
  const [d1, setD1] = useState([]);
  const [d2, setD2] = useState([]);

  const perPage = 10;
  const testData1 = Array(400)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      ...d1[i % 8],
    }));
  const testData2 = Array(200)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      ...d2[i % 8],
    }));

  // 獲取當前頁面的資料
  const getCurrentPageData = (data, currentPage) => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>錯誤: {error}</div>;
  }

  if (
    userData.subscriptionLevel == !"Pro" ||
    userData.subscriptionLevel == !"Test"
  ) {
    return <NeedToPay />;
  }

  useEffect(() => {
    if (
      data &&
      data.current_employees &&
      Array.isArray(data.current_employees) &&
      data.current_employees.length > 0
    ) {
      // 測試資料用
      const d = generateTestData(data.current_employees, 400);
      setD1(d);

      // 正常寫法
      // setD1(data.current_employees);
    }

    if (
      data &&
      data.people_highlights &&
      data.current_advisors &&
      Array.isArray(data.current_advisors) &&
      data.current_advisors.length > 0
    ) {
      // 測試資料用
      const d = generateTestData(data.current_advisors, 200);
      setD2(d);

      // 正常寫法
      // setD2(data.current_advisors);
    }
  }, data);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <section className="py-5 px-7 flex bg-white items-center border border-search-home-bg">
            <div className="mr-5 w-[88px] rounded-[5px] shrink-0">
              <img
                src={data?.image || default_company_icon}
                alt={data.name || "company logo"}
                className="w-full h-fit rounded-5px max-w-unset border border-search-home-bg"
              />
            </div>
            <div className="flex flex-col ">
              <p className="text-16px leading-140 text-main-text-gray">
                ORGANIZATION
              </p>
              <h2 className="text-32px font-semibold leading-140">
                {data?.name}
              </h2>
            </div>
          </section>

          <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white border border-search-home-bg">
            <div className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9984 0.677734L15.2593 7.5115L22.7662 8.50106L17.2746 13.7141L18.6533 21.1595L11.9984 17.5476L5.34344 21.1595L6.72209 13.7141L1.23047 8.50106L8.73744 7.5115L11.9984 0.677734ZM11.9984 5.32179L10.075 9.35249L5.64722 9.93615L8.8863 13.0109L8.07314 17.4024L11.9984 15.272L15.9236 17.4024L15.1104 13.0109L18.3495 9.93615L13.9217 9.35249L11.9984 5.32179Z"
                  fill="#009BAF"
                />
              </svg>
              <h3 className="w-full text-24px font-semibold leading-140 ml-2">
                Highlights
              </h3>
            </div>

            <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
              <div className="w-[200px] gap-1">
                <p className="text-main-text-gray leading-140">
                  Employee Profiles
                </p>
                <div className="mt-[1.375rem]"></div>
                <div className="flex items-center">
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data.num_employee_profiles || "-"}
                  </p>
                  {/* <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.41421 5L16.4853 12.071L9.41439 19.142L8.00017 17.7278L13.6569 12.071L8 6.41418L9.41421 5Z"
                      fill="#009BAF"
                    />
                  </svg> */}
                </div>
              </div>
              <div className="w-[200px] gap-1">
                <p className="text-main-text-gray leading-140">
                  Number of Board Member and Advisor Profiles
                </p>
                <div className="flex items-center">
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.people_highlights?.num_current_advisor_positions ||
                      "-"}
                  </p>
                  {/* <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.41421 5L16.4853 12.071L9.41439 19.142L8.00017 17.7278L13.6569 12.071L8 6.41418L9.41421 5Z"
                      fill="#009BAF"
                    />
                  </svg> */}
                </div>
              </div>
            </div>
          </section>
        </div>

        {(data?.num_employee_profiles ||
          data?.people_highlights?.num_current_advisor_positions) && (
          <section className="w-full pt-8 pb-10 px-16 flex flex-col bg-white border border-search-home-bg">
            <div className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.47717 2 2 6.47712 2 12C2 17.5228 6.47717 22 12 22C17.5229 22 22 17.5228 22 12C22 6.47712 17.5229 2 12 2ZM12 20C7.58881 20 4.00001 16.4112 4.00001 12C4.00001 7.58876 7.58876 4.00001 12 4.00001C16.4112 4.00001 20 7.58876 20 12C20 16.4112 16.4112 20 12 20ZM13.2522 8C13.2522 8.72506 12.7243 9.25001 12.0101 9.25001C11.2671 9.25001 10.7522 8.72501 10.7522 7.98612C10.7522 7.27596 11.2811 6.75003 12.0101 6.75003C12.7243 6.75003 13.2522 7.27596 13.2522 8ZM11.0022 11H13.0022V17H11.0022V11Z"
                  fill="#009BAF"
                />
              </svg>
              <h3 className="w-full text-24px font-semibold leading-140 ml-2">
                About
              </h3>
            </div>

            <div className="text-main-text-gray mt-5">
              {data?.num_employee_profiles && (
                <p>
                  <span className="font-semibold">{data?.name}</span> has{" "}
                  <span className="font-semibold">
                    {data?.num_employee_profiles}
                  </span>{" "}
                  current employee profiles, including CEO and{" "}
                  {Array.isArray(data.founders) && data.founders.length > 1
                    ? "Founders"
                    : "Founder"}{" "}
                  <span className="font-semibold">
                    {data.founders &&
                      data.founders.map((founder) => founder.value).join(", ")}
                  </span>
                  .
                </p>
              )}

              {data?.people_highlights?.num_current_advisor_positions && (
                <p className="mt-3">
                  <span className="font-semibold">{data?.name}</span> has{" "}
                  <span className="font-semibold">
                    {data?.people_highlights?.num_current_advisor_positions}
                  </span>{" "}
                  current employee profiles, including{" "}
                  <span className="font-semibold">
                    {Array.isArray(data.current_advisors)
                      ? data.current_advisors[0]?.name
                      : ""}
                  </span>
                  .
                </p>
              )}
            </div>
          </section>
        )}

        {(data?.num_employee_profiles || data?.current_employees) && (
          <section className="w-full pt-8 pb-11 flex flex-col bg-white border border-search-home-bg">
            <div className="flex items-center px-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5ZM6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9Z"
                  fill="#009BAF"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.41444 13.5643C6.87282 14.7217 5 17.5766 5 21H3C3 16.8693 5.26352 13.2569 8.58556 11.7441L9.41444 13.5643ZM19 21C19 17.7772 17.3382 15.0529 15.0193 13.7816L15.9807 12.0279C18.9902 13.6778 21 17.1058 21 21H19Z"
                  fill="#009BAF"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20 21H4V19H20V21Z"
                  fill="#009BAF"
                />
              </svg>
              <h3 className="w-full text-24px font-semibold leading-140 ml-2">
                Employee Profiles
              </h3>
            </div>
            <div className="text-main-text-gray font-medium px-16 mt-5">
              <p className="py-6 border-b border-[rgba(0,0,0,0.12)]">
                {`${data?.name} has ${
                  data?.num_employee_profiles
                } current employee profiles, including CEO and ${
                  Array.isArray(data.founders) && data.founders.length > 1
                    ? "Founders"
                    : "Founder"
                } ${
                  data.founders &&
                  data.founders.map((founder) => founder.value).join(", ")
                }`}
                .
              </p>
            </div>

            <div>
              <div className="flex flex-wrap px-16 pt-2">
                {data?.current_employees?.map((item, index) => (
                  <div
                    key={item?.id || index}
                    className="py-6 px-5 w-full md:w-1/2 flex items-center border-b border-[rgba(0,0,0,0.12)]"
                  >
                    <div className="w-[60px] h-[60px] rounded-[4px] border border-search-home-placeholder overflow-hidden shrink-0">
                      <img
                        src={profile}
                        alt={item.name || "profile"}
                        className="object-cover w-full h-full max-w-unset"
                      ></img>
                    </div>
                    <div className="ml-3.5 flex flex-col justify-center">
                      <div className="text-main-text-gray">{item?.title}</div>
                      <div className="font-semibold text-base text-main-color-gb">
                        {item?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 self-end px-16">
              {/* <Pagination
              total={testData1.length}
              perPage={perPage}
              currentPage={currentPage1}
              onPageChange={setCurrentPage1}
            /> */}
            </div>
          </section>
        )}

        {(data?.current_advisors ||
          data?.people_highlights?.num_current_advisor_positions) && (
          <section className="w-full pt-8 pb-11 flex flex-col bg-white border border-search-home-bg">
            <div className="flex items-center px-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5C13 5.04205 12.9974 5.08346 12.9924 5.12409C12.6751 5.04307 12.3426 5 12 5C11.6574 5 11.3249 5.04307 11.0076 5.12408C11.0026 5.08345 11 5.04205 11 5ZM9.21851 6.1254C9.07771 5.77779 9 5.39776 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5C15 5.39776 14.9223 5.7778 14.7815 6.1254C15.5329 6.85261 16 7.87175 16 9V10H13V11H19V14.1707C20.1652 14.5825 21 15.6938 21 17C21 17.3978 20.9223 17.7778 20.7815 18.1254C21.5329 18.8526 22 19.8717 22 21V22H14V21C14 19.8717 14.4671 18.8526 15.2185 18.1254C15.0777 17.7778 15 17.3978 15 17C15 15.6938 15.8348 14.5825 17 14.1707V13H13V15H11V13H7V14.1653C8.13829 14.5521 9 15.5819 9 16.8712C9 17.3028 8.9005 17.7093 8.72562 18.0723C9.50966 18.8026 10 19.844 10 21V22H2V21C2 19.844 2.49034 18.8026 3.27438 18.0723C3.0995 17.7093 3 17.3028 3 16.8712C3 15.5819 3.86171 14.5521 5 14.1653V11H11V10H8V9C8 7.87175 8.46712 6.8526 9.21851 6.1254ZM5 16.8712C5 16.4517 5.38397 16 6 16C6.61603 16 7 16.4517 7 16.8712C7 16.9547 6.98643 17.0369 6.9598 17.1159C6.65232 17.0402 6.33085 17 6 17C5.66915 17 5.34768 17.0402 5.0402 17.1159C5.01357 17.0369 5 16.9547 5 16.8712ZM18 16C17.4477 16 17 16.4477 17 17C17 17.042 17.0026 17.0835 17.0076 17.1241C17.3249 17.0431 17.6574 17 18 17C18.3426 17 18.6751 17.0431 18.9924 17.1241C18.9974 17.0835 19 17.042 19 17C19 16.4477 18.5523 16 18 16ZM12 7C12.7403 7 13.3866 7.4022 13.7324 8H10.2676C10.6134 7.4022 11.2597 7 12 7ZM7.73244 20C7.38663 19.4022 6.74028 19 6 19C5.25972 19 4.61337 19.4022 4.26756 20H7.73244ZM18 19C18.7403 19 19.3866 19.4022 19.7324 20H16.2676C16.6134 19.4022 17.2597 19 18 19Z"
                  fill="#009BAF"
                />
              </svg>
              <h3 className="w-full text-24px font-semibold leading-140 ml-2">
                Board Member and Advisor Profiles
              </h3>
            </div>
            <div className="text-main-text-gray font-medium px-16 border-b border-search-home-bg mt-5">
              <p className="py-6 border-b border-[rgba(0,0,0,0.12)]">
                {data?.name} has{" "}
                {data?.people_highlights?.num_current_advisor_positions} current
                employee profiles, including{" "}
                {Array.isArray(data.current_advisors)
                  ? data.current_advisors[0]?.name
                  : ""}
                .
              </p>
              <p className="py-6">
                Number of Board Member and Advisor Profiles{" "}
                <span className="text-main-color-gb font-semibold ml-4">
                  {data.people_highlights?.num_current_advisor_positions || "-"}
                </span>
              </p>
            </div>

            <div>
              <div className="flex flex-wrap px-16 pt-2">
                {data?.current_advisors?.map((item) => (
                  <div
                    key={item.id}
                    className="py-6 px-5 w-full md:w-1/2 flex items-center border-b border-[rgba(0,0,0,0.12)]"
                  >
                    <div className="w-[60px] h-[60px] rounded-[4px] border border-search-home-placeholder overflow-hidden shrink-0">
                      <img
                        src={profile}
                        alt={item.name || "profile"}
                        className="object-cover w-full h-full max-w-unset"
                      ></img>
                    </div>
                    <div className="ml-3.5 flex flex-col justify-center">
                      <div className="text-main-text-gray">{item.job_type}</div>
                      <div className="font-semibold text-base text-main-color-gb">
                        {item.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 self-end px-16">
              {/* <Pagination
              total={testData2.length}
              perPage={perPage}
              currentPage={currentPage2}
              onPageChange={setCurrentPage2}
            /> */}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// 分頁
const Pagination = ({ total, perPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / perPage);
  const groupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const totalGroups = Math.ceil(totalPages / groupSize);

  const getPageRange = () => {
    const start = currentGroup * groupSize + 1;
    const end = Math.min(start + groupSize - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-7 h-7 border border-main-text-gray rounded-[2px] flex justify-center items-center mr-3 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-main-text-gray"
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {currentGroup > 0 && (
        <button
          onClick={() =>
            onPageChange((currentGroup - 1) * groupSize + groupSize)
          }
          className="w-7 h-7 border border-main-text-gray rounded-[2px] hover:bg-gray-50"
        >
          ...
        </button>
      )}

      {getPageRange().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-7 h-7 border rounded-[2px] text-sm ${
            currentPage === pageNum
              ? "bg-main-color-gb text-white border-main-color-gb"
              : "bg-white hover:bg-gray-50 border-main-text-gray"
          }`}
        >
          {pageNum}
        </button>
      ))}

      {currentGroup < totalGroups - 1 && (
        <button
          onClick={() => onPageChange((currentGroup + 1) * groupSize + 1)}
          className="w-7 h-7 border border-main-text-gray rounded-[2px] hover:bg-gray-50"
        >
          ...
        </button>
      )}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`w-7 h-7 border border-main-text-gray rounded-[2px] flex justify-center items-center ml-3 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-main-text-gray"
        }`}
      >
        <ChevronRight size={24} />
      </button>

      <span className="ml-8 text-sm text-gray-600">
        Showing {(currentPage - 1) * perPage + 1} -{" "}
        {Math.min(currentPage * perPage, total)} of {total}
      </span>
    </div>
  );
};

export default CB_page_people;
