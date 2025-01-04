"use client";

import React from "react";
import { Github, GlobeLock } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface ReviewStepProps {
  formData: {
    projectName: string;
    description: string;
    skills: Skill[];
    images: File[];
    codeFiles: File[];
    github: string;
    liveLink: string;
    coverImage: File | null;
  };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Project Details</h3>
        <p className="text-sm text-gray-700">
          <strong>Project Name:</strong> {formData.projectName}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Description:</strong> {formData.description}
        </p>
      </div>

      {/* Skills */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill._id}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Project Links</h3>
        {formData.github && (
          <div className="flex items-center space-x-2 mb-2">
            <Github className="h-5 w-5 text-gray-500" />
            <a
              href={formData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {formData.github}
            </a>
          </div>
        )}
        {formData.liveLink && (
          <div className="flex items-center space-x-2">
            <GlobeLock className="h-5 w-5 text-gray-500" />
            <a
              href={formData.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {formData.liveLink}
            </a>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {formData.coverImage && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Cover Image</h3>
          <p className="text-sm text-gray-700">{formData.coverImage.name}</p>
          <img
            src={URL.createObjectURL(formData.coverImage)}
            alt="Cover"
            className="mt-2 w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Images & PDFs */}
      {formData.images.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Images & PDFs</h3>
          <ul className="list-disc list-inside">
            {formData.images.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Files */}
      {formData.codeFiles.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Code Files</h3>
          <ul className="list-disc list-inside">
            {formData.codeFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
