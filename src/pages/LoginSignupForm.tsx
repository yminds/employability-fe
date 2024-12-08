import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  fetchUser,
  logoutUser,
} from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import TextInput from "@/components/TextInput";
import Toggle from "@/components/ui/Toggle";

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const LoginSignupForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/verify-phone");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleCustomSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const signupData: SignupData = {
      email,
      password,
      name,
      role: "candidate",
    };

    try {
      await dispatch(registerUser(signupData)).unwrap();
      navigate("/verify-phone");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    const providerRoutes: { [key: string]: string } = {
      google: "auth/google",
      github: "auth/github",
      linkedin: "auth/linkedin",
      apple: "auth/apple",
    };

    const backendUrl = "http://localhost:3000";
    const redirectUrl = `${backendUrl}/api/${providerRoutes[provider]}`;
    window.location.href = redirectUrl;
  };

  const handleToggle = () => {
    setIsWhatsAppEnabled((prev) => !prev);
  };

  return (
    <section className="grid grid-cols-2 h-screen">
      {/* Left Image Section */}
      <div className="bg-[#F5F6FA] flex items-center justify-center">
        <div
          className="w-[832px] h-[800px] bg-no-repeat bg-cover "
          style={{ backgroundImage: "url('./src/assets/carousel.png')" }}
        ></div>
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center">
        <div className="w-[400px]">
          {/* Header */}
          <h1
            className="mb-6 text-[32px] font-semibold leading-[28px] text-[#1A1A1A] text-center"
            style={{
              fontFamily: '"Work Sans", sans-serif',
              fontFeatureSettings: "'liga' off, 'clig' off",
              letterSpacing: "-0.7px",
            }}
          >
            {isSignup ? "Create Your Account" : "Sign in to Employability.ai"}
          </h1>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
            >
              <img src="./src/assets/Search.png" alt="Google" />
            </button>
            <button
              onClick={() => handleOAuthLogin("linkedin")}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
            >
              <img src="./src/assets/Linkedin.png" alt="LinkedIn" />
            </button>
            <button
              onClick={() => handleOAuthLogin("apple")}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
            >
              <img src="./src/assets/Apple logo.png" alt="Apple" />
            </button>
            <button
              onClick={() => handleOAuthLogin("github")}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
            >
              <img src="./src/assets/Github.png" alt="GitHub" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <span className="flex-1 h-px bg-gray-300"></span>
            <span className="text-sm text-gray-500">Or register with</span>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSignup}>
            <div className="flex flex-col gap-4 mb-6">
              {isSignup && (
                <TextInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  icon="./src/assets/user.png"
                />
              )}

              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon="./src/assets/mail.png"
              />

              {isSignup && (
                <TextInput
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  required
                  icon="./src/assets/India.png"
                />
              )}

              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                icon="./src/assets/password.png"
              />

              {isSignup && (
                <TextInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  icon="./src/assets/password.png"
                />
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 mb-6">
              <Toggle
                isChecked={isWhatsAppEnabled}
                onToggle={handleToggle}
                label="Get recruiter updates on WhatsApp"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0AD472] text-white py-3 rounded-lg text-lg font-semibold"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#0AD472] underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginSignupForm;
