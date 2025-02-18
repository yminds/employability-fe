import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationDialog: React.FC<LogoutConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl bg-white border border-gray-200">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <LogOut className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center text-h1 text-gray-900 mt-4">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-center mt-2 text-sub-header text-gray-500">
            Are you sure you want to log out? This action will end your current
            session.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 sm:mt-6">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="destructive"
              className="flex-1 bg-[#00183d] text-white hover:bg-[#00183d]/90"
            >
              Logout
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmationDialog;
