import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUpdateFirstTimeUserMutation } from "@/api/authApiSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";
import bg from "@/assets/set-goal/backGround.png";
import logo from "@/assets/branding/logo.svg";
import ESymbol from "@/assets/branding/e.png";
import arrow from "@/assets/skills/arrow.svg";
import ProtectedOnboardingRoute from "@/features/authentication/ProtectedOnboardingRoute";
import { setCredentials } from "@/features/authentication/authSlice";

const AddPhone: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateFirstTimeUser, { isLoading }] = useUpdateFirstTimeUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message
    const experienceLevel = location.state?.experienceLevel as
      | "entry"
      | "mid"
      | "senior"
      | null;

    if (!experienceLevel || !user?._id) {
      console.error("Missing experience level or user ID");
      return;
    }

    try {
      const result = await updateFirstTimeUser({
        user_id: user._id,
        experience_level: experienceLevel,
        phone_number: phoneNumber,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user_info,
          accessToken: token,
        })
      );

      navigate("/");
    } catch (err: any) {
      console.error("Failed to update user profile:", err);
      if (err) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage(
          "An error occurred while updating your profile. Please try again."
        );
      }
    }
  };

  return (
    <ProtectedOnboardingRoute>
      <main className="h-screen w-screen flex p-6">
        {/* Left Section - Background Image */}
        <section className="h-full w-full relative">
          <img
            className="w-full h-full rounded-lg"
            src={bg || "/placeholder.svg"}
            alt=""
          />
          <img
            className="absolute top-0 2xl:top-10 left-10"
            src={logo || "/placeholder.svg"}
            alt=""
          />
          <img
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 xl:w-[600px] 2xl:w-[1000px]"
            src={ESymbol || "/placeholder.svg"}
            alt=""
          />
        </section>

        {/* Right Section - Phone Number Form */}
        <section className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[846px] w-full">
            <div className="bg-white rounded-lg w-full max-w-[500px] p-8 relative">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                <img
                  src={arrow || "/placeholder.svg"}
                  alt="Back"
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm font-medium">Back</span>
              </button>

              <div className="mb-[40px] mt-8">
                <h1 className="font-ubuntu text-2xl font-bold leading-[42px] tracking-[-0.5px]">
                  Let's add phone number
                </h1>
                <p className="text-black text-opacity-60 font-sf-pro-display text-base font-normal leading-6 tracking-wide">
                  We need your phone number for verification and to keep your
                  account secure.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded transition-opacity duration-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <PhoneInput
                    placeholder="Phone Number"
                    required
                    className="w-full"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || "")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-4 rounded-lg font-medium 
                         hover:bg-primary/90 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Continue"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </ProtectedOnboardingRoute>
  );
};

export default AddPhone;
