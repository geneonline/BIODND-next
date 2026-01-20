/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import eventImg from "@/assets/thermo/thermo_event_banner.webp";

import pd1 from "@/assets/thermo/scientific_day/Attune-NxT.avif";
import pd2 from "@/assets/thermo/lab/Chromatography-Consumables.avif";
import pd3 from "@/assets/thermo/scientific_day/Ion-Torrent-Genexus.avif";
import pd4 from "@/assets/thermo/lab/IRMS.avif";
import pd5 from "@/assets/thermo/scientific_day/KingFisher-Apex.avif";
import pd6 from "@/assets/thermo/lab/Pharma-Analytics-kits.avif";
import pd7 from "@/assets/thermo/lab/ProFlex-PCR-system.avif";
import pd8 from "@/assets/thermo/scientific_day/Single-Use-Flexible-Containment.avif";
import pd9 from "@/assets/thermo/lab/Ion-Chromatography-Inuvion-NPI.webp";
import pd10 from "@/assets/thermo/lab/MarqMetrix-AIO-C.avif";
import pd11 from "@/assets/thermo/scientific_day/MAX_iR-Display-2-NEW.avif";
import pd12 from "@/assets/thermo/lab/Process-11_0001_new-Logo2016.avif";
import pd13 from "@/assets/thermo/lab/TruScan-G3-HOME.avif";
import pd14 from "@/assets/thermo/scientific_day/TSQ.avif";
import pd15 from "@/assets/thermo/lab/Vanquish-HPLC-Systems.avif";

