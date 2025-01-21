import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocialAuthMutation } from "@/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { Linkedin } from "lucide-react";

const LinkedInCallback: React.FC = () => {
  const [socialAuth] = useSocialAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("LinkedIn Callback");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.log("GitHub Auth Error");
      navigate("/login");
      return;
    }
    if (code) {
      console.log("LinkedIn Auth Code:", code);

      const handleLinkedInAuth = async () => {
        try {
          const result = await socialAuth({
            provider: "linkedin",
            token: code,
          }).unwrap();

          console.log("LinkedIn Auth Result:", result);

          dispatch(
            setCredentials({
              user: result.user_info,
              accessToken: result.token,
            })
          );
          if (result.user_info.experience_level === "") {
            navigate("/setexperience");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.error("LinkedIn auth failed:", err);
          navigate("/login");
        }
      };

      handleLinkedInAuth();
    } else {
      navigate("/login");
    }
  }, [socialAuth, dispatch, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-[400px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Authenticating
            </h2>
          </div>
          <div className="bg-white rounded-md p-4 flex items-center gap-4">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-700" />
            <p className="text-sm text-gray-600">
              Please wait while we verify your LinkedIn credentials...
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Powered by</span>
          <svg
            className="h-5 w-5 text-blue-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
