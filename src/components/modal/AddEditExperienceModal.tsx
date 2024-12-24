import React, { useState, useEffect } from "react";
import ExperienceForm from "../forms/experience-form"; // Adjust the path as necessary
import type { ExperienceItem } from "@/features/profile/types";

interface AddEditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExperience: ExperienceItem[];
  onSave: (experience: ExperienceItem[]) => void;
}

const AddEditExperienceModal: React.FC<AddEditExperienceModalProps> = ({
  isOpen,
  onClose,
  initialExperience,
  onSave,
}) => {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setExperience(initialExperience);
      setErrors({});
    }
  }, [isOpen, initialExperience]);

  const handleFormChange = (updatedExperience: ExperienceItem[]) => {
    setExperience(updatedExperience);
  };

  const handleSave = () => {
 
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-8 overflow-auto h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold">
            {initialExperience.length > 0
              ? "Edit Experience Details"
              : "Add Experience Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ExperienceForm
          experiences={experience}
          onChange={handleFormChange}
          errors={errors}
        />

        <div className="p-6 border-t bg-white text-right">
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditExperienceModal;
