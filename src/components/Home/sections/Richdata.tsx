import Link from "next/link";
import richdata_bg from "@/assets/webp/home/richdata-bg.webp";
import Carousel from "../components/Carousel"; // Adjusted path
import Image from "next/image";

const Richdata = ({ token }: { token: string | null }) => {
  return (
    <section className="w-full py-32 px-8 md:px-16 lg:px-20 xl:px-28 bg-[radial-gradient(ellipse_121.50%_121.50%_at_50.00%_50.00%,_white_0%,_rgba(209,_213,_219,_0.80)_100%)] self-stretch inline-flex flex-col justify-center items-center overflow-hidden">
      <div className="self-stretch  flex flex-col justify-center items-center">
        <div className="w-full max-w-[1200px] relative flex flex-col justify-center items-center gap-16">
          <Image
            className="w-[950px] max-w-none -top-16 z-0 absolute"
            src={richdata_bg}
            alt=""
          />

          {/* content */}
          <div className="z-10 max-w-[502px] flex flex-col justify-start items-center gap-8">
            <div className="self-stretch flex flex-col justify-center items-center gap-4">
              <div className="self-stretch text-center justify-center text-Gray-950 text-base md:text-xl font-bold leading-140">
                Biotech Market Intelligence
              </div>
              <div className="self-stretch text-center justify-center text-Gray-950 text-24px md:text-36px font-bold leading-140">
                Rich Data Ecosystem
              </div>
              <div className="self-stretch text-center justify-center text-textColor-secondary text-base font-normal leading-160">
                Access to diverse data enables data-driven decisions, enhancing
                strategic planning and resource allocation
              </div>
            </div>
            {!token && (
              <Link
                href="/account/register"
                className="px-6 py-3 font-medium text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
              >
                Explore the Data
              </Link>
            )}
          </div>

          {/* cards */}
          <Carousel />
        </div>
      </div>
    </section>
  );
};
export default Richdata;
