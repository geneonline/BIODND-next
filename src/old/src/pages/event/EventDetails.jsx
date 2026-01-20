import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CompanyCard from "@/parts/event/CompanyCard";

import event_details_banner from "../../assets/webp/event/event_details_banner.webp";
import Confirmation from "@/parts/event/Confirmation";

const EventDetails = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  // const [showFloatingWindow, setShowFloatingWindow] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // const toggleTicketPage = () => {
  //   setShowFloatingWindow(!showFloatingWindow);
  // };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        axios
          .get(`${import.meta.env.VITE_API_URL}/events/${eventId}.json`, {
            withCredentials: true,
          })
          .then((res) => {
            setEvent(res.data);
          });
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      setCoverImg(event.event_images?.find((img) => img.section === "cover"));
    }
  }, [event]);

  const toggleConfirmedPage = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user_profiles/current.json`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("User profile:", res.data);
        if (res.data.id) {
          const userId = res.data.user_id;
          axios
            .post(
              `${import.meta.env.VITE_API_URL}/events/${eventId}/users/${userId}/create`,
              null,
              {
                withCredentials: true,
                headers: {
                  Accept: "application/json",
                },
              }
            )
            .then(() => {
              console.log("User added to event successfully.");
              setConfirmed(true);
            })
            .catch((err) => {
              if (err.response && err.response.status === 422) {
                console.log("User is already registered for this event.");
              } else {
                console.error("Failed to add user to event:", err);
              }
            });
        } else {
          navigate("/user/login");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
        navigate("/user/login");
      });
  };

  return (
    <div
      className={`mt-15 xl:mt-19 bg-white min-h-screen font-in ${
        currentLanguage === "en" ? "font-Inter" : "font-Noto"
      }`}
    >
      {event ? (
        <>
          <div className="w-full h-[280px] md:h-[550px] lg:h-[550px] overflow-hidden">
            <img
              src={coverImg?.url}
              alt="event banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="w-full mt-12">
            <h2 className="text-xl md:text-32px lg:text-5xl font-semibold md:font-normal lg:font-normal text-center mb-4 md:mb-8 lg:mb-8">
              {event.name}
            </h2>
            <p className="text-xs3 md:text-xl lg:text-xl font-light leading-[30px] w-5/6 md:w-11/12 lg:w-4/5 mx-auto mb-4 md:mb-8 lg:mb-8">
              {event.description}
            </p>
            {/* <button type="button" onClick={toggleTicketPage} className="text-base text-white font-medium tracking-wide bg-main-color block mx-auto w-5/6 md:w-5/12 lg:w-1/4 min-w-[200px] py-3 rounded-[30px]"> */}
            <button
              type="button"
              onClick={toggleConfirmedPage}
              className="text-base text-white font-medium tracking-wide bg-main-color hover:bg-black block mx-auto w-5/6 md:w-5/12 lg:w-1/4 min-w-[200px] py-3 rounded-[30px]"
            >
              Sign up for the event
            </button>
          </div>
          <div className="w-full mt-12">
            <h2 className="text-xl md:text-32px lg:text-5xl font-semibold md:font-normal lg:font-normal text-center mb-6 md:mb-12 lg:mb-12">
              Companies
            </h2>
          </div>
          <div className="w-11/12 lg:w-4/5 mx-auto mb-16 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2.5">
            {event.event_companies.map((company) => (
              <CompanyCard key={company.company_id} id={company.company_id} />
            ))}
          </div>
          <div className="w-full md:w-11/12 lg:w-4/5 mx-auto mb-16">
            <img
              src={event_details_banner}
              alt="event details banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* {showFloatingWindow && !confirmed && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <EventSignup onClose={toggleTicketPage} onConfirm={toggleConfirmedPage} />
            </div>
          )} */}
          {confirmed && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <Confirmation />
            </div>
          )}
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};

export default EventDetails;
