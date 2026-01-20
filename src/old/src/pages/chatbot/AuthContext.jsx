import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NewAuthService from "./services/auth-service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [chatbotUser, setChatbotUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // 注意: React Router 的慣例是使用小寫 navigate

  console.log("inside AuthProvider");

  // 抽取共用的用戶資料處理邏輯
  const handleUserAuthentication = (userData) => {
    const { token, name, email } = userData;
    const userInfo = { token, name, email };
    setChatbotUser(userInfo);
    navigate("/chatbot/document/1");
  };

  // 處理認證流程
  const authenticateUser = async () => {
    try {
      // 首先嘗試獲取當前用戶
      const res = await NewAuthService.getCurrentUser();
      handleUserAuthentication(res.data);
    } catch (error) {
      // 如果是認證錯誤，嘗試使用數據登入
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/account/login');
      } else {
        // 處理其他類型的錯誤
        console.error('Authentication error:', error);
        window.alert('發生錯誤，請再試一次')
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{ chatbotUser, setChatbotUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);