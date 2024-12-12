import FeatureCard from "./cards/FeatureCard";
import LockSVG from "../assets/lock.svg";
import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUser } from "@/store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

const VerifyPhoneNumber = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const phoneNumber = useSelector((state) => state.auth.user?.phoneNumber);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-screen overflow-hidden bg-white gap-x-6">
      {/* Left Section - Feature Card */}
      <div className="hidden md:flex items-center justify-end overflow-hidden">
        <FeatureCard />
      </div>

      {/* Right Section - Verification Form */}
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Lock Icon and Heading */}
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <img
                src={LockSVG}
                alt="Lock Icon"
                className="h-6 w-6 text-primary"
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Verify Your Phone Number
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              We&apos;ve sent an OTP to{" "}
              <span className="font-medium text-green-500">{phoneNumber}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                <Pencil className="h-3 w-3 text-green-500" />
              </Button>
            </div>
          </div>

          {/* OTP Input and Verify Button */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-8"
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
                      ? "border-green-500 text-green-500 text-4xl font-bold"
                      : "border-gray-300 text-gray-700 text-2xl"
                  } focus:border-green-500 focus:ring-green-500`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className={`w-[400px] py-3 text-sm font-medium rounded-lg ${
                otp.every(Boolean)
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
              disabled={!otp.every(Boolean)}
            >
              Verify
            </Button>
          </form>

          {/* Resend OTP Link */}
          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t Receive the OTP?{" "}
            <Button variant="link" className="h-auto p-0 text-green-500">
              Resend
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhoneNumber;
