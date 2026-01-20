export function PhoneInput({
  field,
  inputHandler,
  value,
  error,
  phoneCountryCode,
  setPhoneCountryCode,
  icon,
}) {
  return (
    <fieldset className="flex flex-col mt-10 w-full max-md:max-w-full">
      <div className="flex flex-wrap items-start w-full max-md:max-w-full">
        <label htmlFor={field.entryName} className="text-base text-black">
          {field.label}
        </label>
        {field.required && <span className="text-sm text-warning">*</span>}
      </div>
      <div className="relative flex items-center mt-2 w-full text-sm1 min-h-[48px] max-md:max-w-full">
        <div className="absolute flex items-center">
          <img
            loading="lazy"
            src={icon}
            alt=""
            className="mr-2 object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <select
            defaultValue={"+886"}
            value={phoneCountryCode}
            onChange={(e) => setPhoneCountryCode(e.target.value)}
            className="text-sm1 p-0 pl-1 w-17 h-fit border bg-white text-main-text-gray border-main-text-gray focus:ring-main-text-gray focus:border-main-text-gray bg-transparent focus:outline-none"
          >
            <option value="+1">+1</option>
            <option value="+30">+30</option>
            <option value="+31">+31</option>
            <option value="+32">+32</option>
            <option value="+33">+33</option>
            <option value="+34">+34</option>
            <option value="+39">+39</option>
            <option value="+41">+41</option>
            <option value="+43">+43</option>
            <option value="+44">+44</option>
            <option value="+45">+45</option>
            <option value="+46">+46</option>
            <option value="+47">+47</option>
            <option value="+49">+49</option>
            <option value="+61">+61</option>
            <option value="+65">+65</option>
            <option value="+81">+81</option>
            <option value="+82">+82</option>
            <option value="+86">+86</option>
            <option value="+352">+352</option>
            <option value="+353">+353</option>
            <option value="+354">+354</option>
            <option value="+356">+356</option>
            <option value="+378">+378</option>
            <option value="+379">+379</option>
            <option value="+420">+420</option>
            <option value="+421">+421</option>
            <option value="+423">+423</option>
            <option value="+886">+886</option>
            <option value="+971">+971</option>

            {/* You can add more options here */}
          </select>
        </div>
        <input
          type="tel"
          id={field.id}
          name={field.entryName}
          placeholder={field.placeholder}
          required={field.required}
          onChange={inputHandler}
          value={value}
          maxLength={"11"}
          className={`py-3.5 pl-26 pr-8 flex-1 bg-transparent border-0 border-b focus:border-black ${
            error ? "border-warning" : "border-search-home-bg"
          } focus:ring-0 ring-0 outline-none`}
          aria-label={field.label}
        />
      </div>
      {error && (
        <div className="flex-1 mt-1 text-warning max-md:max-w-full">
          {error}
        </div>
      )}
    </fieldset>
  );
}
