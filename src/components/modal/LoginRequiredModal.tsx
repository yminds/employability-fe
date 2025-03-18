"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/employer/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Employer Login Required
          </DialogTitle>
          <DialogDescription>
            Only employers can contact this user.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <LogIn className="h-10 w-10 text-slate-600" />
          </div>
          <p className="text-center text-muted-foreground">
            Please log in to the employer portal to view contact information and
            connect with this user. Only employers have access to contact
            details.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#001630] text-white hover:bg-[#002a54] transition-colors duration-200 ease-in-out"
            onClick={handleLogin}
          >
            Go to Employer Portal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredModal;
