import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OTPInput } from "input-otp";
import { Dot, Edit2, ArrowLeft } from "lucide-react";
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
      // First update the email
      const updateResponse = await fetch(
        `http://localhost:3000/api/v1/user/update-email/${user?._id}`,
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

      // Then send verification OTP to the new email
      const otpResponse = await fetch(
        "http://localhost:3000/api/v1/email/send-verification-otp",
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

  const handleSendOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/email/send-verification-otp",
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
        "http://localhost:3000/api/v1/email/verify-otp",
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
    <div className="w-full bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">
            {remainingDays > 0
              ? `${remainingDays} days left to verify your account`
              : "Your account needs verification to continue"}
          </p>
          <p className="text-sm text-gray-500 mt-2">{email}</p>
        </div>
        <Button
          onClick={handleSendOtp}
          className="bg-[#001630] text-white hover:bg-[#062549]"
        >
          Send OTP
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          {currentView === 'edit' ? renderEditView() : renderOtpView()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailVerification;