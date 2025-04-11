"use client";
import type React from "react";
import { ActivelySeekingJobsSVG } from "../SVG/ActivelySeekingJobsSVG";
import PdfFile from "@/assets/job-posting/pdfFile.svg";
import { useState, useEffect } from "react";
import { s3Upload } from "@/utils/s3Service";
import { Loader2 } from "lucide-react";

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
  userId?: string; // Add userId to the interface
}

interface YourDetailsStepProps {
  userData: UserData;
  onUpdateResume?: (resumeData: {
    name: string;
    url: string;
  }) => void;
}

export default function YourDetailsStep({
  userData,
  onUpdateResume,
}: YourDetailsStepProps) {
  // Create a user-friendly resume name using the user's name
  const createUserFriendlyResumeName = (userName: string): string => {
    if (!userName) return "Resume.pdf";

    // Get the first name if there are multiple names
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

  // State for tracking upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Update resume state when userData changes
  useEffect(() => {
    setResume({
      name:
        userData.resumeName ||
        (userData.resume_s3_url
          ? createUserFriendlyResumeName(userData.name)
          : "No resume uploaded"),
      url: userData.resume_s3_url || "",
    });
  }, [
    userData.resumeName,
    userData.resume_s3_url,
    userData.name,
  ]);

  // Update parent component when resume changes
  useEffect(() => {
    if (onUpdateResume && resume.url) {
      onUpdateResume(resume);
    }
  }, [resume, onUpdateResume]);

  // Update the handleResumeChange function to use the provided userId
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update UI immediately with local file info
    setResume({
      name: file.name,
      url: "", // Clear the URL until upload completes
    });

    // Prepare for upload
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", userData.userId || "");
      formData.append("folder", "resume");
      formData.append("name", file.name);

      // Upload to S3
      const response = await s3Upload(formData, setUploadProgress);

      // Update resume with S3 URL
      if (response.data && response.data?.[0].fileUrl) {
        const updatedResume = {
          name: file.name,
          url: response.data?.[0].fileUrl,
        };
        setResume(updatedResume);

        // Notify parent component about the update
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

  return (
    <div className="space-y-8">
      {/* User Profile */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="relative w-[95px] h-[95px] rounded-full overflow-hidden">
            <img
              src={userData.profileImage || "/placeholder.svg"}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
            {ActivelySeekingJobsSVG}
          </div>
        </div>
        <div>
          <h3 className="text-sub-header text-[#202326]">{userData.name}</h3>
          <p className="text-[14px] font-medium leading-6 tracking-[0.07px] text-[#414447]">
            {userData.title}
          </p>
          <p className="text-[14px] font-normal leading-6 tracking-[0.07px] text-[#68696B]">
            {userData.location}
          </p>
        </div>
      </div>

      {/* Resume Section */}
      <div className="flex flex-col bg-[#F2F3F5] p-4 rounded-lg">
        <div className="flex items-center justify-between">
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
              {resume.url && !isUploading && (
                <button
                  onClick={handleViewResume}
                  className="text-xs text-[#10B754] hover:underline"
                >
                  View Resume
                </button>
              )}
            </div>
          </div>
          <label
            className={`text-[#001630] text-sm text-body2 font-medium cursor-pointer hover:underline ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isUploading ? "Uploading..." : "Change Resume"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeChange}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#10B754]" />
              <span className="text-xs text-gray-600">
                Uploading: {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-[#10B754] h-1.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="mt-2 text-xs text-red-500">{uploadError}</div>
        )}
      </div>
    </div>
  );
}
