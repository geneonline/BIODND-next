import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "@/data/function";
import { useTranslation } from "react-i18next";
import DeleteNeed_popup from "@/widgets/needs/DeleteNeed_popup";
const MyNeedsItem = ({ need, isEditMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);
  return (
    <>
      <Link
        to={`/connect/${need.need_type}/${need.id}`}
        className={`w-full border-0.2px py-3 border-toggle-color bg-white rounded-10px flex flex-col `}
      >
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <p
              className={`mx-2.5 py-1.5 px-3 text-xs h-fit rounded-full ${
                need.need_type === "Demand"
                  ? "bg-main-green-10%"
                  : "bg-main-color-10%"
              }`}
            >
              {need.need_type}
            </p>
            <div className="flex flex-col">
              <p className="w-fit border-0.2px rounded-full px-3 py-1.5 mb-1.5 text-xs">
                {need.tag}
              </p>
              <p className="text-sm2 flex flex-wrap">
                {need.title}...
                <button className="pl-1 text-xs3 text-main-text-gray hover:text-main-color underline content-center">
                  {t("user.profile.needs_section.needs_item.view_detail")}
                </button>
              </p>
            </div>
          </div>
          <p className="pl-5 text-xs2 text-input-line self-top md:self-end mr-3">
            {formatDate(need.created_at)}
          </p>
        </div>
        {isEditMode && (
          <div className="flex justify-end space-x-1.5 pr-5">
            <button
              className="w-19 py-1.5 text-xs text-white bg-toggle-color hover:bg-main-color rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/user/editneeds/${need.id}`);
              }}
            >
              {t("user.profile.needs_section.needs_item.edit")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeletePopup(true);
              }}
              className="w-19 py-1.5 text-xs text-white bg-main-text-gray hover:bg-main-color rounded-full"
            >
              {t("user.profile.needs_section.needs_item.delete")}
            </button>
          </div>
        )}
      </Link>
      <DeleteNeed_popup
        popUp={deletePopup}
        setPopUp={setDeletePopup}
        id={need.id}
        contact_id={need.contact_id}
      />
    </>
  );
};
export default MyNeedsItem;
