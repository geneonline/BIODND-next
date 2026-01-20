import { useEffect } from "react";
import { useStats } from "react-instantsearch";

const CB_home_costomState = ({ setHitsLength }) => {
  const { nbHits } = useStats();
  useEffect(() => {
    if (nbHits) {
      setHitsLength(nbHits);
      console.log("nbHits", nbHits);
    }
  }, [nbHits, setHitsLength]);
  return <></>;
};
export default CB_home_costomState;
