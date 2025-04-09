import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EditBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bio: string) => void;
  currentBio: string;
}

export default function EditBioModal({
  isOpen,
  onClose,
  onSave,
  currentBio,
}: EditBioModalProps) {
  const [bio, setBio] = useState(currentBio);
  const [charCount, setCharCount] = useState(currentBio.length);

  useEffect(() => {
    setBio(currentBio);
    setCharCount(currentBio.length);
  }, [currentBio]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    setCharCount(newBio.length);
  };

  const handleSave = () => {
    if (charCount <= 300) {
      onSave(bio);
      onClose();
    }
  };

  const isValidLength = charCount <= 300;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[579px] p-0 rounded-lg bg-[#FFFFFF]">
        <div className="flex flex-col justify-center items-start gap-7 p-[42px]">
          <DialogHeader className="flex flex-col items-start gap-1 flex-1 self-stretch w-full p-0">
            <div className="flex flex-col items-start gap-1 w-full">
              <DialogTitle className="text-[#000000] text-sub-header">
                Edit Bio
              </DialogTitle>
              <DialogDescription className="text-left text-sm text-[rgba(0,0,0,0.60)] ">
                Make your bio stand out.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="w-full">
            <Textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Enter here"
              className="min-h-[200px] resize-none border rounded-lg p-4 w-full mb-2"
            />
            <div className="flex justify-end mb-4">
              <span
                className={`text-sm ${
                  charCount > 300 ? "text-red-500" : "text-[#6a6a6a]"
                }`}
              >
                {charCount}/300 characters
              </span>
            </div>
            <DialogFooter className="flex flex-row justify-end gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-body2 hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValidLength}
                className="bg-[#00183D] hover:bg-[#062549] text-body2 text-white transition-colors"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
