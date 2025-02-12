import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import pdfIcon from "@/assets/profile/pdfIcon.svg";

interface ResumeUploadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => Promise<void>;
  fileName: string;
  fileSize: string;
  uploadProgress: number;
  isUploading: boolean;
  onRemove: () => Promise<void>;
  uploadType: "resume" | "linkedin";
}

export default function ResumeUploadProgressModal({
  isOpen,
  onClose,
  onContinue,
  fileName,
  fileSize,
  uploadProgress,
  isUploading,
  onRemove,
  uploadType,
}: ResumeUploadProgressModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    await onRemove();
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await onContinue();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg max-w-2xl p-[42px] flex flex-col justify-center">
        <DialogHeader className="w-full flex justify-between items-start">
          <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu mb-6">
            {uploadType === "resume"
              ? "Upload your Resume"
              : "Upload your LinkedIn Profile"}
          </DialogTitle>
        </DialogHeader>

        {/* Upload Progress Container */}
        <div className="bg-[#F0F5F3] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* PDF Icon */}
              <div className="w-10 h-10 bg-[#fff] rounded flex items-center justify-center">
                <img src={pdfIcon} alt="" />
              </div>
              {/* File Details */}
              <div>
                <p className="font-medium text-md text-[#0C0F12] leading-[24px] tracking-[0.24px]">
                  {fileName}
                </p>
                <p className="text-sm text-[#909091]">{fileSize}</p>
              </div>
            </div>
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/* Progress Bar and Percentage Container */}
          <div className="flex items-center gap-4">
            {/* Progress Bar */}
            <div className="flex-1 bg-[#D6D7D9] rounded-full h-1">
              <div
                className="bg-[#2EE578] h-1 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            {/* Progress Percentage */}
            <span className="text-[#414447] font-ubuntu text-sm font-medium">
              {uploadProgress}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <Button
            className="h-[44px] flex justify-center items-center gap-2 px-8 py-4 
            bg-[#062549] text-white font-medium rounded-[4px] 
            hover:bg-[#083264] transition-colors duration-200 ease-in-out"
            style={{
              boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
            }}
            onClick={handleContinue}
            disabled={isUploading || uploadProgress < 100 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
