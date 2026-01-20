import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Arrow_svg = () => {
  return (
    <svg
      alt="prev"
      width={40}
      height={40}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-primary-color hover:fill-primary-color-blue flex-grow-0 flex-shrink-0 w-10 h-10 relative"
      preserveAspectRatio="none"
    >
      <g clipPath="url(#clip0_4228_375)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.5 20C38.5 30.2173 30.2173 38.5 20 38.5C9.78273 38.5 1.5 30.2173 1.5 20C1.5 9.78273 9.78273 1.5 20 1.5C30.2173 1.5 38.5 9.78273 38.5 20ZM40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM24.5303 27.6805L16.8498 20L24.5304 12.3194C24.8233 12.0265 24.8233 11.5516 24.5304 11.2587C24.2376 10.9658 23.7627 10.9658 23.4698 11.2587L15.2683 19.4602L15.2587 19.4696C14.9658 19.7625 14.9658 20.2374 15.2587 20.5303L23.4696 28.7412C23.7625 29.0341 24.2374 29.0341 24.5303 28.7412C24.8232 28.4483 24.8232 27.9734 24.5303 27.6805Z"
        />
      </g>
      <defs>
        <clippath id="clip0_4228_375">
          <rect width={40} height={40} fill="white" />
        </clippath>
      </defs>
    </svg>
  );
};

const cards_info = [
  {
    id: 1,
    value: "350,000+",
    award: "Company Data",
    name: "Includes company intro, employee count, listing status, investors, and investment types.",
  },
  {
    id: 2,
    value: "100,000+",
    award: "Clinical Information",
    name: "Centralized results provide a complete overview and save valuable time.",
  },
  {
    id: 3,
    value: "90,000+",
    award: "Licensed Drugs",
    name: "Easily compare and analyze countries with the same licensed drugs.",
  },
  {
    id: 4,
    value: "100,000+",
    award: "Financial Report",
    name: "Access early OTC financials and market data from 18,000+ listed companies.",
  },
  {
    id: 5,
    value: "90+",
    award: "Worldwide Data",
    name: "Covers multiple regions with unique insights and conditions.",
  },
];

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      transformOrigin: "50% 50%",
      left: "-72px",
      width: "fit-content",
      height: "fit-content",
      padding: 0,
      cursor: "pointer",
      transform: "translateY(-50%)",
    }}
  >
    <Arrow_svg />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      transformOrigin: "50% 50%",
      right: "-72px",
      width: "fit-content",
      height: "fit-content",
      padding: 0,
      cursor: "pointer",
      transform: "translateY(-50%) rotate(180deg)",
    }}
  >
    <Arrow_svg />
  </button>
);

const Carousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,
    centerPadding: "0px",
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <style>{`
        .slick-list { margin: 0 -16px; }
        .slick-slide > div { padding: 0 16px; }
        .slick-center > div > div {border: 1px solid #009BAF; }
      `}</style>

      <div className="w-fit">
        <div
          //要用 inline style 或 !important 才能讓 carousel 的寬度正確
          className="mt-6 px-[72px] lg:px-0 mx-auto !w-[970px] lg:!w-[720px] xl:!w-[916px] 2xl:!w-[1072px] "
        >
          <Slider {...settings}>
            {cards_info.map((item) => (
              <div
                key={item.id}
                className="
                flex flex-col p-8 rounded-[15px] mb-2 h-[218px] lg:h-[250px] xl:h-fit
                bg-white filter shadow-[0px_1px_5px_0px_rgba(0,0,0,0.10)]
              "
              >
                <div className="flex flex-col justify-start gap-1 mb-3 ">
                  <p className="self-stretch text-Gray-950 text-24px font-bold  leading-140">
                    {item.value}
                  </p>
                  <p className="self-stretch text-Gray-950 text-xl font-semibold  leading-140 xl:whitespace-nowrap">
                    {item.award}
                  </p>
                </div>

                <p className="h-20 xl:h-15 self-stretch text-textColor-secondary text-sm1  leading-140">
                  {item.name}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Carousel;
