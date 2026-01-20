import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import google_icon from "@/assets/svg/login_signup/google_icon.svg";

function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  const googlelogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const accessToken = codeResponse.access_token;
      loginWithGoogle(accessToken);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  return (
    <button
      type="button"
      onClick={googlelogin}
      aria-label="Sign up with Google"
      className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-interface-gray-light font-sans font-semibold text-[18px] leading-[1.6em] text-textColor-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
    >
      <img
        src={google_icon}
        alt=""
        width={32}
        height={32}
        className="w-8 h-8"
        draggable={false}
        aria-hidden="true"
        focusable="false"
      />
      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleLoginButton;
