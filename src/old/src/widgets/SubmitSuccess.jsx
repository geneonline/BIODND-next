import { Link } from "react-router-dom";

const SubmitSuccess = () => {
  return (
    <div>
      <div className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50">
        <div
          className="absolute max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px py-15 px-18 flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* col 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-5 space-x-2">
              <svg
                width={32}
                height={32}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM8.5 16.5L14.5 23L25 12.5L22.5 10L14.5 18L11 14L8.5 16.5Z"
                  fill="#009BAF"
                />
              </svg>
              <h3 className="whitespace-nowrap text-main-color-gb text-30px font-semibold leading-140">
                Thank you for your feedback
              </h3>
            </div>
            <p className="w-[400px] text-sm1 overflow-auto max-h-[80vh] leading-normal break-words text-center">
              We received your application for contact us or report an issue. We
              appreciate you taking the time to apply.
            </p>

            <div className="flex space-x-3 pt-8">
              <Link
                to="/"
                className="py-2.5 px-7.5 bg-main-color-gb text-24px whitespace-nowrap font-semibold leading-140 text-white rounded-full text-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubmitSuccess;
