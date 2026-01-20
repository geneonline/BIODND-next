import { useState, useEffect, useContext } from "react";
import { messageInfoContext } from "@/data/context";
import { Link } from "react-router-dom";
import sheild_icon from "@/assets/svg/connect/shield-check.svg";
import { useCompanyProfile } from "@/data/api";
import { formatDate } from "@/data/function";
import needsOptions_data from "@/data/database/companies/needsOptions.json";
import { useTranslation } from "react-i18next";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";

import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import viewImage from "@/assets/svg/needs/view.svg";
const DemendItem = ({ demand, userData }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [tag, setTag] = useState(demand.tag);
  const [messageInfo, setMessageInfo] = useContext(messageInfoContext);
  const [payPopup, setPayPopup] = useState(false);
  const { companyProfileData } = useCompanyProfile(demand.company_id);

  useEffect(() => {
    const found = needsOptions_data[currentLanguage].find(
      (option) => option[1] === demand.tag
    );
    if (found) setTag(found[0]);
  }, [currentLanguage, demand]);

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
          company_id: demand.company_id,
          receiver_id: demand.contact_id,
        },
      });
    } else {
      setPayPopup(true);
    }
  };

  return (
    <>
      <Link
        to={`${demand.id}`}
        className="w-89 mr-5 mb-7 flex flex-col border-0.3px rounded-10px"
      >
        <div className="bg-main-color-5% rounded-t-10px py-2.5 pl-3 pr-4 flex justify-between">
          <p className="border-0.2px rounded-full px-3 py-1.5 text-xs">{tag}</p>
          <img src={sheild_icon} alt="check" />
        </div>
        <div className="flex flex-col p-5">
          <p className="text-sm2 h-24 pb-6">{demand.title}</p>
          <div className="flex justify-between">
            <p className="text-xs2 text-input-line">
              {t("connect.demand.post_on")} {formatDate(demand.created_at)}
            </p>
            <div className="flex justify-end items-end">
              <img src={viewImage} alt="view" />
              <p className="pl-1 text-xs2 text-input-line">
                {demand.read_count.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </div>

        {/* company info part */}
        <div className="flex mx-4 mt-1 py-4 border-t-0.3px border-t-main-text-gray ">
          <div className="flex justify-between w-full">
            <div className="flex">
              <div className="w-11 h-11 bg-white border-0.3px border-main-text-gray rounded-full flex justify-center items-center overflow-hidden">
                <img
                  src={
                    companyProfileData?.uploaded_logo_url || defaultCompanyImage
                  }
                  alt=""
                />
              </div>
              <p className="text-sm2 pt-1.5 pl-2">
                {companyProfileData?.Company_Name}
              </p>
            </div>
            <button
              onClick={connectHandler}
              className="py-2 px-4 bg-black text-white hover:bg-main-color text-sm rounded-full"
            >
              {t("connect.demand.connect")}
            </button>
          </div>
        </div>
      </Link>
      <NeedToPay_popup popUp={payPopup} setPopUp={setPayPopup} />
    </>
  );
};

export default DemendItem;
