import { ResponsivePie } from "@nivo/pie";

import { animated, useSpring } from "@react-spring/web";

const data_A = [
  {
    id: "United State",
    label: "United State",
    value: 0.3237,
    color: "#09B1A7",
  },
  {
    id: "Taiwan",
    label: "Taiwan",
    value: 0.1907,
    color: "#39CEF3",
  },
  {
    id: "China",
    label: "China",
    value: 0.1609,
    color: "#1E99F1",
  },
  {
    id: "Japan",
    label: "Japan",
    value: 0.1197,
    color: "#7280FA",
  },
  {
    id: "South Korea",
    label: "South Korea",
    value: 0.0532,
    color: "#A1DC67",
  },
  {
    id: "other",
    label: "other",
    value: 0.1518,
    color: "#c7dc67",
  },
];

const data_B = [
  {
    id: "Biotech/Pharma products",
    label: "Biotech/Pharma products",
    value: 0.3358,
    color: "#09B1A7",
  },
  {
    id: "Medtech Products",
    label: "Medtech Products",
    value: 0.4911,
    color: "#39CEF3",
  },
  {
    id: "Services",
    label: "Services",
    value: 0.08,
    color: "#1E99F1",
  },
  {
    id: "Technologies",
    label: "Technologies",
    value: 0.0976,
    color: "#7280FA",
  },
];
const data_C = [
  {
    id: "Academic",
    label: "Academic",
    value: 0.08,
    color: "#09B1A7",
  },
  {
    id: "Biotech or Pharma",
    label: "Biotech or Pharma",
    value: 0.32,
    color: "#39CEF3",
  },
  {
    id: "Therapeutic R&D",
    label: "Therapeutic R&D",
    value: 0.28,
    color: "#1E99F1",
  },
  {
    id: "Medical DeviceD",
    label: "Medical Device",
    value: 0.16,
    color: "#7280FA",
  },
  {
    id: "Other ",
    label: "Other ",
    value: 0.16,
    color: "#A1DC67",
  },
];

const MyPieChart = animated(ResponsivePie);

const PieChart = ({ inView, input }) => {
  let data = data_A;

  switch (input) {
    case "A":
      data = data_A;
      break;
    case "B":
      data = data_B;
      break;
    case "C":
      data = data_C;
      break;

    default:
      data = data_A;
      break;
  }

  const aniAngle = useSpring({
    from: { count: 360 },
    count: inView ? 0 : 360,
    to: { count: 0 },
    // reset: false,
    // reset: true,
    config: {
      mass: 4,
      friction: 46,
    },
  });

  const turnAngleValue = aniAngle.count.to((value) => value);

  return (
    <div className="h-36 w-36 xl:h-64 xl:w-64 bg-white shadow-md rounded-full ">
      <MyPieChart
        data={data}
        margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
        valueFormat={" >-~%"}
        innerRadius={0.55}
        startAngle={turnAngleValue}
        padAngle={3}
        cornerRadius={16}
        activeOuterRadiusOffset={8}
        colors={data.map((d) => d.color)}
        borderWidth={15}
        borderColor={{ theme: "background" }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        fill={[
          {
            match: {
              id: "ruby",
            },
            id: "dots",
          },
          {
            match: {
              id: "c",
            },
            id: "dots",
          },
          {
            match: {
              id: "go",
            },
            id: "dots",
          },
          {
            match: {
              id: "python",
            },
            id: "dots",
          },
          {
            match: {
              id: "scala",
            },
            id: "lines",
          },
          {
            match: {
              id: "lisp",
            },
            id: "lines",
          },
          {
            match: {
              id: "elixir",
            },
            id: "lines",
          },
          {
            match: {
              id: "javascript",
            },
            id: "lines",
          },
        ]}
        animate={false}
        legends={[]}
      />
    </div>
  );
};

export default PieChart;
