import ReactECharts from "echarts-for-react";

const EChart = ({ input }) => {
  const datas = [
    {
      series_name: "Companies by Area",
      data: [
        { value: 0.3237, name: "United State" },
        { value: 0.1907, name: "Taiwan" },
        { value: 0.1609, name: "China" },
        { value: 0.1197, name: "Japan" },
        { value: 0.0532, name: "South Korea" },
        { value: 0.1518, name: "other" },
      ],
    },
    {
      series_name: "Asset type",
      data: [
        { value: 0.3358, name: "Biotech/Pharma products" },
        { value: 0.4911, name: "Medtech Products" },
        { value: 0.08, name: "Services" },
        { value: 0.0976, name: "Technologies" },
      ],
    },
    {
      series_name: "Companies by Type",
      data: [
        { value: 0.08, name: "Academic" },
        { value: 0.32, name: "Biotech or Pharma" },
        { value: 0.28, name: "Therapeutic R&D" },
        { value: 0.16, name: "Medical DeviceD" },
        { value: 0.16, name: "Other" },
      ],
    },
  ];
  const option = {
    color: ["#09B1A7", "#39CEF3", "#1E99F1", "#7280FA", "#A1DC67", "#c7dc67"],
    tooltip: {
      trigger: "item",
      formatter(params) {
        return `${params.seriesName}<br>${params.marker}${params.name}<span style="float: right; margin-left: 20px"><b>${params.percent}%</b></span>`;
      },
    },
    series: [
      {
        name: datas[input].series_name,
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 20,
          borderColor: "#fff",
          borderWidth: 5,
        },
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: datas[input].data,
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

export default EChart;
