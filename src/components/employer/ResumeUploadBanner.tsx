import React from "react";
import uploadResume from "../../assets/employer/uploadResume.svg";

interface ResumeUploadBannerProps {
  onClick: () => void;
}

const ResumeUploadBanner: React.FC<ResumeUploadBannerProps> = ({ onClick }) => {
  return (
    <div
      className="bg-white rounded-lg border mb-5 cursor-pointer"
      onClick={onClick}
    >
      <img src={uploadResume} alt="Upload Resumes" />
    </div>
  );
};

export default ResumeUploadBanner;