import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Logos from "./sections/Logos";
import Streamline from "./sections/Streamline";
import Richdata from "./sections/Richdata";
import Howworks from "./sections/Howworks";
import Faq from "../userPage/components/Faq";
import Footer from "./sections/Footer";
import Carousel from "@/pages/Home/components/Carousel";

const HomePage = () => {
  const token = localStorage.getItem("token");
  return (
    <div className="w-full bg-white relative">
      {/* Top Nav */}
      <Navbar />

      <Hero token={token} />
      <Logos />
      <Streamline token={token} />
      <Richdata token={token} />
      <Howworks token={token} />
    </div>
  );
};

export default HomePage;
