import { Link } from "react-router-dom";
import dna from "@/assets/webp/home/dna.webp";

const Hero = ({ token }) => {
  return (
    <section className="w-full px-8 md:px-16 lg:px-20 xl:px-28 bg-[radial-gradient(ellipse_121.50%_121.50%_at_50.00%_50.00%,_white_0%,_rgba(209,_213,_219,_0.80)_100%)] self-stretch inline-flex flex-col justify-center items-center overflow-hidden">
      <div className="self-stretch  inline-flex justify-center items-start">
        <div className="w-full flex-1 self-stretch max-w-[1200px] h-[600px] md:h-[800px] relative flex justify-start items-center">
          <div className="w-full md:w-[689px] inline-flex flex-col justify-start items-start gap-10 z-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <h1 className="w-[329px] md:w-full self-stretch justify-start text-Gray-950 selection:text-white selection:bg-primary-default text-5xl md:text-64px font-bold leading-120">
                AI-Powered <br /> Biotech Data Platform
              </h1>
              <div className="self-stretch justify-start selection:text-white selection:bg-primary-default text-textColor-secondary text-xl font-normal leading-140">
                Data Insights for Faster, Smarter Deals
              </div>
            </div>
            <div className="inline-flex flex-wrap justify-center md:justify-start items-center gap-3">
              {token ? (
                <Link
                  to="/database/search"
                  className="w-full sm:w-fit px-6 py-3 whitespace-nowrap font-medium text-18px text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
                >
                  Explore the Data
                </Link>
              ) : (
                <Link
                  to="/account/register"
                  className="w-full sm:w-fit px-6 py-3 whitespace-nowrap font-medium text-18px text-white bg-primary-default hover:bg-primary-hovered rounded-50px inline-flex justify-center items-center overflow-hidden"
                >
                  Start Free Trial
                </Link>
              )}

              <Link
                to="/contact"
                className="w-full sm:w-fit px-6 py-3 whitespace-nowrap font-medium text-18px text-primary-default bg-none border border-primary-default hover:bg-primaryBlue-200 rounded-50px inline-flex justify-center items-center overflow-hidden"
              >
                Request a Demo
              </Link>
            </div>
          </div>
          <img
            className="hidden lg:block absolute left-2/5 overflow-hidden"
            src={dna}
            alt="dna"
          />
        </div>
      </div>
    </section>
  );
};
export default Hero;
