import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

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
    if (charCount <= 250) {
      onSave(bio);
      onClose();
    }
  };

  const isValidLength = charCount <= 250;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[579px] p-0 rounded-xl bg-[#FFFFFF]">
        <div className="flex flex-col justify-center items-start gap-10 p-[42px]">
          <DialogHeader className="flex flex-col items-start gap-1 flex-1 self-stretch w-full p-0">
            <div className="flex flex-col items-start gap-1 w-full">
              <DialogTitle className="text-[#000000] font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.2px]">
                Edit Bio
              </DialogTitle>
              <p className="text-[rgba(0,0,0,0.60)] font-sf-pro text-sm font-normal leading-6 tracking-[0.24px]">
                Enter your goal and tailor your learning path.
              </p>
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
                  charCount > 250 ? "text-red-500" : "text-[#6a6a6a]"
                }`}
              >
                {charCount}/250 characters
              </span>
            </div>
            <Button
              onClick={handleSave}
              disabled={!isValidLength}
              className="flex h-11 px-8 justify-center items-center gap-2 self-stretch bg-[#00183d] text-white hover:bg-[#00183d]/90 rounded text-base font-medium w-full disabled:opacity-50"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
