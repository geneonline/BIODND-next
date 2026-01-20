import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export const findContinentByCountry = (country, options) => {
  // 假设使用英文版本进行匹配，根据需要调整
  const entries = Object.entries(options);
  for (let [continent, countries] of entries) {
    if (countries.some(([_, countryName]) => countryName === country)) {
      return continent;
    }
  }
  return null; // 如果没有找到匹配的大陆，返回null
};

// turns "2024-05-22T03:05:11.657Z" into "2024.05.22"
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) {
    return "now";
  } else if (diffHour < 1) {
    return `${diffMin}m`;
  } else if (diffDay < 1) {
    return `${diffHour}h`;
  } else if (diffDay < 7) {
    return `${diffDay}D`;
  } else {
    return date.toLocaleString("en-US", { month: "short", day: "numeric" });
  }
}

//把 message API 轉換成前端好用的格式
export function organizeMessages(messagesData, user_id) {
  // 使用 Map 來存儲每個聊天對象的對話數據
  const chatMap = new Map();

  messagesData.forEach((message) => {
    // 確定對話對象的ID
    const partnerId =
      message.user_id === user_id ? message.receiver_id : message.user_id;
    const isMine = message.user_id === user_id;

    // 如果還沒有這個對象的記錄，則初始化
    if (!chatMap.has(partnerId)) {
      chatMap.set(partnerId, {
        receiver_id: partnerId,
        company_id: message.company_id,
        last_content: message.content,
        last_time: message.created_at,
        contents: [],
      });
    }

    // 添加訊息到對應的聊天記錄中
    chatMap.get(partnerId).contents.push({
      id: message.id,
      content: message.content,
      mine_text: isMine,
      read: message.read,
      created_at: message.created_at,
      updated_at: message.updated_at,
    });
  });

  // 轉換 Map 為陣列，並按最後訊息時間排序
  const chats = Array.from(chatMap.values());
  chats.forEach((chat) => {
    // 對話內的訊息按創建時間排序
    chat.contents.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    // 更新最後一條訊息內容
    chat.last_content = chat.contents[chat.contents.length - 1].content;
    // 更新最後一條訊息的時間
    chat.last_time = chat.contents[chat.contents.length - 1].created_at;
  });

  console.log(
    chats.sort((a, b) => new Date(b.last_time) - new Date(a.last_time))
  );
  // 按對話的最後訊息時間排序，最近的在前
  return chats.sort((a, b) => new Date(b.last_time) - new Date(a.last_time));
}

//把 uuid 塞到 cookie 中來匿名辨識用戶
const COOKIE_NAME = "anonymousId";
const COOKIE_EXPIRY_DAYS = 365; // Cookie 的有效期（天）

export const getAnonymousId = () => {
  // 檢查是否已有匿名標識
  let anonymousId = Cookies.get(COOKIE_NAME);

  // 如果沒有，生成新的 UUID 並存入 Cookie
  if (!anonymousId) {
    anonymousId = uuidv4();
    Cookies.set(COOKIE_NAME, anonymousId, { expires: COOKIE_EXPIRY_DAYS });
  }

  return anonymousId;
};
