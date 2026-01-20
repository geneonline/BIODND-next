import google_cloud_logo from "@/assets/webp/home/logos/google_cloud_logo.webp";
import nvidia from "@/assets/webp/home/logos/nvidia.webp";
import core8 from "@/assets/webp/home/logos/core8.webp";
import scalehealth from "@/assets/webp/home/logos/scalehealth.webp";
import selltech from "@/assets/webp/home/logos/selltech.webp";
import sparklab from "@/assets/webp/home/logos/sparklab.webp";
import trade from "@/assets/webp/home/logos/trade.webp";

export const partner_Logos = [
  { name: "", url: google_cloud_logo },
  { name: "", url: nvidia },
  { name: "", url: core8 },
  { name: "", url: scalehealth },
  { name: "", url: selltech },
  { name: "", url: sparklab },
  { name: "", url: trade },
];

const Logos = () => {
  const marquees = ["marquee", "marquee2"];

  return (
    <div className="relative w-full overflow-hidden bg-white h-[98px]">
      {/* --- 小於 lg 時才顯示跑馬燈 --- */}
      <div className="lg:hidden">
        {marquees.map((anim, idx) => (
          <div
            key={idx}
            className={`
              absolute top-0 left-0 py-2
              animate-${anim}
              whitespace-nowrap flex space-x-8 pr-8 min-w-full
            `}
          >
            {partner_Logos.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-[74px] scale-110 flex items-center justify-center"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="object-contain max-h-full"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* --- lg 以上改成正常排列 --- */}
      <div className="hidden lg:flex items-center justify-center space-x-8 h-full">
        {partner_Logos.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-32 h-[74px] scale-110 flex items-center justify-center"
          >
            <img
              src={item.url}
              alt={item.name}
              className="object-contain max-h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logos;
