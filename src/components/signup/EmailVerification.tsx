import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "input-otp";
import { Dot, Edit2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { useGetUserDetailsQuery } from "@/api/userApiSlice";
import logo from "@/assets/skills/e-Logo.svg";
import { useDispatch } from "react-redux";
import { updateEmailVerification, updateUserEmail } from "@/features/authentication/authSlice";

const EmailVerification = () => {
  // States
  const [remainingDays, setRemainingDays] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [shake, setShake] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<"otp" | "edit">("otp");
  const [hasActiveToken, setHasActiveToken] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const email = user?.email;
  const createdAt = user?.createdAt;
  const { refetch } = useGetUserDetailsQuery(user?._id);
  const dispatch = useDispatch();

  // Timer Effect
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

  // Start Timer Function
  const startResendTimer = () => {
    setTimeRemaining(30);
    setTimerActive(true);
  };

  // Initialize email state
  useEffect(() => {
    setNewEmail(email || "");
  }, [email]);

  // Calculate remaining days
  useEffect(() => {
    if (createdAt) {
      const created = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remaining = Math.max(10 - diffDays, 0);
      setRemainingDays(remaining);
    }
  }, [createdAt]);

  // Reset states when modal closes
  useEffect(() => {
    if (!showModal) {
      setOtp("");
      setError("");
      setCurrentView("otp");
      setShake(false);
    }
  }, [showModal]);

  // Token Functions
  const checkActiveToken = async () => {
    if (!user?._id) return false;
    
    try {
      const response = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/email/check-token/${user._id}`
      );
      const data = await response.json();
      setHasActiveToken(data.hasActiveToken);
      return data.hasActiveToken;
    } catch (err) {
      console.error("Error checking token status:", err);
      return false;
    }
  };

  const clearToken = async () => {
    if (!user?._id) return;
    
    try {
      await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/email/clear-token/${user._id}`,
        { method: "POST" }
      );
    } catch (err) {
      console.error("Error clearing token:", err);
    }
  };

  // Handle Verify Click
  const handleVerifyClick = async () => {
    const hasToken = await checkActiveToken();
    setShowModal(true);
    
    if (hasToken) {
      toast.info("An active verification code exists", {
        description: "Please use the existing code or click 'Resend' for a new one",
      });
    } else {
      await handleSendOtp();
      startResendTimer();
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/email/send-verification-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setError("");
        setHasActiveToken(true);
        toast.success("OTP sent successfully! Please check your email.");
      } else {
        const data = await response.json();
        setError(data.message);
        toast.error("Failed to send OTP", {
          description: data.message,
        });
      }
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/email/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newEmail, otp }),
        }
      );

      if (response.ok) {
        dispatch(updateEmailVerification());
        setShowModal(false);
        setHasActiveToken(false);
        setTimerActive(false);
        setTimeRemaining(0);
        toast.success("Email verified successfully!");
        await refetch();
      } else {
        const data = await response.json();
        setError(data.message);
        setShake(true);
        toast.error("Invalid OTP", {
          description: "Please enter the correct verification code.",
        });
        setTimeout(() => setShake(false), 600);
      }
    } catch (err) {
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timerActive) return;
    
    setIsResending(true);
    try {
      await clearToken();
      await handleSendOtp();
      setOtp("");
      setError("");
      startResendTimer();
    } finally {
      setIsResending(false);
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
    if (!validateEmail(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateResponse = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/user/update-email/${user?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newEmail }),
        }
      );

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        setError(updateData.message);
        toast.error(updateData.message);
        return;
      }

      dispatch(updateUserEmail(newEmail));
      await clearToken();

      const otpResponse = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/email/send-verification-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newEmail }),
        }
      );

      const otpData = await otpResponse.json();

      if (otpResponse.ok) {
        toast.success("Email updated and verification code sent!");
        await refetch();
        setCurrentView("otp");
        setError("");
        setHasActiveToken(true);
        startResendTimer();
      } else {
        setError(otpData.message);
        toast.error(otpData.message);
      }
    } catch (err) {
      toast.error("Failed to update email and send verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Edit View
  const renderEditView = () => (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      <Button
        variant="ghost"
        onClick={() => setCurrentView("otp")}
        className="self-start"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center">
        <h2 className="text-[32px] font-bold font-ubuntu leading-[42px] mb-4">
          Edit Your Email
        </h2>
        <p className="text-black/60 text-sm mb-6">
          Enter your new email address below
        </p>
      </div>

      <div className="w-full max-w-md">
        <Input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full mb-4"
          placeholder="Enter new email"
        />
        <Button
          onClick={handleUpdateEmail}
          className="w-full bg-[#001630] text-white hover:bg-[#062549]"
          disabled={!validateEmail(newEmail) || isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update & Send Verification Code"}
        </Button>
      </div>
    </div>
  );

  // Render OTP View
  const renderOtpView = () => (
    <div className="flex flex-col items-center justify-center gap-8 p-6 ">
      <div className="w-[58px] h-[58px] p-3 rounded-[54px] border border-black/10">
        <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
      </div>

      <div className="text-center">
        <h2 className="text-[32px] font-bold font-ubuntu leading-[42px] mb-4">
          Verify Your Email
        </h2>
        <div className="flex items-center justify-center gap-2 text-black/60 text-sm">
          <span>{hasActiveToken ? "We've already sent an OTP to" : "We'll send an OTP to"}</span>
          <div className="flex items-center gap-1">
            <span className="text-[#09d372]">{newEmail}</span>
            <Button
              onClick={() => setCurrentView("edit")}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className={cn("w-full max-w-md mx-auto", shake && "animate-shake")}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          maxLength={4}
          containerClassName="group flex items-center gap-2 has-[:disabled]:opacity-30"
          render={({ slots }) => (
            <>
              {slots.map((slot, idx) => (
                <div key={idx} className="w-full">
                  <div
                    className={cn(
                      "relative w-full h-[70px] text-[2rem] cursor-text",
                      "flex items-center justify-center",
                      "transition-all duration-300",
                      "border rounded-md border-gray-300",
                      "group-focus-within:border-[#09d372]",
                      "group-hover:border-[#09d372]",
                      shake ? "border-red-500" : "",
                      slot.char && "border-[#09d372]"
                    )}
                  >
                    {slot.char ? (
                      slot.char
                    ) : (
                      <Dot className="w-4 h-4 text-gray-300" />
                    )}
                    {slot.hasFakeCaret && (
                      <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
                        <div className="w-px h-8 bg-[#09d372] animate-caret-blink" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        />
      </div>

      <Button
        onClick={handleVerifyOtp}
        disabled={otp.length !== 4}
        className="w-full bg-[#001630] text-white hover:bg-[#062549] disabled:opacity-50"
      >
        Verify
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-[#656565] text-sm">Didn't receive the OTP?</span>
        {timerActive ? (
          <span className="text-[#656565] text-sm">
            Resend in {timeRemaining}s
          </span>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-[#09d372] underline disabled:opacity-50 hover:text-[#07a358]"
          >
            Resend
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <div className="h-[38px] bg-[#e9d4bd] flex justify-center items-center gap-[33px]">
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-5 h-5 relative">
              <div className="w-5 h-5 absolute inset-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 20"
                  className="w-full h-full"
                >
                  <mask id="calendar_mask">
                    <rect x="0.5" width="20" height="20" fill="white" />
                  </mask>
                  <g mask="url(#calendar_mask)">
                    <path
                      d="M5.0013 8.17281H16.0013V5.75615C16.0013 5.69198 15.9746 5.63323 15.9211 5.5799C15.8678 5.52642 15.809 5.49969 15.7448 5.49969H5.25776C5.19359 5.49969 5.13484 5.52642 5.08151 5.5799C5.02804 5.63323 5.0013 5.69198 5.0013 5.75615V8.17281ZM5.25776 17.583C4.88262 17.583 4.56554 17.4535 4.30651 17.1945C4.04748 16.9355 3.91797 16.6184 3.91797 16.2432V5.75615C3.91797 5.39073 4.04991 5.07608 4.3138 4.81219C4.57769 4.5483 4.89234 4.41635 5.25776 4.41635H7.07818V2.87781C7.07818 2.71878 7.13096 2.58608 7.23651 2.47969C7.34207 2.37344 7.47373 2.32031 7.63151 2.32031C7.78943 2.32031 7.92255 2.37344 8.03089 2.47969C8.13936 2.58608 8.19359 2.71878 8.19359 2.87781V4.41635H12.8411V2.86198C12.8411 2.70823 12.8925 2.57948 12.9953 2.47573C13.0982 2.37212 13.2259 2.32031 13.3784 2.32031C13.5309 2.32031 13.66 2.37212 13.7657 2.47573C13.8715 2.57948 13.9244 2.70823 13.9244 2.86198V4.41635H15.7448C16.1103 4.41635 16.4249 4.5483 16.6888 4.81219C16.9527 5.07608 17.0846 5.39073 17.0846 5.75615V9.41323C17.0846 9.56698 17.0332 9.69566 16.9303 9.79927C16.8275 9.90302 16.6998 9.9549 16.5473 9.9549C16.3948 9.9549 16.2657 9.90302 16.1601 9.79927C16.0542 9.69566 16.0013 9.56698 16.0013 9.41323V9.25615H5.0013V16.2432C5.0013 16.3074 5.02804 16.3661 5.08151 16.4195C5.13484 16.473 5.19359 16.4997 5.25776 16.4997H10.3346C10.4884 16.4997 10.6171 16.5511 10.7209 16.6539C10.8245 16.7568 10.8763 16.8845 10.8763 17.037C10.8763 17.1895 10.8245 17.3186 10.7209 17.4243C10.6171 17.5301 10.4884 17.583 10.3346 17.583H5.25776Z"
                      fill="#86451F"
                    />
                    <path
                      d="M15.6569 18.583C14.6611 18.583 13.8157 18.2339 13.1207 17.5357C12.4257 16.8377 12.0782 15.9907 12.0782 14.9949C12.0782 13.9992 12.4273 13.1539 13.1255 12.4589C13.8235 11.7639 14.6705 11.4164 15.6663 11.4164C16.6621 11.4164 17.5075 11.7655 18.2023 12.4636C18.8973 13.1617 19.2448 14.0086 19.2448 15.0045C19.2448 16.0002 18.8958 16.8455 18.1978 17.5405C17.4996 18.2355 16.6526 18.583 15.6569 18.583ZM16.1136 14.8074V13.4997C16.1136 13.377 16.0689 13.2711 15.9794 13.1818C15.8901 13.0925 15.7841 13.0478 15.6615 13.0478C15.5389 13.0478 15.4329 13.0925 15.3436 13.1818C15.2543 13.2711 15.2096 13.377 15.2096 13.4997V14.9195C15.2096 15.0199 15.2278 15.1086 15.2642 15.1855C15.3005 15.2625 15.3507 15.3331 15.4151 15.3974L16.4773 16.4597C16.5689 16.5462 16.6762 16.5908 16.7992 16.5934C16.9221 16.5961 17.0296 16.5515 17.1215 16.4597C17.2135 16.3677 17.2594 16.2616 17.2594 16.1414C17.2594 16.0209 17.2135 15.9123 17.1215 15.8153L16.1136 14.8074Z"
                      fill="#86451F"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="text-[#86441e] text-body2">
              {remainingDays} days left to verify this account
            </div>
          </div>
          <button
            onClick={handleVerifyClick}
            className="justify-start items-center gap-1 flex hover:opacity-80 cursor-pointer"
          >
            <div className="text-black text-body2">
              verify now
            </div>
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.495 12.495C18.7683 12.2216 18.7683 11.7784 18.495 11.505L14.0402 7.05025C13.7668 6.77689 13.3236 6.77689 13.0503 7.05025C12.7769 7.32362 12.7769 7.76684 13.0503 8.0402L17.0101 12L13.0503 15.9598C12.7769 16.2332 12.7769 16.6764 13.0503 16.9497C13.3236 17.2231 13.7668 17.2231 14.0402 16.9497L18.495 12.495ZM18 11.3L7 11.3V12.7L18 12.7V11.3Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          {currentView === "edit" ? renderEditView() : renderOtpView()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailVerification;