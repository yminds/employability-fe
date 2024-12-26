// src/components/modals/AddEditEducationModal.tsx

import React, { useState, useEffect } from "react";
import EducationForm from "../forms/education-form"; // Adjust the path as necessary
import { Education } from "./../../features/profile/types"; // Define the Education type accordingly

interface AddEditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEducation: Education[];
  onSave: (education: Education[]) => void;
}

const AddEditEducationModal: React.FC<AddEditEducationModalProps> = ({
  isOpen,
  onClose,
  initialEducation,
  onSave,
}) => {
  const [education, setEducation] = useState<Education[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setEducation(initialEducation);
      setErrors({});
    }
  }, [isOpen, initialEducation]);

  const handleFormChange = (updatedEducation: Education[]) => {
    setEducation(updatedEducation);
    // Optionally, you can add validation logic here and update the 'errors' state
  };

  const handleSave = () => {
    // Optionally, perform additional validation here
    onSave(education);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden "
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-8 overflow-auto h-[80vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold">
            {initialEducation.length > 0
              ? "Edit Education Details"
              : "Add Education Details"}
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

        {/* Body */}
        <div>
          <EducationForm
            education={education}
            onChange={handleFormChange}
            errors={errors}
          />
        </div>

        <div className="p-6 border-t bg-white text-right justify-end ">
          <button
            onClick={handleSave}
            className=" bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditEducationModal;
