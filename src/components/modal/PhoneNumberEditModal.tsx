import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import { PhoneInput } from "../cards/phoneInput/PhoneInput";

interface PhoneEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhoneNumber: string;
  userId: string;
  onPhoneNumberUpdated: (newPhoneNumber: string) => void;
}

export function PhoneEditDialog({
  isOpen,
  onOpenChange,
  currentPhoneNumber,
  userId,
  onPhoneNumberUpdated,
}: PhoneEditDialogProps) {
  const [updateUser] = useUpdateUserMutation();
  const [newPhoneNumber, setNewPhoneNumber] = useState(currentPhoneNumber);

  const handlePhoneNumberUpdate = async () => {
    try {
      await updateUser({
        userId,
        data: {
          phone_number: newPhoneNumber,
        },
      }).unwrap();

      onPhoneNumberUpdated(newPhoneNumber);
      onOpenChange(false);
      toast.success("Phone number updated successfully");
    } catch (error) {
      toast.error("Failed to update phone number");
      console.error("Error updating phone number:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg p-8">
        <DialogHeader className="text-left text-sub-header">
          <DialogTitle>
            {currentPhoneNumber ? "Edit Phone Number" : "Add Phone Number"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <PhoneInput
                id="phone"
                value={newPhoneNumber}
                onChange={(value) => setNewPhoneNumber(value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#00183D] hover:bg-[#062549] text-body2 text-white transition-colors"
            onClick={handlePhoneNumberUpdate}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
