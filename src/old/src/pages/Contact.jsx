import { useState, useEffect } from "react";
import axios from "axios";
import Select from "@/widgets/Select";
import IssueTypes from "@/data/database/IssueTypes.json";
import { useTranslation } from "react-i18next";
import SubmitSuccess from "@/widgets/SubmitSuccess";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [popup, setPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const currentLanguage = i18n.language;
  const [inputValue, setInputValue] = useState({
    "entry.35205124": localStorage.getItem("user_name"),
    "entry.92521899": localStorage.getItem("user_email"),
    "entry.1635082506": "",
    "entry.793493309": "",
    "entry.1383352643": "",
  });
  const inputHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const setType = (newType) => {
    setInputValue((prevState) => ({
      ...prevState,
      "entry.1635082506": newType,
    }));
    setErrors((prev) => ({ ...prev, ["entry.1635082506"]: "" }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Get the phone number value (without country code)
    const selectValue = inputValue["entry.1635082506"];

    // Validate phone number only if there is a value.
    if (!selectValue) {
      setErrors((prev) => ({
        ...prev,
        ["entry.1635082506"]: "*You most choose one.",
      }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, ["entry.1635082506"]: "" }));
    }

    try {
      setPopup(true);
      await axios({
        method: "POST",
        url: `https://docs.google.com/forms/d/e/1FAIpQLSd4dZYANZRTPITO6AbHzvkR8PJASvtIw12r6GvT4l6NYyfGRw/formResponse?entry.35205124=${inputValue["entry.35205124"]}&entry.92521899=${inputValue["entry.92521899"]}&entry.1635082506=${inputValue["entry.1635082506"]}&entry.793493309=${inputValue["entry.793493309"]}&entry.1383352643=${inputValue["entry.1383352643"]}`,
        data: inputValue,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue) {
      console.log(inputValue);
    }
  }, [inputValue]);
  return (
    <main className=" w-full flex">
      {/* img side */}
      <div className=" pt-[250px] pl-26 pr-17 hidden md:flex flex-col bg-contact bg-cover max-md:ml-0 max-md:w-full">
        <div className="w-[380px] flex flex-col text-white ">
          <div className="text-5xl font-bold leading-140 pb-3">
            Contact Us or Report An Issue
          </div>
          <div className=" text-xl font-normal leading-140 max-md:mr-2.5 ">
            Please enter the details of your request. A member of our support
            staff will respond as soon as possible.
          </div>
        </div>
      </div>

      {/* form side   */}
      <div className="mt-20 xl:mt-30 w-[658px] mx-auto mb-16 px-13 pt-8 pb-10 bg-white rounded-10px">
        <h1 className="text-18px font-medium mb-9">{t("contact.title")}</h1>

        <form
          onSubmit={submitHandler}
          className="pl-0.5 flex flex-col space-y-7.5"
        >
          <fieldset className="flex flex-col">
            <label htmlFor="entry.35205124" className="pb-2 text-sm1">
              {t("contact.label.name")}{" "}
              <span className="text-sm text-warning">*</span>
            </label>

            <input
              name="entry.35205124"
              value={inputValue["entry.35205124"]}
              onChange={inputHandler}
              required
              placeholder={t("contact.placeholder.name")}
              className={`mr-32 py-3.5 pl-4 rounded-5px text-sm border-0.3px placeholder:text-main-text-gray 
                      focus:border-main-color focus:ring-main-color border-main-text-gray`}
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="entry.92521899" className="pb-2 text-sm1">
              {t("contact.label.email")}{" "}
              <span className="text-sm text-warning">*</span>
            </label>
            <input
              name="entry.92521899"
              value={inputValue["entry.92521899"]}
              type="text"
              required
              onChange={inputHandler}
              placeholder={t("contact.placeholder.email")}
              className={`mr-32 py-3.5 pl-4 rounded-5px text-sm border-0.3px placeholder:text-main-text-gray 
                      focus:border-main-color focus:ring-main-color border-main-text-gray`}
            />
          </fieldset>

          <fieldset className="flex flex-col mr-32">
            <label htmlFor="entry.1635082506" className="pb-2 text-sm1">
              {t("contact.label.type")}
              <span className="text-sm text-warning">*</span>
            </label>
            <Select
              selected={inputValue["entry.1635082506"]}
              setSelected={setType}
              options={
                currentLanguage === "en" ? IssueTypes["en"] : IssueTypes["zh"]
              }
              placeholder={t("contact.placeholder.type")}
            />
            {errors["entry.1635082506"] && (
              <p className="text-sm text-warning">
                {errors["entry.1635082506"]}
              </p>
            )}
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="entry.793493309" className="pb-2 text-sm1">
              {t("contact.label.subject")}
              <span className="text-sm text-warning">*</span>
            </label>
            <input
              name="entry.793493309"
              type="text"
              required
              onChange={inputHandler}
              placeholder={t("contact.placeholder.subject")}
              className={`mr-32 py-3.5 pl-4 rounded-5px text-sm border-0.3px placeholder:text-main-text-gray 
                      focus:border-main-color focus:ring-main-color border-main-text-gray`}
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="entry.1383352643" className="pb-2 text-sm1">
              {t("contact.label.description")}
              <span className="text-sm text-warning">*</span>
            </label>
            <textarea
              name="entry.1383352643"
              type="text"
              required
              placeholder={t("contact.placeholder.description")}
              onChange={inputHandler}
              className={`h-[234px] py-3.5 pl-4 rounded-5px text-sm font-medium border-0.3px placeholder:text-main-text-gray 
                      focus:border-main-color focus:ring-main-color border-main-text-gray
                      resize-none              
                      `}
            />
          </fieldset>

          <button
            type="submit"
            className="w-[300px] font-semibold text-white text-24px py-2.5 px-15 rounded-full bg-main-color-gb"
          >
            {t("contact.submit")}
          </button>
        </form>
      </div>
      {popup && <SubmitSuccess />}
    </main>
  );
};

export default Contact;
