// components/DualRangeSlider.jsx
import { useState, useEffect } from "react";
import Slider from "rc-slider";

const DualRangeSlider = ({ data, onRangeChange }) => {
  const [range, setRange] = useState([1, 3]); // 預設範圍索引，例如 "11-50" 和 "501-1000"

  useEffect(() => {
    handleRangeChange(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    const [min, max] = newRange;
    const selectedRanges = data.slice(min, max + 1);
    onRangeChange(selectedRanges);
  };

  const marks = data.reduce((acc, label, index) => {
    acc[index] = label;
    return acc;
  }, {});

  return (
    <div className="p-4">
      <Slider
        range
        min={0}
        max={data.length - 1}
        step={1}
        marks={marks}
        defaultValue={range}
        value={range}
        dotStyle={{ backgroundColor: "#41ff44", height: "10px", width: "10px" }}
        onChange={handleRangeChange}
        allowCross={false}
        // styles={}
        railStyle={{
          backgroundColor: "#ddd",
          height: 8,
        }}
        trackStyle={[
          {
            backgroundColor: "#9b18ff",
            height: 8,
          },
          {
            backgroundColor: "#1890ff",
            height: 8,
          },
        ]}
        handleStyle={[
          {
            borderColor: "#1890ff",
            height: 24,
            width: 24,
            marginLeft: -12,
            marginTop: -8,
            backgroundColor: "#fff",
          },
          {
            borderColor: "#1890ff",
            height: 24,
            width: 24,
            marginLeft: -12,
            marginTop: -8,
            backgroundColor: "#fff",
          },
        ]}
      />
      <div className="flex justify-between mt-4 text-sm text-gray-700">
        <span>{data[range[0]]}</span>
        <span>{data[range[1]]}</span>
      </div>
    </div>
  );
};

export default DualRangeSlider;
