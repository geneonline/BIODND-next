import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { FormInput } from "@/pages/trial_account_apply/components/FormInput";
import { PhoneInput } from "@/pages/trial_account_apply/components/PhoneInput";
import { inputFields } from "./components/formData";

import Policy from "@/parts/user/Policy";
import SubmitSuccess from "@/widgets/SubmitSuccess";

const BenefitItem = ({ text }) => (
  <div className="flex gap-4 items-center mt-4 text-xl font-semibold leading-140 text-main-color-gb">
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/70d9cbe2cc1f112acf3ca0405a0bf7851a34df903b335d47e58f6a2e686346a6?placeholderIfAbsent=true&apiKey=e07749b70499446d97a4ab39d584855d"
      className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
      alt="Checkmark icon"
    />
    <p className="self-stretch my-auto">{text}</p>
  </div>
);

const ContactSales = () => {
  const benefits = [
    "Multi-person use",
    "Gain API access",
    "Consolidated invoicing",
    "Bulk export full BioDND dataset",
    "Dedicated account team and enhanced support",
  ];

  // Store the form input values
  const [inputValue, setInputValue] = useState({
    "entry.2078138422": "",
    "entry.640863355": "",
    "entry.1819236508": "",
    "entry.349644984": "",
    "entry.2066418644": "",
    "entry.246194045": "",
  });

  // Store error messages for each field (e.g., phone)
  const [errors, setErrors] = useState({});
  const [showPolicy, setShowPolicy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // State for country code; default is "+886"
  const [phoneCountryCode, setPhoneCountryCode] = useState("+886");

  // Generic change handler for all inputs (except the country code select)
  const inputHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    // If the field has been modified, clear existing error message for that field.
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Get the phone number value (without country code)
    const phoneValue = inputValue["entry.246194045"];

    // Validate phone number only if there is a value.
    if (phoneValue) {
      // In this example, we require the phone to be 7 to 10 digits.
      const phoneRegex = /^[0-9]{7,11}$/;
      if (!phoneRegex.test(phoneValue)) {
        setErrors((prev) => ({
          ...prev,
          ["entry.246194045"]: "*Phone format is incorrect",
        }));
        return; // Block submission if phone format is wrong.
      } else {
        // Clear error if valid
        setErrors((prev) => ({ ...prev, ["entry.246194045"]: "" }));
        // Combine the country code and phone value.
        inputValue["entry.246194045"] = `${phoneCountryCode}${phoneValue}`;
      }
    }

    try {
      setShowSuccess(true);
      const response = await axios({
        method: "POST",
        url: `https://docs.google.com/forms/d/1_pFehjv3By7ijp3qlSi8t4EWNTCA3KV9nBzTs9DL7gw/formResponse?entry.2078138422=${inputValue["entry.2078138422"]}&entry.640863355=${inputValue["entry.640863355"]}&entry.1819236508=${inputValue["entry.1819236508"]}&entry.349644984=${inputValue["entry.349644984"]}&entry.2066418644=${inputValue["entry.2066418644"]}&entry.246194045=${inputValue["entry.246194045"]}`,
        data: inputValue,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Status Code:", response.status);
      console.log("Response Data:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-15 xl:mt-19 w-full bg-contact-sales-bg bg-cover bg-bottom">
      <div className="flex justify-center pt-15 pl-36 pr-17 pb-72 space-x-17 max-md:flex-col leading-140">
        {/* info */}
        <div className="flex flex-col max-w-[470px]">
          {" "}
          <header className="flex flex-col items-start w-full text-base font-semibold leading-snug">
            <div className="flex gap-2 items-center text-5xl font-bold leading-tight text-main-color-gb max-md:text-4xl">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a75ccf2810157f5079bbf14159ea7dc943cbbe40b0f0cdf7b5111e1beac8358b?placeholderIfAbsent=true&apiKey=e07749b70499446d97a4ab39d584855d"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[66px]"
                alt="Contact sales icon"
              />
              <h1 className="self-stretch my-auto text-5xl leading-120">
                Contact sales
              </h1>
            </div>
            <h2 className="self-stretch mt-9 mr-5 text-32px leading-10 text-black max-md:mr-2.5">
              Thanks for your interest in BIODND Enterprise.
            </h2>
            <p className="text-base font-semibold leading-140 self-stretch mt-6 text-black max-md:mr-2.5">
              Enter your contact details, and a member of our team will be in
              touch within 1 business day.
            </p>
          </header>
          <section className="">
            <h3 className="mt-10 text-xl font-semibold leading-140 text-black max-md:mt-10">
              Everything in Pro, plus
            </h3>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} text={benefit} />
            ))}
          </section>
          <div className="pt-7.5 w-full h-1 shadow-input-default" />
          <div className="mt-7 text-xs3 leading-140 text-black max-md:max-w-full">
            BIODND needs the contact information you provide to us to contact
            you about our products and services. You may opt out from these
            communications at any time. By submitting your information, you
            agree to BIODND’s{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPolicy(true);
              }}
              className="font-bold text-main-color-gb"
            >
              Privacy Policy & Cookies Policy
            </button>
            <span className="font-bold">.</span>
          </div>
          <div className="flex gap-1 items-center self-start mt-5 text-xs3">
            <div className="self-stretch my-auto text-black">
              If you already have an account registered you can
              <Link
                to={"/user/login"}
                className="pl-1 self-stretch my-auto font-semibold text-main-color-gb"
              >
                SIGN IN.
              </Link>
            </div>
          </div>
          {showPolicy && <Policy setShowPolicy={setShowPolicy} />}
        </div>

        {/* form */}
        <div className="flex flex-col px-12 pb-11 w-[677px] max-md:ml-0 max-md:w-full bg-finance-tabble-even rounded-5px">
          <form onSubmit={submitHandler}>
            {inputFields.map((field) =>
              field.id === "phone" ? (
                <PhoneInput
                  key={field.id}
                  field={field}
                  icon={field.icon}
                  inputHandler={inputHandler}
                  value={inputValue[field.entryName]}
                  error={errors[field.entryName]}
                  phoneCountryCode={phoneCountryCode}
                  setPhoneCountryCode={setPhoneCountryCode}
                />
              ) : (
                <FormInput
                  key={field.id}
                  {...field}
                  inputHandler={inputHandler}
                />
              )
            )}

            <button
              type="submit"
              className="flex flex-col justify-center px-16 py-3 mt-10 max-w-full text-2xl font-semibold text-white bg-main-color-gb rounded-[40px] w-[300px] max-md:px-5"
            >
              <div className="gap-2 self-stretch">Submit</div>
            </button>
          </form>
        </div>
      </div>
      {showSuccess && <SubmitSuccess />}
    </div>
  );
};
export default ContactSales;
