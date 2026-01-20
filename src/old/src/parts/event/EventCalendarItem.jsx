const EventCalendarItem = ({ event, onClick }) => {
  const handleItemClick = () => {
    onClick(event.id);
  };

  const findCover = () =>
    event.event_images?.find((img) => img.section === "cover");

  return (
    <div
      className="mt-5 break-words cursor-pointer grid bg-white rounded-10px md:h-[200px] md:grid-cols-4 lg:h-64 lg:grid-cols-3"
      onClick={handleItemClick}
    >
      <div className="w-full h-full object-cover rounded-l-10px overflow-hidden">
        <img
          src={findCover()?.url || null}
          alt="event calendar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className=" ml-6 md:mr-4 md:col-span-2 lg:mr-0 lg:col-span-1">
        <h3 className="font-semibold tracking-wide md:text-base md:mt-5 lg:text-32px lg:mt-9">
          {event.name}
        </h3>
        <p className=" text-xs3 mb-6 md:mt-3.5 lg:mt-6 whitespace-normal">
          {event.description}
        </p>
      </div>
      <div className="my-auto flex justify-center">
        <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
          <h4 className="tracking-wide md:text-base lg:text-32px">
            {new Date(event.start_time).toLocaleString("en-US", {
              month: "short",
            })}
          </h4>
          <h4 className="tracking-wide md:text-36px lg:text-64px">
            {new Date(event.start_time).getDate()}
          </h4>
          <h4 className="tracking-wide md:text-base lg:text-32px">
            {new Date(event.start_time).getFullYear()}
          </h4>
        </div>
        <div className="bg-[#969696] h-1 mx-1.5 my-auto md:w-4 lg:w-6"></div>
        <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
          <h4 className="tracking-wide md:text-base lg:text-32px">
            {new Date(event.end_time).toLocaleString("en-US", {
              month: "short",
            })}
          </h4>
          <h4 className="tracking-wide md:text-36px lg:text-64px">
            {new Date(event.end_time).getDate()}
          </h4>
          <h4 className="tracking-wide md:text-base lg:text-32px">
            {new Date(event.end_time).getFullYear()}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default EventCalendarItem;
