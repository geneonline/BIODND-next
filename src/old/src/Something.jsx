import { useNavigate } from "react-router-dom";

const Something = () => {
  const navigate = useNavigate();
  const NavigateHandler = () => {
    navigate("/");
  };

  return (
    <div className="mt-19">
      <button onClick={NavigateHandler}>press me</button>
    </div>
  );
};

export default Something;
