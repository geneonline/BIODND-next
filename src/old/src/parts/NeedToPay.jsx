import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NeedToPay = () => {
  const { t } = useTranslation();
  return (
    <div className="relative left-0 top-0 w-full h-screen bg-sub-text-gray z-20">
      <div
        className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pl-10 pr-6.5 pb-14 flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* col 2 */}
        <div className="flex flex-col mt-12.5 mr-1.5 items-center">
          <svg
            width={67}
            height={67}
            viewBox="0 0 67 67"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 67, height: 67, position: "relative" }}
            preserveAspectRatio="none"
          >
            <path
              d="M16.7474 61.417C15.212 61.417 13.898 60.8708 12.8056 59.7783C11.7131 58.6858 11.1659 57.3709 11.1641 55.8337V27.917C11.1641 26.3816 11.7112 25.0676 12.8056 23.9752C13.8999 22.8827 15.2138 22.3355 16.7474 22.3337H19.5391V16.7503C19.5391 12.8885 20.9005 9.59715 23.6233 6.8762C26.3461 4.15526 29.6375 2.79386 33.4974 2.79199C37.3573 2.79013 40.6496 4.15154 43.3743 6.8762C46.099 9.60087 47.4595 12.8922 47.4557 16.7503V22.3337H50.2474C51.7828 22.3337 53.0977 22.8808 54.192 23.9752C55.2864 25.0695 55.8326 26.3834 55.8307 27.917V55.8337C55.8307 57.3691 55.2845 58.6839 54.192 59.7783C53.0995 60.8726 51.7847 61.4188 50.2474 61.417H16.7474ZM33.4974 47.4587C35.0328 47.4587 36.3477 46.9124 37.442 45.82C38.5364 44.7275 39.0826 43.4126 39.0807 41.8753C39.0789 40.338 38.5326 39.0241 37.442 37.9335C36.3514 36.8429 35.0365 36.2957 33.4974 36.292C31.9583 36.2883 30.6443 36.8354 29.5556 37.9335C28.4668 39.0315 27.9196 40.3455 27.9141 41.8753C27.9085 43.4052 28.4556 44.72 29.5556 45.82C30.6555 46.9199 31.9694 47.4661 33.4974 47.4587ZM25.1224 22.3337H41.8724V16.7503C41.8724 14.4239 41.0582 12.4465 39.4297 10.818C37.8012 9.18956 35.8238 8.37533 33.4974 8.37533C31.171 8.37533 29.1936 9.18956 27.5651 10.818C25.9366 12.4465 25.1224 14.4239 25.1224 16.7503V22.3337Z"
              fill="#07BBD3"
            />
          </svg>
          <h3 className=" text-base font-medium mt-4.5 mb-1.5">
            {t("payment.popup.title")}
          </h3>
          <p className="w-[400px] text-sm1 overflow-auto max-h-[80vh] leading-normal break-words text-center">
            {t("payment.popup.description")}
          </p>

          <div className="flex space-x-3 pt-8">
            <Link
              to="/subscribe"
              className="w-50 bg-db-search text-white hover:bg-main-color rounded-full text-center py-3"
            >
              {t("payment.popup.button.subscribe_now")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedToPay;
