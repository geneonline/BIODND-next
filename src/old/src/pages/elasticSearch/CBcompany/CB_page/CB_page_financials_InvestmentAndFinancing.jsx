import default_company_icon from "@/assets/webp/search/default_company_icon.webp";
import noresults_icon from "@/assets/svg/database/noresults_icon.svg";

const formatValue = (value) => {
  // 將字串轉換為數字
  const num = parseFloat(value);

  // 如果無法轉換為數字，返回原始字串
  if (isNaN(num)) {
    return value;
  }

  // 進行數值格式化，處理正數和負數
  const absNum = Math.abs(num); // 取絕對值來進行比較
  let formattedNum;

  if (absNum >= 1e9) {
    // 大於或等於十億，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  } else if (absNum >= 1e6) {
    // 大於或等於百萬，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
  } else if (absNum >= 1e3) {
    // 大於或等於千，保留最多四位小數並移除尾隨零
    formattedNum = (num / 1e3).toFixed(2).replace(/\.?0+$/, "") + "K";
  } else {
    // 如果數字小於千，保留最多四位小數並移除尾隨零
    formattedNum = num.toFixed(4).replace(/\.?0+$/, "");
  }

  return formattedNum;
};

function formatDate(inputDate) {
  const date = new Date(inputDate); // 將字串轉為 Date 物件
  const options = { year: "numeric", month: "short", day: "numeric" }; // 短月份格式
  return date.toLocaleDateString("en-US", options); // 格式化為 "Jan 22, 1999"
}

