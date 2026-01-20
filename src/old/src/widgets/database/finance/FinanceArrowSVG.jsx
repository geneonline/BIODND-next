const FinanceArrowSVG = ({ color, rotate = 0 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      style={{
        WebkitFlexGrow: "0",
        MsFlexGrow: "0",
        flexGrow: "0",
        WebkitFlexShrink: "0",
        MsFlexShrink: "0",
        flexShrink: "0",
        width: 24,
        height: 24,
        position: "relative",
        rotate: `${rotate}deg`,
      }}
    >
      <path
        fill={color}
        d="M20.905 13.175l-7.779-8.964a.749.749 0 00-1.132 0l-7.776 8.964a.187.187 0 00.14.31h1.899a.38.38 0 00.283-.13l5.13-5.912V20.64a.19.19 0 00.188.188h1.407a.188.188 0 00.187-.188V7.443l5.13 5.913c.07.082.174.129.284.129h1.899a.187.187 0 00.14-.31z"
      ></path>
    </svg>
  );
};
export default FinanceArrowSVG;
