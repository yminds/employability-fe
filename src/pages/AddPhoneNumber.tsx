import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyPhoneMutation } from "@/api/authApiSlice";
import { useSelector } from "react-redux";
import { PhoneInput } from "@/components/cards/phoneInput/PhoneInput";
import logo from "@/assets/branding/logo.svg";
import arrow from "@/assets/skills/arrow.svg";
import ProtectedOnboardingRoute from "@/features/authentication/ProtectedOnboardingRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import validationRules from "@/utils/validation/validationRules";
import { toast } from "sonner";
import Phone from "@/assets/sign-up/Phone.svg";
import { Value as PhoneNumberValue } from "react-phone-number-input";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
import { Button } from "@/components/ui/button";

const AddPhone: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyPhone, { isLoading }] = useVerifyPhoneMutation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const validatePhoneNumber = (phone: string, country: string) => {
    // Remove non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    console.log("cleanPhone:", cleanPhone);

    const rules: any = validationRules[country];
    console.log("rules:", rules);

    if (!rules) {
      return true;
    }

    // Determine the country code length
    const countryCodeLengths: { [key: string]: number } = {
      US: 1,
      CA: 1,
      IN: 2,
      CN: 2,
      BR: 2,
      AU: 2,
      RU: 1,
      DE: 2,
      FR: 2,
      GB: 2,
      IT: 2,
      MX: 2,
      NG: 3,
    };

    const countryCodeLength = countryCodeLengths[country] || 0; // Default to 0 if not found
    console.log("countryCodeLength:", countryCodeLength);

    // Slice off the country code part
    const localNumber = cleanPhone.slice(countryCodeLength);
    console.log("localNumber:", localNumber);

    // Validate the remaining number length
    return localNumber.length === rules.length;
  };

  console.log("phoneNumber:", phoneNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message
    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      setErrorMessage(`Please enter a valid ${countryCode} phone number`);
      return;
    }
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
      const verifyResponse = await verifyPhone({
        userId: user._id,
        phoneNumber,
        countryCode,
      }).unwrap();

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Phone verification failed");
      }

      toast.success("OTP sent successfully to your WhatsApp number");

      navigate("/verify-otp", {
        state: {
          phoneNumber,
          countryCode,
          experienceLevel,
        },
      });
    } catch (err: any) {
      console.error("Failed to update user profile:", err);
      toast.error(err.data?.message || "Failed to send OTP. Please try again.");
      if (err) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage(
          "An error occurred while updating your profile. Please try again."
        );
      }
    }
  };

  const handlePhoneInputChange = (
    value: PhoneNumberValue,
    country?: { countryCode: string }
  ) => {
    setPhoneNumber(value || "");

    if (country) {
      setCountryCode(country.countryCode);
    }
  };

  return (
    <ProtectedOnboardingRoute>
      <main className="h-screen w-screen bg-white flex">
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

        {/* Right Section - Phone Number Form */}
        <div className="flex flex-col items-center flex-1 justify-center max-w-[846px] w-full">
          <div className="rounded-lg w-full max-w-[500px] p-8 relative">
            {/* Back Button */}
            <div className="space-y-11">
              <button
                onClick={() => navigate(-1)}
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
                <img
                  src={Phone}
                  alt="Phone"
                  className="w-6 h-6 text-gray-600"
                />
              </div>
            </div>

            <div className="mb-[32px] mt-[40px] space-y-4">
              <h1 className="text-[#1A1A1A] text-title">
                Let's add phone number
              </h1>
              <p className="text-[rgba(0,0,0,0.60)] text-body2">
                We need your phone number for verification and to keep your
                account secure.
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

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2">
                <PhoneInput
                  placeholder="Phone Number"
                  required
                  className="w-full"
                  value={phoneNumber}
                  onChange={handlePhoneInputChange}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !phoneNumber}
                className="w-full h-[44px] px-8 py-4 justify-center items-center gap-2 flex-shrink-0 rounded bg-[#001630] text-white hover:bg-[#062549] hover:shadow-[0_10px_16px_-2px_rgba(6,90,216,0.15)] active:border active:border-white/20 disabled:bg-black/20 disabled:text-white/60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Phone Number"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </ProtectedOnboardingRoute>
  );
};

export default AddPhone;
