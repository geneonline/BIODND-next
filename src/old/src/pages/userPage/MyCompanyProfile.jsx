import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { companyProfileAssetsURL, useUser } from "@/data/api";

import {
  continentTranslation,
  locationOptions_en,
  locationOptions_zh,
} from "@/data/database/companies/locationOptions";

import {
  companyTypesTranslation,
  companyTypesOptions_en,
} from "@/data/database/companies/companyTypesOptions";

import {
  mainTherapeuticAreasOptions_en,
  mainTherapeuticAreasOptions_zh,
} from "@/data/database/companies/mainTherapeuticAreasOptions";

import LoginToContinue from "@/parts/LoginToContinue";
import defaultCompanyImage from "@/assets/img/database/Company Default Image.png";
import Loading from "@/widgets/Loading";
import { tableStyle } from "@/data/tailwindStyleGroup";
import Description_content from "@/widgets/database/Description_content";
import MultiCheckboxSelect from "@/widgets/user/MultiCheckboxSelect";
import HierarchicalMultiCheckboxSelect from "@/widgets/user/HierarchicalMultiCheckboxSelect ";

const findContinentByCountry = (country) => {
  // 假设使用英文版本进行匹配，根据需要调整
  const entries = Object.entries(locationOptions_en);
  for (let [continent, countries] of entries) {
    // eslint-disable-next-line no-unused-vars
    if (countries.some(([_, countryName]) => countryName === country)) {
      return continent;
    }
  }
  return null; // 如果没有找到匹配的大陆，返回null
};

