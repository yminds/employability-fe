import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApiSlice";
import { Button } from "@/components/elements/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// IMAGES
import logo from "@/assets/branding/logo.svg";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
import arrow from "@/assets/skills/arrow.svg";
import Mail from "@/assets/sign-up/mail.png";
import Password from "@/assets/sign-up/password.png";
import SocialLogin from "./SocialAuth";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isSuccess }] = useLoginMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await login({ email, password }).unwrap();
    } catch (err: any) {
      if (err.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (
    provider: "google" | "linkedin" | "apple" | "github"
  ) => {
    console.log(`Social Login with ${provider}`);
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isSuccess || token) {
      setIsLoading(false);
      if (user && user.experience_level === "") {
        navigate("/setexperience");
      } else {
        navigate("/");
      }
    }
  }, [isSuccess, token, user, navigate]);

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-800">
      {/* Left Section */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src={grid || "/placeholder.svg"}
          alt="Grid Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={man || "/placeholder.svg"}
          alt="Hero"
          className="absolute bottom-0 left-0 right-0 w-full object-contain"
        />
        <div className="absolute top-8 left-8 z-20">
          <img src={logo || "/placeholder.svg"} alt="Logo" />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          {/* Back Button */}
          <div className="items-center gap-2 mb-6 hidden">
            <img className="w-4 h-4" src={arrow} alt="Back Arrow" />
            <button
              onClick={() => navigate("/")}
              className="text-sm text-black hover:text-green-600"
            >
              Back
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                Login to Your Account
              </h1>
              <p className="text-sm text-gray-500">
                New to EmployAbility.AI?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Sign up
                </button>
              </p>
            </div>

            {errorMessage && (
              <Alert
                variant="destructive"
                className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
              >
                <AlertDescription className="text-[#ff3b30]">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Email or Phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img
                src={Mail}
                alt="Email Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={Password}
                alt="Password Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4 
                 bg-[#001630] text-white font-medium rounded-[4px] 
                 hover:bg-[#002a54] transition-colors duration-200 ease-in-out
                 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          {/* Social Login */}
          <SocialLogin onSocialLogin={handleSocialLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
