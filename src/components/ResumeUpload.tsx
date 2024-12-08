// components/ResumeUpload.tsx
import React from "react";

interface ResumeUploadProps {
  uploading: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  uploading,
  error,
  onFileChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">
        Upload Your Resume
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onFileChange}
        className="w-full border border-gray-300 rounded p-2"
      />
      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
