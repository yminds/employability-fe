import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OTPInput } from "input-otp";
import { ArrowLeft, Dot, Edit2, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import assets
import logo from "@/assets/branding/logo.svg";
import employerLoginSvg from "@/assets/employer/employerLoginSvg.svg";
import arrow from "@/assets/skills/arrow.svg";
import CandidateProfileCard from "@/components/employer/CandidateProfileCard";

// Import Redux actions and API hooks
import { 
  setEmployerCredentials,
  updateEmailVerification, 
  updateEmployerEmail 
} from "@/features/authentication/employerAuthSlice";
import { 
  useCheckTokenQuery, 
  useClearTokenMutation, 
  useSendVerificationOTPMutation, 
  useVerifyOTPMutation, 
  useUpdateEmployerEmailMutation 
} from "@/api/employerApiSlice";

const EmployerEmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // States
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentView, setCurrentView] = useState<"otp" | "edit">("otp");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isFromSignup, setIsFromSignup] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  // Use a ref to track if OTP has been sent to prevent multiple sends
  const otpSent = useRef(false);

  // API hooks
  const { data: tokenData, refetch: refetchToken } = useCheckTokenQuery(employerId || "", {
    skip: !employerId
  });
  const [clearToken] = useClearTokenMutation();
  const [sendVerificationOTP, { isLoading: isSendingOTP }] = useSendVerificationOTPMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [updateEmployerEmailMutation, { isLoading: isUpdatingEmail }] = useUpdateEmployerEmailMutation();

  // Initialize data from session storage once
  useEffect(() => {
    const signupDataStr = sessionStorage.getItem('employerSignupData');
    if (signupDataStr) {
      try {
        const parsedData = JSON.parse(signupDataStr);
        setSignupData(parsedData);
        setEmployerId(parsedData._id);
        setEmail(parsedData.email);
        setNewEmail(parsedData.email);
        setIsFromSignup(true);
      } catch (error) {
        console.error("Error parsing signup data:", error);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeRemaining]);

  // Handle initial OTP sending - consolidated with proper dependencies
  useEffect(() => {
    const initVerification = async () => {
      // Only proceed if we have the necessary data and haven't sent OTP yet
      if (employerId && email && tokenData !== undefined && !otpSent.current) {
        // Only send OTP if there's no active token
        if (!tokenData?.hasActiveToken) {
          otpSent.current = true; // Mark as sent before making the API call
          await handleSendOtp();
        } else {
          // If there's already an active token, just start the timer
          startResendTimer();
        }
      }
    };
    
    initVerification();
  }, [employerId, email, tokenData]);

  // Start Timer Function
  const startResendTimer = () => {
    setTimeRemaining(30);
    setTimerActive(true);
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    if (!email || isSendingOTP) return;
    
    try {
      const result = await sendVerificationOTP({ email }).unwrap();
      
      if (result.success) {
        setError("");
        startResendTimer();
        toast.success("OTP sent successfully! Please check your email.");
        await refetchToken();
      } else {
        setError(result.message);
        toast.error("Failed to send OTP", {
          description: result.message,
        });
      }
    } catch (err: any) {
      setError(err.data?.message || "Failed to send OTP");
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!email || otp.length !== 4 || isVerifying) return;
    
    try {
      const result = await verifyOTP({ email, otp }).unwrap();
      
      if (result.success) {
        // Update verified status in Redux
        dispatch(updateEmailVerification());
        
        if (signupData) {
          dispatch(
            setEmployerCredentials({
              employer_info: {
                ...signupData,
                is_email_verified: true,
              },
              token: signupData.token,
              company: signupData.companyInfo || null,
            })
          );
          
          // Clear the saved signup data
          sessionStorage.removeItem('employerSignupData');
        }
        
        setError("");
        setOtp("");
        setTimerActive(false);
        setTimeRemaining(0);
        toast.success("Email verified successfully!");
        
        navigate("/employer");
      } else {
        setError(result.message);
        setShake(true);
        toast.error("Invalid OTP", {
          description: "Please enter the correct verification code.",
        });
        setTimeout(() => setShake(false), 600);
      }
    } catch (err: any) {
      setError(err.data?.message || "Failed to verify OTP");
      setShake(true);
      toast.error("Failed to verify OTP. Please try again.");
      setTimeout(() => setShake(false), 600);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timerActive || !employerId || isSendingOTP) return;
    
    try {
      await clearToken(employerId).unwrap();
      await handleSendOtp();
      setOtp("");
      setError("");
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  // Validate Email
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Update Email
  const handleUpdateEmail = async () => {
    if (!validateEmail(newEmail) || !employerId || isUpdatingEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const updateResult = await updateEmployerEmailMutation({
        employer_id: employerId,
        data: { email: newEmail }
      }).unwrap();

      if (updateResult.success) {
        setEmail(newEmail);
        dispatch(updateEmployerEmail({ email: newEmail }));
        
        // Clear any existing token
        if (tokenData?.hasActiveToken) {
          await clearToken(employerId).unwrap();
        }
        
        // Reset the OTP sent flag before sending a new OTP
        otpSent.current = false;
        
        // Send new OTP
        const otpResult = await sendVerificationOTP({ email: newEmail }).unwrap();
        
        if (otpResult.success) {
          toast.success("Email updated and verification code sent!");
          setCurrentView("otp");
          setError("");
          startResendTimer();
          await refetchToken();
        } else {
          setError(otpResult.message);
          toast.error(otpResult.message);
        }
      } else {
        setError(updateResult.message);
        toast.error(updateResult.message);
      }
    } catch (err: any) {
      // This catch block specifically handles domain validation errors
      console.error("Email update error:", err);
      const errorMessage = err.data?.message || "Failed to update email";
      setError(errorMessage);
      
      // Show a more specific error message for domain mismatch
      if (errorMessage.includes("domain")) {
        toast.error("Domain mismatch", {
          description: "Your email domain must match your company's domain."
        });
      } else {
        toast.error(errorMessage);
      }
    }
  }

  // Render Edit Email Form
  const renderEditEmailForm = () => (
    <div className="w-full max-w-md bg-white rounded-lg p-8">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setCurrentView("otp")}
          className="hover:text-green-600 text-[#666666] text-sm flex items-center"
        >
          <img className="w-4 h-4 mr-2" src={arrow} alt="Back Arrow" />
          <span>Back</span>
        </button>
      </div>

      {/* Lock icon */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-[#d9d9d9] flex items-center justify-center">
          <Edit2 className="text-[#666666]" size={24} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[#000000] text-3xl font-bold text-center mb-4">
        Update Your Email
      </h1>

      <p className="text-[#666666] text-center mb-8">
        Enter your new email address below
      </p>

      {/* Email input field */}
      <div className="mb-8">
        <Input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-4 h-14 text-lg border-2 border-[#d9d9d9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ad472] focus:border-transparent"
          placeholder="Enter new email address"
        />
      </div>

      {/* Update button */}
      <button 
        className="w-full py-4 bg-[#001630] text-white rounded-md mb-6"
        onClick={handleUpdateEmail}
        disabled={isUpdatingEmail || !validateEmail(newEmail)}
      >
        {isUpdatingEmail ? "Updating..." : "Update & Send Code"}
      </button>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );

  // Render OTP Verification Form
  const renderOtpVerificationForm = () => (
    <div className="w-full max-w-md bg-white rounded-lg p-8">
      {/* Back Button - Only show if not coming from signup */}
      {!isFromSignup && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-green-600 text-[#666666] text-sm flex items-center"
          >
            <img className="w-4 h-4 mr-2" src={arrow} alt="Back Arrow" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Lock icon */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-[#d9d9d9] flex items-center justify-center">
          <Lock className="text-[#666666]" size={24} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[#000000] text-3xl font-bold text-center mb-4">
        Verify Your Email
      </h1>

      {/* Email with edit option */}
      <div className="flex items-center justify-center mb-8">
        <p className="text-[#666666]">We've sent an OTP to</p>
        <div className="flex items-center ml-2">
          <span className="text-[#0ad472] max-w-[150px] truncate">{email}</span>
          <button 
            onClick={() => setCurrentView("edit")}
            className="ml-2 text-[#666666] hover:text-[#0ad472]"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* OTP input */}
      <div className={cn("mb-8", shake && "animate-shake")}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          maxLength={4}
          containerClassName="flex justify-center gap-3"
          render={({ slots }) => (
            <>
              {slots.map((slot, idx) => (
                <div key={idx} className="w-16 h-16">
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      "text-2xl border-2 rounded-md",
                      "transition-all duration-300",
                      shake ? "border-red-500" : slot.char ? "border-[#0ad472]" : "border-[#d9d9d9]",
                      "focus-within:border-[#0ad472] focus-within:ring-2 focus-within:ring-[#0ad472]"
                    )}
                  >
                    {slot.char ? (
                      slot.char
                    ) : (
                      <Dot className="w-6 h-6 text-gray-300" />
                    )}
                    {slot.hasFakeCaret && (
                      <div className="absolute pointer-events-none">
                        <div className="w-px h-8 bg-[#0ad472] animate-caret-blink" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        />
      </div>

      {/* Verify button */}
      <button 
        className="w-full py-4 bg-[#001630] text-white rounded-md mb-6"
        onClick={handleVerifyOtp}
        disabled={otp.length !== 4 || isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      {/* Resend option */}
      <div className="text-center">
        <span className="text-[#666666]">Didn't Receive the OTP?</span>{" "}
        {timerActive ? (
          <span className="text-[#666666]">Resend in {timeRemaining}s</span>
        ) : (
          <button 
            className="text-[#0ad472] font-medium"
            onClick={handleResendOtp}
            disabled={isSendingOTP}
          >
            Resend
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );

  return (
    <section className="flex h-screen w-screen bg-white relative dark:bg-gray-800">
      {/* Left Section with SVG */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src={employerLoginSvg}
          alt="Employer Signup Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-20">
          <img src={logo} alt="Logo" className="w-[160px]" />
        </div>

        {/* Heading text at the top */}
        <div className="absolute inset-0 flex flex-col justify-center items-start max-w-[400px] mx-auto z-10 px-6 pb-[340px]">
          <h1 className="text-[30px] font-ubuntu font-medium leading-[45px] tracking-[-0.6px] text-[#202326] mb-[-4px]">
            Cut the Guesswork.
          </h1>
          <h2 className="text-[30px] font-ubuntu font-bold leading-[45px] tracking-[-0.6px] text-[#10b754]">
            Discover Proven Talent
            <br />
            at Speed.
          </h2>
        </div>

        {/* Candidate profile card in the center */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
          <CandidateProfileCard />
        </div>
      </div>

      {/* Right Section - Email Verification UI */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        {currentView === "edit" ? renderEditEmailForm() : renderOtpVerificationForm()}
      </div>
    </section>
  );
};

export default EmployerEmailVerification;