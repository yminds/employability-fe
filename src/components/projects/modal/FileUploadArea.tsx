import React, { ReactNode } from "react";

interface FileUploadAreaProps {
  id: string;
  onFilesSelected: (files: FileList | null) => void;
  label: string;
  accept?: string;
  children?: ReactNode;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  id,
  onFilesSelected,
  label,
  accept,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-green-500 transition-colors relative">
      <input
        type="file"
        id={id}
        multiple
        accept={accept}
        onChange={(e) => onFilesSelected(e.target.files)}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center h-full w-full"
      >
        {children || (
          <svg
            className="w-12 h-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5L12 19M12 5L19 12M12 5L5 12"
            />
          </svg>
        )}
        <span className="text-sm text-gray-600 mb-1">{label}</span>
        <span className="text-sm text-green-500">Select from files</span>
      </label>
    </div>
  );
};

export default FileUploadArea;