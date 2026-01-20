import { useState, useContext } from "react";
import search_icon from "@/assets/svg/homepage/search_icon.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SearchContext } from "@/data/context";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // eslint-disable-next-line no-unused-vars
  const [searchValue, setSearchValue] = useContext(SearchContext);

  function handleKeyDown(event) {
    if (event.key === "Enter" && event.target === document.activeElement) {
      setSearchValue(event.target.value);
      navigate("/company-home?" + "query=" + event.target.value);
    }
  }

  return (
    <div className="relative w-4/5 md:w-7/10 xl:w-3/5 xl:max-w-2xl">
      <input
        className="relative w-full
        rounded-full py-3 xl:py-4.5 px-7.5 md:px-11 xl:px-15 text-sm xl:text-base
        focus:outline-none focus:border-none focus:ring-0 focus:shadow-search-glow focus:py-3.5 focus:xl:py-5
        transition-all duration-100 ease 
        "
        type="text"
        placeholder={t("home.search_section.placeholder")}
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

export default Searchbar;
