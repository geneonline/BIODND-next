import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Logo from "@/assets/svg/LOGO.svg";
import PwShow from "@/assets/svg/login_signup/pw_show.svg";
import PwHide from "@/assets/svg/login_signup/pw_hide.svg";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 先讀 token，真正驗證以 useUser 為主
  const token = localStorage.getItem("token");
  const { userData, userLoading, userError } = useUser(token);

  // 僅在 loading 結束 AND 有 userData 時才導頁 (指自動登入狀態)
  useEffect(() => {
    if (!userLoading && token && userData) {
      const redirectTo = location.state?.from?.pathname || "/database/search";
      navigate(redirectTo, { replace: true });
    }
  }, [userLoading, token, userData, location, navigate]);

  // 若 local token 存在、但 userError 代表 token 失效，要自動清掉
  useEffect(() => {
    if (!userLoading && !userData && token && userError) {
      localStorage.removeItem("token");
      // 用 replace 避免 push 到 history
      navigate("/account/login", { replace: true });
    }
  }, [userLoading, userData, token, userError, navigate]);

  const { login, sendVerifyMail, loading, error, errorCode, clearError } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (error) {
      // 如果有錯誤，清除 email 和 password
      // setEmail("");
      // setPassword("");
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");

    try {
      await sendVerifyMail(email);
      setResendMsg(
        "✅ The verification letter has been resent, please check your mailbox"
      );
    } catch {
      setResendMsg("❌ Resend verification letter failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊效果 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />

        {/* 主要內容區塊 */}
        <div className="relative w-full sm:w-[480px] h-full sm:h-fit flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-10px">
          {/* LOGO */}
          <Link to={"/"}>
            <img src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>
          {/* 內容區塊 */}
          <div className="flex flex-col items-center w-full gap-9">
            {/* 標題 */}
            <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center">
              Welcome to BIODND
            </h2>

            {/* Google 登入 */}
            <div className="w-full">
              <GoogleLoginButton />
            </div>

            {/* 表單表單區 */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-6"
              autoComplete="off"
            >
              {/* Email 輸入 */}
              <label className="flex flex-col gap-1">
                <span className="text-textColor-primary text-sm1 font-medium">
                  Work email
                </span>
                <input
                  id="Email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=" border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none"
                />
              </label>

              {/* Password 輸入 */}
              <label className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-textColor-primary text-sm1 font-medium ">
                    Password
                  </span>
                  {/* 忘記密碼 */}
                  <Link
                    to="/account/resendPassword"
                    state={{ email }}
                    className="text-sm1 text-primary-default hover:text-primary-hovered hover:underline ml-auto"
                    tabIndex={-1}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-interface-gray-light text-textColor-secondary rounded-10px px-4 py-3.5 text-base focus:border-primary-color-blue focus:ring-0 focus:outline-none pr-12"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                    tabIndex={0}
                  >
                    <img
                      src={showPassword ? PwShow : PwHide}
                      alt={showPassword ? "hide password" : "show password"}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 px-5 transition-all"
              >
                {loading ? "Login..." : "Login"}
              </button>
            </form>

            {errorCode === "1060" && (
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="mt-2 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-10px py-3 px-5 transition-all"
                >
                  {resendLoading ? "resending" : "resend verification email"}
                </button>
                {resendMsg && (
                  <p
                    className={
                      resendMsg.startsWith("✅")
                        ? "text-green-600"
                        : "text-warning"
                    }
                  >
                    {resendMsg}
                  </p>
                )}
              </div>
            )}
          </div>
          {/* 已有帳號導連結 */}
          <div className="w-full text-center mt-5 gap-[10px]">
            <span className="text-sm1 text-textColor-secondary mr-2">
              Don’t have an account?
            </span>
            <Link
              to="/account/register"
              className="text-primary-default hover:text-primary-hovered text-sm1 font-normal underline transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
