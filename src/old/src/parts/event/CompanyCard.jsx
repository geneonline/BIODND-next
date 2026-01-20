import download from "../../assets/svg/event/download.svg";
import { useCompanyProfile } from "@/data/api";
import { Link } from "react-router-dom";
import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";

const CompanyCard = ({ id }) => {
  // eslint-disable-next-line no-unused-vars
  const { companyProfileData, companyProfileLoading } = useCompanyProfile(id);

  return (
    <div className="w-full">
      <div className="pt-3 bg-sub-text-gray rounded-5px mb-2.5 min-h-[350px] transition duration-300 ease-in-out transform hover:shadow-xl">
        <div className="mx-3 mb-3 p-3  bg-white">
          <img
            src={
              companyProfileData?.uploaded_logo_url ||
              // item?.Company_Logo ||
              defaultCompanyImage
            }
            alt="event company banner"
            className="w-[60px] md:w-[120px] mx-auto"
          />
        </div>
        <div className="px-3 mb-3 flex justify-between items-center">
          <h3 className="text-xl">{companyProfileData?.Company_Name}</h3>
          <img src={download} alt="download" className="cursor-pointer" />
        </div>
        <p className="px-3 text-xs3 font-light">
          {companyProfileData?.Brief_Description}
        </p>
        <Link
          to={`/database/${id}`}
          className="p-3 text-base font-extralight cursor-pointer hover:underline decoration-2 decoration-main-color underline-offset-4"
        >
          Learn more
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {companyProfileData?.Company_Types &&
          companyProfileData.Company_Types.split("|")
            .slice(0, 5)
            .map((item) => (
              <div
                key={item}
                className="px-3 py-2.5 text-base font-extralight bg-sub-text-gray rounded-10px"
              >
                #{item}
              </div>
            ))}
        {/* <div className="px-3 py-2.5 text-base font-extralight bg-sub-text-gray rounded-10px">
          #Data Analytics
        </div>
        <div className="px-3 py-2.5 text-base font-extralight bg-sub-text-gray rounded-10px">
          #AI
        </div> */}
      </div>
    </div>
  );
};

export default CompanyCard;
