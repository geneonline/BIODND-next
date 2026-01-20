// import { useEffect } from "react";
import useSWR from "swr";
import { fetcher_get } from "@/data/api";

const AutoComplete = ({ inputValue, setInputValue, type }) => {
  let url;
  switch (type) {
    case "Company_Name":
      url =
        `${import.meta.env.VITE_API_URL}/companies/autocomplete?Company_Name=` +
        inputValue.Company_Name;
      break;
    case "Company_Types":
      url =
        `${import.meta.env.VITE_API_URL}/companies/autocomplete?Company_Types=` +
        inputValue.Company_Types;
      break;
    case "search[main_therapeutic_sector]":
      url =
        `${import.meta.env.VITE_API_URL}/assets/autocomplete?main_therapeutic_sector=` +
        inputValue["search[main_therapeutic_sector]"];
      break;
    default:
      url = null;
  }

  const { data } = useSWR(url, fetcher_get);

  const clickHandler = (item) => {
    console.log(item);
    if (item) {
      setInputValue({ ...inputValue, [type]: item });
    }
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <div className="absolute z-70">
      <ul className=" ">
        {data &&
          data.map((item) => (
            <li
              key={item}
              onMouseDown={() => clickHandler(item)}
              className="p-1 text-xs3 bg-white hover:bg-bg-gray hover:cursor-default border-[0.5px] border-black"
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AutoComplete;
