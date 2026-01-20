"use client";

import Hero from "@/components/Home/sections/Hero";
import Logos from "@/components/Home/sections/Logos";
import Streamline from "@/components/Home/sections/Streamline";
import Richdata from "@/components/Home/sections/Richdata";
import Howworks from "@/components/Home/sections/Howworks";

export default function HomePage() {
  // In the original HomePage, token was fetched from localStorage or passed down.
  // Here we can access it within the components if they use "use client" and access localStorage,
  // or we can fetch it here (since this is "use client") and pass it down.
  // The components Hero, Streamline, Richdata, Faq, Footer all accept `token`.
  // Let's fetch it here to be consistent with the original design.

  return (
    <>
      <Hero />
      <Logos />
      <Streamline />
      <Richdata />
      <Howworks />
    </>
  );
}
