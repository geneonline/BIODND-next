import React from "react";
import { animated, useSpring } from "@react-spring/web";

const AniAppearCompNoT = ({
  children,
  className,
  element,
  inView,
  delay,
  friction,
  style,
  z,
  ...props
}) => {
  const Element = animated(element);
  const aniStyle = useSpring({
    opacity: inView ? 1 : 0,
    config: {
      duration: 500,
    },
    zIndex: z,
    delay,
  });

  return (
    <Element style={{ ...style, ...aniStyle }} className={className} {...props}>
      {children}
    </Element>
  );
};

export default AniAppearCompNoT;
