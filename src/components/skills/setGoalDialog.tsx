// GoalDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Ensure correct import path
import { Button } from "@/components/ui/button"; // Ensure Button component is correctly imported

import SetGoalCard from "@/features/dashboard/SetGoalCard"; // Ensure SetGoalCard is correctly imported
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface GoalDialogProps {
  isOpen: boolean; // To control dialog visibility
  onClose: () => void; // Function to close the dialog
}

const GoalDialog: React.FC<GoalDialogProps> = ({ isOpen, onClose }) => {
  const experience_level = useSelector(
    (state: RootState) => state.auth?.user?.experience_level
  );

  const [journeyDialog, setJourneyDialog] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose(); // Notify parent to close the dialog
          setJourneyDialog(false); // Reset internal state
        }
      }}
    >
      <DialogContent
        className={`flex flex-col justify-center items-start rounded-[12px] outline-none ${
          journeyDialog
            ? "max-w-[1400px]" // Example style for journeyDialog
            : "bg-white max-w-[513px] h-[252px] p-[42px] gap-y-[40px]" // Example style for initial dialog
        }`}
      >
        {/* Close Button */}
        <DialogClose asChild></DialogClose>

        {/* Conditional Content */}
        {!journeyDialog ? (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-medium text-black">
                Start with a goal
              </DialogTitle>
              <DialogDescription className="mt-2 text-base text-black opacity-60">
                We encourage users to set a goal and work towards it gradually,
                ensuring focus, motivation, and consistent progress.
              </DialogDescription>
            </DialogHeader>
            {/* Action Button */}
            <div className="flex w-full justify-center">
              <Button
                onClick={() => setJourneyDialog(true)}
                className="w-full bg-[#00183D] text-white py-2 rounded-md hover:bg-[#062549]"
              >
                Set your goal
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-[#1A1A1A]">
                Set Your Goal
              </DialogTitle>
            </DialogHeader>
            <hr className="w-full border-gray-300 my-4" />
            <SetGoalCard
              setJourneyDialog={setJourneyDialog}
              selectedLevel={
                experience_level === "entry"
                  ? "1"
                  : experience_level === "mid"
                  ? "2"
                  : experience_level === "senior"
                  ? "3"
                  : "all"
              }
              onGoalUpdate={onClose}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