const Thermo_lab = () => {
  const [eventDay, setEventDay] = useState(24);
  return (
    <div className="mt-15 xl:mt-19 w-full ">
      <div className="py-15 max-w-[1400px] mx-auto px-[5%]">
        <div className="w-full flex justify-center">
          <img src={eventImg} alt="event_banner" />
        </div>
        <div className=" flex flex-col-reverse md:flex-row">
          <div className="md:w-4/5">
            {/* Lab Indonesia */}

            <h5 className="pt-10 text-18px font-bold ">
              Wednesday, April 24 to Friday, April 26
            </h5>
            <h1 className="text-5xl font-extrabold">Lab Indonesia 2024</h1>
            <p className="font-bold mt-10">
              Join us at the Thermo Fisher Scientific Day Event and Lab
              Indonesia, where scientific innovation meets practical
              application. Explore how our solutions can catalyze breakthroughs
              and advance material analysis across industries and research
              domains. Secure your spot today by registering at{" "}
              <a
                className="hover:underline text-main-color"
                href="https://thermofisher.com/2024idevents"
              >
                thermofisher.com/2024idevents
              </a>
              . Don't miss the opportunity to delve into diverse topics,
              including accelerating drug pipelines from discovery to QC,
              ensuring food safety and quality, tackling challenges in advanced
              battery technology, and monitoring environmental impacts. We are
              committed to bringing science to life, fostering imagination,
              invention, and inspiration. Connect and collaborate with us as we
              envision a future shaped by scientific excellence.
            </p>

            <div className="mt-8">
              <h3 className="text-24px font-bold">Date and time</h3>
              <p className="pt-2 text-sm1">
                24 - 26 April 2024 · 11.30AM - 2.50PM (GMT +7)
              </p>
            </div>

            <div className="mt-15">
              <h3 className="text-24px font-bold">Venue</h3>
              <p className="pt-2 text-sm1">
                Jakarta Convention Centre Connecting Hall, Booth G01
              </p>
            </div>

            <div className="mt-15">
              <h3 className="text-24px font-bold">Location</h3>
              <p className="pt-2 text-sm1">
                Jl.Jend. Gatot Subroto Jakarta 10270
              </p>
            </div>

            <div className="mt-15">
              <h3 className="text-24px font-bold">About this event</h3>
              <p className="pt-2 leading-normal text-main-text-gray">
                We warmly invite you to join us at the Thermo Fisher Scientific
                Day event and Lab Indonesia 2024. Discover how you can go a step
                beyond with our comprehensive solutions in key segments of
                healthcare, biotechnology and biopharma, applied science, clean
                energy, food and agriculture, and cell and gene therapy.
              </p>
              <p className="pt-2 leading-normal text-main-text-gray">
                We look forward to the opportunity to connect and collaborate
                with you.
              </p>

              <br />
            </div>

            <div className="mt-15">
              <h3 className="text-24px font-bold pb-3">Demo Session</h3>

              <div className="flex space-x-2 font-bold text-18px">
                <button
                  className={`px-5 py-2 border-0.5px border-db-Asearch rounded-t-5px ${
                    eventDay === 24
                      ? "text-white bg-main-color"
                      : "text-main-color bg-white"
                  }`}
                  onClick={() => setEventDay(24)}
                >
                  24/04/2024
                </button>
                <button
                  className={`px-5 py-2 border-0.5px border-db-Asearch rounded-t-5px ${
                    eventDay === 25
                      ? "text-white bg-main-color"
                      : "text-main-color bg-white"
                  }`}
                  onClick={() => setEventDay(25)}
                >
                  25/04/2024
                </button>
                <button
                  className={`px-5 py-2 border-0.5px border-db-Asearch rounded-t-5px ${
                    eventDay === 26
                      ? "text-white bg-main-color"
                      : "text-main-color bg-white"
                  }`}
                  onClick={() => setEventDay(26)}
                >
                  26/04/2024
                </button>
              </div>

              {eventDay === 24 && (
                <table
                  className="border border-main-text-gray text-sm1 "
                  id="table--1878449734"
                >
                  <tbody>
                    <tr className="bg-main-color text-white">
                      <td className="w-1/5 p-3">
                        <b>Time (GMT +7)</b>
                      </td>
                      <td className="w-2/5">
                        <b>Vertical Segment Area</b>
                      </td>
                      <td className="w-2/5">
                        <b>Topic</b>
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:00-11:20</td>
                      <td className=" py-3">Biotechnology</td>
                      <td className=" py-3">Countess and Qubit Product Demo</td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:30-11:50</td>
                      <td className=" py-3">Applied Science</td>
                      <td className=" py-3">
                        Environmental Quality Water Testing - Thermo Scientific™
                        Dionex Inuvion IC system Product Demo
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:00-14:20</td>
                      <td className=" py-3">Biotechnology</td>
                      <td className=" py-3">
                        Thermo Scientific™ TruScan™ G3 Handheld Raman Analyzer
                        Product Demo
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:30-14:50</td>
                      <td className=" py-3">Food & agriculture</td>
                      <td className=" py-3">Proflex PCR System Product Demo</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {eventDay === 25 && (
                <table
                  className="border border-main-text-gray text-sm1 "
                  id="table--1878449734"
                >
                  <tbody>
                    <tr className="bg-main-color text-white">
                      <td className="w-1/5 p-3">
                        <b>Time (GMT +7)</b>
                      </td>
                      <td className="w-2/5">
                        <b>Vertical Segment Area</b>
                      </td>
                      <td className="w-2/5">
                        <b>Topic</b>
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:00-11:20</td>
                      <td className=" py-3">Healthcare</td>
                      <td className=" py-3">3D Cell Culture Model Demo</td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:30-11:50</td>
                      <td className=" py-3">Applied Science</td>
                      <td className=" py-3">
                        Process Analytical Technology - Unlocking Insights with
                        MarqMetrix All-In-One Process Raman Analyzer
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:00-14:20</td>
                      <td className=" py-3">Applied Science</td>
                      <td className=" py-3">
                        Continuous Gas Analysis in ppb Level Using Advance FTIR
                        Technology
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:30-14:50</td>
                      <td className=" py-3">Biotechnology</td>
                      <td className=" py-3">
                        EVOS M5000 Imaging System Product Demo
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {eventDay === 26 && (
                <table
                  className="border border-main-text-gray text-sm1 "
                  id="table--1878449734"
                >
                  <tbody>
                    <tr className="bg-main-color text-white">
                      <td className="w-1/5 p-3">
                        <b>Time (GMT +7)</b>
                      </td>
                      <td className="w-2/5">
                        <b>Vertical Segment Area</b>
                      </td>
                      <td className="w-2/5">
                        <b>Topic</b>
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:00-11:20</td>
                      <td className=" py-3">Biotechnology</td>
                      <td className=" py-3">
                        Multiskan SkyHigh Microplate Spectrophotometer Product
                        Demo
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">11:30-11:50</td>
                      <td className=" py-3">Applied Science</td>
                      <td className=" py-3">
                        Food contaminants: PFAS and pesticide residues analysis
                        in Food
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:00-14:20</td>
                      <td className=" py-3">Biotechnology</td>
                      <td className=" py-3">
                        Introduction to Bioprocess by Design
                      </td>
                    </tr>
                    <tr className="border-footer-text border-b-0.5px">
                      <td className=" px-1">14:30-14:50</td>
                      <td className=" py-3">Applied Science</td>
                      <td className=" py-3">
                        How to Perform Effective Measurement with Your
                        Rheometers
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              <p className="text-main-text-gray text-sm1 pt-2">
                *Timings are subjected to change
              </p>

              <br />
            </div>

            <div className="mt-15">
              <h3 className="text-24px font-bold">Key Instrument Highlight</h3>
              <div className="my-5 flex flex-wrap">
                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd1} alt="Attune™ NxT" />
                  </div>
                  <p className="px-3 pt-3 text-center">Attune™ NxT</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd2} alt="Chromatography Consumables" />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Chromatography Consumables
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd3} alt="Indiko™" />
                  </div>
                  <p className="px-3 pt-3 text-center">Ion Torrent™ Genexus™</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd4} alt="IRMS" />
                  </div>
                  <p className="px-3 pt-3 text-center">IRMS</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd5} alt="KingFisher" />
                  </div>
                  <p className="px-3 pt-3 text-center">KingFisher</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd6} alt="Pharma Analytics kits" />
                  </div>
                  <p className="px-3 pt-3 text-center">Pharma Analytics kits</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd7} alt="ProFlex PCR system" />
                  </div>
                  <p className="px-3 pt-3 text-center">ProFlex PCR system</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd8} alt="SUT consumables" />
                  </div>
                  <p className="px-3 pt-3 text-center">SUT consumables</p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd9}
                      alt="Thermo Scientific™ Dionex Inuvion IC system"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific™ Dionex Inuvion IC system
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd10}
                      alt="Thermo Scientific™ MarqMetrix All-In-One Process Raman Analyzer"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific™ MarqMetrix All-In-One Process Raman
                    Analyzer
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd11}
                      alt="TThermo Scientific™ MAX-iR FTIR Gas Analyzers"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific™ MAX-iR FTIR Gas Analyzers
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd12}
                      alt="Thermo Scientific Process 11 Twin-screw Extruder"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific Process 11 Twin-screw Extruder
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd13}
                      alt="Thermo Scientific™ TruScan™ G3 Handheld Raman Analyzer"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific™ TruScan™ G3 Handheld Raman Analyzer
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img
                      src={pd14}
                      alt="Thermo Scientific™ TSQ Altis Plus Mass Spectrometer"
                    />
                  </div>
                  <p className="px-3 pt-3 text-center">
                    Thermo Scientific™ TSQ Altis Plus Mass Spectrometer
                  </p>
                </div>

                <div className="m-2 w-[230px] py-5 border-0.5px border-db-Asearch rounded-10px bg-white flex flex-col items-center">
                  <div className="">
                    <img src={pd15} alt="Vanquish HPLC Systems" />
                  </div>
                  <p className="px-3 pt-3 text-center">Vanquish HPLC Systems</p>
                </div>
              </div>

              <br />
            </div>

            {/* <a
              target="_self"
              href="https://tinyurl.com/thermo-biodnd"
              className="pointer-events-none block w-fit mt-10 px-5 xl:px-10 py-4 text-white md:text-18px xl:text-2xl bg-main-color hover:bg-black rounded-full text-center whitespace-nowrap"
            >
              Register Now
            </a> */}
          </div>

          <div className="w-1/5 md:ml-5 xl:ml-20 mt-5">
            {/* <a
              target="_self"
              href="https://tinyurl.com/thermo-biodnd"
              className="pointer-events-none block w-fit mt-10 px-5 xl:px-10 py-4 text-white md:text-18px xl:text-2xl bg-main-color hover:bg-black rounded-full text-center whitespace-nowrap"
            >
              Register Now
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thermo_lab;
