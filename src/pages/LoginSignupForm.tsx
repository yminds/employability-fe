import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useRegisterUserMutation } from "../store/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
// import { RootState } from "@/store/store";
import Apple from "../assets/Apple logo.png";
import Google from "../assets/Search.png";
import LinkedIn from "../assets/Linkedin.png";
import Github from "../assets/Github.png";
import User from "../assets/user.png";
import Mail from "../assets/mail.png";
import Password from "../assets/password.png";
import TextInput from "@/components/inputs/TextInput";
import Toggle from "@/components/ui/Toggle";
import FeatureCard from "@/components/cards/HeroCard";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: any;
  phoneNumber: string;
  isWhatsAppEnabled: boolean;
}

const SignupLoginForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const { role: urlRole } = useParams();
  console.log(urlRole);

  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);

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
      role: urlRole,
      phoneNumber,
      isWhatsAppEnabled,
    };

    try {
      console.log(signupData);
      const response = await registerUser(signupData);
      console.log(response);
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
    <section className="grid grid-cols-1 md:grid-cols-2 h-screen  overflow-hidden bg-white">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-end overflow-hidden">
        <FeatureCard />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg  p-8">
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
                icon: Google,
                alt: "Google",
              },
              {
                provider: "linkedin",
                icon: LinkedIn,
                alt: "LinkedIn",
              },
              {
                provider: "apple",
                icon: Apple,
                alt: "Apple",
              },
              {
                provider: "github",
                icon: Github,
                alt: "GitHub",
              },
            ].map(({ provider, icon, alt }) => (
              <button
                key={provider}
                onClick={() => handleOAuthLogin(provider)}
                className="flex items-center justify-center w-10 h-10 rounded-full border p-2 border-gray-200 hover:shadow-md transition"
              >
                <img src={icon} alt={alt} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-9">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="text-sm text-gray-500">Or register with</span>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSignup}>
            <div className="flex flex-col gap-6 mb-6">
              {isSignup && (
                <TextInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  icon={User}
                />
              )}

              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={Mail}
              />

              {isSignup && (
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
                icon={Password}
              />

              {isSignup && (
                <TextInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  icon={Password}
                />
              )}
            </div>

            {/* Toggle */}
            {isSignup && (
              <div className="flex items-center gap-2 mb-8">
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
              className="w-full bg-primary-500 text-white py-3 rounded-l rounded-r text-lg font-semibold hover:bg-green-600 transition"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary-500 underline hover:text-green-600"
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
