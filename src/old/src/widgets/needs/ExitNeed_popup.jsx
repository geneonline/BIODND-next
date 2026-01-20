import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ExitNeed_popup = ({ popUp, setPopUp }) => {
  const { t } = useTranslation();

  return (
    <div>
      {popUp && (
        <div
          className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50"
          onClick={() => setPopUp(false)}
        >
          <div
            className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pl-10 pr-6.5 pb-14 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* content */}
            <div className="flex flex-col mt-12.5 mr-1.5 items-center">
              <h3 className=" text-xl font-medium mt-4.5 mb-1.5">
                {t("user.needs_profile.popup.edit.title")}
              </h3>
              <p className="w-[400px] text-base overflow-auto max-h-[80vh] leading-normal break-words text-center">
                {t("user.needs_profile.popup.edit.content")}
              </p>

              <div className="flex space-x-3 pt-8">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPopUp(false);
                  }}
                  className="w-40 bg-toggle-color text-white hover:bg-main-color rounded-full text-center py-3"
                >
                  {t("user.needs_profile.popup.edit.keep_editing")}
                </button>
                <Link
                  to="/user/profile"
                  className="w-40  bg-db-search text-white hover:bg-main-color rounded-full text-center py-3"
                >
                  {t("user.needs_profile.popup.edit.confirm")}
                </Link>
              </div>
            </div>

            {/* X button */}
            <div className="w-5">
              <button
                className=" mt-6 mr-8 z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
                onClick={() => setPopUp(false)}
              >
                <div
                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full rotate-45 translate-y-1 bg-db-Asearch`}
                ></div>
                <div
                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full -rotate-45  -translate-y-[4px] bg-db-Asearch`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitNeed_popup;
