import { useEffect, useMemo, useState } from "react";
import {
  InstantSearch,
  Configure,
  Pagination,
  Stats,
  useInstantSearch,
} from "react-instantsearch";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { updateHistory } from "@/data/api";
import { useUser } from "@/hooks/useUser";
import { createSearchkitClient } from "@/services/searchkitClient";

import CB_home_costomHits from "./CB_home_costomHits";
import CB_home_costomSearchBox from "./CB_home_costomSearchBox";
import CB_home_costomRefinementList from "./CB_home_costomRefinementList";
import CB_home_costomInputFilter from "./CB_home_costomInputFilter";
import CB_home_costomSelectFilter from "./CB_home_costomSelectFilter";
import CB_home_dualRangeSlider from "./CB_home_dualRangeSlider";
import CB_home_searchTags from "./CB_home_searchTags";
import CB_home_costomState from "./CB_home_costomState";

import noresults_icon from "@/assets/svg/database/noresults_icon.svg";

// const INDEX_NAMES = [
//   "crunchbase-companies-uniq",
//   "crunchbase-companies-uniq-biodnd",
// ].join(",");
const INDEX_ALIAS = "crunchbase_company";

const CB_home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [inputFiltersValues, setInputFiltersValues] = useState({
    num_employees: "",
  });
  const [hitsLength, setHitsLength] = useState(0);
  const [queryValue, setQueryValue] = useState("");

  const [isRefinementListChecked, setIsRefinementListChecked] = useState(false);
  const [isStartSearch, setIsStartSearch] = useState(false);

  const token = localStorage.getItem("token");
  const { userData, userIsValidating } = useUser(token);
  const [needToPay, setNeedtoPay] = useState(true);

  //判斷是不是免費仔
  useEffect(() => {
    if (userData) {
      if (
        userData.subscriptionLevel === "Pro" ||
        userData.subscriptionLevel === "Test"
      ) {
        setNeedtoPay(false);
      } else {
        setNeedtoPay(true);
      }
    }
  }, [userData]);

  //判斷開始搜尋了沒
  useEffect(() => {
    if (
      queryValue ||
      isRefinementListChecked ||
      Object.values(inputFiltersValues).some((value) => value !== "")
    ) {
      setIsStartSearch(true);
    } else {
      setIsStartSearch(false);
    }
  }, [queryValue, isRefinementListChecked, inputFiltersValues]);

  // 定義員工數量的範圍標籤
  const employee_num_data = [
    "1-10",
    "11-50",
    "51-100",
    "101-250",
    "251-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10001+",
    "",
  ];

  // Create the Searchkit client
  const searchClient = useMemo(
    () =>
      createSearchkitClient({
        searchSettings: {
          search_attributes: ["*"], // The field to search
          result_attributes: ["*"], // 顯示的欄位
          facet_attributes: [
            {
              attribute: "industries.value.keyword",
              field: "industries.value.keyword",
              type: "string",
            },
            {
              attribute: "name",
              field: "name",
              type: "string",
            },
            {
              attribute: "legal_name",
              field: "legal_name",
              type: "string",
            },
            {
              attribute: "full_description",
              field: "full_description",
              type: "string",
            },
            {
              attribute: "location.name",
              field: "location.name",
              type: "string",
            },
            {
              attribute: "num_employees",
              field: "num_employees",
              type: "string",
            },
            {
              attribute: "funding_rounds.last_funding_type.keyword",
              field: "funding_rounds.last_funding_type.keyword",
              type: "string",
            },
          ],
        },
      }),
    []
  );

  // 處理 Range Slider 的範圍變更
  // const handleEmployeeRangeChange = (selectedRanges) => {
  //   setInputFiltersValues((prevValues) => ({
  //     ...prevValues,
  //     num_employees: selectedRanges,
  //   }));
  // };

  const [rangeValue, setRangeValue] = useState(employee_num_data.length - 1); // 預設選中 "" (最後一個)

  const handleRangeChange = (e) => {
    const newIndex = parseInt(e.target.value, 10);
    setRangeValue(newIndex);

    // 通知父組件範圍變更
    const selectedValue = employee_num_data[newIndex];
    setInputFiltersValues((prevValues) => ({
      ...prevValues,
      ["num_employees"]: selectedValue,
    }));
  };

  //tracking click result event
  const handleClickCompany = (e, value, isExample, uuid) => {
    //get userdata
    if (userData) {
      console.log(userData);
    }
    //post to history
    updateHistory({
      userData: userData || {},
      event: isExample ? "click search result example" : "click search result",
      eventData: { value, uuid },
    });
  };

  // 定義 OR 分組
  const OR_GROUPS = [
    ["name", "legal_name"], // 這些欄位將被 OR 連接
    // 可以在這裡添加更多的分組
  ];

  // 構建過濾器字符串
  const buildFilterString = () => {
    // 複製 inputFiltersValues 以避免直接修改狀態
    const filtersCopy = { ...inputFiltersValues };
    let filterParts = [];

    // 處理 OR 分組
    OR_GROUPS.forEach((group) => {
      const groupFilters = group
        .map((field) =>
          filtersCopy[field] ? `${field}:"${filtersCopy[field]}"` : null
        )
        .filter(Boolean);

      if (groupFilters.length > 0) {
        filterParts.push(`${groupFilters.join(" OR ")}`);
        // 清除已處理的欄位，避免重複處理
        group.forEach((field) => delete filtersCopy[field]);
      }
    });

    // 處理剩餘的單一欄位，使用 AND 連接
    Object.entries(filtersCopy).forEach(([key, value]) => {
      if (value) {
        filterParts.push(`${key}:"${value}"`);
      }
    });

    return filterParts.join(" AND ");
  };

  const filterString = buildFilterString();

  return (
    <div className="w-full relative bg-finance-bg">
      <InstantSearch
        indexName={INDEX_ALIAS}
        searchClient={searchClient}
        initialUiState={{
          [INDEX_ALIAS]: {
            query: query,
          },
        }}
      >
        <CB_home_costomState setHitsLength={setHitsLength} />
        <div className="w-full">
          <div className="w-full flex flex-col items-center bg-main-color-gb pt-30 pb-13">
            <h1 className="pb-3 text-4xl text-white font-bold leading-140">
              Search for companies
            </h1>
            <CB_home_costomSearchBox setQueryValue={setQueryValue} />
          </div>

          <div className="w-full">
            <CB_home_searchTags />
            <div className="w-full flex">
              <div className="bg-white border-r border-search-home-placeholder">
                <div>
                  <CB_home_costomRefinementList
                    setIsRefinementListChecked={setIsRefinementListChecked}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="w-full pt-6 pb-8 pl-11 bg-white border-b border-search-home-placeholder">
                  <div className="flex space-x-6 ">
                    <div className="flex flex-col gap-y-5">
                      <CB_home_costomInputFilter
                        label="Organization Name"
                        value={inputFiltersValues["name"] || ""}
                        onChange={(e) =>
                          setInputFiltersValues((prevValues) => ({
                            ...prevValues,
                            ["name"]: e.target.value,
                            ["legal_name"]: e.target.value,
                          }))
                        }
                      />
                      <CB_home_costomInputFilter
                        label="Description Keywords"
                        value={inputFiltersValues["full_description"] || ""}
                        onChange={(e) =>
                          setInputFiltersValues((prevValues) => ({
                            ...prevValues,
                            ["full_description"]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-y-5">
                      <CB_home_costomInputFilter
                        label="Headquarters Location"
                        value={inputFiltersValues["location.name"] || ""}
                        onChange={(e) =>
                          setInputFiltersValues((prevValues) => ({
                            ...prevValues,
                            ["location.name"]: e.target.value,
                          }))
                        }
                        needToPay={needToPay}
                      />
                      <CB_home_costomSelectFilter
                        label="Last Funding Type"
                        attribute={"funding_rounds.last_funding_type.keyword"}
                        needToPay={needToPay}
                      />
                    </div>

                    <div className="relative">
                      <p className="font-semibold leading-140 pb-4">
                        Number of Employees
                      </p>
                      <div className=" relative flex flex-col items-center">
                        <input
                          type="range"
                          min={0}
                          max={9}
                          step="1"
                          onChange={handleRangeChange}
                          className="w-full"
                        />
                        <div className="mt-4 py-0.5 text-center rounded-5px w-[120px] text-main-text-gray border border-main-text-gray font-medium text-sm1">
                          {employee_num_data[rangeValue] === ""
                            ? "ALL"
                            : employee_num_data[rangeValue]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Number of Employees
                    </label>
                    <CB_home_dualRangeSlider
                      data={employee_num_data}
                      onRangeChange={handleEmployeeRangeChange}
                    />
                  </div> */}
                </div>

                {isStartSearch ? (
                  <>
                    {hitsLength === 0 ? (
                      // no results
                      <div className="flex items-center pt-9 pl-11 mb-18">
                        <div className="h-9 pr-2">
                          <img src={noresults_icon} alt="" />
                        </div>
                        <h2 className=" text-main-color text-32px font-semibold leading-140">
                          We couldn’t find any match for your search.
                        </h2>
                      </div>
                    ) : (
                      // results
                      <div className="relative w-full pt-6 pl-11 pr-19 pb-10">
                        <Loading />
                        <Results handleClickCompany={handleClickCompany} />
                      </div>
                    )}
                  </>
                ) : (
                  // not yet search
                  <div className="pl-11 pt-6 pb-10">
                    <div className="flex items-center pb-6">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative mr-2"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.2835 13.721L21.1252 7.25L14.6542 8.09169L16.5144 9.95192L12.1525 14.3138L7.90967 10.071L2 15.9799L3.41421 17.3941L7.9093 12.899L12.1523 17.142L17.9286 11.3661L20.2835 13.721Z"
                          fill="#009BAF"
                        />
                      </svg>
                      <h3 className=" font-semibold text-24px">
                        Trending on Biodnd
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Maze Therapeutics",
                            true,
                            "bad2d178-2fa9-4403-9b18-b66f39ebd2cd"
                          )
                        }
                        to={
                          "/company-page/bad2d178-2fa9-4403-9b18-b66f39ebd2cd"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/rcuwxmgtqgdtmxlblipu"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Maze Therapeutics
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Poseida Therapeutics",
                            true,
                            "0e457bab-6ece-077d-445f-93d757fd68d2"
                          )
                        }
                        to={
                          "/company-page/0e457bab-6ece-077d-445f-93d757fd68d2"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/f4ibl0cus5idnv5q7by8"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Poseida Therapeutics
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Legend Biotech",
                            true,
                            "b03f77ec-69d2-466e-b73c-aa80bbc47175"
                          )
                        }
                        to={
                          "/company-page/b03f77ec-69d2-466e-b73c-aa80bbc47175"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/ifjmht6xjz3j89290cyp"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Legend Biotech
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Pfizer",
                            true,
                            "2eadc665-593a-c934-5088-a7490b7aa47d"
                          )
                        }
                        to={
                          "/company-page/2eadc665-593a-c934-5088-a7490b7aa47d"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/ricb1aqf73vxbqbqzlyw"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Pfizer
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Cereno Scientific AB",
                            true,
                            "bc1bc20f-02fd-493f-bf98-170ce8824d39"
                          )
                        }
                        to={
                          "/company-page/bc1bc20f-02fd-493f-bf98-170ce8824d39"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/siks6lbtgiskkootuwrm"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Cereno Scientific AB
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Merck",
                            true,
                            "2f9b212a-d3aa-a8c2-6317-516127c8ba88"
                          )
                        }
                        to={
                          "/company-page/2f9b212a-d3aa-a8c2-6317-516127c8ba88"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/v1484319228/r5dfop9wrdxrsbkflim9.png"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Merck
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "CropX",
                            true,
                            "3649dbe0-efb2-7c8b-d514-94f7058ecdab"
                          )
                        }
                        to={
                          "/company-page/3649dbe0-efb2-7c8b-d514-94f7058ecdab"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/xvcyul3wwitc8igdhg0s"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          CropX
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "Rad AI",
                            true,
                            "cf5cffe3-be53-4e4c-ba34-4356af54807f"
                          )
                        }
                        to={
                          "/company-page/cf5cffe3-be53-4e4c-ba34-4356af54807f"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/ufzt8xwdhpqa47l3rinx"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          Rad AI
                        </p>
                      </Link>

                      <Link
                        onClick={(e) =>
                          handleClickCompany(
                            e,
                            "ModifyHealth",
                            true,
                            "83c8a724-708f-458b-b643-3f56614ca643"
                          )
                        }
                        to={
                          "/company-page/83c8a724-708f-458b-b643-3f56614ca643"
                        }
                        target="_blank"
                        className=" pl-6 pr-2 flex items-center w-[300px] h-24 bg-white rounded-10px shadow-finance-autocomplete"
                      >
                        <div className="w-9 h-9 border border-search-home-bg rounded-5px">
                          <img
                            src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_4/einp9ebylouucxrbajb6"
                            alt=""
                          />
                        </div>
                        <p className="pl-3 font-semibold text-xl leading-140">
                          ModifyHealth
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Configure filters={filterString || "*"} hitsPerPage={20} />
      </InstantSearch>
    </div>
  );
};
export default CB_home;

