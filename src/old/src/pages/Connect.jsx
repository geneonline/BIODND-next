import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Connect = () => {
  const [link, setLink] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("/Supply") ||
      location.pathname.includes("/supply")
    ) {
      setLink(0);
    } else {
      setLink(1);
    }
  }, [location]);

  return (
    <div className="mt-15 xl:mt-19 w-full ">
      <div className="flex space-x-3">
        <div className="bg-connect-nav mt-5.5 ml-6 w-52 pt-32 shrink-0 rounded-t-10px">
          <ul>
            <li>
              <Link
                to="supply"
                onClick={() => setLink(0)}
                className={`w-full text-center inline-block py-3.5
                ${
                  link === 0
                    ? "bg-white text-black"
                    : "bg-none text-main-text-gray"
                }
                `}
              >
                Supply
              </Link>
            </li>
            <li>
              <Link
                to="demand"
                onClick={() => setLink(1)}
                className={`w-full text-center inline-block py-3.5
                ${
                  link === 1
                    ? "bg-white text-black"
                    : "bg-none text-main-text-gray"
                }
                `}
              >
                Demand
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Connect;
