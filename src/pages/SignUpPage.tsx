import { useState, FormEvent } from "react";
import {
  useRegisterUserMutation,
} from "@/api/authApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import User from "@/assets/sign-up/user.png";
import Mail from "@/assets/sign-up/mail.png";
import Password from "@/assets/sign-up/password.png";
import TextInput from "@/components/inputs/TextInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

import logo from "@/assets/branding/logo.svg";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
interface SignupData {
  email: string;
  password: string;
  name: string;
  role: any;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading: isSignupLoading }] =
    useRegisterUserMutation();
  const { role: urlRole } = useParams();

  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      const response = await registerUser(signupData).unwrap();
      console.log("Signup successful:", response);
      navigate("/verify-otp");
    } catch (err: any) {
      setError(err.data?.message || "Signup failed. Please try again.");
      console.error("Signup failed:", err);
    }
  };

  const isLoading = isSignupLoading;

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
        <img
          src={man}
          alt="Hero"
          className="w-[100%] bottom-0 absolute"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full h-[546px] flex flex-col justify-around bg-white rounded-lg p-8">
          {/* Header */}
          <h1
            className="text-2xl font-semibold text-gray-800 text-start mb-6"
            style={{
              fontFamily: '"Work Sans", sans-serif',
              fontFeatureSettings: "'liga' off, 'clig' off",
              letterSpacing: "-0.7px",
            }}
          >
            Create Your Account
          </h1>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleCustomSignup}>
            <div className="flex flex-col gap-6 mb-6">
              <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                icon={User}
                disabled={isLoading}
              />

              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={Mail}
                disabled={isLoading}
              />

              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                icon={Password}
                disabled={isLoading}
              />

              <TextInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                icon={Password}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </form>

          {/* Footer Links */}
          <div className="text-start space-y-4 mt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary-500 underline hover:text-green-600"
                disabled={isLoading}
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
