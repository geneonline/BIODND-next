import { useState, useEffect, useContext } from "react";
import { messageInfoContext } from "@/data/context";
import { useSupplies } from "@/data/api";
import { Link, useParams } from "react-router-dom";
import { useCompanyProfile, useUser } from "@/data/api";
import { formatDate } from "@/data/function";
import { useTranslation } from "react-i18next";
import needsOptions_data from "@/data/database/companies/needsOptions.json";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import Loading from "@/widgets/Loading";

const SupplyPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [messageInfo, setMessageInfo] = useContext(messageInfoContext);
  const { id } = useParams();
  console.log(id);
  const { suppliesData, suppliesLoading } = useSupplies(id);
  const { userData } = useUser();
  const { companyProfileData } = useCompanyProfile(
    suppliesData ? suppliesData.company_id : ""
  );
  const [tag, setTag] = useState(suppliesData?.tag || "");
  const [payPopup, setPayPopup] = useState(false);

  const connectHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      userData?.subscription_level === "pro" ||
      userData?.subscription_level === "silver" ||
      userData?.subscription_level === "test" ||
      userData?.user_id === 1
    ) {
      setMessageInfo({
        ...messageInfo,
        messaging: {
          ...messageInfo.messaging,
        },
        isOpen: true,
        isShow: true,
        message: {
          company_id: companyProfileData.id,
          receiver_id: suppliesData.contact_id,
        },
      });
    } else {
      setPayPopup(true);
    }
  };

  //tag 中英文切換
  useEffect(() => {
    const found = needsOptions_data[currentLanguage].find(
      (option) => option[1] === suppliesData?.tag
    );
    if (found) setTag(found[0]);
  }, [currentLanguage, suppliesData]);
  return (
    <div className="pt-9 pl-16 w-7/10 mb-10">
      {suppliesLoading ? (
        <Loading height={"50vh"} />
      ) : (
        <div className="flex flex-col">
          <Link
            to={`/connect/supply`}
            className="flex items-center text-toggle-color hover:text-main-color text-sm1 fill-toggle-color hover:fill-main-color"
          >
            <div className="w-5 h-5 pr-1 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="11"
                preserveAspectRatio="none"
              >
                <path
                  fillRule="evenodd"
                  d="M.568 6.06a.792.792 0 010-1.12L5.046.462a.792.792 0 111.12 1.12L2.246 5.5l3.92 3.919a.792.792 0 01-1.12 1.12L.568 6.058z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            {t("connect.supply.back_button")}
          </Link>
          <p className="mt-7 w-fit border-0.2px rounded-full px-5 py-3 text-sm">
            {tag}
          </p>

          <div className="pr-3.5 flex justify-between">
            <h1 className="w-4/5 text-2xl font-medium mt-5 pr-2">
              {suppliesData.title}
            </h1>
            <button
              onClick={connectHandler}
              className="py-2.5 px-10 bg-black text-white hover:bg-main-color text-sm2 rounded-full"
            >
              {t("connect.supply.connect")}
            </button>
          </div>
          <p className="text-xs2 text-input-line mt-2">
            {t("connect.supply.post_on")} {formatDate(suppliesData.created_at)}{" "}
            {" | "}
            {t("connect.demand.valid_until")}{" "}
            {formatDate(suppliesData.expired_at)}
          </p>

          {/* company info part */}
          <div className="flex mt-2 py-4 border-y-0.3px border-y-toggle-color bg-com-profile-bg">
            <div className="ml-1 flex justify-between w-full">
              <div className="flex">
                <div className="w-11 h-11 bg-white border-0.3px border-main-text-gray rounded-full flex justify-center items-center overflow-hidden">
                  <img
                    src={
                      companyProfileData?.uploaded_logo_url ||
                      defaultCompanyImage
                    }
                    alt=""
                  />
                </div>
                <p className="text-sm2 pt-1.5 pl-2">
                  {companyProfileData?.Company_Name}
                </p>
              </div>
            </div>
          </div>

          <p className="min-h-[20vh] mt-7 ml-1 text-sm2 text-db-table-text">
            {suppliesData.description}
          </p>

          <div className="w-[458px] mt-24 p-6.5 bg-com-profile-bg border-toggle-color border-0.3px flex flex-col text-sm1 rounded-10px">
            <table>
              <tbody>
                <tr>
                  <td className="text-toggle-color pb-2 w-24">
                    {t("connect.supply.compant_info.name")}
                  </td>
                  <td className="text-db-table-text pb-2">
                    {companyProfileData?.Company_Name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="text-toggle-color pb-2">
                    {t("connect.demand.compant_info.department")}
                  </td>
                  <td className="text-db-table-text pb-2">
                    {suppliesData?.department || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="text-toggle-color pb-2">
                    {t("connect.demand.compant_info.budget")}
                  </td>
                  <td className="text-db-table-text pb-2">
                    {suppliesData?.budget || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="text-toggle-color pb-2">
                    {t("connect.demand.valid_until")}
                  </td>
                  <td className="text-db-table-text pb-2">
                    {formatDate(suppliesData.expired_at) || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <NeedToPay_popup popUp={payPopup} setPopUp={setPayPopup} />
        </div>
      )}
    </div>
  );
};
export default SupplyPage;
