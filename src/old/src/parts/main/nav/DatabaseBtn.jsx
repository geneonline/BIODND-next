import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import button_arrow from "@/assets/svg/database/companiesHits_arrow.svg";
import CTandDrugs_data from "@/data/home/CTandDrugs_data.json";

const DatabaseBtn = ({ userData, setPopUp }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCTandDrugOpen, setIsCTandDrugOpen] = useState(false);
  const [isCTandDrugSubtitleOpen, setIsCTandDrugSubtitleOpen] = useState([
    false,
    false,
    false,
  ]);

  const handleCTandDrugSubtitleToggle = (index) => {
    setIsCTandDrugSubtitleOpen((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  const handleIsLoginLink = (e) => {
    if (!userData) {
      e.preventDefault();
      setPopUp(true);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    !isDropdownOpen && setIsCTandDrugSubtitleOpen([false, false, false]);
  }, [isDropdownOpen]);

  return (
    <div
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
      className="relative px-5 h-full flex items-center"
    >
      <button
        className={`h-full flex items-center cursor-pointer ${
          isDropdownOpen ? "text-main-color" : "text-white"
        }`}
      >
        DATABASE
        <svg
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 8L10 13L5.00012 8.00012L6.0001 7.00012L10 11L14 7L15 8Z"
            fill={` ${isDropdownOpen ? "#07BBD3" : "#FFFFFF"}`}
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="shadow-finance-autocomplete absolute left-0 top-15 xl:top-19 flex">
          {/* list */}
          <div className={` py-8 bg-finance-bg text-main-text-gray `}>
            <ul className="flex flex-col gap-y-6">
              <li>
                <Link
                  onClick={handleIsLoginLink}
                  to={"/database/search/assets/clinical-trial"}
                  className="h-[88px] py-4 pl-12 pr-10 flex items-center space-x-2 w-[342px] hover:bg-finance-search-hover"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.1332 4.50073C11.3076 4.19922 11.6311 4 12 4C12.3689 4 12.6924 4.19922 12.8668 4.50073L13.1556 5H15V6H9V5H10.8444L11.1332 4.50073ZM12 2C11.1107 2 10.3125 2.38731 9.76406 3H7V4H4V22H15.8047C15.8778 22.0499 15.9532 22.0974 16.0311 22.1423C17.7051 23.1088 19.8457 22.5352 20.8122 20.8612L23.3122 16.5311C24.2787 14.8571 23.7051 12.7165 22.0311 11.75C21.3917 11.3808 20.6841 11.2363 20 11.2921V4H17V3H14.2359C13.6875 2.38731 12.8893 2 12 2ZM17 6V8H7V6H6V20H14.3958C14.1698 19.1393 14.2699 18.1927 14.75 17.3612L17.25 13.0311C17.4532 12.6792 17.7083 12.3759 18 12.1253V6H17ZM20.8302 16.83L21.5801 15.5311C21.9943 14.8137 21.7485 13.8963 21.0311 13.4821C20.3137 13.0678 19.3963 13.3137 18.9821 14.0311L18.2321 15.33L20.8302 16.83ZM19.8302 18.5621L17.2321 17.0621L16.4821 18.3612C16.0678 19.0787 16.3137 19.996 17.0311 20.4103C17.7485 20.8245 18.6659 20.5787 19.0801 19.8612L19.8302 18.5621ZM8 15V13H16V15H8ZM16 12V10H8V12H16ZM8 16H13V18H8V16Z"
                      fill="#69747F"
                    />
                  </svg>
                  <span className="text-left text-xl text-main-text-gray leading-140 font-semibold">
                    Search by assets
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  onClick={handleIsLoginLink}
                  to={"/company-home"}
                  onMouseEnter={() => setIsCTandDrugOpen(false)}
                  className=" h-[88px] py-4 pl-12 pr-10 flex items-center space-x-2 w-[342px] hover:bg-finance-search-hover"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19 7H5V17H19V7ZM3 5V19H21V5H3ZM13.9786 9.81799L13 8.83935L17.5086 8L16.6693 12.5086L15.3929 11.2322L11.4146 15.2104L9.29352 13.0893L7.41421 14.9686L6 13.5544L9.29334 10.2611L11.4146 12.382L13.9786 9.81799Z"
                      fill="#69747F"
                    />
                  </svg>
                  <span className="text-xl text-main-text-gray leading-140 font-semibold">
                    Search by companies
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  onClick={closeDropdown}
                  to={"/about"}
                  onMouseEnter={() => setIsCTandDrugOpen(false)}
                  className="h-[88px] py-4 pl-12 pr-10 flex items-center space-x-2 w-[342px] hover:bg-finance-search-hover"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47717 2 2 6.47712 2 12C2 17.5228 6.47717 22 12 22C17.5229 22 22 17.5228 22 12C22 6.47712 17.5229 2 12 2ZM12 20C7.58881 20 4.00001 16.4112 4.00001 12C4.00001 7.58876 7.58876 4.00001 12 4.00001C16.4112 4.00001 20 7.58876 20 12C20 16.4112 16.4112 20 12 20ZM13.2522 8C13.2522 8.72506 12.7243 9.25001 12.0101 9.25001C11.2671 9.25001 10.7522 8.72501 10.7522 7.98612C10.7522 7.27596 11.2811 6.75003 12.0101 6.75003C12.7243 6.75003 13.2522 7.27596 13.2522 8ZM11.0022 11H13.0022V17H11.0022V11Z"
                      fill="#69747F"
                    />
                  </svg>

                  <span className="text-xl text-main-text-gray leading-140 font-semibold">
                    About BIODND
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {isCTandDrugOpen && (
            <div className="h-[87vh] overflow-hidden bg-white pt-9 pl-10 pr-4 pb-10">
              <Link
                to={"/database/search"}
                onClick={closeDropdown}
                className="inline-block mb-7 whitespace-nowrap px-14 py-2 text-xl font-semibold text-white bg-main-color-gb rounded-full"
              >
                Advanced search
              </Link>

              <ul className=" h-full overflow-y-auto overflow-x-hidden pr-8 pb-10">
                {Object.entries(CTandDrugs_data).map(
                  ([section, items], sectionIndex) => (
                    // 大項目 subtitle
                    <li className="w-[280px]" key={sectionIndex}>
                      <button
                        onClick={() =>
                          handleCTandDrugSubtitleToggle(sectionIndex)
                        }
                        className={` p-2 flex items-center shadow-border-b whitespace-nowrap text-xl text-main-color-gb font-semibold leading-140 ${
                          items.length > 3
                            ? "pointer-events-auto"
                            : "pointer-events-none"
                        }`}
                      >
                        {section}
                        {items.length > 3 && (
                          <img
                            className={`ml-5 ${
                              isCTandDrugSubtitleOpen[sectionIndex]
                                ? "-rotate-90"
                                : "rotate-90"
                            }`}
                            src={button_arrow}
                          />
                        )}
                      </button>

                      {/* 子項目 Link */}
                      <ul className="pt-2 pb-5">
                        {(isCTandDrugSubtitleOpen[sectionIndex]
                          ? items
                          : items.slice(0, 3)
                        ).map((item, index) => (
                          <li key={index}>
                            <Link
                              onClick={handleIsLoginLink}
                              to={`/searchkit/${item.link}`}
                              className="inline-block rounded-5px text-left w-full p-2 text-base text-toggle-color font-medium leading-140 hover:bg-finance-bg"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}

                        {!isCTandDrugSubtitleOpen[sectionIndex] &&
                          items.length > 3 && (
                            <li key={"ShowMore"}>
                              <button
                                onClick={() =>
                                  handleCTandDrugSubtitleToggle(sectionIndex)
                                }
                                className="rounded-5px text-left w-full p-2 text-base font-medium leading-140 hover:bg-finance-bg"
                              >
                                Show more...
                              </button>
                            </li>
                          )}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default DatabaseBtn;
