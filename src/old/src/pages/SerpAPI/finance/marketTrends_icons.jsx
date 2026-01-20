// icons/MostActiveIcon.jsx
export const MostActiveIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36.5 36.5" // 確保 viewBox 正確
    fill="currentColor" // 使用 currentColor
  >
    <g clipPath="url(#a)">
      <path
        fill="currentColor" // 使用 currentColor
        fillRule="evenodd"
        d="M18 36C27.941 36 36 27.941 36 18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18zm3-29h-5v20h5V7zm-7 9h-5v11h5V16zm9 5h5v6h-5v-6z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h36v36H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

// icons/GainersIcon.jsx
export const GainersIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36.5 36.5"
    fill="currentColor" // 使用 currentColor
  >
    <g clipPath="url(#a)">
      <path
        fill="currentColor" // 使用 currentColor
        fillRule="evenodd"
        d="M18 36C27.941 36 36 27.941 36 18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18zM29.212 9.712l-7.423 1.521 2.073 2.073L18 19.168l-4-4-8.207 8.207 1.414 1.414L14 17.996l4 4 7.276-7.275 2.415 2.414 1.52-7.423z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h36v36H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

// icons/LosersIcon.jsx
export const LosersIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36.5 36.5"
    fill="currentColor" // 使用 currentColor
  >
    <g clipPath="url(#clip0_582_11986)">
      <path
        fill="currentColor" // 使用 currentColor
        fillRule="evenodd"
        d="M18 36C27.941 36 36 27.941 36 18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18zm11.419-9.923l-7.423-1.52 2.073-2.074-5.862-5.862-3.293 3.293-.707.707-.707-.707-7.5-7.5L7.914 11l6.793 6.793L18 14.5l.707-.707.707.707 6.57 6.569 2.413-2.415 1.522 7.423z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_582_11986">
        <path fill="#fff" d="M0 0H36V36H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
