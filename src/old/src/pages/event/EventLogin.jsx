import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventLoginForm from "./EventLoginForm";

const EventLogin = () => {
  const navigate = useNavigate();
  const [userType] = useState(null);

  // const handleUserTypeSelect = (type) => {
  //   setShowLoginForm(false);
  //   setTimeout(() => {
  //     setUserType(type);
  //     setShowLoginForm(true);
  //   }, 300);
  // };

  const handleLogin = () => {
    localStorage.setItem("user_type", userType);
    navigate(`/userprofile_setting`);
  };

  return (
    <div className="mt-15 xl:mt-19 w-full  flex justify-center">
      <div className="w-full max-w-[429px] mx-[10vw] flex-col pt-18 pb-26">
        <div>
          <EventLoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default EventLogin;
