import right_arrow from "../../assets/svg/event/right_arrow.svg";

const EventCalendarItemMobile = ({ event, onClick }) => {
  const handleItemClick = () => {
    onClick(event.id);
  };

  const findCover = () =>
    event.event_images?.find((img) => img.section === "cover");

  return (
    <div
      className="mt-5 break-words cursor-pointer bg-white rounded-10px flex flex-col h-60"
      onClick={handleItemClick}
    >
      <div className="flex-none h-[100px]">
        <img
          src={findCover()?.url || null}
          alt="event calendar"
          className="object-cover h-full w-full rounded-t-10px"
        />
      </div>
      <div className="mx-3 overflow-y-hidden">
        <div className="flex items-center my-2.5">
          <p className="text-xs3 mr-2">
            {new Date(event.start_time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <img
            src={right_arrow}
            alt="right arrow"
            className="h-3 w-3 text-main-color"
          />
          <p className="text-xs3 ml-2">
            {new Date(event.end_time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <h3 className="text-base font-semibold tracking-wide mb-3">
          {event.name}
        </h3>
        <p className="text-xs3">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCalendarItemMobile;
