import { useState } from "react";

const Ticket = ({ onCheckout }) => {
  const [eventCounts, setEventCounts] = useState([
    { id: 1, count: 0 },
    { id: 2, count: 0 },
  ]);

  const handleIncrement = (eventId) => {
    setEventCounts((prevCounts) =>
      prevCounts.map((event) => {
        if (event.id === eventId) {
          return { ...event, count: event.count + 1 };
        }
        return event;
      })
    );
  };

  const handleDecrement = (eventId) => {
    setEventCounts((prevCounts) =>
      prevCounts.map((event) => {
        if (event.id === eventId && event.count > 0) {
          return { ...event, count: event.count - 1 };
        }
        return event;
      })
    );
  };

  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <>
      <div className="h-[480px] md:h-[305px] lg:h-[305px] overflow-y-scroll px-11">
        <h2 className="text-xl font-medium my-6">Tickets</h2>
        <div className="h-24 border rounded-10px mb-5">
          <div className="flex h-9 items-center justify-between border-b px-4">
            <p className="text-xs3 font-medium">General Admission</p>
            <div className="flex items-center">
              <button
                className={`w-6 h-6 rounded-full flex justify-center items-center mr-2 text-white ${
                  eventCounts.find((event) => event.id === 1)?.count > 0
                    ? "bg-main-color"
                    : "bg-main-text-gray"
                }`}
                onClick={() => handleDecrement(1)}
              >
                -
              </button>
              <p className="text-xs3">
                {eventCounts.find((event) => event.id === 1)?.count || 0}
              </p>
              <button
                className="w-6 h-6 rounded-full flex justify-center items-center ml-2 bg-main-color text-white"
                onClick={() => handleIncrement(1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="text-xs3 px-4 mt-3">
            <span className="text-black">$237.00</span>{" "}
            <span className="text-main-text-gray">+$23.70 Tax</span>
          </div>
        </div>
        <div className="h-24 border rounded-10px mb-5">
          <div className="flex h-9 items-center justify-between border-b px-4">
            <p className="text-xs3 font-medium">Group Admission</p>
            <div className="flex items-center">
              <button
                className={`w-6 h-6 rounded-full flex justify-center items-center mr-2 text-white ${
                  eventCounts.find((event) => event.id === 2)?.count > 0
                    ? "bg-main-color"
                    : "bg-main-text-gray"
                }`}
                onClick={() => handleDecrement(2)}
              >
                -
              </button>
              <p className="text-xs3">
                {eventCounts.find((event) => event.id === 2)?.count || 0}
              </p>
              <button
                className="w-6 h-6 rounded-full flex justify-center items-center ml-2 bg-main-color text-white"
                onClick={() => handleIncrement(2)}
              >
                +
              </button>
            </div>
          </div>
          <div className="text-xs3 px-4 mt-3">
            <span className="text-black">$1237.00</span>{" "}
            <span className="text-main-text-gray">+$123.70 Tax</span>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">Promo Code</h2>
        <input
          className="w-full h-12 pl-6 py-2 text-base rounded-[30px] mb-7 bg-[#EAECF0] border-none"
          placeholder="Enter promo code"
        />

        <h2 className="text-xl font-medium mb-3">Total</h2>
        <p className="text-xs3 text-main-text-gray font-medium mb-2">
          *All Sales Final - No Refunds
        </p>
        <h3 className="text-right font-medium mb-7">$1360.70</h3>
      </div>
      <div className="border-t">
        <button
          className="text-base text-white font-medium bg-main-color py-3 px-6 float-right mr-6 mt-2 rounded-[30px]"
          onClick={handleCheckout}
        >
          Check out
        </button>
      </div>
    </>
  );
};

export default Ticket;
