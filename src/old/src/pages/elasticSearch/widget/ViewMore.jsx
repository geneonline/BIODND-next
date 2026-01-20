import { useState } from "react";
import { Link } from "react-router-dom"; // 引入 Link

// 新增一個解析函數，用於將 URL 轉換為 <a> 或 <Link> 元素
const parseContent = (text, useLink, linkColor) => {
  // 確保 text 是字串
  if (typeof text !== "string") {
    console.warn("parseContent expected a string but received:", typeof text);
    text = text !== null && text !== undefined ? String(text) : "";
  }

  if (useLink) {
    // 如果 useLink 為 true，直接將整個 content 替換為 <Link>
    return (
      <Link
        to={`/database/search?query=${text}`}
        className={`${linkColor} underline`}
      >
        {text}
      </Link>
    );
  }

  // 正則表達式匹配 URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // 分割文字並保留分隔符
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // 使用不帶 /g 的正則來測試單個部分是否為 URL
    if (/^(https?:\/\/[^\s]+)$/.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-main-color-gb underline"
        >
          {part}
        </a>
      );
    } else {
      // 否則，返回純文字
      return part;
    }
  });
};

const ViewMore = ({
  content,
  maxCharacters,
  labelName,
  useLink = false,
  linkColor = "text-main-color-gb",
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  // 確保 content 是字串
  const safeContent =
    typeof content === "string"
      ? content
      : content !== null && content !== undefined
      ? String(content)
      : "";

  const isContentLong = safeContent.length > maxCharacters;
  const truncatedContent = isContentLong
    ? safeContent.substring(0, maxCharacters) + "..."
    : safeContent;

  return (
    <>
      <span>
        {isContentLong
          ? parseContent(truncatedContent, useLink, linkColor)
          : parseContent(safeContent, useLink, linkColor)}
        {isContentLong && (
          <button
            className="mt-2 font-semibold text-black hover:text-main-color-gb underline underline-offset-2"
            onClick={(e) => {
              e.preventDefault();
              setShowFullContent(true);
            }}
          >
            View More
          </button>
        )}
      </span>

      {/* Modal for full content */}
      {showFullContent && (
        <div
          className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50 flex justify-center items-center"
          onClick={() => setShowFullContent(false)}
        >
          <div
            className="mx-40 max-h-[80vh] max-w-[1124px] bg-white rounded-10px pt-10 px-16 pb-11 relative overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content */}
            <div className="flex flex-col">
              <div className="flex items-center mb-3">
                <div className="bg-main-color-gb w-[5px] h-7.5 mr-3"></div>
                <h3 className="text-30px font-semibold leading-140 text-main-color-gb ">
                  {labelName}
                </h3>
              </div>
              <div className="mb-5 w-full border-b border-[rgba(0,0,0,0.25)]"></div>
              <p className="text-xl text-main-text-gray leading-140 break-words">
                {parseContent(safeContent, useLink)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewMore;
