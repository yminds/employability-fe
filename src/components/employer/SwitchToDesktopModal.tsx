"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SwitchToDesktop from "@/assets/employer/SwitchToDesktop.svg";

interface SwitchToDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwitchToDesktopModal({
  isOpen,
  onClose,
}: SwitchToDesktopModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <div className="flex justify-center my-6">
          <img
            src={SwitchToDesktop}
            alt="Desktop computer illustration"
            className="w-[80%]"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.2px] text-center">
            Switch to Desktop
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-[14px] font-normal leading-6 tracking-[0.21px]">
          We've sent an email with instructions about the interview. Kindly
          continue from your desktop to complete the interview.
        </DialogDescription>
        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-[#001630] hover:bg-[#001630]/90 text-white"
          >
            OK, I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
