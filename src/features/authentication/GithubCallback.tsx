import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocialAuthMutation } from "@/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { Fingerprint } from "lucide-react";

const GitHubCallback: React.FC = () => {
  const [socialAuth] = useSocialAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");
      const stateParam = urlParams.get("state");

      let jobApplication = null;
      let stateType = null;
      if (stateParam) {
        try {
          const stateObj = JSON.parse(atob(stateParam));
          jobApplication = stateObj.job_application || null;
          stateType = stateObj.type || null;
          console.log("Job Application from state:", jobApplication);
          console.log("State type:", stateType);
        } catch (error) {
          console.error("Error parsing state parameter:", error);
        }
      }

      console.log("GitHub Callback Params:", {
        code: code ? "present" : "absent",
        state,
        error,
      });

      if (error || !code) {
        console.error("GitHub Auth Error:", error);
        navigate("/login");
        return;
      }

      try {
        const result = await socialAuth({
          provider: "github",
          token: code,
        }).unwrap();

        console.log("GitHub Auth Result:", result);

        dispatch(
          setCredentials({
            user: result.user_info,
            accessToken: result.token,
          })
        );
        if (jobApplication) {
          try {
            if (result.user_info && result.user_info?.goals?.length > 0) {
              const jobUrl = new URL(decodeURIComponent(jobApplication));
              const path = jobUrl.pathname + jobUrl.search + jobUrl.hash;
              navigate(path);
            } else if (result.user_info.experience_level === "") {
              navigate(
                `/setexperience?job_application=${encodeURIComponent(
                  jobApplication
                )}`
              );
            } else {
              navigate(
                `/?job_application=${encodeURIComponent(jobApplication)}`
              );
            }
          } catch (error) {
            console.error("Invalid URL:", error);
            navigate("/");
          }
        } else if (stateType === "github_signup") {
          navigate("/login");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("GitHub Auth Failed:", err);
        navigate("/login");
      }
    };

    handleCallback();
  }, [location, socialAuth, dispatch, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-[400px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Authenticating
            </h2>
          </div>
          <div className="bg-white rounded-md p-4 flex items-center gap-4">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
            <p className="text-sm text-gray-600">
              Please wait while we verify your credentials...
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Powered by</span>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;
