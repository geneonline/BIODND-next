# config 資料夾說明

這裡放置專案的設定與攔截器等共用邏輯。

## accountInterceptor.js
- 全域掛載 Axios 的 request/response interceptor。
- request 階段會自動從 `localStorage` 取得 `token`，並在一般請求上加上 `Authorization: Bearer <token>`。
- 若要避免某些第三方服務被加上 `Authorization` 導致 CORS 問題，可在檔案頂部的 `AUTH_SKIP_HOSTS` 名單中新增主機名稱；名稱需為完整的 hostname，如 `api.example.com`。
- response 階段會更新回傳的新 token，並在 401 或特定錯誤碼時清除本地端 token。

> 小提醒：新增主機後記得重新整理頁面，讓最新的設定套用到瀏覽器的請求。
