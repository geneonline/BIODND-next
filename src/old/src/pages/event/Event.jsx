import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import event_banner from "../../assets/webp/event/event_banner.webp";
import EventCalendarItem from "@/parts/event/EventCalendarItem";
import EventCalendarItemMobile from "@/parts/event/EventCalendarItemMobile";
import PageHelmet from "@/widgets/PageHelmet";

import eventImg from "@/assets/thermo/thermo_event_banner.webp";
import right_arrow from "../../assets/svg/event/right_arrow.svg";

const Event = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/events.json`, {
        withCredentials: true,
      })
      .then((res) => {
        setEventList(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch list of events:", err);
      });
  }, []);

  const handleCalendarItemClick = (eventId) => {
    navigate(`/event/${eventId}/details`);
  };

  return (
    <div
      className={`bg-nav-bg min-h-screen font-in ${
        currentLanguage === "en" ? "font-Inter" : "font-Noto"
      }`}
    >
      <PageHelmet
        pageTitle={t("head.event.title")}
        pageDescription={t("head.event.description")}
      />
      <div
        className="w-full bg-cover relative h-[540px] lg:h-[800px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${event_banner})`,
        }}
      >
        <div className="absolute w-5/6 left-1/2 transform -translate-x-1/2 top-[170px] md:w-auto md:transform-none md:left-6 lg:top-[240px] lg:left-[76px] text-white">
          <h1 className="text-32px md:text-5xl lg:text-[5rem] font-extrabold leading-tight tracking-wide">
            <Trans
              i18nKey="event.event_page.title"
              components={{ br: <br /> }}
            />
          </h1>
          <p className="w-3/5 text-base lg:text-2xl mt-3 font-light leading-tight tracking-wide">
            {t("event.event_page.description")}
          </p>
          {/* <button type="button" className="tracking-wide bg-main-color py-5 rounded-[30px] absolute left-1/2 transform -translate-x-1/2 text-base w-44 mt-20 md:static md:left-none md:transform-none md:text-xl md:mt-12 lg:text-2xl lg:w-64">
            Register Now
          </button> */}
        </div>
      </div>
      <div className="w-full">{/* ad-banner */}</div>
      <div className="mx-4 md:mx-6 lg:mx-20 mt-12">
        <h2 className="font-bold text-xl md:font-medium lg:text-32px mb-9 lg:font-bold text-white tracking-wide">
          Events Calendar
        </h2>

        {/* Thermo Fisher Scientific Day */}

        {windowWidth < 768 ? (
          <Link
            to="/event/Thermo-Fisher-Scientific-Indonesia"
            className="mt-5 break-words cursor-pointer bg-white rounded-10px flex flex-col "
          >
            <div className="overflow-hidden aspect-400/209">
              <img
                src={eventImg}
                alt="event thermo"
                className="object-cover h-full w-full rounded-t-10px"
              />
            </div>
            <div className="mx-3 overflow-y-hidden h-fit pb-3">
              <div className="flex items-center my-2.5">
                <p className="text-xs3 mr-2">Apr 24,2024</p>
                <img
                  src={right_arrow}
                  alt="right arrow"
                  className="h-3 w-3 text-main-color"
                />
                <p className="text-xs3 ml-2">Apr 24,2024</p>
              </div>
              <h3 className=" text-base font-semibold tracking-wide mb-3">
                Thermo Fisher Scientific Day
              </h3>
              <p className="text-xs3">
                We warmly invite you to join us at the Thermo Fisher Scientific
                Day event. Discover how you can go a step beyond with our
                comprehensive solutions in key segments of healthcare,
                biotechnology and biopharma, applied science, clean energy, food
                and agriculture, and cell and gene therapy.
              </p>
            </div>
          </Link>
        ) : (
          <Link
            to="/event/Thermo-Fisher-Scientific-Indonesia"
            className="mt-5 overflow-hidden break-words cursor-pointer grid bg-white rounded-10px md:h-fit md:grid-cols-4 lg:h-fit lg:grid-cols-3 items-center"
          >
            <div className=" overflow-hidden aspect-400/209">
              <img
                src={eventImg}
                alt="event thermo"
                className=" w-full h-full object-cover"
              />
            </div>
            <div className=" ml-6 md:mr-4 md:col-span-2 lg:mr-0 lg:col-span-1">
              <h3 className="font-semibold tracking-wide md:text-base md:mt-5 lg:h-20 lg:text-32px lg:mt-9">
                Thermo Fisher Scientific Day
              </h3>
              <p className=" text-xs3 mb-6 md:mt-3.5 lg:h-[105px] lg:mt-6 xl:h-[60px] whitespace-normal">
                We warmly invite you to join us at the Thermo Fisher Scientific
                Day event. Discover how you can go a step beyond with our
                comprehensive solutions in key segments of healthcare,
                biotechnology and biopharma, applied science, clean energy, food
                and agriculture, and cell and gene therapy.
              </p>
            </div>
            <div className="my-auto flex justify-center">
              <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
                <h4 className="tracking-wide md:text-base lg:text-32px">Apr</h4>
                <h4 className="tracking-wide md:text-36px lg:text-64px">24</h4>
                <h4 className="tracking-wide md:text-base lg:text-32px">
                  2024
                </h4>
              </div>
              <div className="bg-[#969696] h-1 mx-1.5 my-auto md:w-4 lg:w-6"></div>
              <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
                <h4 className="tracking-wide md:text-base lg:text-32px">Apr</h4>
                <h4 className="tracking-wide md:text-36px lg:text-64px">24</h4>
                <h4 className="tracking-wide md:text-base lg:text-32px">
                  2024
                </h4>
              </div>
            </div>
          </Link>
        )}

        {/* Lab Indonesia */}

        {windowWidth < 768 ? (
          <Link
            to="/event/Thermo-Fisher-Lab-Indonesia"
            className="mt-5 break-words cursor-pointer bg-white rounded-10px flex flex-col "
          >
            <div className="overflow-hidden aspect-400/209">
              <img
                src={eventImg}
                alt="event thermo"
                className="object-cover h-full w-full rounded-t-10px"
              />
            </div>
            <div className="mx-3 overflow-y-hidden h-fit pb-3">
              <div className="flex items-center my-2.5">
                <p className="text-xs3 mr-2">Apr 24,2024</p>
                <img
                  src={right_arrow}
                  alt="right arrow"
                  className="h-3 w-3 text-main-color"
                />
                <p className="text-xs3 ml-2">Apr 26,2024</p>
              </div>
              <h3 className="text-base font-semibold tracking-wide mb-3">
                Lab Indonesia 2024
              </h3>
              <p className="text-xs3">
                We warmly invite you to join us at the Lab Indonesia 2024.
                Discover how you can go a step beyond with our comprehensive
                solutions in key segments of healthcare, biotechnology and
                biopharma, applied science, clean energy, food and agriculture,
                and cell and gene therapy.
              </p>
            </div>
          </Link>
        ) : (
          <Link
            to="/event/Thermo-Fisher-Lab-Indonesia"
            className="mt-5 overflow-hidden break-words cursor-pointer grid bg-white rounded-10px md:h-fit md:grid-cols-4 lg:h-fit lg:grid-cols-3 items-center"
          >
            <div className=" overflow-hidden aspect-400/209">
              <img
                src={eventImg}
                alt="event thermo"
                className=" w-full h-full object-cover"
              />
            </div>
            <div className=" ml-6 md:mr-4 md:col-span-2 lg:mr-0 lg:col-span-1">
              <h3 className="font-semibold tracking-wide md:text-base md:mt-5 lg:h-20 lg:text-32px lg:mt-9">
                Lab Indonesia 2024
              </h3>
              <p className=" text-xs3 mb-6 md:mt-3.5 lg:h-[105px] lg:mt-6 xl:h-[60px] whitespace-normal">
                We warmly invite you to join us at the Lab Indonesia 2024.
                Discover how you can go a step beyond with our comprehensive
                solutions in key segments of healthcare, biotechnology and
                biopharma, applied science, clean energy, food and agriculture,
                and cell and gene therapy.
              </p>
            </div>
            <div className="my-auto flex justify-center">
              <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
                <h4 className="tracking-wide md:text-base lg:text-32px">Apr</h4>
                <h4 className="tracking-wide md:text-36px lg:text-64px">24</h4>
                <h4 className="tracking-wide md:text-base lg:text-32px">
                  2024
                </h4>
              </div>
              <div className="bg-[#969696] h-1 mx-1.5 my-auto md:w-4 lg:w-6"></div>
              <div className="bg-main-color text-white rounded-10px py-5 flex flex-col items-center md:w-2/5 lg:w-1/3">
                <h4 className="tracking-wide md:text-base lg:text-32px">Apr</h4>
                <h4 className="tracking-wide md:text-36px lg:text-64px">26</h4>
                <h4 className="tracking-wide md:text-base lg:text-32px">
                  2024
                </h4>
              </div>
            </div>
          </Link>
        )}

        {/* other event */}

        {eventList.map((event, index) => (
          <div key={index} className="pb-14">
            {windowWidth < 768 ? (
              <EventCalendarItemMobile
                event={event}
                onClick={() => handleCalendarItemClick(event.id)}
              />
            ) : (
              <EventCalendarItem
                event={event}
                onClick={() => handleCalendarItemClick(event.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;
