import { useState, useContext } from "react";
import search_icon from "@/assets/svg/homepage/search_icon.svg";

import { SearchContext } from "@/data/context";

const NormalSearchBar = () => {
  const [query, setQuery] = useState("");
  const [setSearchValue] = useContext(SearchContext);

  function handleKeyDown(event) {
    if (event.key === "Enter" && event.target === document.activeElement) {
      setSearchValue(event.target.value);
    }
  }
  return (
    <div className="relative w-4/5 md:w-7/10 xl:w-3/5 xl:max-w-2xl">
      <input
        className="relative w-full
        rounded-full py-3 px-7.5 md:px-11 xl:px-15 text-xs3 leading-none
        focus:outline-none focus:ring-0 

        "
        type="text"
        placeholder="Search biopharma keywords, company, products or person..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <img
        className="absolute top-1/2 -translate-y-1/2  
        left-3 md:left-5 xl:left-7
        max-w-[12px] md:max-w-[14.5px] xl:max-w-[20px]
        "
        src={search_icon}
        alt="search icon"
      />
    </div>
  );
};

export default NormalSearchBar;
