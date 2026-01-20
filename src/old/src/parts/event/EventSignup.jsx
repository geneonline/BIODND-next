import { useState } from "react";
import event_banner from "../../assets/webp/event/event_calendar.webp";
import Ticket from "./Ticket";
import Payment from "./Payment";

const EventSignup = ({ onClose, onConfirm }) => {
  const pages = ["ticket", "payment"];
  const [currentPage, setCurrentPage] = useState("ticket");

  const renderSignupPage = () => {
    switch (currentPage) {
      case "ticket":
        return <Ticket onCheckout={handleCheckout} />;
      case "payment":
        return <Payment onConfirm={onConfirm} />;
      default:
        return null;
    }
  };

  const handleCheckout = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  return (
    <div className="block relative bg-white rounded-5px shadow-lg w-[330px] h-[600px] md:w-[630px] md:h-[425px] md:grid md:grid-cols-5 lg:w-[700px] lg:h-[425px] lg:grid lg:grid-cols-5">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 lg:top-4 lg:right-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 lg:h-6 lg:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="md:col-span-3 lg:col-span-3">
        <div className="flex justify-around items-center border-b h-[60px]">
          <div className="relative">
            <div className="absolute left-[-12px] top-[50%] transform -translate-y-1/2 bg-main-color w-3 h-3 rounded-full"></div>
            <div className="text-main-color text-xs3 font-semibold ml-2">
              Ticket
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[-12px] top-[50%] transform -translate-y-1/2 bg-[#69747F] w-3 h-3 rounded-full"></div>
            <div className="text-[#69747F] text-xs3 font-medium ml-2">
              Payment
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[-12px] top-[50%] transform -translate-y-1/2 bg-[#69747F] w-3 h-3 rounded-full"></div>
            <div className="text-[#69747F] text-xs3 font-medium ml-2">
              Confirmation
            </div>
          </div>
        </div>
        {renderSignupPage()}
      </div>
      <div className="hidden md:block md:col-span-2 lg:col-span-2 w-full overflow-hidden rounded-r-5px">
        <img
          src={event_banner}
          alt="event banner"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default EventSignup;
