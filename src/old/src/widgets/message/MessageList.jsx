import { useEffect, useState } from "react";
import defaultUserImage from "@/assets/img/database/User Default Image.png";
import axios from "axios";
import { formatRelativeTime } from "@/data/function";

const MessageList = ({ chats, onSelectChat, setUnreadIcon, t }) => {
  const [receiverData, setReceiverData] = useState({});

  const enterMessageWindowHandler = (chat) => {
    onSelectChat(chat.receiver_id);
    setUnreadIcon(false);
  };

  // Fetch receiver data for each chat
  useEffect(() => {
    const fetchReceiverData = async () => {
      const newReceiverData = {};
      await Promise.all(
        chats
          .filter((chat) => chat.receiver_id)
          .map(async (chat) => {
            const url = `${import.meta.env.VITE_API_URL}/users/${chat.receiver_id}/user_profile.json`;
            try {
              const response = await axios.get(url, {
                withCredentials: true,
                headers: { Accept: "application/json" },
              });
              newReceiverData[chat.receiver_id] = response.data;
            } catch (error) {
              console.error(
                `Error fetching data for receiver ${chat.receiver_id}:`,
                error
              );
            }
          })
      );
      setReceiverData(newReceiverData);
    };

    fetchReceiverData();
  }, [chats]);

  // set nav bar message icon
  useEffect(() => {
    const checkMessages = chats.some((chat) =>
      chat.contents.some((content) => !content.mine_text && !content.read)
    );
    setUnreadIcon(checkMessages);
  }, [chats, setUnreadIcon]);

  return (
    <div className="message-list">
      <p className="pl-8 py-3.5 font-medium text-18px">
        {t("message.all_messages")}
      </p>
      <div className="overflow-y-auto flex flex-col border-t-0.5px border-toggle-color">
        {chats.map((chat) => (
          <div
            key={chat.receiver_id}
            className="relative flex border-b-0.3px border-toggle-color space-x-4 px-7.5 py-4.5 items-center cursor-pointer hover:bg-bg-gray "
            onClick={() => enterMessageWindowHandler(chat)}
          >
            <div className="w-14 h-14 flex-shrink-0 border-toggle-color border-0.4px rounded-full overflow-hidden">
              <img
                src={
                  receiverData[chat.receiver_id]?.profile_photo ||
                  defaultUserImage
                }
                alt={"receiver img"}
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {receiverData[chat.receiver_id]?.user_name ||
                    `user ${chat.receiver_id}`}
                </p>
                <div>
                  <p className="text-toggle-color text-sm1">
                    {formatRelativeTime(chat.last_time)}
                  </p>
                </div>
              </div>
              <p
                className={`${
                  chat.contents[chat.contents.length - 1].mine_text === false &&
                  chat.contents[chat.contents.length - 1].read === false
                    ? "text-black"
                    : "text-toggle-color"
                }`}
              >
                {chat.last_content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MessageList;
