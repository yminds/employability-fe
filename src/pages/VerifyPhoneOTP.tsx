import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useVerifyOTPMutation,
  useUpdateFirstTimeUserMutation,
  useVerifyPhoneMutation,
  useResendOTPMutation,
} from "@/api/authApiSlice";
import { setCredentials } from "@/features/authentication/authSlice";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";
import bg from "@/assets/set-goal/backGround.png";
import logo from "@/assets/branding/logo.svg";
import ESymbol from "@/assets/branding/e.png";
import arrow from "@/assets/skills/arrow.svg";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProtectedOnboardingRoute from "@/features/authentication/ProtectedOnboardingRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import verify from "@/assets/sign-up/verify.svg";
import Phone from "@/assets/sign-up/Phone.svg";
import { Value as PhoneNumberValue } from "react-phone-number-input";

const RESEND_COOLDOWN = 60; // 60 seconds cooldown for resend

const VerifyPhoneOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [shake, setShake] = useState(false);
  const [currentView, setCurrentView] = useState<"otp" | "edit">("otp");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("IN");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [verifyOTP] = useVerifyOTPMutation();
  const [updateFirstTimeUser] = useUpdateFirstTimeUserMutation();
  const [verifyPhone] = useVerifyPhoneMutation();
  const [resendOTP] = useResendOTPMutation();

  useEffect(() => {
    setNewPhoneNumber(location.state?.phoneNumber || "");
  }, [location.state?.phoneNumber]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (element: any, index: any) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 3) {
      const nextInput =
        element.parentElement.nextElementSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: any, index: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput =
        e.target.parentElement.previousElementSibling?.querySelector("input");
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePhoneInputChange = (
    value: PhoneNumberValue,
    country?: { countryCode: string }
  ) => {
    setNewPhoneNumber(value || "");
    if (country) {
      setCountryCode(country.countryCode);
    }
  };

  const handleUpdatePhone = async () => {
    try {
      const verifyResponse = await verifyPhone({
        userId: user?._id || "",
        phoneNumber: newPhoneNumber,
        countryCode,
      }).unwrap();

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Phone verification failed");
      }

      toast.success("OTP sent successfully to your new number");
      setCurrentView("otp");
      setOtp(["", "", "", ""]);
      setResendTimer(RESEND_COOLDOWN);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update phone number");
      setErrorMessage(err.data?.message || "Failed to update phone number");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const response = await resendOTP({
        userId: user?._id || "",
        phoneNumber: location.state?.phoneNumber,
        countryCode: location.state?.countryCode,
      }).unwrap();

      if (response.success) {
        toast.success("New OTP sent successfully!");
        setOtp(["", "", "", ""]);
        setErrorMessage(null);
        setResendTimer(RESEND_COOLDOWN);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP");
      setErrorMessage(err.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await verifyOTP({
        userId: user?._id || "",
        otp: otp.join(""),
      }).unwrap();

      if (!response.success) {
        throw new Error(response.message || "Verification failed");
      }

      const result = await updateFirstTimeUser({
        user_id: user?._id || "",
        experience_level: location.state?.experienceLevel,
        phone_number: location.state?.phoneNumber,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user_info,
          accessToken: token,
        })
      );

      toast.success("Phone number verified successfully");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP. Please try again.");
      setErrorMessage(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditView = () => (
    <>
      <div className="space-y-11">
        <button
          onClick={() => setCurrentView("otp")}
          className="absolute top-4 left-8 text-[#666] hover:text-gray-900 flex items-center mb-6"
        >
          <img
            src={arrow || "/placeholder.svg"}
            alt="Back"
            className="w-4 h-4 mr-2"
          />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="w-[58px] h-[58px] flex justify-center items-center p-4 rounded-full border border-[rgba(0,0,0,0.10)]">
          <img src={Phone} alt="Phone" className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      <div className="mb-[32px] mt-[40px] space-y-4">
        <h1 className="text-[#1A1A1A] text-title">Edit Phone Number</h1>
        <p className="text-[rgba(0,0,0,0.60)] text-body2">
          Enter your new phone number below
        </p>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
        >
          <AlertDescription className="text-[#ff3b30]">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <PhoneInput
          placeholder="Phone Number"
          required
          className="w-full"
          value={newPhoneNumber}
          onChange={handlePhoneInputChange}
        />

        <Button
          onClick={handleUpdatePhone}
          className="w-full h-[44px] bg-[#062549] text-white hover:bg-[#083264]"
          disabled={!newPhoneNumber}
        >
          Update & Send New OTP
        </Button>
      </div>
    </>
  );

  const renderOtpView = () => (
    <>
      <div className="space-y-11">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-8 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <img
            src={arrow || "/placeholder.svg"}
            alt="Back"
            className="w-4 h-4 mr-2"
          />
          <span className="text-sm font-medium">Back</span>
        </button>
        <img
          src={verify}
          alt="verify"
          className="w-[58px] h-[58px] object-cover"
        />
      </div>

      <div className="mb-[40px] mt-8">
        <h1 className="text-title text-[#1A1A1A]">Verify Your Phone Number</h1>
        <div className="flex justify-start gap-2 text-body2 text-[rgba(0,0,0,0.60)] mt-[16px]">
          <span>We've sent an OTP to</span>
          <div className="flex items-center gap-1">
            <span
              className="text-[#0AD472] underline decoration-solid decoration-from-font"
              style={{
                textDecorationSkipInk: "none",
                textDecorationThickness: "auto",
                textUnderlineOffset: "auto",
                textUnderlinePosition: "from-font",
              }}
            >
              {location.state?.phoneNumber}
            </span>
            <Button
              onClick={() => setCurrentView("edit")}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3 text-[#0AD472]" />
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
        >
          <AlertDescription className="text-[#ff3b30]">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div
          className={cn("flex justify-center gap-4", shake && "animate-shake")}
        >
          {otp.map((digit, index) => (
            <div key={index} className="w-12 h-12">
              <input
                type="text"
                maxLength={1}
                className={cn(
                  "w-full h-full text-center text-2xl font-bold border rounded-md",
                  "focus:border-[#062549] focus:ring-1 focus:ring-[#062549] outline-none",
                  shake ? "border-red-500" : "border-gray-300",
                  digit && "border-[#0AD472] text-[#0AD472]"
                )}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.some((digit) => !digit)}
          className="w-full h-[44px] bg-[#062549] text-white hover:bg-[#083264] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-[#666] text-body2">
            Didn't receive the OTP?
          </span>
          {resendTimer > 0 ? (
            <span className="text-[#656565]">
              Wait {resendTimer}s to resend
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || resendTimer > 0}
              className="text-[#0AD472] underline decoration-solid decoration-from-font"
              style={{
                textDecorationSkipInk: "none",
                textDecorationThickness: "auto",
                textUnderlineOffset: "auto",
                textUnderlinePosition: "from-font",
              }}
            >
              Resend
            </button>
          )}
        </div>
      </form>
    </>
  );

  return (
    <ProtectedOnboardingRoute>
      <main className="h-screen w-screen flex p-6 bg-white">
        <section className="h-full w-full relative">
          <img
            className="w-full h-full rounded-lg"
            src={bg || "/placeholder.svg"}
            alt=""
          />
          <img
            className="absolute top-10 2xl:top-10 left-10"
            src={logo || "/placeholder.svg"}
            alt=""
          />
          <img
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 xl:w-[600px] 2xl:w-[1000px]"
            src={ESymbol || "/placeholder.svg"}
            alt=""
          />
        </section>

        <section className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[846px] w-full">
            <div className=" rounded-lg w-full max-w-[500px] p-8 relative">
              {currentView === "edit" ? renderEditView() : renderOtpView()}
            </div>
          </div>
        </section>
      </main>
    </ProtectedOnboardingRoute>
  );
};

export default VerifyPhoneOTP;
