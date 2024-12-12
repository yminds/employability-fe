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
import TextInput from "@/components/inputs/TextInput";
import Toggle from "@/components/ui/Toggle";
import FeatureCard from "@/components/cards/HeroCard";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: string;
  phoneNumber: string;
}

const SignupLoginForm = () => {
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
      phoneNumber,
    };

    try {
      console.log(phoneNumber);
      console.log(signupData);
      await dispatch(registerUser(signupData)).unwrap();
      navigate("/verify-otp");
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
    <section className="grid grid-cols-1 md:grid-cols-2 h-screen w-screen overflow-hidden bg-white gap-x-6">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-end overflow-hidden">
        <FeatureCard />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <h1
            className="text-2xl font-semibold text-gray-800 text-center mb-6"
            style={{
              fontFamily: '"Work Sans", sans-serif',
              fontFeatureSettings: "'liga' off, 'clig' off",
              letterSpacing: "-0.7px",
            }}
          >
            {isSignup ? "Create Your Account" : "Sign in to Employability.ai"}
          </h1>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-6">
            {[
              {
                provider: "google",
                icon: "./src/assets/Search.png",
                alt: "Google",
              },
              {
                provider: "linkedin",
                icon: "./src/assets/Linkedin.png",
                alt: "LinkedIn",
              },
              {
                provider: "apple",
                icon: "./src/assets/Apple logo.png",
                alt: "Apple",
              },
              {
                provider: "github",
                icon: "./src/assets/Github.png",
                alt: "GitHub",
              },
            ].map(({ provider, icon, alt }) => (
              <button
                key={provider}
                onClick={() => handleOAuthLogin(provider)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:shadow-md transition"
              >
                <img src={icon} alt={alt} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
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
                // <TextInput
                //   type="tel"
                //   value={phoneNumber}
                //   onChange={(e) => setPhoneNumber(e.target.value)}
                //   placeholder="Phone Number"
                //   required
                //   icon="./src/assets/India.png"
                // />
                <PhoneInput
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  placeholder="Phone Number"
                  // className="border border-[rgba(0,0,0,0.10)]"
                  required
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
            {isSignup && (
              <div className="flex items-center gap-2 mb-6">
                <Toggle
                  isChecked={isWhatsAppEnabled}
                  onToggle={handleToggle}
                  label="Get recruiter updates on WhatsApp"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-green-500 underline hover:text-green-600"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignupLoginForm;
