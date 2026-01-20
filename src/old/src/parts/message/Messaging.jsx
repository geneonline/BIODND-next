import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { messageInfoContext } from "@/data/context";
import { useMessages } from "@/data/api";
import MessageList from "@/widgets/message/MessageList";
import MessageWindow from "@/widgets/message/MessageWindow";

import { organizeMessages } from "@/data/function";
import defaultUserImage from "@/assets/img/database/User Default Image.png";

const Messaging = ({ userData, setUnreadIcon }) => {
  const { t } = useTranslation();
  const { messagesData, resetRetries } = useMessages();
  const [messageInfo, setMessageInfo] = useContext(messageInfoContext);
  const [selectedChatID, setSelectedChatID] = useState(null);
  const [organizedChats, setOrganizedChats] = useState([]);

  //處理聊天數據
  useEffect(() => {
    if (messagesData && userData?.user_id) {
      console.log(messagesData);
      const chats = organizeMessages(messagesData, userData?.user_id);
      setOrganizedChats(chats); // 儲存處理後的聊天數據
    } else {
      setOrganizedChats([]);
    }
  }, [messagesData, userData?.user_id]);

  useEffect(() => {
    if (userData?.user_id) resetRetries();
  }, [resetRetries, userData?.user_id]);

  //檢查有沒有未讀訊息來設定icon
  useEffect(() => {
    const hasUnreadMessages = organizedChats.some((chat) =>
      chat.contents.some((content) => !content.mine_text && !content.read)
    );

    setUnreadIcon(hasUnreadMessages);
  }, [organizedChats, setUnreadIcon]);

  useEffect(() => {
    if (!messageInfo.messaging.isOpen) {
      setSelectedChatID(null);
    }
  }, [messageInfo]);

  return (
    <>
      <div
        className={` w-[450px] h-[650px] bg-white rounded-t-20px shadow-2xl pointer-events-auto ${
          messageInfo.messaging.isShow
            ? "-translate-y-0"
            : "translate-y-[582px]"
        } ${messageInfo.messaging.isOpen ? "block" : "hidden"}`}
      >
        <div
          onClick={() =>
            setMessageInfo((prev) => ({
              ...prev,
              messaging: {
                ...prev.messaging,
                isShow: !prev.messaging.isShow,
              },
            }))
          }
          className="bg-black text-white h-17 flex justify-between items-center px-8 rounded-t-10px"
        >
          <div className="flex space-x-3.5 items-center">
            <div className="relative">
              <div className=" w-9 h-9 border-0.3px border-toggle-color rounded-full overflow-hidden flex justify-center items-center">
                <img
                  className="w-full h-full object-cover"
                  src={userData?.profile_photo || defaultUserImage}
                  alt="my image"
                />
              </div>
              <div className="w-1.5 h-1.5 bg-main-green rounded-full absolute bottom-0.5 right-0.5"></div>
            </div>
            <span>{t("message.messaging")}</span>
          </div>
          <button
            onClick={() =>
              setMessageInfo({
                ...messageInfo,
                messaging: { ...messageInfo.messaging, isOpen: false },
              })
            }
            className=" z-[60] w-6 h-6 flex flex-col space-y-1.5 justify-center items-center"
          >
            <div
              className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full rotate-45 translate-y-1 bg-db-Asearch`}
            ></div>
            <div
              className={` w-full h-0.5  transition-transform duration-300 ease-out rounded-full -rotate-45  -translate-y-[4px] bg-db-Asearch`}
            ></div>
          </button>
        </div>
        {!selectedChatID ? (
          <MessageList
            chats={organizedChats}
            onSelectChat={setSelectedChatID}
            setUnreadIcon={setUnreadIcon}
            userData={userData}
            t={t}
          />
        ) : (
          <>
            {organizedChats.length > 0 && (
              <MessageWindow
                setSelectedChatID={setSelectedChatID}
                chat={organizedChats.find(
                  (chat) => chat.receiver_id === selectedChatID
                )}
                t={t}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Messaging;
