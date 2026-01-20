import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateCompanyToCountinue = () => {
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
            xmlns="http://www.w3.org/2000/svg"
            width="58"
            height="53"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#07BBD3"
              d="M46.4 35.333h-5.8v5.89h5.8m0-17.667h-5.8v5.888h5.8m5.8 17.667H29v-5.889h5.8v-5.889H29v-5.889h5.8v-5.888H29v-5.89h23.2m-29-5.888h-5.8v-5.89h5.8m0 17.668h-5.8v-5.89h5.8m0 17.667h-5.8v-5.889h5.8m0 17.667h-5.8v-5.889h5.8M11.6 11.778H5.8v-5.89h5.8m0 17.668H5.8v-5.89h5.8m0 17.667H5.8v-5.889h5.8m0 17.667H5.8v-5.889h5.8M29 11.778V0H0v53h58V11.778H29z"
            ></path>
          </svg>
          <h3 className=" text-base font-medium mt-4.5">
            {t("user.no_data.no_company.title")}
          </h3>
          <p className="w-[400px] mt-2 text-sm1 overflow-auto max-h-[80vh] leading-normal break-words text-center">
            {t("user.no_data.no_company.description")}
          </p>

          <div className="flex space-x-3 pt-8">
            <Link
              to="/user/companyprofile"
              className="w-40 bg-db-search text-white hover:bg-main-color rounded-full text-center py-3"
            >
              {t("user.no_data.no_company.button")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCompanyToCountinue;
