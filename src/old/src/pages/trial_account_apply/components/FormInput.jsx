export function FormInput({
  id,
  label,
  type,
  placeholder,
  icon,
  required,
  entryName,
  error,
  inputHandler,
}) {
  return (
    <fieldset className="flex flex-col mt-10 w-full max-md:max-w-full">
      <div className="flex flex-wrap items-start w-full max-md:max-w-full">
        <label htmlFor={entryName} className="text-base text-black">
          {label}
        </label>
        {required && <span className="text-sm text-warning">*</span>}
      </div>

      <div className="relative mt-2 w-full text-sm1  min-h-[48px] max-md:max-w-full">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="absolute left-0 top-1/2 -translate-y-1/2 object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <input
          type={type}
          id={id}
          name={entryName}
          placeholder={placeholder}
          required={required}
          onChange={inputHandler}
          className={`py-3.5 px-8 self-stretch my-auto w-full max-md:max-w-full bg-transparent 
            border-0 border-b focus:border-black ${
              error ? "border-warning" : "border-search-home-bg"
            } focus:ring-0 ring-0 outline-none`}
          aria-label={label}
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
