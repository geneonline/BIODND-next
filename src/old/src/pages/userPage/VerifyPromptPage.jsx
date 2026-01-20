import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Logo from "@/assets/svg/LOGO.svg";
import resendmail_icon from "@/assets/svg/login_signup/resendmail.svg";

export default function VerifyPromptPage() {
  const { sendVerifyMail } = useAuth();
  const location = useLocation();
  const email = location.state?.email || "";

  const [resentLoading, setResentLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setResentLoading(true);
    try {
      await sendVerifyMail(email);
      toast.success("Email has been sent!");
    } catch (err) {
      toast.error("Resend failed, please try again");
    } finally {
      setResentLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />
        <div className="relative h-full w-full sm:w-[480px] flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-2xl">
          <Link to={"/"}>
            <img src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>
          <div className="flex flex-col items-center w-full gap-9">
            <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center mb-2">
              Please Verify Your Email
            </h2>
            <div className="flex flex-col items-center w-full gap-1">
              <span className="text-textColor-secondary text-center text-base">
                We’ve sent an email to
              </span>
              <span className="text-[#7369CC] text-base font-medium text-center">
                {email || "xxxx@xxxxx.com"}
              </span>
              <span className="text-textColor-secondary text-center text-base">
                Just click the link to verify and sign in
              </span>
            </div>
            <div className="flex flex-col items-center my-2">
              <img src={resendmail_icon} alt="verify mail icon" />
            </div>
            <div className="w-full flex justify-center items-center">
              <span className="text-sm1 text-textColor-secondary mr-2">
                Haven’t got the email?
              </span>
              <button
                disabled={resentLoading}
                onClick={handleResend}
                className="text-primary-default hover:text-primary-hovered text-sm1 font-normal underline transition cursor-pointer "
                tabIndex={0}
              >
                {resentLoading ? "Resending..." : "Resent email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
