import { useState } from "react";
import indicesNaming from "@/data/database/elastic/indices_naming.json";
import downArrowbtn_icon from "@/assets/svg/database/downArrowbtn.svg";
import ViewMore from "@/pages/elasticSearch/widget/ViewMore";

const CB_page_assets_hitView = ({ hit }) => {
  const displayFields = indicesNaming.find(
    (indice) => indice.key === "biodnd_assets"
  )?.displayFields;
  const headerField = "product_name";
  const [isHitOpen, setIsHitOpen] = useState(false);

  // 定義需要特殊渲染的標籤
  const specialRenderLabels = ["main_therapeutic_sector"];

  // 顯示前 6 項的字段，展開後顯示全部
  const visibleFields = isHitOpen ? displayFields : displayFields.slice(0, 6);

  return (
    <div className="w-full mb-3 border border-search-border overflow-hidden">
      {/* Header */}
      <div className="py-4 px-7 bg-sub-color text-white flex justify-between">
        <p className="text-xl font-semibold pr-10">{hit[headerField]}</p>
        <button
          className="flex-shrink-0"
          onClick={() => setIsHitOpen(!isHitOpen)}
        >
          <img
            className={`${
              isHitOpen ? "rotate-0" : "rotate-180"
            } transition-transform duration-200`}
            src={downArrowbtn_icon}
            alt="Toggle Details"
          />
        </button>
      </div>

      {/* Details */}
      <div className="w-full flex flex-wrap pt-5 px-7 pb-8 bg-white space-y-5">
        <div className="w-full grid grid-cols-3 gap-x-20">
          {visibleFields.map(({ label, field }) => {
            // 檢查當前標籤是否需要特殊渲染
            const isSpecialLabel = specialRenderLabels.includes(label);

            // 取得字段的值
            const fieldValue = hit[field];

            // 定義要將內容替換成 <Link/> 的標籤
            const useLinkLabels = ["company_name"];

            return (
              <div className="flex flex-col mb-5" key={field}>
                <p className="font-medium text-toggle-color pb-1">{label}</p>
                <div className="flex flex-wrap gap-1">
                  {isSpecialLabel
                    ? fieldValue
                      ? fieldValue
                          .split("|")
                          .slice(0, 5)
                          .map((item, index) => (
                            <p
                              key={index}
                              className="w-fit py-1 px-3 border border-sub-color text-sub-color font-semibold leading-140 rounded-[16px]"
                            >
                              {item}
                            </p>
                          ))
                      : "-"
                    : (
                        <div
                          className={`font-semibold text-sub-color overflow-hidden ${
                            isHitOpen
                              ? "whitespace-normal break-words"
                              : "whitespace-nowrap text-ellipsis"
                          }`}
                        >
                          <ViewMore
                            content={fieldValue || "-"}
                            maxCharacters={300}
                            labelName={label}
                            useLink={useLinkLabels.some(
                              (item) => item === label
                            )}
                            linkColor={"text-sub-color"}
                          />
                        </div>
                      ) || "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CB_page_assets_hitView;