const CB_page_financials_InvestmentAndFinancing = ({
  data,
  loading,
  error,
}) => {
  return (
    <>
      {data?.stock_symbol ||
      data?.num_investments_lead ||
      data?.num_investments ||
      data?.num_exits ||
      data?.financials_highlights?.num_funding_rounds ||
      data?.ipo_fields?.date ||
      data?.num_lead_investors ||
      data?.num_investors ||
      data?.num_diversity_spotlight_investments ||
      data?.num_acquisitions ? (
        <div className="w-full">
          {(data?.stock_symbol ||
            data?.num_investments_lead ||
            data?.num_investments ||
            data?.num_exits ||
            data?.financials_highlights?.num_funding_rounds) && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col ">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0003 0.677734L15.2612 7.5115L22.7682 8.50106L17.2766 13.7141L18.6552 21.1595L12.0003 17.5476L5.34539 21.1595L6.72404 13.7141L1.23242 8.50106L8.7394 7.5115L12.0003 0.677734ZM12.0003 5.32179L10.077 9.35249L5.64918 9.93615L8.88825 13.0109L8.07509 17.4024L12.0003 15.272L15.9255 17.4024L15.1124 13.0109L18.3514 9.93615L13.9237 9.35249L12.0003 5.32179Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Highlights
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Stock Symbol
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.stock_symbol || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Lead Investors
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_lead_investors || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Investors
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_investors || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">Exits</p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.num_exits || "-"}
                  </p>
                </div>
              </div>

              <div className="w-full pt-6 flex">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Funding Rounds
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_funding_rounds || "-"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {(data?.stock_symbol || data?.ipo_fields?.date) && (
            //IPO 有三個資料沒有，先註解掉，先把 IPO Date 放到上面這排
            <section className="w-full pt-8 pb-10 px-16 flex flex-col ">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 4H6V18L20 18V20H4V4ZM7 6H10V17H7V6ZM14 9H11V17H14V9ZM15 13H18V17H15V13Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  IPO & Stock Price
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Stock Symbol
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.stock_symbol || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">IPO Date</p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {formatDate(data?.ipo_fields?.date) || "-"}
                  </p>
                </div>

                {/* 
            <div className="w-[220px] gap-1">
              <p className="text-main-text-gray leading-140">
                Lead Investments
              </p>
              <p className="text-main-color-gb font-semibold leading-140">
                {data?.num_investments_lead || "-"}
              </p>
            </div>

            <div className="w-[220px] gap-1">
              <p className="text-main-text-gray leading-140">Investments</p>
              <p className="text-main-color-gb font-semibold leading-140">
                {data?.num_investments || "-"}
              </p>
            </div>

            <div className="w-[220px] gap-1">
              <p className="text-main-text-gray leading-140">Exits</p>
              <p className="text-main-color-gb font-semibold leading-140">
                {data?.num_exits || "-"}
              </p>
            </div> */}
              </div>

              {/* <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
            <div className="w-[220px] gap-1">
              <p className="text-main-text-gray leading-140">IPO Date</p>
              <p className="text-main-color-gb font-semibold leading-140">
                {data?.ipo_fields?.date || "-"}
              </p>
            </div>
          </div> */}
            </section>
          )}

          {/* <section className="w-full pt-8 pb-10 px-16 flex flex-col ">
        <h3 className="w-full text-24px font-semibold leading-140">Funding</h3>

        <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
          <p></p>
        </div>

        <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
          <div className="w-[220px] gap-1">
            <p className="text-main-text-gray leading-140">Stock Symbol</p>
            <p className="text-main-color-gb font-semibold leading-140">
              {data?.stock_symbol || "-"}
            </p>
          </div>

          <div className="w-[220px] gap-1">
            <p className="text-main-text-gray leading-140">Lead Investments</p>
            <p className="text-main-color-gb font-semibold leading-140">
              {data?.num_investments_lead || "-"}
            </p>
          </div>

          <div className="w-[220px] gap-1">
            <p className="text-main-text-gray leading-140">Investments</p>
            <p className="text-main-color-gb font-semibold leading-140">
              {data?.num_investments || "-"}
            </p>
          </div>

          <div className="w-[220px] gap-1">
            <p className="text-main-text-gray leading-140">Exits</p>
            <p className="text-main-color-gb font-semibold leading-140">
              {data?.num_exits || "-"}
            </p>
          </div>
        </div>

        <div className="w-full gap-x-12 pt-7 pb-6 flex border-b border-[rgba(0,0,0,0.12)]">
          <div className="w-[220px] gap-1">
            <p className="text-main-text-gray leading-140">Stock Symbol</p>
            <p className="text-main-color-gb font-semibold leading-140">
              {data?.ipo_fields.date || "-"}
            </p>
          </div>
        </div>
      </section> */}

          {/* Funding Rounds */}

          {data?.financials_highlights?.num_funding_rounds && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13 0.402344L10 3.00042L12.3176 5.00749C12.2123 5.00279 12.1064 5.00042 12 5.00042C8.13401 5.00042 5 8.13443 5 12.0004C5 15.5269 7.60771 18.4443 11 18.9295V19.9385C7.05369 19.4464 4 16.08 4 12.0004C4 10.1582 4.62143 8.46405 5.66668 7.11206L4.08441 5.88878C2.7779 7.57869 2 9.70012 2 12.0004C2 17.1858 5.94668 21.4493 11 21.951V23.5985L14 21.0004L11.6824 18.9933C11.7877 18.998 11.8936 19.0004 12 19.0004C15.866 19.0004 19 15.8664 19 12.0004C19 8.47395 16.3923 5.55654 13 5.07131V4.06231C16.9463 4.55441 20 7.9208 20 12.0004C20 14.2719 19.0547 16.3208 17.5332 17.7783L18.9167 19.2225C20.8156 17.4035 22 14.8394 22 12.0004C22 6.81507 18.0533 2.55152 13 2.04979V0.402344ZM11 16.9004V15.4429C10.1572 15.2595 9.3322 14.8271 8.54883 14.1246L9.88408 12.6356C10.5264 13.2116 11.1141 13.4561 11.6273 13.524C12.1319 13.5907 12.6398 13.4964 13.1462 13.2664C12.92 13.1807 12.5801 13.0776 12.0972 12.9811C10.8274 12.7271 10.0114 12.439 9.69243 12.2794L9.54739 12.2069L9.43271 12.0922C8.88571 11.5452 8.63214 10.8873 8.7673 10.218C8.88754 9.62248 9.27811 9.21929 9.58512 9.01462C10.0433 8.70918 10.5255 8.52068 11 8.4151V7.10044C8.71776 7.56371 7 9.58146 7 12.0004C7 14.4194 8.71776 16.4371 11 16.9004ZM13 7.10044V8.38905C13.6949 8.51314 14.307 8.75648 14.6942 9.0146L13.5848 10.6787C13.4367 10.58 12.9701 10.3776 12.366 10.3189C11.8377 10.2675 11.3015 10.3352 10.8408 10.5898C10.9197 10.6175 11.0146 10.6489 11.1256 10.683C11.4506 10.7829 11.905 10.903 12.4895 11.0199C13.1553 11.1531 13.6577 11.3096 14.0271 11.4649C14.2115 11.5424 14.3716 11.6234 14.5063 11.7066C14.6162 11.7745 14.7654 11.8777 14.8904 12.0213C15.1435 12.3043 15.4394 12.8219 15.3591 13.4646C15.2683 14.1912 14.7483 14.7252 14.0325 15.0601C13.7057 15.213 13.3603 15.3371 13 15.4215V16.9004C15.2822 16.4371 17 14.4194 17 12.0004C17 9.58146 15.2822 7.56371 13 7.10044Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Funding Rounds
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Funding Rounds
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_funding_rounds || "-"}
                  </p>
                </div>
              </div>

              <div>
                <table className="border border-[rgba(0,0,0,0.12)]">
                  <tr className="bg-main-color-gb font-semibold leading-140 text-white">
                    <td className="w-[230px] px-6 py-4">Announced Date</td>
                    <td className="w-[230px] px-6 py-4">Transaction Name</td>
                    <td className="w-[230px] px-6 py-4">Number of Investors</td>
                    <td className="w-[230px] px-6 py-4">Money Raised</td>
                  </tr>

                  <tbody>
                    {data?.funding_rounds_list?.map((round) => {
                      return (
                        <tr
                          className="font-medium leading-140 text-main-text-gray border-b border-[rgba(0,0,0,0.12)]"
                          key={round?.id}
                        >
                          <td className="w-[230px] px-6 py-4">
                            {round?.announced_on || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {round?.title || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {round?.lead_investors?.length
                              ? round?.lead_investors?.length
                              : "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {round?.money_raised?.value
                              ? `$${formatValue(round.money_raised.value)}`
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Investors */}
          {(data?.financials_highlights?.num_lead_investors ||
            data?.financials_highlights?.num_investors) && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.72222 7.66667C6.72222 5.58026 8.41359 3.88889 10.5 3.88889C12.5864 3.88889 14.2778 5.58026 14.2778 7.66667C14.2778 9.75308 12.5864 11.4444 10.5 11.4444C8.41359 11.4444 6.72222 9.75308 6.72222 7.66667ZM10.5 2C7.37039 2 4.83333 4.53705 4.83333 7.66667C4.83333 8.92509 5.24354 10.0877 5.93754 11.0281C3.54576 12.7193 2 15.6827 2 19H11.3414C12.1651 21.3304 14.3876 23 17 23C20.3137 23 23 20.3137 23 17C23 13.6863 20.3137 11 17 11C16.4239 11 15.8667 11.0812 15.3394 11.2328C15.2483 11.1627 15.156 11.0945 15.0623 11.0283C15.7564 10.0879 16.1667 8.92518 16.1667 7.66667C16.1667 4.53705 13.6296 2 10.5 2ZM12.5843 12.9377C11.9392 13.193 11.236 13.3333 10.5 13.3333C9.32746 13.3333 8.2381 12.9772 7.33417 12.3672C5.76745 13.3483 4.56166 15.0484 4.09695 17.1111H11.001C11.0003 17.0742 11 17.0371 11 17C11 15.433 11.6007 14.0064 12.5843 12.9377ZM16.3363 12H18.1331V13.1355C18.7136 13.3026 19.2091 13.6027 19.5209 13.9093L18.1184 15.3352C18.0345 15.2527 17.7422 15.0658 17.3768 15.0134C17.0658 14.9688 16.7431 15.023 16.4316 15.3218C16.4303 15.3241 16.4286 15.3271 16.4267 15.3308C16.4175 15.3489 16.4076 15.3756 16.403 15.4094C16.3986 15.4411 16.3979 15.4862 16.4128 15.5473C16.4201 15.5772 16.432 15.6145 16.4519 15.6589C16.5063 15.6874 16.5773 15.7226 16.6663 15.7629C16.9013 15.8694 17.2358 16.0002 17.6703 16.1284C18.2192 16.2904 18.6422 16.4834 18.9589 16.6799C19.2317 16.8492 19.5135 17.075 19.6786 17.3553C19.8692 17.6691 20.0391 18.1546 19.9924 18.7058C19.9406 19.3177 19.6268 19.9266 18.9759 20.3758C18.7183 20.5537 18.4359 20.7068 18.1331 20.8169V21.8426H16.3363V20.8898C15.5362 20.662 14.826 20.0946 14.2024 19.2697L15.7979 18.0637C16.306 18.7359 16.7094 18.9356 16.9604 18.9846C17.1976 19.0308 17.4805 18.9779 17.8398 18.7299C17.9352 18.664 17.9697 18.6138 17.9815 18.5937C17.9933 18.5734 17.9979 18.5564 17.9996 18.5371C18.0015 18.5139 17.9991 18.4832 17.9898 18.4486C17.989 18.4454 17.9881 18.4423 17.9873 18.4394C17.9867 18.4376 17.9862 18.4358 17.9856 18.4341C17.9663 18.4197 17.9396 18.4012 17.9046 18.3794C17.7637 18.2921 17.5103 18.1665 17.1043 18.0467C16.0889 17.7471 15.4107 17.4003 15.1228 17.1878L14.9849 17.0861L14.8888 16.9443C14.0098 15.6475 14.4793 14.4365 15.0153 13.9093C15.4299 13.5016 15.8831 13.253 16.3363 13.1212V12Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Investors
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Lead Investors
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_lead_investors || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Investors
                  </p>
                  <p className=" text-main-color-gb font-semibold leading-140">
                    {data?.financials_highlights?.num_investors || "-"}
                  </p>
                </div>
              </div>

              <div>
                <table className="border border-[rgba(0,0,0,0.12)]">
                  <tr className="bg-main-color-gb font-semibold leading-140 text-white">
                    <td className="w-[230px] px-6 py-4">Investor Name</td>
                    <td className="w-[230px] px-6 py-4">Lead Investor</td>
                    <td className="w-[230px] px-6 py-4">Funding Round</td>
                    <td className="w-[230px] px-6 py-4">Partners</td>
                  </tr>

                  <tbody>
                    {data?.investors?.map((obj) => {
                      return (
                        <tr
                          className="font-medium leading-140 text-main-text-gray border-b border-[rgba(0,0,0,0.12)]"
                          key={obj.id}
                        >
                          <td className="w-[230px] px-6 py-4">
                            {obj?.investor?.value || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {obj?.lead_investor ? "Yes" : "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {obj?.funding_round?.value}
                          </td>
                          <td className="w-[230px] px-6 py-4">{"-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Investments */}
          {data?.num_investments && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5002 0.530273L1.70703 9.99989H6.00024V20.9999H12.2575C13.2663 22.2213 14.7924 22.9998 16.5002 22.9998C19.5378 22.9998 22.0002 20.5373 22.0002 17.4998C22.0002 14.4622 19.5378 11.9998 16.5002 11.9998C15.9802 11.9998 15.4771 12.0719 15.0002 12.2068V9.99989H19.2935L10.5002 0.530273ZM13.0002 13.2569V7.99989H14.707L10.5002 3.4695L6.29346 7.99989H8.00024V18.9999H11.2073C11.0724 18.523 11.0002 18.0198 11.0002 17.4998C11.0002 15.7918 11.7787 14.2657 13.0002 13.2569ZM16.0007 12.9999H17.715V14.0898C18.373 14.2107 18.9522 14.4389 19.3232 14.6822L18.2265 16.3547C18.0871 16.2633 17.6379 16.0708 17.0536 16.015C16.5822 15.9699 16.1063 16.0216 15.6887 16.2182C15.7396 16.2347 15.7955 16.2523 15.8565 16.2707C16.171 16.3658 16.6112 16.4803 17.1775 16.5917C17.824 16.7188 18.3124 16.8684 18.6722 17.0172C18.8517 17.0914 19.0081 17.1692 19.1402 17.2494C19.2472 17.3144 19.3953 17.4148 19.5203 17.556C19.7702 17.8309 20.0683 18.3401 19.9874 18.9771C19.8958 19.6979 19.3735 20.2157 18.6782 20.5357C18.3726 20.6763 18.0506 20.7914 17.715 20.8719V22.2855H16.0007V20.9518C15.0856 20.8153 14.1876 20.3871 13.3391 19.6387L14.6621 18.1388C15.2802 18.6841 15.846 18.9156 16.3405 18.98C16.789 19.0383 17.2402 18.9668 17.6905 18.7844C17.4771 18.7123 17.183 18.6311 16.7915 18.554C15.5596 18.3117 14.7664 18.0366 14.4546 17.8832L14.3098 17.8119L14.1948 17.6988C13.6581 17.1709 13.3996 16.5251 13.536 15.8603C13.6567 15.2726 14.0468 14.8795 14.3477 14.6822C14.8835 14.3309 15.4523 14.1411 16.0007 14.0561V12.9999Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Investments
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Investments
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.num_investments || "-"}
                  </p>
                </div>

                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Lead Investments
                  </p>
                  <p className=" text-main-color-gb font-semibold leading-140">
                    {data?.num_investments_lead || "-"}
                  </p>
                </div>
              </div>

              <div>
                <table className="border border-[rgba(0,0,0,0.12)]">
                  <tr className="bg-main-color-gb font-semibold leading-140 text-white">
                    <td className="w-[230px] px-6 py-4">Announced Date</td>
                    <td className="w-[230px] px-6 py-4">Organization Name</td>
                    <td className="w-[230px] px-6 py-4">Lead Investor</td>
                    <td className="w-[230px] px-6 py-4">Funding Round</td>
                  </tr>

                  <tbody>
                    {data?.investments?.map((investment) => {
                      return (
                        <tr
                          className="font-medium leading-140 text-main-text-gray border-b border-[rgba(0,0,0,0.12)]"
                          key={investment.id}
                        >
                          <td className="w-[230px] px-6 py-4">
                            {formatDate(investment?.announced_on) || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.organization?.value || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.lead_investor ? "Yes" : "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.funding_round?.value || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Diversity Investments */}
          {data?.num_diversity_spotlight_investments && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clipPath="url(#clip0_2006_12252)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V5.07089C14.186 5.24054 15.2761 5.70748 16.1924 6.39381L17.0678 5.51841C17.0236 5.35307 17 5.17929 17 5C17 3.89543 17.8954 3 19 3C20.1046 3 21 3.89543 21 5C21 6.10457 20.1046 7 19 7C18.821 7 18.6474 6.97648 18.4823 6.93235L17.6066 7.80809C18.2927 8.72428 18.7595 9.81421 18.9291 11H20.2676C20.6134 10.4022 21.2597 10 22 10C23.1046 10 24 10.8954 24 12C24 13.1046 23.1046 14 22 14C21.2597 14 20.6134 13.5978 20.2676 13H18.9291C18.7595 14.1859 18.2927 15.2758 17.6065 16.192L18.4821 17.0677C18.6473 17.0235 18.8209 17 19 17C20.1046 17 21 17.8954 21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19C17 18.8208 17.0236 18.6471 17.0678 18.4818L16.1923 17.6063C15.276 18.2926 14.186 18.7595 13 18.9291V20.2676C13.5978 20.6134 14 21.2597 14 22C14 23.1046 13.1046 24 12 24C10.8954 24 10 23.1046 10 22C10 21.2597 10.4022 20.6134 11 20.2676V18.9291C9.81403 18.7595 8.72395 18.2926 7.80767 17.6063L6.9322 18.4817C6.97642 18.647 7 18.8208 7 19C7 20.1046 6.10457 21 5 21C3.89543 21 3 20.1046 3 19C3 17.8954 3.89543 17 5 17C5.17908 17 5.35267 17.0235 5.51783 17.0677L6.3935 16.192C5.70734 15.2758 5.24051 14.1858 5.07089 13H3.73244C3.38663 13.5978 2.74028 14 2 14C0.895431 14 0 13.1046 0 12C0 10.8954 0.895431 10 2 10C2.74028 10 3.38663 10.4022 3.73244 11H5.07089C5.24051 9.81413 5.70736 8.72414 6.39355 7.80792L5.51792 6.93229C5.35273 6.97645 5.17912 7 5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3C6.10457 3 7 3.89543 7 5C7 5.1792 6.97643 5.3529 6.93222 5.51816L7.80774 6.39368C8.724 5.70742 9.81406 5.24052 11 5.07089V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM10.9996 16.8999V15.9449C10.034 15.7796 9.11678 15.2471 8.27246 14.3534L9.72622 12.9799C10.3574 13.648 10.9129 13.9076 11.3644 13.978C11.8168 14.0486 12.2852 13.9482 12.7755 13.6774C12.9248 13.595 12.9807 13.531 12.9965 13.51C12.964 13.4893 12.9144 13.4603 12.8442 13.4254C12.6396 13.3239 12.2915 13.1878 11.7535 13.0608C10.5128 12.7679 9.70767 12.434 9.38639 12.2443L9.24099 12.1585L9.13183 12.0296C8.61169 11.4157 8.41954 10.7431 8.52867 10.1052C8.62945 9.51613 8.96672 9.08008 9.27643 8.83639C9.82871 8.40183 10.4231 8.16738 10.9996 8.06481V7.1001C8.71755 7.56354 7 9.58119 7 12C7 14.4188 8.71755 16.4365 10.9996 16.8999ZM12.9996 7.09993V8.17395C13.5721 8.33201 14.0654 8.57935 14.392 8.83637L13.1553 10.4081C13.019 10.301 12.5876 10.0806 12.0335 10.017C11.5107 9.95704 10.9775 10.0464 10.5208 10.4022C10.519 10.4043 10.5159 10.4082 10.5122 10.4139C10.5041 10.4267 10.501 10.4367 10.5 10.4424C10.4996 10.4448 10.497 10.4591 10.5072 10.4926C10.5134 10.513 10.5265 10.5471 10.5543 10.5942C10.6416 10.6324 10.7589 10.68 10.9069 10.7336C11.2168 10.846 11.652 10.9819 12.213 11.1143C12.8686 11.2691 13.366 11.4516 13.7333 11.6339C14.0441 11.7881 14.3737 11.9962 14.5753 12.2695C14.8135 12.5832 15.0541 13.1073 14.9885 13.7267C14.9146 14.4251 14.4775 15.0223 13.7423 15.4283C13.506 15.5588 13.2578 15.6723 12.9996 15.763V16.9001C15.282 16.437 17 14.4191 17 12C17 9.58089 15.282 7.56304 12.9996 7.09993Z"
                      fill="#009BAF"
                    />
                  </g>
                  <defs>
                    <clippath id="clip0_2006_12252">
                      <rect width={24} height={24} fill="white" />
                    </clippath>
                  </defs>
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Diversity Investments
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-full gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Diversity Investments
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.num_diversity_spotlight_investments || "-"}
                  </p>
                </div>
              </div>

              <div>
                <table className="border border-[rgba(0,0,0,0.12)]">
                  <tr className="bg-main-color-gb font-semibold leading-140 text-white">
                    <td className="w-[230px] px-6 py-4">Announced Date</td>
                    <td className="w-[230px] px-6 py-4">Organization Name</td>
                    <td className="w-[230px] px-6 py-4">Diversity Spotlight</td>
                    <td className="w-[230px] px-6 py-4">Funding Round</td>
                  </tr>

                  <tbody>
                    {data?.diversity_investments?.map((investment) => {
                      return (
                        <tr
                          className="font-medium leading-140 text-main-text-gray border-b border-[rgba(0,0,0,0.12)]"
                          key={investment.id}
                        >
                          <td className="w-[230px] px-6 py-4">
                            {formatDate(investment?.announced_on) || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.organization?.value || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.organization_diversity
                              ?.map((diversity) => diversity?.value)
                              .join(", ") || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {investment?.funding_round?.value || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Acquisitions */}
          {data?.num_acquisitions && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 5H15V15H5V5ZM10 17V19L19 19V10H17V17H10Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Acquisitions
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Acquisitions
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.num_acquisitions || "-"}
                  </p>
                </div>
              </div>

              <div>
                <table className="border border-[rgba(0,0,0,0.12)]">
                  <tr className="bg-main-color-gb font-semibold leading-140 text-white">
                    <td className="w-[230px] px-6 py-4">Acquiree Name</td>
                    <td className="w-[230px] px-6 py-4">Announced Date</td>
                    <td className="w-[230px] px-6 py-4">Price</td>
                    <td className="w-[230px] px-6 py-4">Transaction Name</td>
                  </tr>

                  <tbody>
                    {data?.acquisitions?.map((acquisition) => {
                      return (
                        <tr
                          className="font-medium leading-140 text-main-text-gray border-b border-[rgba(0,0,0,0.12)]"
                          key={acquisition.identifier?.permalink}
                        >
                          <td className="w-[230px] px-6 py-4">
                            {acquisition.acquiree_identifier?.value || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {formatDate(acquisition.announced_on?.value) || "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {acquisition.price?.value_usd
                              ? `$${formatValue(acquisition.price?.value_usd)}`
                              : "-"}
                          </td>
                          <td className="w-[230px] px-6 py-4">
                            {acquisition.identifier?.value || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Exits */}
          {data?.num_exits && (
            <section className="w-full pt-8 pb-10 px-16 flex flex-col border-t border-[rgba(0,0,0,0.12)]">
              <div className="w-full flex justify-start items-center space-x-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 3H21V21H3V16H5V19H19V5H5V8H3V3ZM10.1041 14V16.8025L15.8579 11.9507L10.1041 7.09888V10H2V14H10.1041Z"
                    fill="#009BAF"
                  />
                </svg>
                <h3 className="w-full text-24px font-semibold leading-140">
                  Exits
                </h3>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex">
                <p></p>
              </div>

              <div className="w-full gap-x-12 pt-7 pb-6 flex border-t border-[rgba(0,0,0,0.12)]">
                <div className="w-[220px] gap-1">
                  <p className="text-main-text-gray leading-140">
                    Number of Exits
                  </p>
                  <p className="text-main-color-gb font-semibold leading-140">
                    {data?.num_exits || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-8 px-6 pb-12.5 flex flex-wrap gap-8 border border-[rgba(0,0,0,0.12)]">
                {data?.exits?.map((exit) => (
                  <div
                    className="w-[388px] flex items-center justify-start"
                    key={exit.link}
                  >
                    <div className="w-15 h-15 flex-shrink-0 mr-4 rounded-5px border border-search-home-bg">
                      <img src={default_company_icon} alt="" />
                    </div>
                    <div className="flex flex-col leading-140 space-y-1">
                      <p className="text-main-text-gray">{exit.value}</p>
                      <p className="text-main-color-gb font-semibold">
                        {exit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex items-center pt-7.5 pl-11 mb-10">
          <div className="flex-shrink-0 w-8 h-8 mr-3">
            <img className="w-full h-full" src={noresults_icon} alt="" />
          </div>
          <h2 className=" text-main-color-gb text-24px font-semibold leading-140">
            No results found
          </h2>
        </div>
      )}
    </>
  );
};
export default CB_page_financials_InvestmentAndFinancing;
