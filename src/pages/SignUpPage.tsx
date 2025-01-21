import { useState, useEffect, FormEvent } from "react";
import { useLoginMutation, useRegisterUserMutation } from "@/api/authApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import User from "@/assets/sign-up/user.png";
import Mail from "@/assets/sign-up/mail.png";
import Password from "@/assets/sign-up/password.png";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import SocialLogin from "@/features/authentication/SocialAuth";

import logo from "@/assets/branding/logo.svg";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
import arrow from "@/assets/skills/arrow.svg";
interface SignupData {
  email: string;
  password: string;
  name: string;
  role: any;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const { role: urlRole } = useParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useRegisterUserMutation();
  const [name, setName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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
    };
    try {
      const result = await signup(signupData);
      console.log("Signup successful:", result);
      
      if (result.data && result.data.success === true) {
        const loginResponse = await login({ email, password });

        if (loginResponse.data) {
          navigate("/setexperience"); // Navigate after successful login
        }
      } else {
        setError(result.data?.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      if (err.data?.message) {
        console.log("Signup failed:", err);
        
        setError(err.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleSocialLogin = (
    provider: "google" | "linkedin" | "apple" | "github"
  ) => {
    console.log(`Social Login with ${provider}`);
  };

  // const handleCustomSignupOTP = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match!");
  //     return;
  //   }

  //   const signupData: SignupData = {
  //     email,
  //     password,
  //     name,
  //     role: urlRole,
  //   };

  //   try {
  //     const response = await registerUser(signupData).unwrap();
  //     console.log("Signup successful:", response);
  //     navigate("/verify-otp");
  //   } catch (err: any) {
  //     setError(err.data?.message || "Signup failed. Please try again.");
  //     console.error("Signup failed:", err);
  //   }
  // };

  const isLoading = isSignupLoading;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section className="flex h-screen w-screen relative dark:bg-gray-800">
      <div className=" absolute top-5 left-10 w-1/4  h-1/4  z-10">
        <img src={logo} alt="" />
      </div>
      {/* Left Image Section */}
      <div className="flex w-1/2 justify-center items-center md:block md:p-0 relative">
        <img
          src={grid}
          alt="Hero"
          className="w-full max-h-screen md:h-screen object-cover hidden md:block"
        />
        <img src={man} alt="Hero" className="w-[100%] bottom-0 absolute" />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/login")}
              className="d-block hover:text-green-600 text-black text-sm flex items-center"
            >
              <img className="w-4 h-4 mr-2" src={arrow} alt="Back Arrow" />{" "}
              <span>Back</span>
            </button>
          </div>
          {/* Header */}

          <form className="space-y-4" onSubmit={handleCustomSignup}>
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Log in
                </button>
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
              >
                <AlertDescription className="text-[#ff3b30]">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <img
                src={User}
                alt="User Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Email"
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

            <div className="relative">
              <input
                type="password"
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

            <div className="relative">
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                src={Password}
                alt="Password Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4 
                 bg-[#062549] text-white font-medium rounded-[4px] 
                 hover:bg-[#083264] transition-colors duration-200 ease-in-out"
              style={{
                boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            {/* Social Login */}
            <SocialLogin onSocialLogin={handleSocialLogin} />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
