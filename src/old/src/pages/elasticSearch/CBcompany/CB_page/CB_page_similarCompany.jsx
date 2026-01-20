import { useOutletContext, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import profile from "../../../../assets/img/CBcompany/profile.png";

import default_company_icon from "@/assets/webp/search/default_company_icon.webp";

const getCompanyText = (companies, companyName) => {
  if (!companies || companies.length === 0) {
    return (
      <p>
        No similar companies found for{" "}
        <span className="font-semibold">{companyName}</span>.
      </p>
    );
  } else if (companies.length === 1) {
    return (
      <p>
        Companies like <span className="font-semibold">{companyName}</span>{" "}
        include <span className="font-semibold">{companies[0]?.name}</span>.
      </p>
    );
  } else if (companies.length === 2) {
    return (
      <p>
        Companies like <span className="font-semibold">{companyName}</span>{" "}
        include <span className="font-semibold">{companies[0]?.name}</span> and{" "}
        <span className="font-semibold">{companies[1]?.name}</span>.
      </p>
    );
  } else {
    return (
      <p>
        Companies like <span className="font-semibold">{companyName}</span>{" "}
        include <span className="font-semibold">{companies[0]?.name}</span>,{" "}
        <span className="font-semibold">{companies[1]?.name}</span>,{" "}
        <span className="font-semibold">{companies[2]?.name}</span> and{" "}
        <span className="font-semibold">others</span>.
      </p>
    );
  }
};

// 點擊卡片的標籤
const handleLabelClick = (e, i) => {
  e.preventDefault();
};

const CB_page_similarCompany = () => {
  const { data, loading, error } = useOutletContext();
  const [d, setD] = useState([]); // 列表需要的資料
  const [currentPage, setCurrentPage] = useState(1); // 分頁
  const perPage = 10;

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

  // 測試資料用
  const generateDummyData = () => {
    const getEmployeeRange = (num) => {
      if (num <= 10) return "1-10";
      if (num <= 50) return "11-50";
      if (num <= 100) return "51-100";
      if (num <= 1000) {
        const lowerBound = Math.floor((num - 1) / 100) * 100 + 1;
        const upperBound = Math.min(Math.ceil(num / 100) * 100, 1000);
        return `${lowerBound}-${upperBound}`;
      }
      if (num <= 10000) {
        const lowerBound = Math.floor((num - 1) / 1000) * 1000 + 1;
        const upperBound = Math.min(Math.ceil(num / 1000) * 1000, 10000);
        return `${lowerBound}-${upperBound}`;
      }
      return "10001+";
    };

    const allLabels = [
      "Artificial Intelligence (AI)",
      "Cloud Computing",
      "Computer",
      "Embedded Systems",
      "GPU",
      "Hardware",
      "Semiconductor",
      "Software",
      "Consumer Electronics",
      "Gaming",
      "Media and Entertainment",
    ];

    const getRandomLabels = () => {
      // 隨機決定要選擇的產業數量（3-7個）
      const count = Math.floor(Math.random() * 5) + 3;
      const selectedIndustries = [];

      // 簡單隨機選取產業
      while (selectedIndustries.length < count) {
        const randomIndex = Math.floor(Math.random() * allLabels.length);
        const randomIndustry = allLabels[randomIndex];

        // 確保不會選到重複的產業
        if (!selectedIndustries.includes(randomIndustry)) {
          selectedIndustries.push(randomIndustry);
        }
      }

      return selectedIndustries;
    };

    const finalCompanies = [];
    const originalCompanies = data.similar_companies; // 原始10筆資料
    const totalNeeded = data.overview_highlights.num_org_similarities; // 需要的總數

    // 計算需要完整重複的次數和剩餘數量
    const fullSets = Math.floor(totalNeeded / originalCompanies.length);
    const remainder = totalNeeded % originalCompanies.length;

    // 處理完整組的資料
    for (let i = 0; i < fullSets; i++) {
      const enrichedSet = originalCompanies.map((company, index) => ({
        ...company,
        address:
          index % 2 === 0
            ? `Santa Clara, California, United States`
            : `Port Washington, New York, United States`,
        contacts: index % 2 === 0 ? 4837 : 14,
        employeeNum: getEmployeeRange(Math.floor(Math.random() * 15000) + 1),
        introduction: `${company?.name} is a semiconductor company that designs and develops graphics units, processors, and media solutions.`,
        labels: getRandomLabels(),
      }));
      finalCompanies.push(...enrichedSet);
    }

    // 處理剩餘的資料
    if (remainder > 0) {
      const remainingSet = originalCompanies
        .slice(0, remainder)
        .map((company, index) => ({
          ...company,
          address:
            index % 2 === 0
              ? `Santa Clara, California, United States`
              : `Port Washington, New York, United States`,
          contacts: index % 2 === 0 ? 4837 : 14,
          employeeNum: getEmployeeRange(Math.floor(Math.random() * 15000) + 1),
          introduction: `${company?.name} is a semiconductor company that designs and develops graphics units, processors, and media solutions.`,
          labels: getRandomLabels(),
        }));
      finalCompanies.push(...remainingSet);
    }

    return finalCompanies;
  };

  useEffect(() => {
    if (
      data &&
      data.overview_highlights &&
      data.overview_highlights.num_org_similarities &&
      data.similar_companies &&
      Array.isArray(data.similar_companies)
    ) {
      // 測試資料用
      const finalCompanies = generateDummyData();
      setD(finalCompanies);

      // 正常寫法
      // setD([...data.similar_companies]);
    }
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <section className="py-5 px-7 flex bg-white items-center border border-search-home-bg">
            <div className="mr-5 w-[88px] rounded-5px shrink-0 border border-search-home-bg">
              <img
                src={data?.image || default_company_icon}
                alt={data.name || "company logo"}
                className="w-full h-fit rounded-[5px] max-w-unset"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-16px leading-140 text-main-text-gray">
                ORGANIZATION
              </p>
              <h2 className="text-32px font-semibold leading-140">
                {data?.name}
              </h2>
            </div>
          </section>
        </div>

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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 3H16V8H20V21H4V3ZM16 19V10H18V19H16ZM14 5V19H6V5H14ZM7.5 10H12.5V8H7.5V10ZM12.5 13H7.5V11H12.5V13ZM7.5 16H12.5V14H7.5V16Z"
                fill="#009BAF"
              />
            </svg>
            <h3 className="w-full text-24px font-semibold leading-140 ml-2">
              Similar Companies
            </h3>
          </div>
          <div className="text-main-text-gray mt-5">
            {getCompanyText(d, data?.name)}
          </div>
        </section>

        <section className="w-full py-5 flex flex-col bg-white border border-search-home-bg">
          <div className="flex flex-wrap justify-between px-6 border-b border-[rgba(0,0,0,0.12)]">
            {getCurrentPageData(d, currentPage).map((item, index) => (
              <Link
                key={item.id || index}
                to={item?.link}
                target="_blank"
                className="shrink-0 mb-4 hover:bg-gray-50 max-md:!w-full"
                style={{ width: "calc(50% - 0.5rem)" }}
              >
                <div className="p-7 border border-search-home-bg rounded-10px h-full">
                  <div className="flex items-center pb-5 border-b border-[rgba(0,0,0,0.12)] ">
                    <div className="w-[60px] h-[60px] rounded-[5px] overflow-hidden shrink-0">
                      <img
                        src={item.image || profile}
                        alt={item.name || "profile"}
                        className="object-cover w-full h-full max-w-unset"
                      ></img>
                    </div>
                    <h3 className="text-[1.5rem] font-semibold ml-4">
                      {item?.name}
                    </h3>
                  </div>
                  <div className="pt-4 pb-5 border-b border-[rgba(0,0,0,0.12)]">
                    <div className="flex items-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.75934 14.4432L6.72598 14.406C6.6678 14.3405 6.61087 14.2739 6.55522 14.2063C6.46426 14.0958 6.37671 13.9824 6.29273 13.8664C6.27682 13.8445 6.26104 13.8224 6.24539 13.8002L6.13277 13.6593L6.14314 13.6513C5.42046 12.5685 5 11.273 5 9.88123C5 6.08083 8.13401 3 12 3C15.866 3 19 6.08083 19 9.88123C19 11.273 18.5797 12.5683 17.857 13.6511L17.8672 13.6593L17.7546 13.8002C17.739 13.8224 17.7232 13.8445 17.7073 13.8664C17.6233 13.9824 17.5358 14.0958 17.4448 14.2063C17.3891 14.2739 17.3322 14.3405 17.274 14.406L17.2407 14.4432L12 21L6.75934 14.4432ZM16.1934 12.541L16.156 12.5969L16.1551 12.598L16.1208 12.6467C16.0083 12.806 15.8862 12.9588 15.7552 13.1041L15.7154 13.1482L12 17.7967L8.28457 13.1482L8.24483 13.1041C8.11383 12.9588 7.9917 12.806 7.87919 12.6467L7.84485 12.598L7.84397 12.5969L7.80663 12.541C7.29531 11.7749 7 10.8638 7 9.88123C7 7.21753 9.20617 5 12 5C14.7938 5 17 7.21753 17 9.88123C17 10.8638 16.7047 11.7749 16.1934 12.541ZM13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
                          fill="#69747F"
                        />
                      </svg>
                      {/* 地址 */}
                      <p className="ml-3 font-semibold text-base text-main-color-gb">
                        {item?.address}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.78734 8L12.5 12.7045L18.2127 8H6.78734ZM5 15.8439L9.02766 12.4359L5 9.11898V15.8439ZM10.5968 13.7281L6.72994 17H18.429L14.6437 13.53L12.5 15.2955L10.5968 13.7281ZM20 9.11898V15.7269L16.2028 12.2461L20 9.11898ZM3 6H22V19H3V6Z"
                          fill="#69747F"
                        />
                      </svg>
                      {/* Contacts */}
                      <p className="ml-3 font-semibold text-base text-main-color-gb">
                        {item?.contacts}
                        <span className="text-main-text-gray">
                          {" "}
                          Contact{item.contacts && item.contacts > 1 ? "s" : ""}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13 9.43767C13 8.10825 14.1023 7 15.5 7C16.8977 7 18 8.10825 18 9.43767C18 10.1461 17.6909 10.7866 17.1878 11.2359C16.6521 11.0823 16.0868 11 15.5 11C14.9132 11 14.3479 11.0823 13.8122 11.2359C13.3091 10.7866 13 10.1461 13 9.43767ZM11.933 12.1434C11.3497 11.3963 11 10.458 11 9.43767C11 6.96995 13.0317 5 15.5 5C17.9683 5 20 6.96995 20 9.43767C20 10.458 19.6503 11.3963 19.067 12.1434C20.6002 13.2308 21.6647 14.9951 21.9334 17H22V19H9V18H2V16H2.07401C2.31656 14.3704 3.14157 12.9044 4.34476 11.9876C4.12873 11.6164 4 11.1866 4 10.7188C4 9.08047 5.49067 8 7 8C8.50933 8 10 9.08047 10 10.7188C10 11.0901 9.9189 11.4375 9.77741 11.7506C10.2573 12.0566 10.6868 12.4446 11.0535 12.8923C11.3252 12.6168 11.6193 12.3659 11.933 12.1434ZM11.0889 17H19.9111C19.4884 14.6649 17.6141 13 15.5 13C13.3859 13 11.5116 14.6649 11.0889 17ZM9.81969 14.5991C9.59181 15.0405 9.40713 15.5099 9.27116 16H4.0997C4.47321 14.1829 5.83974 13 7.23529 13C8.23733 13 9.20151 13.5842 9.81969 14.5991ZM6 10.7188C6 10.4586 6.30019 10 7 10C7.69981 10 8 10.4586 8 10.7188C8 10.8211 7.96663 10.935 7.88533 11.0452C7.67323 11.0154 7.45635 11 7.23529 11C6.86962 11 6.51617 11.0412 6.17731 11.1192C6.05017 10.987 6 10.8442 6 10.7188Z"
                          fill="#69747F"
                        />
                      </svg>
                      {/* employees */}
                      <p className="ml-3 font-semibold text-base text-main-color-gb">
                        {item?.employeeNum}
                        <span className="text-main-text-gray"> employees</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 pb-5 border-b border-[rgba(0,0,0,0.12)]">
                    {/* 公司簡介 */}
                    <p className="text-main-text-gray">{item?.introduction}</p>
                  </div>
                  <div className="pt-4 pb-5 flex flex-wrap mb-1">
                    {/* 標籤 */}
                    {item.labels &&
                      Array.isArray(item.labels) &&
                      item.labels.map((i, index) => (
                        <div
                          className="rounded-[50px] border border-main-color text-main-color-gb text-sm mb-2.5 py-1 px-4 mr-2 hover:text-white hover:bg-main-color-gb cursor-pointer"
                          key={index}
                          onClick={(e) => handleLabelClick(e, i)}
                        >
                          {i}
                        </div>
                      ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 mb-6 self-end px-16">
            <Pagination
              total={d.length}
              perPage={perPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              label="Section 1"
            />
          </div>
        </section>
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
        {total} Result{total === 1 ? "" : "s"}
      </span>
    </div>
  );
};

export default CB_page_similarCompany;
