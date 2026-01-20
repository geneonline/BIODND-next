import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { FormInput } from "./components/FormInput";
import { inputFields } from "./components/formData";
import { PhoneInput } from "./components/PhoneInput";

import Policy from "@/parts/user/Policy";
import SubmitSuccess from "@/widgets/SubmitSuccess";

const TrialAccountApply = () => {
  // Store the form input values
  const [inputValue, setInputValue] = useState({
    "entry.1797746638": "",
    "entry.1022022986": "",
    "entry.1859418169": "",
    "entry.1729519511": "",
    "entry.1668524869": "",
    "entry.236941534": "",
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
    const phoneValue = inputValue["entry.236941534"];

    // Validate phone number only if there is a value.
    if (phoneValue) {
      // In this example, we require the phone to be 7 to 10 digits.
      const phoneRegex = /^[0-9]{7,11}$/;
      if (!phoneRegex.test(phoneValue)) {
        setErrors((prev) => ({
          ...prev,
          ["entry.236941534"]: "*Phone format is incorrect",
        }));
        return; // Block submission if phone format is wrong.
      } else {
        // Clear error if valid
        setErrors((prev) => ({ ...prev, ["entry.236941534"]: "" }));
        // Combine the country code and phone value.
        inputValue["entry.236941534"] = `${phoneCountryCode}${phoneValue}`;
      }
    }

    try {
      setShowSuccess(true);
      const response = await axios({
        method: "POST",
        url: `https://docs.google.com/forms/d/1OmkG3itmeHXm7u0MkCkkD8FkuSkAA_V3sxYvp3O7ZnU/formResponse?entry.1797746638=${inputValue["entry.1797746638"]}&entry.1022022986=${inputValue["entry.1022022986"]}&entry.1859418169=${inputValue["entry.1859418169"]}&entry.1729519511=${inputValue["entry.1729519511"]}&entry.1668524869=${inputValue["entry.1668524869"]}&entry.236941534=${inputValue["entry.236941534"]}`,
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
    <div className="mt-15 xl:mt-19 w-full bg-main-color-gb">
      <div className="flex max-md:flex-col leading-140">
        {/* form */}
        <div className="flex flex-col max-md:ml-0 max-md:w-full bg-white">
          <form
            onSubmit={submitHandler}
            className="flex flex-col px-20 py-28 mx-auto w-full leading-snug  max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full"
          >
            <div className="flex gap-3 items-center self-start text-3xl font-semibold text-main-color-gb">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc3be18c454d274ce47e95116d2015623b0c0a6d5afd181df16a291b21e6d846?placeholderIfAbsent=true&apiKey=e07749b70499446d97a4ab39d584855d"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-9 aspect-square"
              />
              <div className="self-stretch my-auto">Try BIODND Free</div>
            </div>

            <div className="flex gap-1 items-center self-start mt-5 text-base">
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

            <div className="mt-7 text-base leading-6 text-black max-md:max-w-full">
              People who use our service may have uploaded your contact
              information to BIODND. By clicking Sign Up, you agree to our
              Terms,{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPolicy(true);
                }}
                className="font-bold text-main-color-gb"
              >
                Privacy Policy & Cookies Policy
              </button>
              <span className="font-bold">.</span> You may receive SMS
              Notifications from us and can opt out any time.
            </div>

            {showPolicy && <Policy setShowPolicy={setShowPolicy} />}

            <button
              type="submit"
              className="flex flex-col justify-center px-16 py-3 mt-10 max-w-full text-2xl font-semibold text-white bg-main-color-gb rounded-[40px] w-[300px] max-md:px-5"
            >
              <div className="gap-2 self-stretch">SIGN UP NOW</div>
            </button>
          </form>
        </div>

        {/* img side */}
        <div className="p-24 flex flex-col bg-trial-account-apply bg-cover bg-center max-md:ml-0 max-md:w-full">
          <div className="flex flex-col text-white max-md:mt-10">
            <div className="text-2xl font-semibold leading-snug max-md:mr-2.5">
              START YOUR 7-DAY FREE TRIAL.
            </div>
            <div className="mt-8 text-5xl font-bold leading-[58px] max-md:mt-10 max-md:text-4xl max-md:leading-[54px]">
              Explore Biotech Possibilities with BIODND.
            </div>
          </div>
        </div>
      </div>
      {showSuccess && <SubmitSuccess />}
    </div>
  );
};

export default TrialAccountApply;
