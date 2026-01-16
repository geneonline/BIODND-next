"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/svg/LOGO_white.svg";
import go_logo from "@/assets/webp/footer/geneonline_logo.webp";
import axios from "axios";
import Image from "next/image";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const Footer = ({ token }: { token: string | null }) => {
  const router = useRouter();

  // Insights AI(ChatDND) behavior replacement
  const handleGoToChatDND = async (e: any) => {
    e.preventDefault();

    // Use token from props or localStorage (but props is better if passed down)
    // The original code re-read localStorage. We should arguably rely on `token` prop if it's reliable.
    // But let's check localStorage if token prop is null/undefined to be safe, or just use prop.
    const currentToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!currentToken) {
      router.push("/account/login");
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/api/ChatDND/Go`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const result =
        typeof response.data === "string" ? response.data : response.data.url;
      if (typeof result === "string" && result.startsWith("http")) {
        window.location.href = result;
      } else {
        alert("unexpected response format");
      }
    } catch (error) {
      alert("API error, please try again later.");
    }
  };

  return (
    <footer className="w-full self-stretch bg-Gray-950 inline-flex flex-col justify-center items-center overflow-hidden">
      <div className="self-stretch px-8 md:px-16 lg:px-20 xl:px-28 py-20 flex flex-col justify-center items-center gap-16">
        <div className="w-full max-w-[1200px] flex flex-col justify-start items-start gap-16">
          <div className="self-stretch inline-flex flex-col gap-y-16 md:gap-y-20  xl:flex-row justify-between items-start content-start">
            <div className="w-64 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch md:h-16 relative overflow-hidden">
                <Image className="w-[123px] md:w-full" src={logo} alt="logo" />
              </div>
              <div className="self-stretch h-4 justify-center text-white text-sm1 font-normal  leading-tight">
                Data Insights for Faster, Smarter Deals
              </div>
              <div className="inline-flex justify-start items-center">
                <div className="w-20 justify-center text-white text-sm1 font-normal  leading-tight">
                  Powered by
                </div>
                <a target="_blank" href="https://geneonline.com">
                  <Image
                    className="w-12 h-6"
                    src={go_logo}
                    alt="geneonline logo"
                  />
                </a>
              </div>
              <div className="self-stretch h-4 justify-center text-white text-sm1 font-normal  leading-tight">
                Follow us on social media
              </div>

              <div className="flex justify-start items-center gap-1.5">
                <a
                  target="_blank"
                  href="https://www.facebook.com/people/BIODND/61553977141306/"
                  className="w-7 h-7 relative overflow-hidden"
                >
                  <svg
                    width={30}
                    height={30}
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-[30px] h-[30px] relative"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M27.5 15C27.5 8.1 21.9 2.5 15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.05 6.8 26.0875 12.5 27.25V18.75H10V15H12.5V11.875C12.5 9.4625 14.4625 7.5 16.875 7.5H20V11.25H17.5C16.8125 11.25 16.25 11.8125 16.25 12.5V15H20V18.75H16.25V27.4375C22.5625 26.8125 27.5 21.4875 27.5 15Z"
                      fill="#FFFFFF"
                    />
                  </svg>{" "}
                </a>

                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/100426332/admin/feed/posts/"
                  className="w-7 h-7 relative overflow-hidden"
                >
                  <svg
                    width={30}
                    height={30}
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-[30px] h-[30px] relative"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M23.75 3.75C24.413 3.75 25.0489 4.01339 25.5178 4.48223C25.9866 4.95107 26.25 5.58696 26.25 6.25V23.75C26.25 24.413 25.9866 25.0489 25.5178 25.5178C25.0489 25.9866 24.413 26.25 23.75 26.25H6.25C5.58696 26.25 4.95107 25.9866 4.48223 25.5178C4.01339 25.0489 3.75 24.413 3.75 23.75V6.25C3.75 5.58696 4.01339 4.95107 4.48223 4.48223C4.95107 4.01339 5.58696 3.75 6.25 3.75H23.75ZM23.125 23.125V16.5C23.125 15.4192 22.6957 14.3828 21.9315 13.6185C21.1672 12.8543 20.1308 12.425 19.05 12.425C17.9875 12.425 16.75 13.075 16.15 14.05V12.6625H12.6625V23.125H16.15V16.9625C16.15 16 16.925 15.2125 17.8875 15.2125C18.3516 15.2125 18.7967 15.3969 19.1249 15.7251C19.4531 16.0533 19.6375 16.4984 19.6375 16.9625V23.125H23.125ZM8.6 10.7C9.15695 10.7 9.6911 10.4788 10.0849 10.0849C10.4788 9.6911 10.7 9.15695 10.7 8.6C10.7 7.4375 9.7625 6.4875 8.6 6.4875C8.03973 6.4875 7.50241 6.71007 7.10624 7.10624C6.71007 7.50241 6.4875 8.03973 6.4875 8.6C6.4875 9.7625 7.4375 10.7 8.6 10.7ZM10.3375 23.125V12.6625H6.875V23.125H10.3375Z"
                      fill="#FFFFFF"
                    />
                  </svg>{" "}
                </a>

                <a
                  target="_blank"
                  href="https://line.me/R/ti/p/@836xikku"
                  className="w-7 h-7 relative overflow-hidden flex justify-center items-center"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M4.31992 1.91992C2.99512 1.91992 1.91992 2.99512 1.91992 4.31992V19.6799C1.91992 21.0047 2.99512 22.0799 4.31992 22.0799H19.6799C21.0047 22.0799 22.0799 21.0047 22.0799 19.6799V4.31992C22.0799 2.99512 21.0047 1.91992 19.6799 1.91992H4.31992ZM11.9999 5.27992C15.9695 5.27992 19.1999 7.85235 19.1999 11.0155C19.1999 12.2779 18.7004 13.4211 17.654 14.5443C16.9004 15.3987 15.677 16.3392 14.549 17.1168C13.421 17.8848 12.3839 18.4893 11.9999 18.6477C11.8463 18.7101 11.7311 18.7387 11.6399 18.7387C11.3231 18.7387 11.3515 18.4035 11.3755 18.2643C11.3947 18.1587 11.4815 17.6587 11.4815 17.6587C11.5055 17.4811 11.5291 17.1988 11.4571 17.0212C11.3755 16.8244 11.0539 16.7232 10.8187 16.6752C7.36267 16.224 4.79992 13.8475 4.79992 11.0155C4.79992 7.85235 8.03032 5.27992 11.9999 5.27992ZM11.5162 9.11898C11.2743 9.12347 11.0399 9.30802 11.0399 9.59992V12.4799C11.0399 12.7449 11.255 12.9599 11.5199 12.9599C11.7849 12.9599 11.9999 12.7449 11.9999 12.4799V11.098L13.049 12.7584C13.3207 13.1385 13.9199 12.947 13.9199 12.4799V9.59992C13.9199 9.33496 13.7049 9.11992 13.4399 9.11992C13.175 9.11992 12.9599 9.33496 12.9599 9.59992V11.0399L11.9109 9.32148C11.809 9.17892 11.6613 9.11629 11.5162 9.11898ZM7.19992 9.11992C6.93496 9.11992 6.71992 9.33496 6.71992 9.59992V12.4799C6.71992 12.7449 6.93496 12.9599 7.19992 12.9599H8.63992C8.90488 12.9599 9.11992 12.7449 9.11992 12.4799C9.11992 12.215 8.90488 11.9999 8.63992 11.9999H7.67992V9.59992C7.67992 9.33496 7.46488 9.11992 7.19992 9.11992ZM10.0799 9.11992C9.81496 9.11992 9.59992 9.33496 9.59992 9.59992V12.4799C9.59992 12.7449 9.81496 12.9599 10.0799 12.9599C10.3449 12.9599 10.5599 12.7449 10.5599 12.4799V9.59992C10.5599 9.33496 10.3449 9.11992 10.0799 9.11992ZM14.8799 9.11992C14.615 9.11992 14.3999 9.33496 14.3999 9.59992V12.4799C14.3999 12.7449 14.615 12.9599 14.8799 12.9599H16.3199C16.5849 12.9599 16.7999 12.7449 16.7999 12.4799C16.7999 12.215 16.5849 11.9999 16.3199 11.9999H15.3599V11.5199H16.3199C16.5854 11.5199 16.7999 11.3049 16.7999 11.0399C16.7999 10.775 16.5854 10.5599 16.3199 10.5599H15.3599V10.0799H16.3199C16.5849 10.0799 16.7999 9.86488 16.7999 9.59992C16.7999 9.33496 16.5849 9.11992 16.3199 9.11992H14.8799Z"
                      fill="white"
                    ></path>
                  </svg>
                </a>

                <a
                  target="_blank"
                  href="https://www.youtube.com/@GeneOnline"
                  className="w-7 h-7 relative overflow-hidden flex justify-center items-center"
                >
                  <svg
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M13.305 0C13.9725 0.00375 15.6425 0.0199999 17.4175 0.0912499L18.0475 0.11875C19.8337 0.2025 21.6187 0.3475 22.505 0.59375C23.6863 0.92625 24.6138 1.89375 24.9275 3.12125C25.4275 5.07125 25.49 8.87375 25.4975 9.795L25.4988 9.985V10.2025C25.49 11.1237 25.4275 14.9275 24.9275 16.8762C24.61 18.1075 23.6812 19.0763 22.505 19.4038C21.6187 19.65 19.8337 19.795 18.0475 19.8787L17.4175 19.9075C15.6425 19.9775 13.9725 19.995 13.305 19.9975L13.0112 19.9988H12.6925C11.28 19.99 5.3725 19.9263 3.4925 19.4038C2.3125 19.0713 1.38375 18.1038 1.07 16.8762C0.57 14.9262 0.5075 11.1237 0.5 10.2025V9.795C0.5075 8.87375 0.57 5.07 1.07 3.12125C1.3875 1.89 2.31625 0.92125 3.49375 0.595C5.3725 0.0712498 11.2812 0.0075 12.6938 0H13.305ZM10.4987 5.625V14.375L17.9987 10L10.4987 5.625Z"
                      fill="white"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex-1 w-full xl:max-w-[610px] min-w-96 flex flex-col gap-y-8 md:flex-row justify-between items-start whitespace-nowrap">
              <div className="w-28 self-stretch inline-flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-white text-base font-semibold  leading-relaxed">
                  Account
                </div>
                <div className="flex flex-col justify-start items-start gap-4">
                  {!token && (
                    <Link
                      href="/account/login"
                      className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                    >
                      Login
                    </Link>
                  )}
                  <Link
                    href="/subscribe"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Pricing
                  </Link>
                </div>
              </div>

              <div className="self-stretch inline-flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-white text-base font-semibold  leading-relaxed">
                  About
                </div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <Link
                    href="/about"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    About BIODND
                  </Link>
                  <Link
                    href="/contact"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/contact"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Partnership
                  </Link>
                  <a
                    target="_blank"
                    href="https://geneonline.com"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    GeneOnline News
                  </a>
                </div>
              </div>

              <div className="w-28 self-stretch inline-flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-white text-base font-semibold  leading-relaxed">
                  Explore
                </div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <Link
                    href={"/database/serach"}
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Asset Explore
                  </Link>

                  <Link
                    href={"/company-home"}
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Company Search
                  </Link>

                  <button
                    type="button"
                    onClick={handleGoToChatDND}
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Insights AI
                  </button>

                  <Link
                    href="/event"
                    className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight"
                  >
                    Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-12 flex flex-col justify-start items-center gap-4">
            <div className="self-stretch h-px bg-white" />
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-center text-Gray-400 text-sm1 font-normal  leading-tight">
                BIODND @ All Rights Reserved.
                <Link
                  href="/terms"
                  target="_blank"
                  className="pl-1 hover:underline"
                >
                  Terms & Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
