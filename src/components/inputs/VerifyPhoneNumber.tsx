import FeatureCard from "../cards/HeroCard";
import LockSVG from "../../assets/lock.svg";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchUserQuery } from "@/store/slices/authSlice";
import BackButtonSVG from "../../assets/back-button.svg";
import { useNavigate } from "react-router-dom";

const VerifyPhoneNumber = () => {
  // Fetch user data using RTK Query
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useFetchUserQuery();

  console.log(user);

  const phoneNumber = user?.user?.phoneNumber; // Extract phone number from user data

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 4) {
      console.log("Submitting OTP:", otpString);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user data.</p>;

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
            onClick={() => navigate(-1)}
          />

          {/* Lock Icon */}
          <div className="flex flex-col items-start">
            <div className="flex justify-start">
              <div className="rounded  mb-6">
                <img src={LockSVG} alt="Lock Icon" className="h-16 w-16 " />
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
              Verify Your Phone Number
            </h1>
          </div>

          {/* Subtext */}
          <div className="flex gap-2 text-secondary-400 text-start text-[16px] font-normal leading-[25.6px] tracking-[-0.5px] mt-4">
            We&apos;ve sent an OTP to{" "}
            <span className="font-medium text-primary-500 underline">
              {phoneNumber}
            </span>
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
              <Pencil className="h-3 w-3 text-green-500" />
            </Button>
          </div>

          {/* OTP Input and Verify Button */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-8 mt-8"
          >
            {/* OTP Inputs */}
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`h-[80px] w-[75px] text-center rounded-[10px] border appearance-none leading-none ${
                    digit
                      ? "border-green-500 text-green-500 text-3xl font-bold"
                      : "border-gray-300 text-gray-700 text-2xl"
                  } focus:border-green-500 focus:ring-green-500`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className={`w-full py-3 text-sm font-medium rounded-l rounded-r ${
                otp.every(Boolean)
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-secondary-200 text-white text-base"
              }`}
              disabled={!otp.every(Boolean)}
            >
              Verify
            </Button>
          </form>

          {/* Resend OTP Link */}
          <div className="text-center text-base text-secondary-400 text-muted-foreground mt-4">
            Didn&apos;t Receive the OTP?{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-base text-[ubuntu] underline text-primary-500"
            >
              Resend
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhoneNumber;
