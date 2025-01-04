"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Github, GlobeLock } from "lucide-react";
import FileUploadArea from "../FileUploadArea";
import FileList from "../FileList";

interface UploadLinksStepProps {
  images: File[];
  setImages: (images: File[]) => void;
  codeFiles: File[];
  setCodeFiles: (files: File[]) => void;
  github: string;
  setGithub: (value: string) => void;
  liveLink: string;
  setLiveLink: (value: string) => void;
  coverImage: File | null;
  setCoverImage: (image: File | null) => void;
}

const UploadLinksStep: React.FC<UploadLinksStepProps> = ({
  images,
  setImages,
  codeFiles,
  setCodeFiles,
  github,
  setGithub,
  liveLink,
  setLiveLink,
  coverImage,
  setCoverImage,
}) => {
  return (
    <div className="space-y-6">
      {/* Images & PDFs */}
      <div>
        <Label>Images & PDFs</Label>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Upload Area */}
            <div className="flex-1">
              <FileUploadArea
                id="imagesInput"
                onFilesSelected={(files) => {
                  if (files) {
                    setImages([...images, ...Array.from(files)]);
                  }
                }}
                label="Drag and drop your files"
                accept=".png,.jpg,.jpeg,.pdf"
              />
            </div>
            {/* File List */}
            <div className="flex-1">
              <FileList
                files={images}
                onRemove={(index) => {
                  const updatedImages = [...images];
                  updatedImages.splice(index, 1);
                  setImages(updatedImages);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Code Files */}
      <div>
        <Label>Code Files</Label>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Upload Area */}
            <div className="flex-1">
              <FileUploadArea
                id="codeFilesInput"
                onFilesSelected={(files) => {
                  if (files) {
                    setCodeFiles([...codeFiles, ...Array.from(files)]);
                  }
                }}
                label="Drag and drop your files"
                accept=".zip,.rar,.tar,.gz,.7z"
              />
            </div>
            {/* File List */}
            <div className="flex-1">
              <FileList
                files={codeFiles}
                onRemove={(index) => {
                  const updatedCodeFiles = [...codeFiles];
                  updatedCodeFiles.splice(index, 1);
                  setCodeFiles(updatedCodeFiles);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Links */}
      <div>
        <Label>Project Links</Label>
        <div className="space-y-4">
          {/* GitHub Link Input */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
            <Github className="h-5 w-5 text-gray-400" />
            <Input
              type="url"
              placeholder="Paste GitHub link"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              required
            />
          </div>
          {/* Live Link Input */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
            <GlobeLock className="h-5 w-5 text-gray-400" />
            <Input
              type="url"
              placeholder="Live Link"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <Label>Upload a Cover Image</Label>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-green-500 transition-colors relative">
            <input
              type="file"
              id="coverImageInput"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="coverImageInput"
              className="flex flex-col items-center justify-center h-full w-full"
            >
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
                  d="M7 16V4m0 0l3 3m-3-3l3-3m6 14v-4m0 0l-3 3m3-3l-3-3"
                />
              </svg>
              <span className="text-sm text-gray-600 mb-1">
                Drag and drop your image
              </span>
              <span className="text-sm text-green-500">Select from files</span>
            </label>
          </div>
          {coverImage && (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">{coverImage.name}</p>
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
          {coverImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadLinksStep;
