import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { messageInfoContext } from "@/data/context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import sendIcon from "@/assets/svg/message/send.svg";

const MessageSending = () => {
  const { t } = useTranslation();
  const [messageInfo, setMessageInfo] = useContext(messageInfoContext);
  const [receiverData, setReceiverData] = useState({});

  const schema = yup
    .object({
      content: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data) => {
    console.log("GOOOOOOOOOOO");
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] !== null) {
        // 確保只添加非 null 值
        formData.append(`message[${key}]`, data[key]);
      }
    });

    formData.append("message[company_id]", messageInfo.message.company_id);
    formData.append("message[receiver_id]", messageInfo.message.receiver_id);

    axios
      .post(`${import.meta.env.VITE_API_URL}/messages.json`, formData, {
        withCredentials: true,
        headers: { Accept: "application/json" },
      })
      .then(() => {
        console.log("you send a message");
        reset();
        setMessageInfo({
          messaging: {
            isOpen: true,
            isShow: true,
          },
          isOpen: false,
          to: "", //company name for now
          message: {
            company_id: "",
            receiver_id: "",
          },
        });
        mutate(`${import.meta.env.VITE_API_URL}/messages.json`);
      })

      .catch(() => {
        // setOnSubmitLoading(false);
      });
  };

  useEffect(() => {
    axios
      .get(
        messageInfo.message.receiver_id
          ? `${import.meta.env.VITE_API_URL}/users/${messageInfo.message.receiver_id}/user_profile.json`
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
  }, [messageInfo]);

  //視窗關閉時，清空表單
  useEffect(() => {
    if (!messageInfo.isOpen) {
      reset();
    }
  }, [messageInfo.isOpen, reset]);

  return (
    <>
      {messageInfo.isOpen && (
        <div
          className={`w-[450px] h-[650px] bg-white rounded-t-20px shadow-2xl pointer-events-auto ${
            messageInfo.isShow ? "-translate-y-0" : "translate-y-[582px]"
          }`}
        >
          <div
            onClick={() =>
              setMessageInfo((prev) => ({ ...prev, isShow: !prev.isShow }))
            }
            className={`bg-black text-white h-17 flex justify-between items-center px-8 rounded-t-10px `}
          >
            {t("message.message_sending.title")}
            {/* close button */}
            <button
              onClick={() => {
                reset();
                setMessageInfo({
                  ...messageInfo,
                  isOpen: false,
                  isShow: false,
                  message: {
                    company_id: "",
                    receiver_id: "",
                  },
                });
              }}
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

          <div className="flex flex-col pt-5 px-6">
            <p className="font-medium mb-3 pl-2">
              {t("message.message_sending.new")}
            </p>
            <div className="mb-3.5 py-2.5 px-4.5 border-0.3px border-toggle-color rounded-full text-sm2">
              <span className="text-toggle-color">
                {t("message.message_sending.to")}
              </span>
              <span>
                {receiverData?.user_name ||
                  " User Name " + messageInfo.message.receiver_id}
              </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex flex-col ">
                <textarea
                  id="content"
                  type="text"
                  placeholder={t("message.message_sending.placeholder")}
                  {...register("content")}
                  className={`h-85 mb-3.5 py-3.5 pl-4 rounded-5px text-sm font-medium border-0.3px placeholder:text-toggle-color 
                      ${
                        errors.content
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-toggle-color"
                      }
                      resize-none
                      `}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-fit text-white bg-black hover:bg-main-color px-5 py-1.5 rounded-full "
                  >
                    <img src={sendIcon} alt="send button" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default MessageSending;