const MyCompanyProfile = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [isEditMode, setIsEditMode] = useState(false);
  const [comInfo, setComInfo] = useState();

  const { userData, userLoading: isUserDataLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [selected_companyType_options, setSelected_companyType_options] =
    useState([]);

  const [
    selected_mainTherapeuticArea_options,
    setSelected_mainTherapeuticArea_options,
  ] = useState([]);

  const schema = yup
    .object({
      Company_Name: yup.string("string only!"),
      Country_Region: yup.string("string only!"),
      Address: yup.string("string only!"),
      Founded_Year: yup.string("string only!").nullable(),
      Ownership: yup.string("string only!").nullable(),
      Employee: yup.string("string only!").nullable(),
      Brief_Description: yup.string("string only!").nullable(), //Description
      Company_Types: yup.string("string only!"),
      Primary_Therapeutic_Areas: yup.string("string only!"),
      Description: yup.string("string only!").nullable(), // Summary of Assets
      Website: yup.string("string only!").nullable(),
      Email: yup.string("string only!").nullable(),
      Phone: yup
        .string()
        .nullable()
        .notRequired()
        .matches(/^[0-9]+$/, {
          message: "number Only!",
          excludeEmptyString: true,
        }),
      Social_media_1: yup.string("string only!"),
      Social_media_2: yup.string("string only!"),
      Social_media_3: yup.string("string only!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isCompanyDataLoading, setIsCompanyDataLoading] = useState(true);

  useEffect(() => {
    if (userData?.companies?.id) {
      setIsCompanyDataLoading(true);

      axios
        .get(
          `${import.meta.env.VITE_API_URL}/companies/${
            userData?.companies?.activity_target_id
          }.json`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          // 設置公司信息
          setComInfo(response.data);
        })
        .catch(() => {})
        .finally(() => {
          setIsCompanyDataLoading(false);
        });
    } else {
      setIsCompanyDataLoading(false);
    }
  }, [userData?.companies?.activity_target_id, userData?.companies?.id]);

  useEffect(() => {
    if (!isUserDataLoading && !isCompanyDataLoading) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [isUserDataLoading, isCompanyDataLoading]);

  const [list, setList] = useState({ isOpen: [true, false, false], now: 0 });

  const [continent, setContinent] = useState("Global");
  const locationChangeHanlder = (e) => {
    const continent = e.target.value;
    if (continent === "Global") {
      setContinent("Global");
    } else if (continent) {
      setContinent(continent);
    } else {
      setContinent(null);
    }
  };

  const [selectedFile, setSelectedFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // save company data
  const onSubmit = (data) => {
    setIsSubmitting(true);
    setList((prev) => ({ ...prev, now: 0 }));
    window.scrollTo(0, 0);
    console.log(data);

    if (
      data.Country_Region ===
      t("user.company_profile.placeholders.country_region")
    ) {
      data.Country_Region = null;
    }

    const filteredData = Object.keys(data).reduce((acc, key) => {
      // 檢查數據不為 undefined 且不為空字符串
      if (data[key] !== undefined && data[key] !== "" && data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    const formData = new FormData();

    Object.entries(filteredData).forEach(([key, value]) => {
      if (key === "uploaded_logo" && selectedFile) {
        formData.append("company[uploaded_logo]", selectedFile);
      } else {
        formData.append(`company[${key}]`, value);
      }
    });

    // if first time use post,or use patch.
    if (comInfo?.id) {
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/companies/${comInfo.id}.json`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data);
          setComInfo(res.data);
          setIsSubmitting(false);
        })
        .catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_API_URL}/companies.json`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setComInfo(res.data);
          setIsSubmitting(false);
        })

        .catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });
    }

    setIsEditMode(false);
  };

  const EditCompanyHandler = (e) => {
    e.preventDefault();
    if (comInfo) {
      if (comInfo.Country_Region) {
        const continent = findContinentByCountry(comInfo.Country_Region);
        if (continent) {
          setContinent(continent);
          // 需要确保这里设置的是continentTranslation里对应的键值，而不是显示文本
        }
      }

      reset(comInfo);

      const companyTypes = comInfo.Company_Types
        ? comInfo.Company_Types.split("|")
        : [];
      setSelected_companyType_options(companyTypes);
      setValue("Company_Types", companyTypes.join("|"));

      const mainTherapeuticAreas = comInfo.Primary_Therapeutic_Areas
        ? comInfo.Primary_Therapeutic_Areas.split("|")
        : [];
      setSelected_mainTherapeuticArea_options(mainTherapeuticAreas);
      setValue("Primary_Therapeutic_Areas", mainTherapeuticAreas.join("|"));
    }
    setIsEditMode(true);
    setList({
      ...list,
      now: 0,
      isOpen: [true, false, false],
    });
  };

  //---------------- img change
  const [image, setImage] = useState("");

  const ImageUploadHandler = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const [assetsData, setAssetsData] = useState([]);

  //fetch assets data
  useEffect(() => {
    if (comInfo?.id) {
      axios
        .get(companyProfileAssetsURL(comInfo.id), {
          withCredentials: true,
        })
        .then((res) => {
          setAssetsData(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [comInfo]);

  const [servicesAssets, setServicesAssets] = useState([]);
  const [technologiesAssets, setTechnologiesAssets] = useState([]);
  const [productsAssets, setProductsAssets] = useState([]);

  // filter service assets and technologies assets, other will be products
  useEffect(() => {
    if (assetsData && assetsData.assets) {
      const servicesTypes = [
        "Biotechnology / R&D Services",
        "Molecular diagnostics",
        "Other diagnostic",
        "Professional Services and Consulting",
        "Services",
        "Supplier & Engineering",
      ];
      const technologiesTypes = [
        "Technologies",
        "Clinical Development Tools",
        "Discovery Tools",
        "Drug delivery/formulation technology",
      ];

      const newServicesAssets = assetsData.assets.filter((asset) =>
        servicesTypes.includes(asset.assets_types)
      );
      const newTechnologiesAssets = assetsData.assets.filter((asset) =>
        technologiesTypes.includes(asset.assets_types)
      );
      const newProductsAssets = assetsData.assets.filter(
        (asset) =>
          !servicesTypes.includes(asset.assets_types) &&
          !technologiesTypes.includes(asset.assets_types)
      );

      setServicesAssets(newServicesAssets);
      setTechnologiesAssets(newTechnologiesAssets);
      setProductsAssets(newProductsAssets);
    }
  }, [assetsData]);

  return (
    <div className="bg-white">
      <div className="bg-white w-fit mx-auto pt-20">
        {/* company profile form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pb-32 w-full  flex flex-col text-base"
        >
          {/* top */}
          <div className=" pl-5 pr-8 py-8 bg-profile-button-bg flex justify-between items-center rounded-10px z-10">
            <div className="flex items-center">
              {/* img */}
              <div className="mr-5 relative flex flex-col bg-white overflow-hidden rounded-full items-stretch w-[66px] h-[66px] md:w-[81px] md:h-[81px] shrink-0">
                <img
                  loading="lazy"
                  src={
                    image ||
                    comInfo?.uploaded_logo_url ||
                    // comInfo?.Company_Logo ||
                    defaultCompanyImage
                  }
                  className="aspect-square  shrink-0"
                  alt="Profile Picture"
                />

                {isEditMode && (
                  <>
                    <label
                      className="absolute right-[10px] -top-4 text-xs3 h-full w-full block opacity-0 hover:opacity-90 transition-opacity cursor-pointer z-10"
                      htmlFor="file-upload"
                    >
                      <span className="bg-black text-white absolute mt-18 px-10 pt-1 pb-5 whitespace-nowrap">
                        {t("user.company_profile.buttons.edit_img")}
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
              <div className="flex flex-col">
                <h2 className="text-xl font-medium pb-1.5">
                  {comInfo?.Company_Name ||
                    t("user.company_profile.defult_company_name")}
                </h2>
                <p className="text-main-text-gray text-sm">
                  {t("user.company_profile.company_profile")}
                </p>
              </div>
            </div>
            {list.now <= 3 && (
              <>
                {comInfo?.id && userData.id === 1 && (
                  <>
                    {isEditMode ? (
                      <button className="w-[166px] py-2.5 bg-black hover:bg-main-color text-white text-sm2 rounded-full">
                        {t("user.company_profile.buttons.save_changes")}
                      </button>
                    ) : (
                      <button
                        onClick={EditCompanyHandler}
                        className="w-[166px] py-2.5 bg-main-text-gray hover:bg-main-color text-white text-sm2 rounded-full"
                      >
                        {t("user.company_profile.buttons.edit_profile")}
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {list.now > 3 && list.now < 7 && (
              <Link
                to={`/user/${comInfo?.id}/addasset`}
                className="w-[166px] py-2.5 bg-main-text-gray hover:bg-main-color text-white text-sm2 rounded-full text-center"
              >
                Add New Asset
              </Link>
            )}
          </div>

          {/* main */}
          <div className="w-full flex">
            {/* col 1 drop down menu*/}
            <div className="w-[225px] flex flex-col bg-com-profile-bg text-sm2 -translate-y-3.5 py-10 pl-5 pr-7.5 rounded-b-10px">
              {/* Overview */}
              <div className="pb-5.5">
                <button
                  className="font-medium flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setList({
                      ...list,
                      isOpen: [!list.isOpen[0], list.isOpen[1], list.isOpen[2]],
                    });
                  }}
                >
                  <span>
                    <svg
                      width={8}
                      height={8}
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-2 h-2 relative ${
                        list.isOpen[0] ? "rotate-180" : "rotate-0"
                      }`}
                      preserveAspectRatio="none"
                    >
                      <path d="M4 1.6001L8 5.86676H0L4 1.6001Z" fill="black" />
                    </svg>
                  </span>
                  <span className="pl-2.5">
                    {t("user.company_profile.list.overview.overview")}
                  </span>
                </button>
                {/* list */}
                <ul
                  className={`pl-7.5 pt-3 space-y-3 list-none ${
                    list.isOpen[0] ? "list-item" : "hidden"
                  }`}
                >
                  <li>
                    <button
                      className={`${
                        list.now === 0
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 0 });
                      }}
                    >
                      {t("user.company_profile.list.overview.about")}
                    </button>
                  </li>

                  <li>
                    <button
                      className={`${
                        list.now === 1
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 1 });
                      }}
                    >
                      {t("user.company_profile.list.overview.categorization")}
                    </button>
                  </li>

                  <li>
                    <button
                      className={`${
                        list.now === 2
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 2 });
                      }}
                    >
                      {t(
                        "user.company_profile.list.overview.summary_of_assets"
                      )}
                    </button>
                  </li>

                  <li>
                    <button
                      className={`text-start ${
                        list.now === 3
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 3 });
                      }}
                    >
                      {t("user.company_profile.list.overview.contact")}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Assets */}
              <div className="pb-5.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setList({
                      ...list,
                      isOpen: [list.isOpen[0], !list.isOpen[1], list.isOpen[2]],
                    });
                  }}
                  className={`font-medium flex items-center ${
                    isEditMode || !comInfo?.id
                      ? "pointer-events-none"
                      : "pointer-events-auto"
                  }`}
                >
                  <span>
                    <svg
                      width={8}
                      height={8}
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-2 h-2 relative ${
                        list.isOpen[1] ? "rotate-180" : "rotate-0"
                      }`}
                      preserveAspectRatio="none"
                    >
                      <path d="M4 1.6001L8 5.86676H0L4 1.6001Z" fill="black" />
                    </svg>
                  </span>
                  <span className="pl-2.5">
                    {t("user.company_profile.list.assets.assets")}
                  </span>
                </button>
                {/* list */}
                <ul
                  className={`pl-7.5 pt-3 space-y-3 list-none ${
                    list.isOpen[1] ? "list-item" : "hidden"
                  }`}
                >
                  {/* Products */}
                  <li>
                    <button
                      className={`${
                        list.now === 4
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 4 });
                      }}
                    >
                      {t("user.company_profile.list.assets.products")}
                    </button>
                  </li>

                  {/* Services */}
                  <li>
                    <button
                      className={`${
                        list.now === 5
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 5 });
                      }}
                    >
                      {t("user.company_profile.list.assets.services")}
                    </button>
                  </li>

                  {/* Technologies */}
                  <li>
                    <button
                      className={`${
                        list.now === 6
                          ? "text-black pointer-events-none"
                          : "text-main-text-gray pointer-events-auto"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setList({ ...list, now: 6 });
                      }}
                    >
                      {t("user.company_profile.list.assets.technologies")}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Financials */}
              <div>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="font-medium flex items-center"
                >
                  <span>
                    <svg
                      width={8}
                      height={8}
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2 h-2 relative"
                      preserveAspectRatio="none"
                    >
                      <path d="M4 1.6001L8 5.86676H0L4 1.6001Z" fill="black" />
                    </svg>
                  </span>
                  <span className="pl-2.5">
                    {t("user.company_profile.list.financials.financials")}
                  </span>
                </button>
              </div>
            </div>

            {/* col 2 input area*/}
            <div className="md:min-w-[450px] xl:min-w-[550px] min-h-[650px] flex flex-col bg-white ">
              {/* -------- Overview ------------ */}

              {isLoading || isSubmitting ? (
                <Loading height={"50vh"} />
              ) : (
                <>
                  {!comInfo?.id && !isEditMode ? (
                    // ============= message when not have company info ==============
                    <div className="bg-profile-button-bg m-2 flex flex-col items-center rounded-10px">
                      <h3 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15">
                        Create your company profile
                      </h3>
                      <button
                        onClick={EditCompanyHandler}
                        className="w-[166px] py-2.5 mb-5 bg-black hover:bg-main-color text-white text-sm2 rounded-full"
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    // =============== company info ======================
                    <>
                      {/* About */}
                      {list.now === 0 && (
                        <div className="pt-11 pl-16 flex flex-col space-y-5">
                          {/* Company_Name */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Company_Name"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.company_name")}
                              {errors.Company_Name && (
                                <span className="text-warning pl-3">
                                  {errors.Company_Name.message}
                                </span>
                              )}
                            </label>
                            {isEditMode ? (
                              <input
                                id="Company_Name"
                                type="text"
                                placeholder={t(
                                  "user.company_profile.placeholders.company_name"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Company_Name
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Company_Name")}
                              />
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Company_Name ||
                                  t(
                                    "user.company_profile.placeholders.company_name"
                                  )}
                              </p>
                            )}
                          </div>

                          {/* Global Region */}
                          {isEditMode && (
                            <div className="flex flex-col">
                              <label
                                htmlFor="Global Region"
                                className="pb-2 text-sm1"
                              >
                                {t("user.company_profile.fields.global_region")}
                              </label>

                              <select
                                placeholder={t(
                                  "user.company_profile.placeholders.global_region"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                           focus:border-main-color focus:ring-main-color border-main-text-gray
                      `}
                                onChange={locationChangeHanlder}
                              >
                                <option defaultValue value="Global">
                                  {t(
                                    "user.company_profile.placeholders.global_region"
                                  )}
                                </option>
                                {Object.values(continentTranslation).map(
                                  (option) => (
                                    <option key={option[0]} value={option[0]}>
                                      {currentLanguage === "en"
                                        ? option[0]
                                        : option[1]}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}

                          {/* Country/Region */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Country_Region"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.country_region")}
                              {errors.Country_Region && (
                                <span className="text-warning pl-3">
                                  {errors.Country_Region.message}
                                </span>
                              )}
                            </label>

                            {isEditMode ? (
                              <select
                                id="Country_Region"
                                placeholder={t(
                                  "user.company_profile.placeholders.country_region"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Country_Region
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Country_Region")}
                              >
                                <option>
                                  {t(
                                    "user.company_profile.placeholders.country_region"
                                  )}
                                </option>

                                {continent &&
                                  continent !== "Global" &&
                                  (currentLanguage === "en"
                                    ? locationOptions_en[continent]
                                    : locationOptions_zh[continent]
                                  ).map((option) => (
                                    <option key={option[0]} value={option[1]}>
                                      {option[0]}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Country_Region ||
                                  t(
                                    "user.company_profile.placeholders.country_region"
                                  )}
                              </p>
                            )}
                          </div>

                          {/* Address */}
                          <div className="flex flex-col">
                            <label htmlFor="Address" className=" pb-2 text-sm1">
                              {t("user.company_profile.fields.address")}
                              {errors.Address && (
                                <span className="text-warning pl-3">
                                  {errors.Address.message}
                                </span>
                              )}
                            </label>
                            {isEditMode ? (
                              <input
                                id="Address"
                                type="text"
                                placeholder={t(
                                  "user.company_profile.placeholders.address"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Address
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Address")}
                              />
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Address ||
                                  t(
                                    "user.company_profile.placeholders.address"
                                  )}
                              </p>
                            )}
                          </div>
                          {/* Founded_Year */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Founded_Year"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.founded_year")}
                              {errors.Founded_Year && (
                                <span className="text-warning pl-3">
                                  {errors.Founded_Year.message}
                                </span>
                              )}
                            </label>

                            {isEditMode ? (
                              <input
                                id="Founded_Year"
                                type="text"
                                placeholder={t(
                                  "user.company_profile.placeholders.founded_year"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Founded_Year
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Founded_Year")}
                              />
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Founded_Year || "N/A"}
                              </p>
                            )}
                          </div>
                          {/* State of Ownership */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Ownership"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.ownership")}
                              {errors.Ownership && (
                                <span className="text-warning pl-3">
                                  {errors.Ownership.message}
                                </span>
                              )}
                            </label>
                            {isEditMode ? (
                              <select
                                id="Ownership"
                                placeholder={t(
                                  "user.company_profile.placeholders.state_of_ownership"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Ownership
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Ownership")}
                              >
                                <option className="text-gray-600" value="">
                                  {t(
                                    "user.company_profile.placeholders.state_of_ownership"
                                  )}
                                </option>
                                <option value="Private">{"Private"}</option>
                                <option value="Public">{"Public"}</option>
                              </select>
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Ownership || "N/A"}
                              </p>
                            )}
                          </div>
                          {/* Employee */}
                          <div className="flex flex-col">
                            <label htmlFor="Employee" className="pb-2 text-sm1">
                              {t("user.company_profile.fields.employees")}
                              {errors.Employee && (
                                <span className="text-warning pl-3">
                                  {errors.Employee.message}
                                </span>
                              )}
                            </label>

                            {isEditMode ? (
                              <select
                                id="Employee"
                                type="text"
                                placeholder={t(
                                  "user.company_profile.placeholders.employees"
                                )}
                                className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Employee
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                {...register("Employee")}
                              >
                                <option className="text-gray-600" value="">
                                  {t(
                                    "user.company_profile.placeholders.employees"
                                  )}
                                </option>
                                <option value="<10">{"<10"}</option>
                                <option value="10-50">{"10-50"}</option>
                                <option value="50-100">{"50-100"}</option>
                                <option value="100-200">{"100-200"}</option>
                                <option value="200-500">{"200-500"}</option>
                                <option value="500-1,000">{"500-1,000"}</option>
                                <option value="1,000-5,000">
                                  {"1,000-5,000"}
                                </option>
                                <option value="5,000-10,000">
                                  {"5,000-10,000"}
                                </option>
                                <option value="over 10,000">
                                  {"over 10,000"}
                                </option>
                              </select>
                            ) : (
                              <p className="text-main-text-gray text-sm1">
                                {comInfo?.Employee || "N/A"}
                              </p>
                            )}
                          </div>
                          {/* Brief_Description */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Brief_Description"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.description")}
                              {errors.Brief_Description && (
                                <span className="text-warning pl-3">
                                  {errors.Brief_Description.message}
                                </span>
                              )}
                            </label>
                            {isEditMode ? (
                              <textarea
                                id="Brief_Description"
                                type="text"
                                placeholder={t(
                                  "user.company_profile.placeholders.company_description"
                                )}
                                className={`w-[440px] h-[170px] py-3.5 pl-4 rounded-5px text-sm font-medium border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Brief_Description
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      resize-none
                      
                      `}
                                {...register("Brief_Description")}
                              />
                            ) : (
                              <p className="w-[440px] h-[170px] text-main-text-gray text-sm1">
                                {comInfo?.Brief_Description || "N/A"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Categorization */}
                      {list.now === 1 && (
                        <div className="pt-11 pl-16 pr-[151px] flex flex-col space-y-5 ">
                          {/* Company_Types */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Company_Types"
                              className="pb-2 text-sm1"
                            >
                              {t("user.company_profile.fields.main_sector")}
                              {errors.Company_Types && (
                                <span className="text-warning pl-3">
                                  {errors.Company_Types.message}
                                </span>
                              )}
                            </label>
                            {isEditMode ? (
                              //         <input
                              //           id="Company_Types"
                              //           type="text"
                              //           placeholder={t(
                              //             "user.company_profile.placeholders.main_sector"
                              //           )}
                              //           className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray
                              // ${
                              //   errors.Company_Types
                              //     ? "focus:border-warning focus:ring-warning border-warning"
                              //     : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                              // }
                              // `}
                              //           {...register("Company_Types")}
                              //         />
                              <div className="w-[350px]">
                                <HierarchicalMultiCheckboxSelect
                                  topLevelOptions={companyTypesTranslation}
                                  subLevelOptions={companyTypesOptions_en}
                                  currentLanguage={currentLanguage}
                                  registerName="Company_Types"
                                  placeholder={t(
                                    "user.company_profile.placeholders.main_company_type"
                                  )}
                                  sub_placeholder={t(
                                    "user.company_profile.placeholders.sub_company_type"
                                  )}
                                  selectedSubOptions={
                                    selected_companyType_options
                                  }
                                  setSelectedSubOptions={
                                    setSelected_companyType_options
                                  }
                                  error={errors.Company_Types}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  getValues={getValues}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-wrap">
                                {comInfo?.Company_Types ? (
                                  comInfo?.Company_Types.split("|").map(
                                    (i, index) => (
                                      <p
                                        key={index}
                                        className="px-2.5 py-1.5 m-1 text-sm text-db-table-text bg-bd-gray rounded-20px"
                                      >
                                        {i}
                                      </p>
                                    )
                                  )
                                ) : (
                                  <p className="text-main-text-gray text-sm1">
                                    N/A
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Primary_Therapeutic_Areas */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="Primary_Therapeutic_Areas"
                              className="pb-2 text-sm1"
                            >
                              {t(
                                "user.company_profile.fields.therapeutic_area"
                              )}
                              {errors.Primary_Therapeutic_Areas && (
                                <span className="text-warning pl-3">
                                  {errors.Primary_Therapeutic_Areas.message}
                                </span>
                              )}
                            </label>

                            {isEditMode ? (
                              <MultiCheckboxSelect
                                options={
                                  currentLanguage === "en"
                                    ? mainTherapeuticAreasOptions_en
                                    : mainTherapeuticAreasOptions_zh
                                }
                                currentLanguage={currentLanguage}
                                registerName="Primary_Therapeutic_Areas"
                                setValue={setValue}
                                placeholder={t(
                                  "user.company_profile.placeholders.main_therapeutic_area"
                                )}
                                selectedOptions={
                                  selected_mainTherapeuticArea_options
                                }
                                setSelectedOptions={
                                  setSelected_mainTherapeuticArea_options
                                }
                                error={errors.Primary_Therapeutic_Areas}
                                clearErrors={clearErrors}
                              />
                            ) : (
                              <div className="flex flex-wrap">
                                {comInfo?.Primary_Therapeutic_Areas ? (
                                  comInfo?.Primary_Therapeutic_Areas.split(
                                    "|"
                                  ).map((i, index) => (
                                    <p
                                      key={index}
                                      className="px-2.5 py-1.5 m-1 text-sm text-db-table-text bg-bd-gray rounded-20px"
                                    >
                                      {i}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-main-text-gray text-sm1">
                                    N/A
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Summary of Assets */}
                      {list.now === 2 && (
                        <div className="pt-11 pl-16 flex flex-col space-y-5">
                          <div className="flex flex-col">
                            <label
                              htmlFor="Description"
                              className="pb-3 text-sm2"
                            >
                              {t(
                                "user.company_profile.fields.summary_of_assets"
                              )}
                              {errors.Description && (
                                <span className="text-warning pl-3">
                                  {errors.Description.message}
                                </span>
                              )}
                            </label>

                            {isEditMode ? (
                              <>
                                <p className="pb-4 text-sm text-main-text-gray">
                                  {t(
                                    "user.company_profile.fields.introduction"
                                  )}
                                </p>
                                <textarea
                                  id="Description"
                                  type="text"
                                  placeholder={t(
                                    "user.company_profile.placeholders.summary_of_assets"
                                  )}
                                  className={`w-[448px] h-[234px] py-3.5 pl-4 rounded-5px text-sm font-medium border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Description
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      resize-none
                      
                      `}
                                  {...register("Description")}
                                />
                              </>
                            ) : (
                              <p className="w-[448px] h-[234px] text-main-text-gray text-sm1">
                                {comInfo?.Description || "N/A"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      {list.now === 3 && (
                        <div className="pt-11 pl-16 pr-[151px] flex flex-col space-y-5">
                          <div>
                            <h3 className="font-medium pb-7.5">
                              {t("user.company_profile.fields.contact_title")}
                            </h3>

                            <div className="flex flex-col space-y-7.5">
                              {/* Website */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="Website"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.website")}
                                  {errors.Website && (
                                    <span className="text-warning pl-3">
                                      {errors.Website.message}
                                    </span>
                                  )}
                                </label>

                                {isEditMode ? (
                                  <input
                                    id="Website"
                                    type="text"
                                    placeholder={t(
                                      "user.company_profile.placeholders.website"
                                    )}
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Website
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Website")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.Website || "N/A"}
                                  </p>
                                )}
                              </div>

                              {/* Email */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="Email"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.email")}
                                  {errors.Email && (
                                    <span className="text-warning pl-3">
                                      {errors.Email.message}
                                    </span>
                                  )}
                                </label>
                                {isEditMode ? (
                                  <input
                                    id="Email"
                                    placeholder={t(
                                      "user.company_profile.placeholders.email"
                                    )}
                                    type="text"
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Email
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Email")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.Email || "N/A"}
                                  </p>
                                )}
                              </div>

                              {/* Phone */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="Phone"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.phone")}
                                  {errors.Phone && (
                                    <span className="text-warning pl-3">
                                      {errors.Phone.message}
                                    </span>
                                  )}
                                </label>
                                {isEditMode ? (
                                  <input
                                    id="Phone"
                                    type="number"
                                    placeholder={t(
                                      "user.company_profile.placeholders.phone_number"
                                    )}
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Phone
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Phone")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.Phone || "N/A"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium pb-7.5 pt-15">
                              {t("user.company_profile.fields.social_media")}
                            </h3>

                            <div className="flex flex-col space-y-7.5">
                              {/* Facebook */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="Facebook"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.facebook")}
                                  {errors.Social_media_1 && (
                                    <span className="text-warning pl-3">
                                      {errors.Social_media_1.message}
                                    </span>
                                  )}
                                </label>

                                {isEditMode ? (
                                  <input
                                    id="Facebook"
                                    type="url"
                                    placeholder={t(
                                      "user.company_profile.placeholders.facebook"
                                    )}
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Social_media_1
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Social_media_1")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.social_media_1 || "N/A"}
                                  </p>
                                )}
                              </div>

                              {/* LinkedIn */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="LinkedIn"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.linkedin")}
                                  {errors.Social_media_2 && (
                                    <span className="text-warning pl-3">
                                      {errors.Social_media_2.message}
                                    </span>
                                  )}
                                </label>
                                {isEditMode ? (
                                  <input
                                    id="LinkedIn"
                                    type="url"
                                    placeholder={t(
                                      "user.company_profile.placeholders.linkedin"
                                    )}
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Social_media_2
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Social_media_2")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.social_media_2 || "N/A"}
                                  </p>
                                )}
                              </div>

                              {/* Twitter(X) */}
                              <div className="flex flex-col">
                                <label
                                  htmlFor="Twitter"
                                  className="pb-2 text-sm1"
                                >
                                  {t("user.company_profile.fields.twitter")}
                                  {errors.Social_media_3 && (
                                    <span className="text-warning pl-3">
                                      {errors.Social_media_3.message}
                                    </span>
                                  )}
                                </label>
                                {isEditMode ? (
                                  <input
                                    id="Twitter"
                                    type="url"
                                    placeholder={t(
                                      "user.company_profile.placeholders.twitter"
                                    )}
                                    className={`w-[250px] py-3.5 pl-4 rounded-5px text-sm font-medium xl:w-64 border-0.3px placeholder:text-main-text-gray 
                      ${
                        errors.Social_media_3
                          ? "focus:border-warning focus:ring-warning border-warning"
                          : "focus:border-main-color focus:ring-main-color border-main-text-gray"
                      }
                      `}
                                    {...register("Social_media_3")}
                                  />
                                ) : (
                                  <p className=" text-main-text-gray text-sm1">
                                    {comInfo?.social_media_3 || "N/A"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* -------- Assets ------------ */}

              {(list.now === 4 || list.now === 5 || list.now === 6) && (
                <div className="px-2">
                  {/* Products */}
                  {list.now === 4 &&
                    (productsAssets.length > 0 ? (
                      <>
                        <h2 className="text-xl font-medium text-profile-asset-title  pl-5 mr-3 mb-4 mt-10">
                          {t("company_profile.assets.title.Products")}
                        </h2>

                        <div className="md:w-[60vw] xl:w-[900px] p-5 overflow-auto">
                          <table className="mr-3 border-separate border-spacing-0">
                            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal ">
                              <tr>
                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.product_name"
                                  )}
                                </th>
                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.main_therapeutic_area"
                                  )}
                                </th>
                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.product_description"
                                  )}
                                </th>
                                <th
                                  className={`whitespace-nowrap ${tableStyle.th}`}
                                >
                                  {t(
                                    "company_profile.assets.table_headers.development_phase"
                                  )}
                                </th>
                                <th
                                  className={`whitespace-nowrap ${tableStyle.th}`}
                                >
                                  {t(
                                    "company_profile.assets.table_headers.administration_mode"
                                  )}
                                </th>
                                <th className={tableStyle.th}></th>
                                {/* <th className={tableStyle.th}>IP Rights</th> */}
                              </tr>
                            </thead>
                            <tbody className="text-xs3">
                              {productsAssets.map((asset) => (
                                <tr
                                  className="border border-footer-text"
                                  key={asset.id}
                                >
                                  <td
                                    className={`max-w-[350px] text-sm ${tableStyle.td}`}
                                  >
                                    <p>{asset.product_name}</p>
                                  </td>

                                  {/* main_therapeutic_sector */}
                                  <td
                                    className={`min-w-[300px]  ${tableStyle.td}`}
                                  >
                                    {asset.main_therapeutic_sector ? (
                                      <div className="flex flex-wrap">
                                        {asset.main_therapeutic_sector
                                          .split("|")
                                          .map((i, index) => (
                                            <p
                                              key={index}
                                              className="px-2.5 py-1.5 m-1 text-sm text-db-table-text bg-bd-gray rounded-20px"
                                            >
                                              {i}
                                            </p>
                                          ))}
                                      </div>
                                    ) : (
                                      <p className="text-center">N/A</p>
                                    )}
                                  </td>

                                  <td
                                    className={`max-w-[300px] ${tableStyle.td}`}
                                  >
                                    <Description_content
                                      content={
                                        asset.product_description || "empty"
                                      }
                                      maxCharacters={200}
                                      width={170}
                                      companyName={asset.product_name}
                                      haveImg={false}
                                    />
                                  </td>

                                  <td className={`${tableStyle.td}`}>
                                    <p className="text-center">
                                      {asset.development_phase || "N/A"}
                                    </p>
                                  </td>

                                  <td
                                    className={`max-w-[300px] ${tableStyle.td}`}
                                  >
                                    <p className="text-center">
                                      {asset.mode_of_administration || "N/A"}
                                    </p>
                                  </td>
                                  <td
                                    className={`max-w-[300px] ${tableStyle.td}`}
                                  >
                                    {userData?.id === 1 && (
                                      <Link
                                        to={`/user/${comInfo?.id}/editasset?asset_id=${asset.id}`}
                                      >
                                        <svg
                                          width={20}
                                          height={20}
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-5 h-5 relative"
                                          preserveAspectRatio="none"
                                        >
                                          <path
                                            d="M5.83203 14.1773L9.50953 14.1648L17.5362 6.21484C17.8512 5.89984 18.0245 5.4815 18.0245 5.0365C18.0245 4.5915 17.8512 4.17317 17.5362 3.85817L16.2145 2.5365C15.5845 1.9065 14.4854 1.90984 13.8604 2.534L5.83203 10.4857V14.1773ZM15.0362 3.71484L16.3604 5.034L15.0295 6.35234L13.7079 5.0315L15.0362 3.71484ZM7.4987 11.1807L12.5237 6.20317L13.8454 7.52484L8.8212 12.5007L7.4987 12.5048V11.1807Z"
                                            fill="#009BAF"
                                          />
                                          <path
                                            d="M4.16667 17.5H15.8333C16.7525 17.5 17.5 16.7525 17.5 15.8333V8.61L15.8333 10.2767V15.8333H6.79833C6.77667 15.8333 6.75417 15.8417 6.7325 15.8417C6.705 15.8417 6.6775 15.8342 6.64917 15.8333H4.16667V4.16667H9.8725L11.5392 2.5H4.16667C3.2475 2.5 2.5 3.2475 2.5 4.16667V15.8333C2.5 16.7525 3.2475 17.5 4.16667 17.5Z"
                                            fill="#009BAF"
                                          />
                                        </svg>
                                      </Link>
                                    )}
                                  </td>

                                  {/* <td className="max-w-[500px]">
                          <p className="text-center p-2">
                            {asset.ip_rights || "N/A"}
                          </p>
                        </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h3 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15 text-center">
                          This company does not have any product,you can add a
                          new one.
                        </h3>
                      </div>
                    ))}

                  {/* Services */}
                  {list.now === 5 &&
                    (servicesAssets.length > 0 ? (
                      <>
                        <h2 className="text-xl font-medium text-profile-asset-title  pl-5 mr-3 mb-4 mt-10">
                          {t("company_profile.assets.title.Services")}
                        </h2>

                        <div className="md:w-[60vw] xl:w-[900px] p-5 overflow-auto">
                          <table className="mr-3 border-separate border-spacing-0">
                            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal">
                              <tr>
                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.service_name"
                                  )}
                                </th>

                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.service_description"
                                  )}
                                </th>

                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.service_availability"
                                  )}
                                </th>

                                <th className={tableStyle.th}></th>
                              </tr>
                            </thead>
                            <tbody className="text-xs3">
                              {servicesAssets.map((asset) => (
                                <tr
                                  className="border border-footer-text"
                                  key={asset.id}
                                >
                                  <td
                                    className={`max-w-[350px] text-sm ${tableStyle.td}`}
                                  >
                                    <p>{asset.product_name}</p>
                                  </td>

                                  <td
                                    className={`max-w-[400px] ${tableStyle.td}`}
                                  >
                                    <Description_content
                                      content={
                                        asset.product_description || "empty"
                                      }
                                      maxCharacters={200}
                                      width={170}
                                      companyName={asset.product_name}
                                      haveImg={false}
                                    />
                                  </td>

                                  <td
                                    className={`text-center ${tableStyle.td}`}
                                  >
                                    <p>{asset.service_availability || "N/A"}</p>
                                  </td>

                                  <td
                                    className={`max-w-[300px] ${tableStyle.td}`}
                                  >
                                    {userData?.id === 1 && (
                                      <Link
                                        to={`/user/${comInfo?.id}/editasset?asset_id=${asset.id}`}
                                      >
                                        <svg
                                          width={20}
                                          height={20}
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-5 h-5 relative"
                                          preserveAspectRatio="none"
                                        >
                                          <path
                                            d="M5.83203 14.1773L9.50953 14.1648L17.5362 6.21484C17.8512 5.89984 18.0245 5.4815 18.0245 5.0365C18.0245 4.5915 17.8512 4.17317 17.5362 3.85817L16.2145 2.5365C15.5845 1.9065 14.4854 1.90984 13.8604 2.534L5.83203 10.4857V14.1773ZM15.0362 3.71484L16.3604 5.034L15.0295 6.35234L13.7079 5.0315L15.0362 3.71484ZM7.4987 11.1807L12.5237 6.20317L13.8454 7.52484L8.8212 12.5007L7.4987 12.5048V11.1807Z"
                                            fill="#009BAF"
                                          />
                                          <path
                                            d="M4.16667 17.5H15.8333C16.7525 17.5 17.5 16.7525 17.5 15.8333V8.61L15.8333 10.2767V15.8333H6.79833C6.77667 15.8333 6.75417 15.8417 6.7325 15.8417C6.705 15.8417 6.6775 15.8342 6.64917 15.8333H4.16667V4.16667H9.8725L11.5392 2.5H4.16667C3.2475 2.5 2.5 3.2475 2.5 4.16667V15.8333C2.5 16.7525 3.2475 17.5 4.16667 17.5Z"
                                            fill="#009BAF"
                                          />
                                        </svg>
                                      </Link>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h3 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15 text-center">
                          This company does not have any service,you can add a
                          new one.
                        </h3>
                      </div>
                    ))}

                  {/* Technologies */}
                  {list.now === 6 &&
                    (technologiesAssets.length > 0 ? (
                      <>
                        <h2 className="text-xl font-medium text-profile-asset-title  pl-5 mr-3 mb-4 mt-10">
                          {t("company_profile.assets.title.Technologies")}
                        </h2>

                        <div className="md:w-[60vw] xl:w-[900px] p-5 overflow-auto">
                          <table className="mr-3 border-separate border-spacing-0">
                            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal">
                              <tr>
                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.technologies_name"
                                  )}
                                </th>

                                <th className={tableStyle.th}>
                                  {t(
                                    "company_profile.assets.table_headers.technologies_description"
                                  )}
                                </th>
                                <th className={tableStyle.th}></th>
                                {/* <th className={tableStyle.th}>IP Rights</th> */}
                              </tr>
                            </thead>
                            <tbody className="text-xs3">
                              {technologiesAssets.map((asset) => (
                                <tr
                                  className="border border-footer-text"
                                  key={asset.id}
                                >
                                  <td
                                    className={`max-w-[350px] text-sm ${tableStyle.td}`}
                                  >
                                    <p>{asset.product_name}</p>
                                  </td>

                                  <td
                                    className={`max-w-[400px] ${tableStyle.td}`}
                                  >
                                    <Description_content
                                      content={
                                        asset.product_description || "empty"
                                      }
                                      maxCharacters={200}
                                      width={170}
                                      companyName={asset.product_name}
                                      haveImg={false}
                                    />
                                  </td>

                                  <td
                                    className={`max-w-[300px] ${tableStyle.td}`}
                                  >
                                    {userData?.id === 1 && (
                                      <Link
                                        to={`/user/${comInfo?.id}/editasset?asset_id=${asset.id}`}
                                      >
                                        <svg
                                          width={20}
                                          height={20}
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-5 h-5 relative"
                                          preserveAspectRatio="none"
                                        >
                                          <path
                                            d="M5.83203 14.1773L9.50953 14.1648L17.5362 6.21484C17.8512 5.89984 18.0245 5.4815 18.0245 5.0365C18.0245 4.5915 17.8512 4.17317 17.5362 3.85817L16.2145 2.5365C15.5845 1.9065 14.4854 1.90984 13.8604 2.534L5.83203 10.4857V14.1773ZM15.0362 3.71484L16.3604 5.034L15.0295 6.35234L13.7079 5.0315L15.0362 3.71484ZM7.4987 11.1807L12.5237 6.20317L13.8454 7.52484L8.8212 12.5007L7.4987 12.5048V11.1807Z"
                                            fill="#009BAF"
                                          />
                                          <path
                                            d="M4.16667 17.5H15.8333C16.7525 17.5 17.5 16.7525 17.5 15.8333V8.61L15.8333 10.2767V15.8333H6.79833C6.77667 15.8333 6.75417 15.8417 6.7325 15.8417C6.705 15.8417 6.6775 15.8342 6.64917 15.8333H4.16667V4.16667H9.8725L11.5392 2.5H4.16667C3.2475 2.5 2.5 3.2475 2.5 4.16667V15.8333C2.5 16.7525 3.2475 17.5 4.16667 17.5Z"
                                            fill="#009BAF"
                                          />
                                        </svg>
                                      </Link>
                                    )}
                                  </td>

                                  {/* <td className="tetxt-center p-2">
                                <p>{asset.ip_rights || "N/A"}</p>
                              </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h3 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15 text-center">
                          This company does not have any Technology,you can add
                          a new one.
                        </h3>
                      </div>
                    ))}
                </div>
              )}

              {/* ------------- editMode buttons ----------- */}
              <div className="mt-12 flex flex-col items-end">
                <div className="pt-6 flex">
                  {isEditMode ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditMode(false);
                      }}
                      className="w-fit border-[0.5px] py-4 px-10 mr-2 rounded-full"
                    >
                      {t("user.company_profile.buttons.cancel")}
                    </button>
                  ) : null}

                  {isEditMode ? (
                    <button className="w-fit text-white bg-black hover:bg-main-color py-4 px-10 rounded-full">
                      {t("user.company_profile.buttons.save_changes")}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyCompanyProfile;
