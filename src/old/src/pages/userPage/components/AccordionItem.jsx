import React, { useState, useRef, useEffect } from "react";
import toggle_arrow_img from "@/assets/svg/homepage/toggle_arrow.svg";

const AccordionItem = ({ question, answer, ul }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  // 當 open 變化時，更新 maxHeight
  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div className="w-full pb-5 border-b border-primary-color-gray">
      {/* 按鈕區塊 */}
      <button
        onClick={() => setOpen(!open)}
        className="self-stretch flex justify-between items-center w-full"
      >
        <div className="text-left pr-4 md:pr-28 text-xl font-semibold  leading-140">
          {question}
        </div>

        <div className="relative w-6 h-6 flex flex-shrink-0 items-center justify-center ">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[16.5px] h-[2px] bg-black rounded-full" />
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 w-[16.5px] h-[2px] bg-black transition-all rounded-full ${
              open ? "rotate-0" : "rotate-90"
            } `}
          />
        </div>
      </button>

      {/* 內容區塊：透過 inline style 動態控制 max-height，並加上 overflow-hidden & transition */}
      <div
        className=" overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        <div
          ref={contentRef}
          className="pt-4 self-stretch pr-12 md:pr-30 lg:pr-32 xl:pr-72 inline-flex justify-start items-center"
        >
          <div className="flex-1 max-w-[926px] text-textColor-secondary leading-160">
            {Array.isArray(answer)
              ? answer.map((block, i) => React.cloneElement(block, { key: i }))
              : answer}
            {ul && (
              <ul className="list-disc pl-5">
                {ul.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
