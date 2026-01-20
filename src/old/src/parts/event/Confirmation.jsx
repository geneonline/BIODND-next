import { useNavigate } from "react-router-dom";
import event_banner from "../../assets/webp/event/event_calendar.webp";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-5px shadow-lg w-[330px] h-[450px] md:w-[630px] md:h-[425px] lg:w-[700px] lg:h-[425px]">
      <div className="w-full h-full overflow-hidden flex flex-col items-center">
        <img
          src={event_banner}
          alt="event banner"
          className="w-full h-1/2 object-cover object-center rounded-t-5px mb-4"
        />
        <div className="w-7/12 mx-auto text-center">
          <h2 className="text-xl md:text-30px lg:text-30px font-medium mb-4">
            Congratulations!{" "}
          </h2>
          <p className="text-base text-main-text-gray mb-3">
            You are all set. <br /> You will receive an email including an
            electronic receipt and confirmation in a moment.
          </p>
        </div>
        <button
          className="text-base text-white font-medium bg-main-color py-3 px-6 rounded-[30px]"
          onClick={() => navigate("/user/profile")}
        >
          Visit Ticket
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
