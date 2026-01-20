import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const useApiErrorHandler = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleApiCall = async (apiCall) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        console.log(error.response.data)
        if (error.response.data && error.response.data.error && error.response.data.errorCode) {
            // 使用 i18n 翻譯錯誤消息
            const translatedMessage = t(`common.apiErrors.${error.response.data.errorCode}`, error.response.data.error);
            console.log(translatedMessage);
            // 顯示 SweetAlert
            await Swal.fire({
                icon: 'error',
                title: translatedMessage,
            });
        } else {
            // 顯示 SweetAlert
            await Swal.fire({
                icon: 'error',
                title: t('common.apiErrors.uncaught.title'),
                text: t('common.apiErrors.uncaught.content'),
            });
        }
      } else {
        // 處理其他類型的錯誤
        await Swal.fire({
            icon: 'error',
            title: t('common.apiErrors.uncaught.title'),
            text: t('common.apiErrors.uncaught.content'),
        });
      }
      throw error;
    }
  };

  return { handleApiCall, loading };
};

export default useApiErrorHandler;