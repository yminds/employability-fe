
import React from "react";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove }) => {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      {files.length === 0 && (
        <p className="text-sm text-gray-500">No files uploaded</p>
      )}
    </div>
  );
};

export default FileList;
