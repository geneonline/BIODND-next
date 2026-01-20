import { useState } from "react";
import { Link } from "react-router-dom";

const Types_content = ({
  objs,
  split,
  link,
  params,
  searchKey,
  imgURL,
  haveImg = true,
  name,
  typeName,
  CanClick = true,
  maxObjsNum = 3,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  return (
    <>
      <div className="flex flex-wrap">
        {objs
          ? objs
              .split(split)
              .slice(0, maxObjsNum)
              .map((i, index) => (
                <Link
                  key={index}
                  className={`m-1 px-3 py-1.5 text-db-table-text bg-bg-gray  ${
                    CanClick
                      ? "pointer-events-auto hover:bg-db-Asearch"
                      : "pointer-events-none hover:bg-bg-gray"
                  } rounded-20px`}
                  to={params ? link({ ...params, [searchKey]: i }) : "#"}
                >
                  {i}
                </Link>
              ))
          : "N/A"}
      </div>
      <div>
        {objs && objs.split(split).length > maxObjsNum && (
          <button
            className="ml-3 py-1 font-semibold text-toggle-color hover:text-main-color-gb underline underline-offset-2"
            onClick={() => setShowFullContent(true)}
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
              } w-10 h-10 bg-white border border-img-border rounded-full mr-3.5 mt-9 flex justify-center items-center overflow-hidden`}
            >
              <img src={imgURL} alt="" />
            </div>

            {/* col 2 */}
            <div className="flex flex-col mt-12.5 mr-1.5 ">
              <h3 className=" text-base font-medium pb-8">{name}</h3>
              <h4 className="text-sm2 text-main-text-gray pb-5">{typeName}</h4>
              <div className="w-[400px] text-sm1 max-h-[80vh] flex flex-wrap overflow-auto">
                {objs
                  ? objs.split(split).map((i, index) => (
                      <Link
                        key={index}
                        className={`m-1 px-3 py-1.5 text-db-table-text bg-bg-gray ${
                          CanClick
                            ? "pointer-events-auto hover:bg-db-Asearch"
                            : "pointer-events-none hover:bg-bg-gray"
                        }
                        
                        rounded-20px`}
                        to={link({
                          ...params,
                          [searchKey]: i,
                        })}
                        onClick={() => setShowFullContent(false)}
                      >
                        {i}
                      </Link>
                    ))
                  : "N/A"}
              </div>
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

export default Types_content;
