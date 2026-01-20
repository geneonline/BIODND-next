import { useState } from "react";

const Description_content = ({
  content,
  maxCharacters,
  imgURL,
  haveImg = true,
  companyName,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const truncatedContent = content.substring(0, maxCharacters) + "...";

  return (
    <>
      <div className={`w-[240px] break-words`}>
        {content.length > maxCharacters ? truncatedContent : content}
        {content.length > maxCharacters && (
          <button
            className="font-semibold text-toggle-color hover:text-main-color-gb underline underline-offset-2"
            onClick={(e) => {
              e.preventDefault();
              setShowFullContent(true);
            }}
          >
            View More
          </button>
        )}
      </div>

      {/* show full description */}
      {showFullContent && (
        <div
          className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50"
          onClick={() => setShowFullContent(false)}
        >
          <div
            className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px pl-10 pr-6.5 pb-14 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* col 1 */}
            <div
              className={`${
                haveImg ? "block" : "hidden"
              } w-10 h-10 bg-white border border-bd-gray rounded-full mr-3.5 mt-9 flex justify-center items-center overflow-hidden`}
            >
              <img src={imgURL} alt="" />
            </div>

            {/* col 2 */}
            <div className="flex flex-col mt-12.5 mr-1.5 ">
              <h3 className=" text-base font-medium pb-3.5">{companyName}</h3>
              <p className="w-[400px] text-sm1 overflow-auto max-h-[80vh] leading-normal break-words">
                {content}
              </p>
            </div>

            {/* col 3 */}
            <div className="w-5">
              <button
                className=" mt-6 mr-8 z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
                onClick={() => setShowFullContent(false)}
              >
                <div
                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full rotate-45 translate-y-1 bg-db-grid-text`}
                ></div>
                <div
                  className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full -rotate-45  -translate-y-[4px] bg-db-grid-text`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Description_content;
