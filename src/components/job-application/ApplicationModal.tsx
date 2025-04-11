import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckCircle from "@/assets/job-posting/checkcircle.svg";
import Apply from "@/assets/job-posting/apply.svg";
import { useState } from "react";
import ResumeUploadModal from "./ResumeUploadModal";
import { useNavigate } from "react-router-dom";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobId?: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  companyName,
  jobId,
}: ApplicationModalProps) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleResumeUpload = (file: File) => {
    console.log("Resume uploaded:", file.name);
    // Handle the resume upload logic here
  };

  const handleSignupClick = () => {
    const callbackUrl = window.location.href;
    if (jobId) {
      localStorage.setItem("employability_job_id", jobId);
    }
    const encodedCallback = encodeURIComponent(callbackUrl);
    navigate(`/jobs`);
    onClose();
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-[650px] p-0 gap-0 rounded-lg">
          <DialogHeader className="p-6 pb-0 gap-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-h2 text-[#000000]">
                Apply For {companyName}
              </DialogTitle>
            </div>

            <div className="flex items-center border-b pb-6 gap-4">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                  <img
                    src={CheckCircle}
                    alt="Check Circle"
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-[#10b754] font-medium">Your Details</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border border-[#d9d9d9] flex items-center justify-center mr-2">
                  <span className="text-[#b3b3b3]">2</span>
                </div>
                <span className="text-[#b3b3b3]">Application Questions</span>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div className="bg-gradient-to-r from-[#FCFCFC] to-[#D9FFED] border rounded-lg  mb-8">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h2 className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.2px] text-[#1c1b1f] mb-6">
                    Join Employability, Get Ahead
                  </h2>
                  <ul className="space-y-4 text-[#1c1b1f] text-body2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Build Your Profile</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Take AI-Driven Interviews,</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Get Verified,</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Stand Out to Employers.</span>
                    </li>
                  </ul>

                  <Button
                    className="mt-6 border border-[#000000] bg-white text-[#000000] text-button hover:bg-gray-50 px-8 py-2 h-auto"
                    onClick={handleSignupClick}
                  >
                    Signup & Apply
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-full mt-8 relative">
                    <img
                      src={Apply || "/placeholder.svg"}
                      alt="Verification illustration"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mb-5">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="px-4 text-[#666666] text-sm text-body2">
                Or Apply by uploading resume
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="link"
                className="text-[#001630] font-medium hover:text-[#001630]/90 underline text-body2"
                onClick={() => setIsResumeModalOpen(true)}
              >
                Upload Resume & Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onUpload={handleResumeUpload}
      />
    </>
  );
}
