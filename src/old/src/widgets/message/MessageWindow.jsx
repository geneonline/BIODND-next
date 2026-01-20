import { useState, useEffect, useRef } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";

import defaultUserImage from "@/assets/img/database/User Default Image.png";
import previousIcon from "@/assets/svg/message/previous.svg";
import sendIcon from "@/assets/svg/message/send.svg";

const MessageWindow = ({ setSelectedChatID, chat, t }) => {
  const [receiverData, setReceiverData] = useState({});

  const scrollRef = useRef(null);

  const schema = yup
    .object({
      content: yup.string().required(),
    })
    .required();

  const { register, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] !== null) {
        // 確保只添加非 null 值
        formData.append(`message[${key}]`, data[key]);
      }
    });

    formData.append("message[company_id]", chat.company_id);
    formData.append("message[receiver_id]", chat.receiver_id);

    axios
      .post(`${import.meta.env.VITE_API_URL}/messages.json`, formData, {
        withCredentials: true,
        headers: { Accept: "application/json" },
      })
      .then(() => {
        console.log("you send a message");
        setValue("content", "");
        mutate(`${import.meta.env.VITE_API_URL}/messages.json`);
      })

      .catch(() => {
        // setOnSubmitLoading(false);
      });
  };

  const backHandler = () => {
    setSelectedChatID(null);
    mutate(`${import.meta.env.VITE_API_URL}/messages.json`);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    axios
      .get(
        chat.receiver_id
          ? `${import.meta.env.VITE_API_URL}/users/${chat.receiver_id}/user_profile.json`
          : null,
        {
          withCredentials: true,
          headers: { Accept: "application/json" },
        }
      )
      .then((response) => {
        setReceiverData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Loop over each content in the chat.contents array
    chat.contents.forEach((content) => {
      // Check if the message was not sent by the user (mine_text is false)
      if (!content.mine_text && !content.read) {
        // Construct the URL with the content id
        const url = `${import.meta.env.VITE_API_URL}/messages/${content.id}.json`;

        // Fetch the data from the server
        axios
          .get(url, {
            withCredentials: true,
            headers: { Accept: "application/json" },
          })
          .then((response) => {
            console.log("Fetched message:", response.data);
          })
          .catch((error) => {
            console.error("Error fetching message:", error);
          });
      }
    });
  }, [chat]);

  return (
    <div className="message-window">
      <button
        className="w-full bg-com-profile-bg font-medium flex py-4.5 px-7 items-center"
        onClick={backHandler}
      >
        <img className="pr-3" src={previousIcon} alt="all messages" />
        {t("message.all_messages")}
      </button>

      <div ref={scrollRef} className="h-[350px] pl-5 pr-8 overflow-y-auto">
        {chat?.contents.map((message) => (
          <div
            key={message.id}
            className={`w-full flex first:mt-5 mt-4 ${
              message.mine_text
                ? "justify-end items-end"
                : "justify-start items-center"
            }`}
          >
            {/* reciever img */}
            {!message.mine_text && (
              <div className="w-8 h-8 mr-2.5 border-toggle-color border-0.4px rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={receiverData?.profile_photo || defaultUserImage}
                  alt={"receiver img"}
                />
              </div>
            )}

            {/* read */}
            {message.mine_text && message.read && (
              <p className={`pb-1.5 pr-2 text-xs text-toggle-color`}>
                {t("message.read")}
              </p>
            )}

            {/* text */}
            <p
              className={`text-sm2 py-3 px-5 rounded-40px ${
                message.mine_text ? "bg-message-mine" : "bg-profile-viewed-bg"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 mx-7.5 border-0.3px border-toggle-color rounded-20px overflow-hidden">
          <textarea
            id="content"
            type="text"
            placeholder={t("message.message_sending.placeholder")}
            {...register("content")}
            //   {...register("content")}
            className={` w-full py-3.5 pl-4 text-sm2 font-medium border-0 placeholder:text-toggle-color resize-none focus:ring-0`}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="m-2.5 w-fit text-white bg-black hover:bg-main-color px-5 py-1.5 rounded-full "
            >
              <img src={sendIcon} alt="send button" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageWindow;
