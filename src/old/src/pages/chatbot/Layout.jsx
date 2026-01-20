import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const Layout = () => {
  const { chatbotUser, loading } = useAuth();
  const location = useLocation();

  console.log("inside Layout");
  console.log(chatbotUser);

  // 在加載時顯示載入動畫
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center gap-4 -translate-y-full">
          <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700">Verifying...</span>
        </div>
      </div>
    );
  }

  // 如果不是登入頁面且用戶未登入，重定向到登入頁面
  if (!chatbotUser) {
    console.log("no currentUser");
    // toast.error("Please log in first.");
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default Layout;
