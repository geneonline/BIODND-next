import { useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";

const DemoSectionSwiper = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Register Swiper web component
    register();

    // Object with parameters
    const params = {
      slidesPerView: 1,
      injectStyles: [
        `
      .swiper-pagination-bullet {
        
        width: 280px;
        height: 65px;
        border: 3px solid #dae4e6;
        border-radius: 9999px;
        text-align: center;
        line-height: 20px;
        font-size: 20px;
        font-weight: 500;
        color: #000;
        background: #fff;
        opacity: 1;

      }

      .swiper-pagination-bullet-active {
        color: #fff;
        background: #07BBD3;
      }
      `,
      ],
      pagination: {
        renderBullet: function (index, className) {
          return (
            '<span class="' +
            className +
            '">' +
            `<span style="display: flex; align-items: center; text-align: center;">${
              index + 3000
            }</span>` +
            "</span>"
          );
        },
        clickable: true,
      },
      centeredSlides: true,
      navigation: true,
      loop: true,
    };

    // Assign it to swiper element
    Object.assign(swiperRef.current, params);

    // initialize swiper
    swiperRef.current.initialize();
  }, []);
  return (
    <swiper-container init="false" ref={swiperRef}>
      <swiper-slide>
        <div className="w-[834px] h-[469px] bg-slate-300">Slide 1</div>
      </swiper-slide>
      <swiper-slide>
        <div className="w-[834px] h-[469px] bg-slate-300">Slide 2</div>
      </swiper-slide>
      <swiper-slide>
        <div className="w-[834px] h-[469px] bg-slate-300">Slide 3</div>
      </swiper-slide>
    </swiper-container>
  );
};

export default DemoSectionSwiper;
