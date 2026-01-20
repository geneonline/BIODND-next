import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    // logout 會自動導向首頁或其它設定頁面
  }, [logout]);

  // Option: 可呈現 loading/登出中的訊息，但通常不會顯示
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-xl text-gray-600">
      logout...
    </div>
  );
};

export default LogoutPage;
