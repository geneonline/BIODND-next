import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  return (
    <main className="mt-15 xl:mt-19 ">
      <div className="w-fit mx-auto">
        <div className="max-w-[487px] md:max-w-none md:w-[487px] mx-5.5 mt-36 xl:mt-40 mb-[152px] px-14 pt-14 pb-20 bg-message-bg rounded-10px flex flex-col items-center">
          <svg
            width={72}
            height={72}
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[72px] h-[72px] relative"
            preserveAspectRatio="none"
          >
            <path
              d="M30.729 48.942L18 36.21L22.242 31.968L30.729 40.452L47.697 23.481L51.942 27.726L30.729 48.936V48.942Z"
              fill="#07BBD3"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 36C3 17.775 17.775 3 36 3C54.225 3 69 17.775 69 36C69 54.225 54.225 69 36 69C17.775 69 3 54.225 3 36ZM36 63C32.4543 63 28.9433 62.3016 25.6675 60.9447C22.3918 59.5879 19.4153 57.5991 16.9081 55.0919C14.4009 52.5847 12.4121 49.6082 11.0553 46.3325C9.69838 43.0567 9 39.5457 9 36C9 32.4543 9.69838 28.9433 11.0553 25.6675C12.4121 22.3918 14.4009 19.4153 16.9081 16.9081C19.4153 14.4009 22.3918 12.4121 25.6675 11.0553C28.9433 9.69838 32.4543 9 36 9C43.1608 9 50.0284 11.8446 55.0919 16.9081C60.1554 21.9716 63 28.8392 63 36C63 43.1608 60.1554 50.0284 55.0919 55.0919C50.0284 60.1554 43.1608 63 36 63Z"
              fill="#07BBD3"
            />
          </svg>
          <h1 className="text-24px font-medium pt-7.5 text-center">
            {t("payment.success.title")}
          </h1>
          <p className="text-sm2 pt-3 text-center leading-snug">
            <Trans
              i18nKey="payment.success.message"
              components={{ br: <br /> }}
            />
          </p>
          <Link
            to={"/"}
            className="py-3 px-7 mt-9 rounded-full text-white bg-black hover:bg-main-color text-center"
          >
            {t("payment.success.button")}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
