import { useState } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

const DemoSection = () => {
  const initpost = [
    {
      title:
        "NVIDIA: The Rocket Fuel Boosting BIODND to Build the Most Advanced Integrated Data Platform in Biotech",
      desc: "Artificial intelligence (AI) is evolving faster than ever, and...",
      src: "https://www.geneonline.com/wp-content/uploads/Nvidia%E5%BD%B1%E7%89%87%E5%9C%96.png",
      link: "https://www.geneonline.com/nvidia-the-rocket-fuel-boosting-biodnd-to-build-the-most-advanced-integrated-data-platform-in-biotech/",
    },
  ];

  // eslint-disable-next-line no-unused-vars
  const [post, setPost] = useState(initpost);
  const [activeIndex, setActiveIndex] = useState(0); // 活動影片索引

  // 跳到下一個影片
  const nextSlide = () => {
    const nextIndex = activeIndex < post.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIndex);
  };

  // 跳到上一個影片
  const prevSlide = () => {
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : post.length - 1;
    setActiveIndex(prevIndex);
  };

  // 直接跳到選擇的影片
  const moveToCenter = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="bg-finance-bg flex flex-col items-center justify-center py-13">
      {/* <h2 className="text-36px font-semibold text-center">
        <Trans i18nKey="home.demo_section.title" components={{ br: <br /> }} />
      </h2> */}

      {/* <div className="flex space-x-4 py-14">
        {post.map((video, index) => (
          <button
            key={index}
            className={`py-4 px-14 border-3px border-main-color ${
              index === activeIndex
                ? "bg-main-color text-white"
                : "bg-white text-black"
            } rounded-full text-xl font-medium`}
            onClick={() => moveToCenter(index)}
          >
            {video.title}
          </button>
        ))}
      </div> */}

      <div className="relative h-[500px] overflow-hidden flex items-center w-full p-4">
        {post.map((post, index) => (
          <Link
            target="_blank"
            to={post.link}
            key={index}
            className={`absolute w-[477px] transition-all duration-500 ease-in-out  ${
              index === activeIndex
                ? "left-1/2 -translate-x-1/2"
                : index < activeIndex
                ? "left-0 -translate-x-19/20"
                : "left-full -translate-x-1/20"
            }`}
          >
            <div className="w-full">
              <img className="w-full" src={post.src} alt="" />
            </div>
            <h3 className="pt-4 font-semibold leading-140">{post.title}</h3>
            <p className="pt-1 text-sm1 font-medium leading-140">{post.desc}</p>
          </Link>
        ))}
        {activeIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-1/10 top-1/2 -translate-y-1/2 z-30"
          >
            <svg
              width={48}
              height={48}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 relative stroke-main-color hover:stroke-white hover:fill-main-color"
              preserveAspectRatio="none"
            >
              <path
                d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z"
                stroke="#07BBD3"
                strokeWidth={4}
                strokeLinejoin="round"
              />
              <path
                d="M27 33L18 24L27 15"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {activeIndex < post.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-1/10 top-1/2 -translate-y-1/2 z-30"
          >
            <svg
              width={48}
              height={48}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180 w-12 h-12 relative stroke-main-color hover:stroke-white hover:fill-main-color"
              preserveAspectRatio="none"
            >
              <path
                d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z"
                stroke="#07BBD3"
                strokeWidth={4}
                strokeLinejoin="round"
              />
              <path
                d="M27 33L18 24L27 15"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default DemoSection;
