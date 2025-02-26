"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmailVerification from "../signup/EmailVerification";

interface DisabledAccountModalProps {
  isOpen: boolean;
}

const DisabledAccountModal: React.FC<DisabledAccountModalProps> = ({
  isOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] rounded-lg" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-h1">Account Disabled</DialogTitle>
          <DialogDescription className="text-body2">
            Your account is currently disabled. Please contact support for
            assistance.
          </DialogDescription>
        </DialogHeader>
        <EmailVerification isVerified={true} />
      </DialogContent>
    </Dialog>
  );
};

export default DisabledAccountModal;
