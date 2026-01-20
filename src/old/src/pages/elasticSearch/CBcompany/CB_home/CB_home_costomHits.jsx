import { useState, useEffect, useRef } from "react";
import { useHits, usePagination } from "react-instantsearch";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

import AI_icon from "@/assets/svg/onboarding/AI.svg";
import Handshake_icon from "@/assets/svg/onboarding/Handshake.svg";
import News_icon from "@/assets/svg/onboarding/News.svg";
import Pill_icon from "@/assets/svg/onboarding/Pill.svg";
import Search_icon from "@/assets/svg/onboarding/Search.svg";

const CB_home_costomHits = (props) => {
  const { items } = useHits(props);
  const { currentRefinement } = usePagination(props);
  const hitsContainerRef = useRef(null);
  const [overlayPos, setOverlayPos] = useState({ top: 0, height: 0 });
  const [block, setBlock] = useState({ isblock: true, limit: 5 });
  const token = localStorage.getItem("token");
  const { userData } = useUser(token);

  //block
  useEffect(() => {
    if (userData) {
      //如果是 admin 或 會員 level 是 pro
      if (userData.subscriptionLevel === "Pro") {
        setBlock({ ...block, isblock: false });
      } else if (
        //如果 會員 level 是 pro or advance
        userData.subscriptionLevel === "Test"
      ) {
        //第一頁都可以看
        if (currentRefinement === 0) {
          setBlock({ ...block, isblock: false });
        } else {
          // 第二頁後都不能看
          setBlock({ isblock: true, limit: 0 });
        }
      } else {
        //其他會員 level (免費仔)
        // 第一頁可以看五筆資料
        if (currentRefinement === 0) {
          setBlock({ isblock: true, limit: 5 });
        } else {
          // 第二頁後都不能看
          setBlock({ isblock: true, limit: 0 });
        }
      }
    }
  }, [userData, currentRefinement]);

  useEffect(() => {
    const container = hitsContainerRef.current;
    if (!container) return;

    /**
     * 根據容器中的 <li> 計算第 x 個~最後一個的覆蓋層位置/高度
     */
    const computeOverlay = () => {
      const trElements = container.querySelectorAll("table tbody tr");
      if (!trElements || trElements.length === 0) return;

      // 若 block.limit 超過 trElements 的長度，就使用最後一個元素
      const targetIndex =
        block.limit < trElements.length ? block.limit : trElements.length - 1;
      const targetLiRect = trElements[targetIndex].getBoundingClientRect();
      const lastLiRect =
        trElements[trElements.length - 1].getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const overlayTop = targetLiRect.top - containerRect.top;
      const overlayHeight = lastLiRect.bottom - targetLiRect.top;

      setOverlayPos({
        top: overlayTop,
        height: overlayHeight,
      });
    };

    // 監聽 DOM 結構變化（例如 Hits 內容增刪），以便自動重算
    const mutationObserver = new MutationObserver(() => {
      computeOverlay();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    // 如果你也需要監聽尺寸變化 (例如 <li> 動態高度改變)，可以加上 ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      computeOverlay();
    });
    resizeObserver.observe(container);

    // 第一次進入就先計算一次
    computeOverlay();

    // 移除監聽
    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [items, currentRefinement]);

  return (
    <div className="relative">
      <table
        ref={hitsContainerRef}
        className=" w-full bg-white overflow-x-auto border border-search-home-bg border-collapse"
      >
        <thead>
          <tr className="bg-toggle-color border border-search-home-bg">
            <th className="text-white font-semibold leading-140 py-4.5 px-6 text-left whitespace-nowrap">
              Organization Name
            </th>
            <th className="text-white font-semibold leading-140 py-4.5 px-6 text-left whitespace-nowrap ">
              Number of Employees
            </th>
            <th className="text-white font-semibold leading-140 py-4.5 px-6 text-left whitespace-nowrap ">
              Last Funding Type
            </th>
            <th className="text-white font-semibold leading-140 py-4.5 px-6 text-left whitespace-nowrap ">
              Headquarters Location
            </th>
          </tr>
        </thead>

        <tbody ref={hitsContainerRef} className="relative">
          {items.map((hit) => (
            <tr key={hit["uuid"]} className="border border-search-home-bg">
              <td className="py-4.5 px-6">
                <Link
                  onClick={(e) =>
                    props.handleClickCompany(e, hit["name"], false, hit["uuid"])
                  }
                  to={`/company-page/${hit["uuid"]}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {hit["name"] || "-"}
                </Link>
              </td>
              <td className="py-4.5 px-6">{hit["num_employees"] || "-"}</td>
              <td className="py-4.5 px-6">
                {hit["funding_rounds"]?.last_funding_type?.replace(/_/g, " ") ||
                  "-"}
              </td>
              <td className="py-4.5 px-6">
                {hit["location"]
                  ?.map((loc) => loc.name) // 提取 name
                  .filter((value, index, self) => self.indexOf(value) === index) // 刪除重複值
                  .join(", ") || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* block */}
      {block.isblock && (
        <div
          className={`absolute w-full top-0 left-0 bg-[#EBF0F499] border border-black backdrop-blur`}
          style={{ height: overlayPos.height, top: overlayPos.top }}
        >
          <div className="pt-16 px-12 flex flex-col items-center">
            <div className="leading-160 text-center pb-5">
              <p className="font-medium text-base text-textColor-secondary">
                Want full access to your search results?
              </p>
              <p className="font-medium text-base text-textColor-secondary">
                Try BIODND Pro{" "}
                <span className="text-Neon-Purple">free for 14 days.</span> — No
                charges during trial!
              </p>
            </div>
            <Link
              to="/subscribe"
              className="mb-10 font-medium text-[18px] text-center rounded-10px py-3 px-5 bg-primary-default text-white hover:bg-primary-hovered transition-all shadow"
            >
              Try BIODND Pro Free
            </Link>

            {/* Features */}
            <div className="flex flex-col py-5 w-fit mx-0 lg:mx-auto">
              <div className="flex flex-row items-center gap-2">
                {/* Icon: Pill */}
                <img src={Pill_icon} alt="Pill icon" />
                <span className="text-textColor-Tertiary text-base leading-160">
                  Unlimited Access to Startups & Assets
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* Icon: Search */}
                <img src={Search_icon} alt="Search icon" />

                <span className="text-textColor-Tertiary text-base leading-160">
                  Full Search Results, No Limits
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* Icon: AI */}
                <img src={AI_icon} alt="AI icon" />
                <span className="text-textColor-Tertiary text-base leading-160">
                  Unlimited Use of Insights AI
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* Icon: Handshake */}
                <img src={Handshake_icon} alt="handshake icon" />
                <span className="text-textColor-Tertiary text-base leading-160">
                  Connect with Investors & Partners
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* Icon: News */}
                <img src={News_icon} alt="News icon" />
                <span className="text-textColor-Tertiary text-base leading-160">
                  Stay Ahead with Real-Time News
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CB_home_costomHits;
