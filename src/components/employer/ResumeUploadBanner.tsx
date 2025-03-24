import React from "react";
import UploadResumeImage from "@/assets/employer/UploadResumeImage.svg";

interface ResumeUploadBannerProps {
  onClick: () => void;
}

const ResumeUploadBanner: React.FC<ResumeUploadBannerProps> = ({ onClick }) => {
  return (
    <div
      className="w-full max-w-lg rounded-lg bg-gradient-to-r from-[#f1f0f7] to-[#d8d4f2] cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="flex">
        {/* Text content */}
        <div className="flex-1 p-8 space-y-3">
          <h2 className="flex items-center text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.3px] text-[#333333]">
            Upload Resumes <span className="ml-2">→</span>
          </h2>
          <p className="text-[#414447] text-body2">
            Import files—our AI will highlight top matches for your job.
          </p>
        </div>

        {/* Image container - prioritizing height */}
        <div className="flex items-center justify-center">
          <img
            src={UploadResumeImage || "/placeholder.svg"}
            alt="Upload resumes illustration"
            className="h-full max-h-full object-contain"
            style={{ maxWidth: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadBanner;
