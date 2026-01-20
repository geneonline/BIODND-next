import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyList, useUserNeeds } from "@/data/api";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { mutate } from "swr";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import LoginToContinue from "@/parts/LoginToContinue";
import NeedToPay_popup from "@/widgets/NeedToPay_popup";
import MyNeedsItem from "@/widgets/needs/MyNeedsItem";

import defaultUserImage from "@/assets/img/database/User Default Image.png";
import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import loadingImg from "@/assets/img/loading.png";
import { toast } from "react-toastify";
import Loading from "@/widgets/Loading";
import MultipleSelect_2layers from "@/widgets/database/MultipleSelect_2layers";
import {
  continentTranslation,
  locationOptions_en,
} from "@/data/database/companies/locationOptions";

const baseURL = import.meta.env.VITE_Effect_API;
const showClearLockButton =
  String(import.meta.env.VITE_SHOW_CLEAR_LOCK_BUTTON).toLowerCase() === "true";

const UserProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(false);
  const [imgSrc, setImgSrc] = useState(""); // 新增：集中管理 img src
  const [hasImgError, setHasImgError] = useState(false); // 防止 error 無限觸發
  const [personalRegion, setPersonalRegion] = useState("");
  const [personalCountry, setPersonalCountry] = useState("");
  const navigate = useNavigate();
  // 移除已棄用的 UserContext, user 變數

  // 取得 JWT 並載入 userData
  const token = localStorage.getItem("token") || "";
  const { userData, userIsValidating, userError } = useUser(token);

  // 對齊 API 規格欄位
  const schema = yup
    .object({
      firstName: yup.string().required("required!"),
      lastName: yup.string().required("required!"),
      jobTitle: yup.string().nullable(),
      company: yup.string().nullable(),
      globalRegion: yup.string().nullable(),
      country: yup.string().nullable(),
      // email: yup.string().email("not email").required("required!"), // Email 不可編輯
      officePhoneNumber: yup.string(),
      mobileNumber: yup
        .string()
        .nullable()
        .notRequired()
        .matches(/^[0-9]+$/, {
          message: "number Only!",
          excludeEmptyString: true,
        }),
      linkedIn: yup.string().nullable(),
      facebook: yup.string().nullable(),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 進入編輯模式時將 userData 映射進表單
  useEffect(() => {
    if (isEditMode && userData) {
      setPersonalRegion(userData.globalRegion || "");
      setPersonalCountry(userData.country || "");
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        jobTitle: userData.jobTitle || "",
        company: userData.company || "",
        // country 欄位改為 personalCountry 已於 region/country select 控制
        // email: userData.email || "",
        // email: userData.email || "",
        officePhoneNumber: userData.officePhoneNumber || "",
        mobileNumber: userData.mobileNumber || "",
        linkedIn: userData.linkedIn || "",
        facebook: userData.facebook || "",
      });
    }
  }, [isEditMode, userData, reset]);

  // const { userData, userIsValidating } = useUser();

  // 無需同步 userData 至 context，直接以 userData 呈現畫面

  const { myListData, myListLoading } = useMyList();

  // 更新會員資料與大頭貼 (API 文件規格)
  const onSubmit = async (data) => {
    setLoadingProfilePhoto(true);
    let profilePhotoUrl = userData?.profilePhoto || null;

    // 若有新頭像，先呼叫 API 上傳檔案，拿回路徑
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_Effect_API}/api/Account/UploadProfilePhoto`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        profilePhotoUrl = uploadRes.data;
        toast.success("Avatar uploaded successfully");
        // 上傳成功後清除 selectedFile/image
        setSelectedFile(undefined);
        setImage("");
        setHasImgError(false);
      } catch (e) {
        toast.error(
          "Failed to upload the avatar. Please check the file type or try again later."
        );
        setLoadingProfilePhoto(false);
        return;
      }
    }

    // 合併 userData 的所有欄位（不含特殊帳號欄位），確保全部帶入
    const keysToOmit = ["email", "username", "token", "roles"];
    // manual override, 以 form 為主，其餘 userData
    const merged = {
      ...userData,
      ...data,
      globalRegion: personalRegion,
      country: personalCountry,
      profilePhoto: profilePhotoUrl,
    };
    // 過濾帳號特殊欄位
    keysToOmit.forEach((k) => {
      if (merged.hasOwnProperty(k)) delete merged[k];
    });

    try {
      const updateRes = await axios.post(
        `${import.meta.env.VITE_Effect_API}/api/Account/Update`,
        merged,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditMode(false);
      toast.success("Member information has been saved");
      mutate([`/api/Account`, token]); // 刷新 SWR
    } catch (e) {
      toast.error("Failed to save member information");
    } finally {
      setLoadingProfilePhoto(false);
    }
  };

  //  edit button
  const editButtonHandler = (e) => {
    e.preventDefault();
    if (userData) {
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        jobTitle: userData.jobTitle || "",
        company: userData.company || "",
        country: userData.country || "",
        // email: userData.email || "",
        officePhoneNumber: userData.officePhoneNumber || "",
        mobileNumber: userData.mobileNumber || "",
        linkedIn: userData.linkedIn || "",
        facebook: userData.facebook || "",
      });
    }
    setIsEditMode(true);
  };

  //---------------- img change
  const [image, setImage] = useState("");

  // 控制 <img> src
  useEffect(() => {
    // image：本地上傳預覽
    if (image) {
      setImgSrc(image);
      setHasImgError(false);
    } else if (userData?.profilePhoto) {
      setImgSrc(baseURL + userData.profilePhoto);
      setHasImgError(false);
    } else {
      setImgSrc(defaultUserImage);
      setHasImgError(false);
    }
  }, [image, userData?.profilePhoto]);

  // 選檔案時會觸發預覽
  const ImageUploadHandler = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // 處理上傳成功或清除預覽時回復顯示 state
  useEffect(() => {
    if (!selectedFile && !image && !userData?.profilePhoto) {
      setImgSrc(defaultUserImage);
      setHasImgError(false);
    }
  }, [selectedFile, image, userData?.profilePhoto]);

  function formatPeriod(start_time, end_time) {
    // 解析日期
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    // 將日期格式化為 MM/DD/YYYY
    const format = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    // 檢查是否同一天
    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate);
    } else {
      return `${format(startDate)} - ${format(endDate)}`;
    }
  }

  const [eventImages, setEventImages] = useState({});

  useEffect(() => {
    // 只有在 userData 有效且有事件時執行
    if (userData?.events?.length > 0) {
      userData.events.forEach((event) => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/events/${event.id}.json`, {
            withCredentials: true,
          })
          .then((res) => {
            const coverImage =
              res.data.event_images?.find((img) => img.section === "cover")
                ?.url || "";
            setEventImages((prev) => ({ ...prev, [event.id]: coverImage }));
          })
          .catch((error) =>
            console.error("Error fetching event image:", error)
          );
      });
    }
  }, [userData]); // 依賴於 userData 的變化

  const [IsNeedtopayPopup, setIsNeedtopayPopup] = useState(false);

  const toMyListHandler = (e) => {
    e.preventDefault();
    if (
      (!userData?.subscription_level && userData?.id !== 1) ||
      userData?.subscription_level === "basic"
    ) {
      setIsNeedtopayPopup(true);
      return;
    }

    navigate("/user/mylist");
  };

  ////needs
  const { needsData } = useUserNeeds(userData?.user_id);
  const [DisplayNeeds, setDisplayNeeds] = useState(3);
  const [isEditNeeds, setIsEditNeeds] = useState(false);

  const showMoreHandler = () => {
    if (needsData.length > 0) {
      if (DisplayNeeds >= needsData.length) {
        setDisplayNeeds(needsData.length);
      } else {
        setDisplayNeeds((prev) => prev + 3);
      }
    }
  };

  return (
    <main className="mt-15 xl:mt-19 w-full px-5">
      {userIsValidating ? (
        <Loading height={"50vh"} />
      ) : (
        <section className="mx-auto pb-8 w-fit flex flex-col max-w-[551px] xl:max-w-none">
          <div className="pt-8 mb-6 flex flex-col items-center xl:justify-center mx-auto xl:flex-row xl:items-stretch max-w-[551px] xl:max-w-none">
            {/* user profile */}
            <article className="shadow-[0px_0px_7px_0px_rgba(105,116,127,0.30)] bg-white flex flex-col w-full xl:max-w-[551px] pt-6 pb-10 px-5 rounded-xl">
              {userIsValidating ? (
                <div className="w-full h-96 xl:h-full flex justify-center items-center">
                  <img className=" animate-spin" src={loadingImg} alt="" />
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <section
                    className="bg-profile-button-bg self-stretch flex flex-col md:flex-row  rounded-xl max-md:max-w-full
          mx-1.5 pt-4.5 pr-4 pb-6  pl-5
          md:pt-5.5 md:pr-8 md:pb-5.5 
          "
                  >
                    <div className="flex flex-row items-center">
                      {/* img */}
                      <div className="relative flex flex-col bg-white overflow-hidden rounded-full items-stretch w-[71px] h-[71px] md:w-[101px] md:h-[101px] shrink-0">
                        <img
                          loading="lazy"
                          src={imgSrc}
                          className="aspect-square  shrink-0"
                          alt="Profile Picture"
                          onError={() => {
                            if (!hasImgError) {
                              setImgSrc(defaultUserImage);
                              setHasImgError(true);
                            }
                          }}
                        />

                        {isEditMode && (
                          <>
                            <label
                              className="absolute top-0 text-xs3 h-full w-full block opacity-0 hover:opacity-90 transition-opacity cursor-pointer z-10"
                              htmlFor="file-upload"
                            >
                              <span className="bg-black text-white absolute mt-18 px-6 pt-1 pb-5 whitespace-nowrap">
                                Edit Photo
                              </span>
                            </label>
                            <input
                              type="file"
                              id="file-upload"
                              accept="image/png, image/jpeg"
                              className="hidden"
                              onChange={ImageUploadHandler}
                            />
                          </>
                        )}
                      </div>

                      <div className="flex flex-col items-stretch ml-5 max-md:w-full">
                        <h2 className="text-black  text-18px font-medium whitespace-nowrap">
                          {userData?.firstName
                            ? `${userData.firstName}`
                            : "User Name"}
                        </h2>

                        <p className="text-gray-500 text-sm1 mt-2">
                          {userData?.jobTitle || "Job Title"}
                          <br />
                          {userData?.company || "Company"}
                        </p>
                      </div>
                    </div>

                    {/* button */}
                    <div className="w-full mt-1 md:mt-0 flex justify-end">
                      {isEditMode ? (
                        <>
                          <button
                            type="submit"
                            className={`bg-black hover:bg-main-color-gb text-white text-xs self-center px-9 py-2 rounded-3xl ${
                              loadingProfilePhoto
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={loadingProfilePhoto}
                          >
                            {loadingProfilePhoto ? "Saving..." : "Save"}
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-black hover:bg-main-color-gb text-white text-xs self-center px-8 py-2.5 rounded-3xl"
                          aria-label="Edit Profile"
                          onClick={editButtonHandler}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </section>
                  {/* 開發用 Clear Lock 按鈕 */}
                  {showClearLockButton && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          const token = localStorage.getItem("token") || "";
                          try {
                            const res = await fetch(
                              "https://biodnd-ai-api.fireghost.com.tw/api/QueryAsset/ClearLock",
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            if (res.ok) {
                              toast.success("Lock cleared");
                            } else {
                              toast.error("Failed to clear lock");
                            }
                          } catch (error) {
                            toast.error("Error clearing lock");
                            console.error(error);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-3xl"
                      >
                        Clear Lock (Dev)
                      </button>
                    </div>
                  )}
                  {/* info */}
                  <section
                    className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0 
          pt-7.5 pl-5.5
          "
                  >
                    {/* col 1 */}
                    <div className="flex flex-col items-stretch max-md:w-full space-y-7">
                      {/* user name */}
                      <div>
                        <label
                          htmlFor="user_name"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          First Name
                        </label>
                        {isEditMode ? (
                          <input
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                          ${
                            errors.firstName
                              ? "focus:border-warning focus:ring-warning border-warning"
                              : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                          }`}
                            {...register("firstName")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.firstName || ""}{" "}
                          </p>
                        )}
                      </div>

                      {/* user name */}
                      <div>
                        <label
                          htmlFor="user_name"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Last Name
                        </label>
                        {isEditMode ? (
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border
                          ${
                            errors.lastName
                              ? "focus:border-warning focus:ring-warning border-warning"
                              : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                          }`}
                            {...register("lastName")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.lastName || ""}
                          </p>
                        )}
                      </div>

                      {/* job title */}
                      <div>
                        <label
                          htmlFor="job_title"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Job Title
                        </label>
                        {isEditMode ? (
                          <input
                            id="jobTitle"
                            type="text"
                            placeholder="Enter Job Title"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.jobTitle
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                            {...register("jobTitle")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.jobTitle || "Enter Job Title"}
                          </p>
                        )}
                      </div>

                      {/* company name */}
                      <div>
                        <label
                          htmlFor="company"
                          className={` ${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Company
                        </label>
                        {isEditMode ? (
                          <input
                            id="company"
                            type="text"
                            placeholder="Enter Company"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.company
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                            {...register("company")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.company || "Enter Company Name"}
                          </p>
                        )}
                      </div>

                      {/* Personal Global Region */}
                      <div>
                        <label
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Personal Global Region
                        </label>
                        {isEditMode ? (
                          <>
                            {/* Region 單選 */}
                            <select
                              id="personalRegion"
                              className="mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border focus:border-main-color focus:ring-main-color border-main-text-gray"
                              value={personalRegion}
                              onChange={(e) => {
                                setPersonalRegion(e.target.value);
                                setPersonalCountry("");
                              }}
                            >
                              <option value="">Select Global Region</option>
                              {Object.entries(continentTranslation).map(
                                ([value, labels]) => (
                                  <option value={value} key={value}>
                                    {labels[0]}
                                  </option>
                                )
                              )}
                            </select>
                          </>
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.globalRegion || ""}
                          </p>
                        )}
                      </div>

                      {/* Personal Country */}
                      <div>
                        <label
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Personal Country
                        </label>
                        {isEditMode ? (
                          <>
                            {/* Country 單選 */}

                            <select
                              id="personalCountry"
                              className="mt-2 py-2 pr-3 rounded-5px text-sm font-medium w-44 border focus:border-main-color focus:ring-main-color border-main-text-gray"
                              value={personalCountry}
                              onChange={(e) =>
                                setPersonalCountry(e.target.value)
                              }
                              disabled={!personalRegion}
                            >
                              <option value="">Select Country</option>
                              {(locationOptions_en[personalRegion] || []).map(
                                (item) => (
                                  <option value={item[0]} key={item[0]}>
                                    {item[1]}
                                  </option>
                                )
                              )}
                            </select>
                          </>
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.country || ""}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* col 2 */}
                    <div className="flex flex-col items-stretch md:ml-20 max-md:w-full space-y-7 pt-7 md:pt-0">
                      {/* email */}
                      <div>
                        <label
                          htmlFor="email"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Email
                        </label>
                        <p className="mt-1 text-black">
                          {userData?.email || "Enter Email"}
                        </p>
                      </div>

                      {/* office phone number */}
                      <div className="h-16 mt-7">
                        {/* <label
                          htmlFor="officePhoneNumber"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          {t(
                            "user.profile.user_profile_section.office_phone_number"
                          )}
                        </label>
                        {isEditMode ? (
                          <input
                            id="officePhoneNumber"
                            type="text"
                            placeholder="Enter Office Phone Number"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.officePhoneNumber
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                            {...register("officePhoneNumber")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.officePhoneNumber ||
                              "Enter Office Phone Number"}
                          </p>
                        )} */}
                      </div>

                      {/* mobile number */}
                      <div>
                        <label
                          htmlFor="mobileNumber"
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Mobile Number
                        </label>
                        {isEditMode ? (
                          <input
                            id="mobileNumber"
                            type="text"
                            placeholder="Enter Mobile Phone Number"
                            className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.mobileNumber
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                            {...register("mobileNumber")}
                          />
                        ) : (
                          <p className="mt-1 text-black">
                            {userData?.mobileNumber ||
                              "Enter Mobile Phone Number"}
                          </p>
                        )}
                      </div>

                      {/* Social Media */}
                      <div>
                        <h5
                          className={`${
                            isEditMode ? "text-nav-bg" : "text-neutral-400"
                          } pb-2`}
                        >
                          Social Media
                        </h5>

                        {isEditMode ? (
                          <div className="flex flex-col space-y-2.5">
                            <div className="flex flex-col">
                              <label
                                className="pb-1 text-xs text-main-text-gray"
                                htmlFor="LinkedIn_url"
                              >
                                LinkedIn
                              </label>
                              <input
                                id="LinkedIn_url"
                                type="url"
                                name="LinkedIn_url"
                                placeholder="LinkedIn Account URL"
                                className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.linkedIn
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                                {...register("linkedIn")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label
                                className="pb-1 text-xs text-main-text-gray"
                                htmlFor="Facebook_url"
                              >
                                Facebook
                              </label>
                              <input
                                id="Facebook_url"
                                type="url"
                                name="Facebook_url"
                                placeholder="Facebook Account URL"
                                className={`mt-1 py-2 pr-3 rounded-5px text-sm font-medium w-44 border 
                        ${
                          errors.facebook
                            ? "focus:border-warning focus:ring-warning border-warning"
                            : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                        }`}
                                {...register("facebook")}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-14 max-w-full items-start gap-1.5 mt-3">
                            {userData?.linkedIn && (
                              <div>
                                <img
                                  loading="lazy"
                                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c058479-a689-41ac-9f1c-2e65ed04250b?apiKey=e07749b70499446d97a4ab39d584855d&"
                                  className="aspect-square object-cover object-center w-[26px] overflow-hidden shrink-0"
                                  alt="Social Media Icon 1"
                                />
                              </div>
                            )}
                            {userData?.facebook && (
                              <div>
                                <img
                                  loading="lazy"
                                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/8a4152be-eaf6-4607-8bb5-6846115d5edd?apiKey=e07749b70499446d97a4ab39d584855d&"
                                  className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0 mt-px"
                                  alt="Social Media Icon 2"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </form>
              )}
            </article>

            {/* other profile */}
            <div
              className="flex flex-col md:flex-row xl:flex-col items-stretch w-full xl:max-w-[277px] xl:ml-5 
        md:space-x-5.5 xl:space-x-0 xl:space-y-4"
            >
              {/* My Lists */}
              <article className="shadow-[0px_0px_7px_0px_rgba(105,116,127,0.30)] bg-white self-stretch flex w-full flex-col mt-5.5 md:mt-5 xl:mt-0 pt-5 pb-8 px-5 rounded-xl">
                {/* title */}
                <div
                  className="bg-profile-button-bg flex max-w-full items-center justify-between gap-5  rounded-lg
            ml-px pl-6 pr-4 py-3.5"
                >
                  <h3 className="text-black text-sm2 font-medium"> My Lists</h3>
                  <button
                    to={"/user/mylist"}
                    onClick={toMyListHandler}
                    className="text-white text-sm bg-black hover:bg-main-color-gb max-w-full py-2 px-5 whitespace-nowrap rounded-3xl"
                    aria-label="View List"
                  >
                    View List
                  </button>
                </div>

                {/* info */}
                <div className="flex flex-col pt-4 pb-9 pl-1.5 space-y-4">
                  {/* loading */}
                  {/* {myListLoading && !myListData && (
                  <div className="w-full flex justify-center items-center">
                    <img className=" animate-spin" src={loadingImg} alt="" />
                  </div>
                )} */}

                  {/* <div className="w-full flex justify-center items-center pt-5">
                  <img className=" animate-spin" src={loadingImg} alt="" />
                </div> */}

                  {/* content */}
                  {myListLoading ? (
                    <div className="w-full flex justify-center items-center">
                      {/* <img className=" animate-spin" src={loadingImg} alt="" /> */}
                    </div>
                  ) : myListData?.length > 0 ? (
                    myListData.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        to={`/database/${item.id}`}
                        className="flex items-center text-sm2 font-normal hover:font-medium"
                      >
                        <div
                          className="w-[46px] h-[46px] border-0.3px mr-2 rounded-full overflow-hidden 
                                  flex justify-center items-center shrink-0"
                        >
                          <img
                            src={
                              item?.uploaded_logo_url ||
                              // item?.Company_Logo ||
                              defaultCompanyImage
                            }
                            alt="Company Logo"
                          />
                        </div>
                        <p className="text-nav-bg ">{item.Company_Name}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="py-5 text-sm1 font-medium">
                      No company saved.
                    </p>
                  )}
                </div>
              </article>

              {/* Friends */}

              {/* <article className="shadow-[0px_0px_7px_0px_rgba(105,116,127,0.30)] bg-white self-stretch flex w-full grow flex-col mt-5.5 md:mt-5 xl:mt-0 pt-5 pb-9 px-5 rounded-xl">
            <h3 className="text-black text-sm2 font-medium bg-profile-button-bg max-w-full ml-px pl-5 pr-5 py-5 rounded-lg">
              {t("user.profile.friends_section.title")}
            </h3>

            <div className="flex flex-col max-w-full items-start gap-3 ml-px mt-4 pl-1.5">
              <div className="flex items-center">
                <div className="w-[45px] h-[45px] ">
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/34cdf970-c67b-4f12-a22b-243be3a003be?apiKey=e07749b70499446d97a4ab39d584855d&"
                    className="aspect-square object-cover object-center w-full overflow-hidden self-stretch"
                    alt="Friend 1"
                  />
                </div>

                <div className="self-center pl-3 flex flex-col my-auto">
                  <div className="text-zinc-900 text-sm2 font-medium ">
                    User Name 1
                  </div>
                  <div className="text-gray-500 text-sm2 mt-2">
                    Title, Company
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[45px] h-[45px] ">
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/42a0b37b-cec9-4a0b-82b4-a4a706df1aad?apiKey=e07749b70499446d97a4ab39d584855d&"
                    className="aspect-square object-cover object-center w-full overflow-hidden self-stretch"
                    alt="Friend 2"
                  />
                </div>

                <div className="self-center pl-3 flex flex-col my-auto">
                  <div className="text-zinc-900 text-sm2 font-medium ">
                    User Name 2
                  </div>
                  <div className="text-gray-500 text-sm2 mt-2">
                    Title, Company
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[45px] h-[45px] ">
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4bbce39e-5870-4ac5-a997-26abb3505fae?apiKey=e07749b70499446d97a4ab39d584855d&"
                    className="aspect-square object-cover object-center w-[45px] overflow-hidden shrink-0"
                    alt="Friend 3"
                  />
                </div>

                <div className="self-center pl-3 flex flex-col my-auto">
                  <div className="text-zinc-900 text-sm2 font-medium ">
                    User Name 3
                  </div>
                  <div className="text-gray-500 text-sm2 mt-2">
                    Title, Company
                  </div>
                </div>
              </div>
            </div>
          </article> */}

              {/* Events */}

              <article className="shadow-[0px_0px_7px_0px_rgba(105,116,127,0.30)] bg-white self-stretch flex w-full grow flex-col mt-5.5 md:mt-5 xl:mt-0 pt-5 pb-9 px-5 rounded-xl">
                <h3 className="text-black text-sm2 font-medium bg-profile-button-bg max-w-full ml-px pl-5 pr-5 py-5 rounded-lg">
                  Events
                </h3>

                <div className="flex flex-col max-w-full items-start gap-3 ml-px mt-4 space-y-2">
                  {/* {userData?.events.length > 0 ? (
                    userData.events.slice(0, 2).map((event) => (
                      <Link
                        to={`/event/${event.id}/details`}
                        key={event.id}
                        className="w-full flex flex-col p-2 rounded-5px bg-white hover:bg-profile-button-bg"
                      >
                        <img src={eventImages[event.id] || null} alt="" />
                        <p className="text-nav-bg text-sm2 pb-1 pt-2">
                          {event.name}
                        </p>
                        <p className="text-main-text-gray text-xs3">
                          {formatPeriod(event.start_time, event.end_time)}
                        </p>
                        <p className="text-main-text-gray text-xs3">
                          {event.location}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="py-5 text-sm1 font-medium">
                      No event saved.
                    </p>
                  )} */}
                </div>
              </article>
            </div>
          </div>

          {/* needs profile */}
          <article className="shadow-[0px_0px_7px_0px_rgba(105,116,127,0.30)] bg-white self-stretch flex w-full grow flex-col pt-5 pb-9 px-5 rounded-xl">
            <h3 className="flex justify-between text-black text-sm2 font-medium bg-profile-button-bg max-w-full ml-px pl-5 pr-5 py-5 rounded-lg">
              Supply/Demand List
              <div className="flex items-center space-x-1">
                {/* add needs button */}
                {userData?.companies?.activity_target_id && (
                  <Link to={`/user/addneeds`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      preserveAspectRatio="none"
                      style={{ width: 24, height: 24, position: "relative" }}
                    >
                      <path
                        fill="#07BBD3"
                        d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"
                      ></path>
                    </svg>
                  </Link>
                )}

                {/* edit needs button */}
                {userData?.user_id === 1 && needsData?.length > 0 && (
                  <button
                    onClick={() => setIsEditNeeds((prev) => !prev)}
                    className={`${
                      isEditNeeds ? "fill-toggle-color" : "fill-main-color"
                    } p-[2.5px]`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      preserveAspectRatio="none"
                      style={{ width: 19, height: 19, position: "relative" }}
                    >
                      <path d="M5.54 13.469l3.493-.012 7.625-7.553c.3-.299.464-.696.464-1.12 0-.422-.165-.82-.464-1.119L15.402 2.41c-.598-.599-1.642-.595-2.236-.002L5.539 9.962v3.507zm8.743-9.94l1.258 1.254-1.264 1.252L13.02 4.78l1.262-1.25zm-7.16 7.093l4.773-4.729 1.256 1.256-4.773 4.727-1.257.004v-1.258z"></path>
                      <path d="M3.958 16.625h11.084c.873 0 1.583-.71 1.583-1.583V8.18l-1.583 1.583v5.279H6.458c-.02 0-.042.008-.062.008-.026 0-.052-.008-.08-.008H3.959V3.958h5.42l1.584-1.583H3.958c-.873 0-1.583.71-1.583 1.583v11.084c0 .873.71 1.583 1.583 1.583z"></path>
                    </svg>
                  </button>
                )}
              </div>
            </h3>

            <div className="flex flex-col max-w-full items-start gap-3 ml-px mt-4 space-y-2">
              {!userData?.companies?.activity_target_id ? (
                <div className="w-full bg-profile-button-bg rounded-10px flex flex-col items-center">
                  <p className="text-base font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-8 text-center">
                    You haven't created your company yet!
                  </p>
                  <Link
                    to="/user/companyprofile"
                    className="w-[166px] py-2.5 mb-5 bg-black hover:bg-main-color text-white text-sm2 rounded-full text-center"
                  >
                    Create Company
                  </Link>
                </div>
              ) : needsData?.length > 0 ? (
                needsData
                  .slice(0, DisplayNeeds)
                  .map((need) => (
                    <MyNeedsItem
                      key={need.id}
                      need={need}
                      isEditMode={isEditNeeds}
                    />
                  ))
              ) : (
                <p className="py-5 text-sm1 font-medium">
                  {"you didn't add any Supply/Demand"}
                </p>
              )}
            </div>

            {needsData?.length > DisplayNeeds && (
              <button
                onClick={showMoreHandler}
                className="mt-6 text-nav-bg hover:text-main-color text-sm1 underline text-right"
              >
                View More
              </button>
            )}
          </article>
        </section>
      )}
      <NeedToPay_popup
        popUp={IsNeedtopayPopup}
        setPopUp={setIsNeedtopayPopup}
      />
    </main>
  );
};

export default UserProfile;
