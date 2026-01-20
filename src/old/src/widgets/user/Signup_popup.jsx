import Signup_comp from "./Signup_comp";

const Signup_popup = ({ popUp, setPopUp }) => {
  return (
    <div>
      {popUp && (
        <div
          className="fixed left-0 top-15 xl:top-19 w-full h-screen bg-[#00000044] z-50"
          onClick={() => setPopUp(false)}
          onScroll={(e) => e.stopPropagation()}
        >
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2  
            bg-white rounded-10px flex flex-col px-16 pt-9 pb-11"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full relative">
              <button
                className="w-fit self-end absolute -top-2 -right-9"
                onClick={(e) => {
                  e.preventDefault();
                  setPopUp(false);
                }}
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M5 17.7279L17.7279 5L19.1421 6.41421L6.41421 19.1421L5 17.7279Z"
                    fill="#69747F"
                  />
                  <path
                    d="M6.41455 5.00002L19.1425 17.7279L17.7283 19.1422L5.00034 6.41423L6.41455 5.00002Z"
                    fill="#69747F"
                  />
                </svg>
              </button>
            </div>
            <Signup_comp setPopUp={setPopUp} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup_popup;
