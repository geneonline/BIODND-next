import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentFailed = () => {
  const { t } = useTranslation();
  return (
    <main className="mt-15 xl:mt-19 ">
      <div className="w-fit mx-auto">
        <div className="max-w-[540px] md:max-w-none md:w-[540px] mt-36 xl:mt-40 mb-[152px] mx-5.5 px-7 pt-14 pb-20 bg-message-bg rounded-10px flex flex-col items-center">
          <svg
            width={84}
            height={84}
            viewBox="0 0 84 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[84px] h-[84px] relative"
            preserveAspectRatio="none"
          >
            <path
              d="M42 6.5625C34.9911 6.5625 28.1397 8.64087 22.312 12.5348C16.4843 16.4287 11.9422 21.9633 9.26004 28.4387C6.57785 34.914 5.87607 42.0393 7.24344 48.9135C8.6108 55.7877 11.9859 62.1021 16.9419 67.0581C21.8979 72.0141 28.2123 75.3892 35.0865 76.7566C41.9607 78.1239 49.086 77.4222 55.5614 74.74C62.0367 72.0578 67.5713 67.5157 71.4652 61.688C75.3591 55.8604 77.4375 49.0089 77.4375 42C77.4271 32.6046 73.6902 23.597 67.0466 16.9534C60.403 10.3099 51.3954 6.57292 42 6.5625ZM42 69.5625C36.5487 69.5625 31.2197 67.946 26.6871 64.9174C22.1545 61.8888 18.6217 57.5841 16.5356 52.5477C14.4494 47.5113 13.9036 41.9694 14.9671 36.6228C16.0306 31.2762 18.6557 26.3651 22.5104 22.5104C26.3651 18.6557 31.2762 16.0306 36.6228 14.9671C41.9694 13.9036 47.5113 14.4494 52.5477 16.5356C57.5841 18.6217 61.8888 22.1545 64.9174 26.6871C67.946 31.2197 69.5625 36.5487 69.5625 42C69.5547 49.3076 66.6483 56.3137 61.481 61.481C56.3137 66.6483 49.3076 69.5547 42 69.5625ZM38.0625 43.3125V26.25C38.0625 25.2057 38.4774 24.2042 39.2158 23.4658C39.9542 22.7273 40.9557 22.3125 42 22.3125C43.0443 22.3125 44.0458 22.7273 44.7842 23.4658C45.5227 24.2042 45.9375 25.2057 45.9375 26.25V43.3125C45.9375 44.3568 45.5227 45.3583 44.7842 46.0967C44.0458 46.8352 43.0443 47.25 42 47.25C40.9557 47.25 39.9542 46.8352 39.2158 46.0967C38.4774 45.3583 38.0625 44.3568 38.0625 43.3125ZM47.25 56.4375C47.25 57.4759 46.9421 58.4909 46.3652 59.3542C45.7884 60.2176 44.9684 60.8905 44.0091 61.2879C43.0498 61.6852 41.9942 61.7892 40.9758 61.5866C39.9574 61.3841 39.0219 60.884 38.2877 60.1498C37.5535 59.4156 37.0535 58.4801 36.8509 57.4617C36.6483 56.4433 36.7523 55.3877 37.1496 54.4284C37.547 53.4691 38.2199 52.6492 39.0833 52.0723C39.9466 51.4954 40.9617 51.1875 42 51.1875C43.3924 51.1875 44.7278 51.7406 45.7123 52.7252C46.6969 53.7098 47.25 55.0451 47.25 56.4375Z"
              fill="#07BBD3"
            />
          </svg>
          <h1 className="text-24px font-medium pt-4.5">
            {t("payment.failed.title")}
          </h1>

          <div>
            <p className="text-sm2 pt-6 leading-snug">
              {t("payment.failed.message")}
            </p>
            <ul className="pl-7 text-sm2 pt-3 leading-snug list-disc">
              <li>{t("payment.failed.list.0")}</li>
              <li>{t("payment.failed.list.1")}</li>
              <li>{t("payment.failed.list.2")}</li>
              <li>{t("payment.failed.list.3")}</li>
              <li>{t("payment.failed.list.4")}</li>
            </ul>
            <br />
            <p className="text-sm2 pt-3 leading-snug">
              {t("payment.failed.message_2")}
            </p>
          </div>
          <Link
            to={"/subscribe"}
            className="py-3 px-7 mt-9 rounded-full text-white bg-black hover:bg-main-color text-center"
          >
            Return to Subscribe Page
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailed;
