import { useEffect } from "react";
import { SearchBox, useSearchBox } from "react-instantsearch";

import search_icon from "@/assets/svg/database/search_icon.svg";

const CB_home_costomSearchBox = ({ setQueryValue }) => {
  const { query, refine } = useSearchBox();

  const handleSearchStateChange = (event) => {
    const newQuery = event.target.value;
    refine(newQuery);
  };

  useEffect(() => {
    if (query) {
      setQueryValue(query);
    } else {
      setQueryValue("");
    }
  }, [query, setQueryValue]);

  return (
    <SearchBox
      className=" relative"
      placeholder="NASDAQ : PSTX、Poseida Therapeutics、radiologist、CDMO"
      onChange={handleSearchStateChange}
      classNames={{
        form: "w-[708px] flex",
        input:
          "pl-11 py-3 w-full text-xl rounded-full border-main-color border-4 focus:border-main-color focus:ring-0 placeholder:text-search-home-placeholder",
      }}
      loadingIconComponent={() => <></>}
      resetIconComponent={() => <></>}
      submitIconComponent={() => (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 h-fit flex items-center">
          <span className="w-6 h-6 inline-block">
            <img src={search_icon} alt="" />
          </span>
        </div>
      )}
    />
  );
};
export default CB_home_costomSearchBox;
