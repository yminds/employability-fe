import FeatureCard from "@/components/cards/HeroCard";
import PhoneSVG from "../assets/phone.svg";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";
import BackButtonSVG from "../assets/back-button.svg";
import {
  useFetchUserQuery,
  useUpdatePhoneMutation,
} from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddPhoneNumber: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isUserLoading, isError } = useFetchUserQuery();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [updatePhone, { isLoading, error }] = useUpdatePhoneMutation();

  if (
    user?.isAuthenticated &&
    user?.user?.isPhoneVerified &&
    !user?.user?.isProfileCompleted
  ) {
    navigate("/complete-profile");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(phoneNumber);
      await updatePhone({ phoneNumber }).unwrap();
      navigate("/verify-otp"); // Navigate to OTP verification page
    } catch (err) {
      console.error("Failed to update phone number:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-screen overflow-hidden bg-white gap-x-6">
      {/* Left Section - Feature Card */}
      <div className="hidden md:flex items-center justify-end overflow-hidden">
        <FeatureCard />
      </div>
      {/* Right Section - Verification Form */}
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <img
            src={BackButtonSVG}
            alt=""
            className="mb-[42px]"
            onClick={() => navigate('/verify-otp')}
          />
          {/* Lock Icon */}
          <div className="flex flex-col items-start">
            <div className="flex justify-start">
              <div className="rounded  mb-6">
                <img src={PhoneSVG} alt="Lock Icon" className="h-16 w-16 " />
              </div>
            </div>

            {/* Heading */}
            <h1
              className="font-['ubuntu'] text-[32px] font-semibold leading-[28px] tracking-[-0.7px] mt-4"
              style={{
                textUnderlinePosition: "from-font",
                textDecorationSkipInk: "none",
              }}
            >
              Let’s add phone number
            </h1>
          </div>

          {/* Subtext */}
          <div className="flex gap-2 text-secondary-400 text-start text-[16px] font-normal leading-[25.6px] tracking-[-0.5px] mt-4">
            We need your phone number for verification and to keep your account
            secure.
          </div>

          {/* OTP Input and Verify Button */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-8 mt-8"
          >
            {/* OTP Inputs */}
            <PhoneInput
              placeholder="Phone Number"
              required
              className="w-full"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || "")}
            />
            {/* Verify Button */}
            <Button
              type="submit"
              className={`w-full py-3 text-sm font-medium rounded-l rounded-r ${"bg-green-500 hover:bg-green-600 text-white"}`}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPhoneNumber;
