import { useState, FormEvent, useEffect } from "react";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
  useFetchUserQuery,
} from "../store/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: any;
  phoneNumber: string;
  isWhatsAppEnabled: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

const SignupLoginForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading: isSignupLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const { role: urlRole } = useParams();

  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCustomSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
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
      const response = await registerUser(signupData).unwrap();
      navigate("/verify-otp");
    } catch (err: any) {
      setError(err.data?.message || "Signup failed. Please try again.");
      console.error("Signup failed:", err);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const loginData: LoginData = {
      email,
      password,
    };

    try {
      const response = await loginUser(loginData).unwrap();
      if (response.user.isPhoneVerified) {
        navigate("/dashboard");
      } else {
        navigate("/verify-otp");
      }
    } catch (err: any) {
      setError(err.data?.message || "Login failed. Please try again.");
      console.error("Login failed:", err);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    const providerRoutes: { [key: string]: string } = {
      google: "auth/google",
      github: "auth/github",
      linkedin: "auth/linkedin",
      apple: "auth/apple",
    };

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const redirectUrl = `${backendUrl}/api/${providerRoutes[provider]}`;
    window.location.href = redirectUrl;
  };

  const handleToggle = () => {
    setIsWhatsAppEnabled((prev) => !prev);
  };

  const isLoading = isSignup ? isSignupLoading : isLoginLoading;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden bg-white">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-end overflow-hidden">
        <FeatureCard />                       
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg p-8">
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                disabled={isLoading}
              >
                <img src={icon} alt={alt} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-9">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="text-sm text-gray-500">
              Or {isSignup ? "register" : "sign in"} with email
            </span>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Form */}
          <form onSubmit={isSignup ? handleCustomSignup : handleLogin}>
            <div className="flex flex-col gap-6 mb-6">
              {isSignup && (
                <TextInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  icon={User}
                  disabled={isLoading}
                />
              )}

              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={Mail}
                disabled={isLoading}
              />

              {isSignup && (
                <PhoneInput
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  placeholder="Phone Number"
                  required
                  disabled={isLoading}
                />
              )}

              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                icon={Password}
                disabled={isLoading}
              />

              {isSignup && (
                <TextInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  icon={Password}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-3 rounded-l rounded-r text-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignup ? "Signing up..." : "Signing in..."}
                </>
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-4 mt-6">
            {!isSignup && (
              <a
                href="/forgot-password"
                className="text-sm text-primary-500 hover:text-green-600 block"
              >
                Forgot password?
              </a>
            )}
            <p className="text-sm text-gray-500">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                }}
                className="text-primary-500 underline hover:text-green-600"
                disabled={isLoading}
              >
                {isSignup ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupLoginForm;
