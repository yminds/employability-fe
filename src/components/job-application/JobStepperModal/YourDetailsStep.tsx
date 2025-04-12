import type React from "react";
import { ActivelySeekingJobsSVG } from "../SVG/ActivelySeekingJobsSVG";
import PdfFile from "@/assets/job-posting/pdfFile.svg";
import { useState, useEffect } from "react";
import { s3Upload } from "@/utils/s3Service";
import Upload from "@/assets/job-posting/upload.svg";

interface UserData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  resumeName?: string;
  profileImage?: string;
  resume_s3_url?: string;
  userId?: string;
  currentStatus?: string;
}

interface YourDetailsStepProps {
  userData: UserData;
  onUpdateResume?: (resumeData: { name: string; url: string }) => void;
  validationError?: boolean;
  clearValidationError?: () => void;
}

export default function YourDetailsStep({
  userData,
  onUpdateResume,
  validationError = false,
  clearValidationError = () => {},
}: YourDetailsStepProps) {
  const createUserFriendlyResumeName = (userName: string): string => {
    if (!userName) return "Resume.pdf";

    const firstName = userName.split(" ")[0];
    return `${firstName}'s Resume.pdf`;
  };

  const [resume, setResume] = useState({
    name:
      userData.resumeName ||
      (userData.resume_s3_url
        ? createUserFriendlyResumeName(userData.name)
        : "No resume uploaded"),
    url: userData.resume_s3_url || "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setResume({
      name:
        userData.resumeName ||
        (userData.resume_s3_url
          ? createUserFriendlyResumeName(userData.name)
          : "No resume uploaded"),
      url: userData.resume_s3_url || "",
    });
  }, [userData.resumeName, userData.resume_s3_url, userData.name]);

  useEffect(() => {
    if (onUpdateResume && resume.url) {
      onUpdateResume(resume);
    }
  }, [resume, onUpdateResume]);

  useEffect(() => {
    if (resume.url && validationError && clearValidationError) {
      clearValidationError();
    }
  }, [resume.url, validationError, clearValidationError]);

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validationError && clearValidationError) {
      clearValidationError();
    }

    setResume({
      name: file.name,
      url: "",
    });

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", userData.userId || "");
      formData.append("folder", "resume");
      formData.append("name", file.name);

      const response = await s3Upload(formData, setUploadProgress);

      if (response.data && response.data?.[0].fileUrl) {
        const updatedResume = {
          name: file.name,
          url: response.data?.[0].fileUrl,
        };
        setResume(updatedResume);

        if (onUpdateResume) {
          onUpdateResume(updatedResume);
        }
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUploadError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResume = () => {
    if (resume.url) {
      window.open(resume.url, "_blank");
    }
  };

  const isActivelySeekingJobs =
    userData.currentStatus === "Actively seeking jobs";

  return (
    <div className="space-y-8">
      {/* User Profile */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="relative w-[95px] h-[95px] rounded-full overflow-hidden">
            {userData.profileImage ? (
              <img
                src={userData.profileImage || "/placeholder.svg"}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#E5E7EB] text-[#374151] text-[32px] font-semibold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : ""}
              </div>
            )}
            {isActivelySeekingJobs && ActivelySeekingJobsSVG}
          </div>
        </div>
        <div>
          <h3 className="text-sub-header text-[#202326]">{userData.name}</h3>
          <p className="text-[14px] font-medium leading-6 tracking-[0.07px] text-[#414447]">
            {userData.title}
          </p>
          {userData.location && (
            <p className="text-[14px] font-normal leading-6 tracking-[0.07px] text-[#68696B]">
              {userData.location}
            </p>
          )}
        </div>
      </div>

      {/* Resume Section */}
      <div className="flex flex-col">
        {!isUploading && resume.url ? (
          // Show resume details when a resume exists and not uploading
          <div className="flex items-center justify-between bg-[#F2F3F5] p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded">
                <img
                  src={PdfFile || "/placeholder.svg"}
                  alt="Pdf"
                  className="w-5 h-5"
                />
              </div>
              <div>
                <h3 className="text-sm text-body2 text-gray-800">
                  {resume.name}
                </h3>
                <button
                  onClick={handleViewResume}
                  className="text-xs text-[#10B754] hover:underline"
                >
                  View Resume
                </button>
              </div>
            </div>
            <label className="text-[#001630] text-sm text-body2 font-medium cursor-pointer hover:underline">
              Change Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
              />
            </label>
          </div>
        ) : isUploading ? (
          <div className="bg-[#f5f5f5] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 rounded">
                <img
                  src={PdfFile || "/placeholder.svg"}
                  alt="Pdf"
                  className="w-5 h-5"
                />
              </div>
              <div>
                <h3 className="text-sm text-body2 text-gray-800">
                  {resume.name}
                </h3>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex-grow">
                <div className="w-full bg-[#e0e0e0] rounded-full h-[6px]">
                  <div
                    className="bg-[#10B754] h-[6px] rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-3 text-sm font-ubuntu text-[#202326]">
                {uploadProgress}%
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-medium text-[#202326]">Resume</h3>
            </div>
            <div className="flex">
              <label
                className={`flex items-center justify-center gap-2 py-3 px-6 border ${
                  validationError ? "border-red-500" : "border-[#001630]"
                } rounded-md cursor-pointer hover:bg-gray-50 transition-colors`}
              >
                <img src={Upload || "/placeholder.svg"} alt="Upload" />
                <span className="text-[#001630] text-body2">
                  Upload your resume
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeChange}
                />
              </label>
            </div>
            {validationError && (
              <div className="mt-2 p-2 rounded-lg text-sm text-body2 text-red-500">
                Please upload your resume to continue.
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="mt-2 p-2 bg-[#F2F3F5] rounded-lg text-xs text-red-500">
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
}
