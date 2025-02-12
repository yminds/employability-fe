import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { OTPInput } from "input-otp";
import { Dot, Edit2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { useGetUserDetailsQuery } from "@/api/userApiSlice";
import logo from "@/assets/skills/e-Logo.svg";

const EmailVerification = () => {
  const [remainingDays, setRemainingDays] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [shake, setShake] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<'otp' | 'edit'>('otp');

  const user = useSelector((state: RootState) => state.auth.user);
  const email = user?.email;
  const createdAt = user?.createdAt;
  const { refetch } = useGetUserDetailsQuery(user?._id);

  useEffect(() => {
    setNewEmail(email || "");
  }, [email]);

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
        setShowModal(true);
        setError("");
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
        setShowModal(false);
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

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await handleSendOtp();
      setOtp("");
      setError("");
      toast.success("New verification code sent to your email!");
    } finally {
      setIsResending(false);
    }
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

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
        setCurrentView('otp');
        setError("");
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

  const renderEditView = () => (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      <Button 
        variant="ghost" 
        onClick={() => setCurrentView('otp')}
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

  const renderOtpView = () => (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      <div className="w-[58px] h-[58px] p-3 rounded-[54px] border border-black/10">
        <img src={logo} alt="logo" className="w-8 h-8 object-contain"/>
      </div>

      <div className="text-center">
        <h2 className="text-[32px] font-bold font-ubuntu leading-[42px] mb-4">
          Verify Your Email
        </h2>
        <div className="flex items-center justify-center gap-2 text-black/60 text-sm">
          <span>We've sent an OTP to</span>
          <div className="flex items-center gap-1">
            <span className="text-[#09d372]">{newEmail}</span>
            <Button
              onClick={() => setCurrentView('edit')}
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
        <span className="text-[#656565] text-sm">
          Didn't receive the OTP?
        </span>
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-[#09d372] underline disabled:opacity-50"
        >
          Resend
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* New Sticky Banner */}
      <div className="sticky top-0 z-50 w-full">
        <div className="h-[38px] bg-[#e9d4bd] flex justify-center items-center gap-[33px]">
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-5 h-5 relative">
              <div className="w-5 h-5 left-0 top-0 absolute bg-[#d9d9d9]"></div>
              <div className="left-[3.42px] top-[2.32px] absolute">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.0013 6.17281H13.0013V3.75615C13.0013 3.69198 12.9746 3.63323 12.9211 3.5799C12.8678 3.52642 12.809 3.49969 12.7448 3.49969H2.25776C2.19359 3.49969 2.13484 3.52642 2.08151 3.5799C2.02804 3.63323 2.0013 3.69198 2.0013 3.75615V6.17281ZM2.25776 15.583C1.88262 15.583 1.56554 15.4535 1.30651 15.1945C1.04748 14.9355 0.917969 14.6184 0.917969 14.2432V3.75615C0.917969 3.39073 1.04991 3.07608 1.3138 2.81219C1.57769 2.5483 1.89234 2.41635 2.25776 2.41635H4.07818V0.877813C4.07818 0.718785 4.13096 0.586076 4.23651 0.479687C4.34207 0.373437 4.47373 0.320312 4.63151 0.320312C4.78943 0.320312 4.92255 0.373437 5.03089 0.479687C5.13936 0.586076 5.19359 0.718785 5.19359 0.877813V2.41635H9.84109V0.861979C9.84109 0.708229 9.89248 0.579478 9.99526 0.475728C10.0982 0.372117 10.2259 0.320312 10.3784 0.320312C10.5309 0.320312 10.66 0.372117 10.7657 0.475728C10.8715 0.579478 10.9244 0.708229 10.9244 0.861979V2.41635H12.7448C13.1103 2.41635 13.4249 2.5483 13.6888 2.81219C13.9527 3.07608 14.0846 3.39073 14.0846 3.75615V7.41323C14.0846 7.56698 14.0332 7.69566 13.9303 7.79927C13.8275 7.90302 13.6998 7.9549 13.5473 7.9549C13.3948 7.9549 13.2657 7.90302 13.1601 7.79927C13.0542 7.69566 13.0013 7.56698 13.0013 7.41323V7.25615H2.0013V14.2432C2.0013 14.3074 2.02804 14.3661 2.08151 14.4195C2.13484 14.473 2.19359 14.4997 2.25776 14.4997H7.33464C7.48839 14.4997 7.61714 14.5511 7.72089 14.6539C7.8245 14.7568 7.8763 14.8845 7.8763 15.037C7.8763 15.1895 7.8245 15.3186 7.72089 15.4243C7.61714 15.5301 7.48839 15.583 7.33464 15.583H2.25776Z" fill="#86451F"/>
                </svg>
              </div>
            </div>
            <div className="text-[#86441e] text-base font-normal font-['DM Sans'] leading-normal tracking-tight">
              {remainingDays} days left to verify this account
            </div>
          </div>
          <button 
            onClick={handleSendOtp}
            className="justify-start items-center gap-1 flex hover:opacity-80 cursor-pointer"
          >
            <div className="text-black text-base font-normal font-['DM Sans'] leading-normal tracking-tight">
              verify now
            </div>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.495 12.495C18.7683 12.2216 18.7683 11.7784 18.495 11.505L14.0402 7.05025C13.7668 6.77689 13.3236 6.77689 13.0503 7.05025C12.7769 7.32362 12.7769 7.76684 13.0503 8.0402L17.0101 12L13.0503 15.9598C12.7769 16.2332 12.7769 16.6764 13.0503 16.9497C13.3236 17.2231 13.7668 17.2231 14.0402 16.9497L18.495 12.495ZM18 11.3L7 11.3V12.7L18 12.7V11.3Z" fill="black"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          {currentView === 'edit' ? renderEditView() : renderOtpView()}
        </DialogContent>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default EmailVerification;