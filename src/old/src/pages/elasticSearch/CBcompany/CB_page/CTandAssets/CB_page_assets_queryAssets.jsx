import { useEffect } from "react";
import { useSearchBox } from "react-instantsearch";

const CB_page_assets_queryAssets = ({ companyName }) => {
  const { refine } = useSearchBox();

  useEffect(() => {
    if (companyName) {
      const refinedQuery = companyName;
      console.log(refinedQuery);
      refine(refinedQuery);
    }
  }, [companyName, refine]);

  return null; // 因為這個元件不需要渲染任何內容
};

export default CB_page_assets_queryAssets;