export const Loading = () => {
  const { status } = useInstantSearch();

  return status === "loading" || status === "stalled" ? (
    <div className="absolute top-0 left-0 w-full h-full bg-profile-button-bg bg-opacity-60 z-50 flex items-start justify-center">
      <div className="flex pt-40 justify-between w-[135px] h-[50px]">
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce1"></div>
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce2"></div>
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce3"></div>
      </div>
    </div>
  ) : null;
};

export const Results = ({ handleClickCompany }) => {
  const { results } = useInstantSearch();

  return !results?.nbHits ? (
    <div className="flex items-center pb-96">
      <div className="flex-shrink-0 w-9 h-9 mr-3">
        <img className="w-full h-full" src={noresults_icon} alt="" />
      </div>
      <h2 className=" text-main-color-gb text-32px font-semibold leading-140">
        We couldn’t find any match for your search.
      </h2>
    </div>
  ) : (
    <>
      <Stats className="pb-4 text-main-text-gray text-xl leading-140" />
      {/* Display search results */}

      <CB_home_costomHits handleClickCompany={handleClickCompany} />

      <div className=" bg-white pt-8 pb-11 px-16 border-t border-search-home-placeholder">
        <Pagination
          classNames={{
            root: "flex justify-end",
            list: "flex space-x-2",
            item: "rounded-sm px-2.5 py-1 text-main-text-gray border-main-text-gray border",
            selectedItem: "text-white bg-main-color-gb border-main-color-gb",
          }}
        />
      </div>
    </>
  );
};
