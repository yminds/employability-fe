"use client";

import { useState, useEffect, type FormEvent } from "react";
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
import { Button } from "@/components/ui/button";
interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: any;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const { role: urlRole } = useParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login] = useLoginMutation();
  const [signup] = useRegisterUserMutation();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required!");
      setIsLoading(false);
      return;
    }

    const signupData: SignupData = {
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
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
        if (
          result.error &&
          typeof result.error === "object" &&
          "data" in result.error
        ) {
          setError((result.error as any).data.message);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } catch (err: any) {
      if (err.data?.message) {
        console.log("Signup failed:", err);

        setError(err.data.message);
      } else {
        setError("An error occurred. Please try again.");
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section className="flex h-screen w-screen bg-white relative dark:bg-gray-800">
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

      {/* Right Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/login")}
              className="d-block hover:text-green-600 text-black text-sm flex items-center"
            >
              <img
                className="w-4 h-4 mr-2"
                src={arrow || "/placeholder.svg"}
                alt="Back Arrow"
              />{" "}
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

            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <img
                  src={User || "/placeholder.svg"}
                  alt="User Icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
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
                src={Mail || "/placeholder.svg"}
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
                src={Password || "/placeholder.svg"}
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
                src={Password || "/placeholder.svg"}
                alt="Password Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Submit Button */}
            <Button
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
            </Button>
          </form>
          {/* Social Login */}
          <SocialLogin onSocialLogin={handleSocialLogin} />
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
