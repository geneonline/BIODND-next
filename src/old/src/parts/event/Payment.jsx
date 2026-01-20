const Payment = ({ onConfirm }) => {
  return (
    <>
      <div className="h-[480px] md:h-[305px] lg:h-[305px] overflow-y-scroll px-11">
        <h2 className="text-xl font-medium mt-6 mb-3.5">Billing Information</h2>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-2 gap-y-4 mb-5">
          <input
            className="col-span-2 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Address"
            required
          />
          <input
            className="col-span-1 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="State"
            required
          />
          <input
            className="col-span-1 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Postal code"
            required
          />
          <input
            className="col-span-2 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Contact number"
            required
          />
        </div>
        <h2 className="text-xl font-medium mb-3.5">Payment Information</h2>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-2 gap-y-4 mb-7">
          <input
            className="col-span-2 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Full Name"
            required
          />
          <input
            className="col-span-2 h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Card Number"
            required
          />
          <input
            className="h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="Expiration Date"
            required
          />
          <input
            className="h-12 border border-main-text-gray rounded-10px text-xs3"
            placeholder="CVV"
            required
          />
        </div>
      </div>
      <div className="border-t">
        <button
          className="text-base text-white font-medium bg-main-color py-3 px-6 float-right mr-6 mt-2 rounded-[30px]"
          onClick={onConfirm}
        >
          Check out
        </button>
      </div>
    </>
  );
};

export default Payment;
