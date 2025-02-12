import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useSocialAuthMutation } from "@/api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate, useLocation } from "react-router-dom";

// IMAGES
import GoogleIcon from "@/assets/sign-up/GoogleIcon.svg";
import LinkedinIcon from "@/assets/sign-up/LinkedinIcon.svg";
import GithubIcon from "@/assets/sign-up/GithubIcon.svg";

interface SocialLoginProps {
  onSocialLogin: (provider: "google" | "linkedin" | "github") => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin }) => {
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state: any) => state.auth.token);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLoginSuccess = async (provider: string, response: any) => {
    try {
      setIsLoading(provider);
      const result = await socialAuth({
        provider: provider as "google" | "linkedin" | "github",
        token: response.access_token || response.code,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user_info,
          accessToken: result.token,
        })
      );

      console.log("Social Auth Result:", result);

      if (result.user_info.experience_level === "") {
        navigate("/setexperience");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(`Failed to login with ${provider}`, err);
    } finally {
      setIsLoading(null);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => handleSocialLoginSuccess("google", response),
    onError: () => {
      console.log("Google Login Failed");
      setIsLoading(null);
    },
  });

  const loginWithLinkedIn = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`; // Use dynamic origin
    const state = crypto.randomUUID(); // Use a secure random state
    const scope = "openid profile email"; // Update scopes

    const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${encodeURIComponent(scope)}`;

    window.location.href = linkedinUrl;
  };

  const loginWithGitHub = () => {
    setIsLoading("github");
    const clientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectURI = `${process.env.VITE_API_BASE_URL}/auth/github/callback`;
    const state =
      location.pathname === "/signup" ? "github_signup" : "github_login";

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
      redirectURI
    )}&scope=user:email&state=${state}`;
  };

  return (
    <div className="w-full">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => googleLogin()}
          disabled={isLoading !== null}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Continue with Google"
        >
          {isLoading === "google" ? (
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            <img
              src={GoogleIcon || "/placeholder.svg"}
              alt="Google"
              className="w-5 h-5"
            />
          )}
        </button>

        <button
          onClick={loginWithLinkedIn}
          disabled={isLoading !== null}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Continue with LinkedIn"
        >
          {isLoading === "linkedin" ? (
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            <img
              src={LinkedinIcon || "/placeholder.svg"}
              alt="LinkedIn"
              className="w-5 h-5"
            />
          )}
        </button>

        <button
          onClick={loginWithGitHub}
          disabled={isLoading !== null}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Continue with GitHub"
        >
          {isLoading === "github" ? (
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            <img
              src={GithubIcon || "/placeholder.svg"}
              alt="GitHub"
              className="w-5 h-5"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
