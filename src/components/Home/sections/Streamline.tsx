import Link from "next/link";
import streamlineBg from "@/assets/webp/home/streamline-bg.webp";

import { useUser } from "@/hooks/useUser";

const Streamline = () => {
  const { user } = useUser();
  return (
    <section className="w-full h-fit self-stretch  bg-white inline-flex flex-col justify-center items-center overflow-hidden">
      <div
        className="h-[800px] px-8 md:px-16 lg:px-20 xl:px-28 self-stretch w-full bg-center bg-no-repeat flex justify-center"
        style={{ backgroundImage: `url(${streamlineBg.src})` }}
      >
        <div className="w-full flex-1 max-w-[1200px] xl:w-[1200px] pt-[336px] relative flex justify-center md:justify-end">
          <div className=" flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch justify-center text-Gray-950 text-24px md:text-36px font-bold leading-140">
                Streamline your biotech strategy{" "}
                <br className="hidden sm:block" />
                with AI-driven insights
              </div>
              <div className="max-w-[578px] justify-center text-textColor-secondary text-base font-normal leading-160">
                BIODND is your ultimate AI-driven biotech data platform,
                designed for leaders and experts in biotechnology and
                pharmaceuticals. Gain instant access to market insights,
                financial data, and regulatory intelligence to make smarter,
                data-driven decisions.
              </div>
            </div>

            {!user && (
              <Link
                href="/account/register"
                className="px-6 py-3 font-medium text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
              >
                Join Us Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Streamline;
