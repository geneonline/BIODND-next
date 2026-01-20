import { useState, useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import axios from "axios";
import Logo from "@/assets/svg/LOGO.svg";
import { toast } from "react-toastify";
import PwShow from "@/assets/svg/login_signup/pw_show.svg";
import PwHide from "@/assets/svg/login_signup/pw_hide.svg";
// 如後續有“eye/hide”SVG，可 import 置換下方👁️
const baseURL = import.meta.env.VITE_Effect_API;

// 密碼格式驗證函數（同 RegisterPage 規則）
const validatePassword = (pw) => {
  const lengthValid = pw.length >= 8;
  const digitValid = /[0-9]/.test(pw);
  const lowerValid = /[a-z]/.test(pw);
  const upperValid = /[A-Z]/.test(pw);
  return lengthValid && digitValid && lowerValid && upperValid;
};

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  // 登入者自動導頁保護
  const localtoken = localStorage.getItem("token");
  useEffect(() => {
    if (localtoken) {
      const redirectTo = location.state?.from?.pathname || "/database/search";
      navigate(redirectTo, { replace: true });
    }
  }, [localtoken, navigate, location]);

  const token = params.get("token");
  const safeToken = encodeURIComponent(token);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  // 顯示密碼錯誤訊息
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!validatePassword(newPwd)) {
      setShowPasswordError(true);
      return;
    }
    setShowPasswordError(false);
    if (newPwd !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${baseURL}/api/Account/ResetPassword`,
        { token: safeToken, newPKey: newPwd, newPKeyConfirm: confirmPwd },
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/account/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      // 如果有錯誤，清除
      setNewPwd("");
      setConfirmPwd("");
      console.error(error);
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen h-[800px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_143.75%_143.75%_at_50.00%_58.37%,_white_0%,_#EEEEEE_100%)]">
      <div className="relative w-full sm:w-fit h-full sm:h-fit max-w-full">
        {/* 背景模糊區塊 */}
        <div className="hidden sm:block absolute inset-0 bg-primary-color-blue blur-[50px] opacity-20 rounded-10px" />
        <div className="relative h-full w-full sm:w-[400px] flex flex-col items-center mx-0 sm:mx-4 px-10 py-10 sm:py-9 gap-8 bg-white rounded-none sm:rounded-2xl">
          {/* LOGO */}
          <Link to={"/"}>
            <img src={Logo} alt="BioDND LOGO" className="w-[138px] h-[36px]" />
          </Link>
          {/* 內容區 */}
          <div className="flex flex-col items-center w-full gap-9">
            <h2 className=" font-bold text-[30px] leading-140 text-[#222326] text-center mb-2">
              Reset Your Password
            </h2>
            <form
              onSubmit={handleReset}
              className="flex flex-col w-full gap-6"
              autoComplete="off"
            >
              <div className="flex flex-col gap-4">
                {/* 密碼欄 */}
                <label className="flex flex-col gap-1 w-full">
                  <span className="font-inter text-base text-[#222326] mb-1">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      id="password"
                      type={showNewPwd ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPwd}
                      onChange={(e) => {
                        setNewPwd(e.target.value);
                        if (showPasswordError) setShowPasswordError(false);
                      }}
                      required
                      className={`border ${
                        showPasswordError
                          ? "border-red-500 focus:border-red-500"
                          : "border-interface-gray-light focus:border-primary-color-blue"
                      } text-textColor-secondary rounded-[8px] px-4 py-3.5 text-base w-full focus:ring-0 focus:outline-none pr-12`}
                    />
                    <button
                      type="button"
                      aria-label={
                        showNewPwd ? "hide password" : "show password"
                      }
                      onClick={() => setShowNewPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                      tabIndex={0}
                    >
                      <img
                        src={showNewPwd ? PwShow : PwHide}
                        alt={showNewPwd ? "hide password" : "show password"}
                        className="w-6 h-6"
                      />
                    </button>
                    {showPasswordError && (
                      <span className="text-xs2 text-red-500 mt-1">
                        Use at least 8 characters, including uppercase,
                        lowercase, and a number.
                      </span>
                    )}
                  </div>
                </label>
                {/* 確認密碼欄 */}
                <label className="flex flex-col gap-1 w-full">
                  <span className="font-inter text-base text-[#222326] mb-1">
                    Confirm Password
                  </span>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPwd ? "text" : "password"}
                      placeholder="Enter your password again"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      required
                      className="border border-interface-gray-light text-textColor-secondary rounded-[8px] px-4 py-3.5 text-base w-full focus:border-primary-color-blue focus:ring-0 focus:outline-none pr-12"
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPwd ? "hide password" : "show password"
                      }
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                      tabIndex={0}
                    >
                      <img
                        src={showConfirmPwd ? PwShow : PwHide}
                        alt={showConfirmPwd ? "hide password" : "show password"}
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </label>
              </div>

              {/* 重設密碼按鈕 */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary-default hover:bg-primary-hovered text-white font-medium text-[18px] rounded-[8px] py-3 px-5 transition-all w-full"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
