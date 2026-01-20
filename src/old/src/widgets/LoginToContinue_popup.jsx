import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginToContinue_popup = () => {
  const { t } = useTranslation();
  const [popOut, setPopOut] = useState(true);
  return (
    <div>
      {popOut && (
        <div
          className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50"
          onClick={() => setPopOut(false)}
        >
          <div
            className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pl-10 pr-6.5 pb-14 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* col 2 */}
            <div className="flex flex-col mt-12.5 mr-1.5 items-center">
              <svg
                width={73}
                height={73}
                viewBox="0 0 73 73"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: 73, height: 73, position: "relative" }}
                preserveAspectRatio="none"
              >
                <path
                  d="M36.5 63.875V57.7917H57.7917V15.2083H36.5V9.125H57.7917C59.4646 9.125 60.8972 9.72117 62.0895 10.9135C63.2819 12.1058 63.877 13.5374 63.875 15.2083V57.7917C63.875 59.4646 63.2799 60.8972 62.0895 62.0895C60.8992 63.2819 59.4666 63.877 57.7917 63.875H36.5ZM30.4167 51.7083L26.2344 47.2979L33.9906 39.5417H9.125V33.4583H33.9906L26.2344 25.7021L30.4167 21.2917L45.625 36.5L30.4167 51.7083Z"
                  fill="#07BBD3"
                />
              </svg>
              <h3 className=" text-xl font-medium mt-4.5">
                {t("login.popup.title")}
              </h3>
              <p className="w-[400px] text-base overflow-auto max-h-[80vh] leading-normal break-words text-center">
                {t("login.popup.description")}
              </p>

              <div className="flex space-x-3 pt-8">
                <Link
                  to="/user/login"
                  className="w-40 bg-db-search text-white hover:bg-main-color rounded-full text-center py-3"
                >
                  {t("login.popup.button.login")}
                </Link>
                <Link
                  to="/user/signup"
                  className="w-40 bg-toggle-color text-white hover:bg-main-color rounded-full text-center py-3"
                >
                  {t("login.popup.button.signup")}
                </Link>
              </div>
            </div>

            {/* col 3 */}
            <div className="w-5">
              <button
                className=" mt-6 mr-8 z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
                onClick={() => setPopOut(false)}
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

export default LoginToContinue_popup;
