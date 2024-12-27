


import React, { useState, useEffect } from "react";
import EducationForm from "../forms/education-form";
import { Education } from "./../../features/profile/types";
import {
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useAddEducationMutation,
} from "../../api/educationSlice";
import { useSelector } from "react-redux";

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
  const user = useSelector((state: any) => state.auth.user);

  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();
  const [deleteEducation, { isLoading: isDeleting }] =
    useDeleteEducationMutation();
  const [addEducation, { isLoading: isAdding }] = useAddEducationMutation();

  useEffect(() => {
    if (isOpen) {
      setEducation(initialEducation);
      setErrors({});
    }
  }, [isOpen, initialEducation]);

  const handleFormChange = (updatedEducation: Education[]) => {
    setEducation(updatedEducation);
  };

  const handleAddEducation = async () => {
    try {
      const savePromises = education.map(async (edu) => {
        if (edu._id) {
          return await updateEducation({
            id: edu._id,
            updatedEducation: edu,
          }).unwrap();
        } else {
          return await addEducation({
            ...edu,
            user_id: user._id,
          }).unwrap();
        }
      });

      await Promise.all(savePromises);
      alert("All education entries saved successfully!");
    } catch (err) {
      console.error("Failed to save education entries:", err);
      alert("An error occurred while saving education entries.");
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      await deleteEducation(educationId).unwrap();
      setEducation(education.filter((edu) => edu._id !== educationId));
    } catch (error) {
      console.error("Failed to delete education:", error);
      setErrors({ ...errors, deleteEducation: "Failed to delete education" });
    }
  };

  const handleSave = async () => {
    try {
      const updatedEducations = await Promise.all(
        education.map(async (edu) => {
          if (edu._id) {
            const result = await updateEducation({
              id: edu._id,
              updatedEducation: edu,
            }).unwrap();
            return result;
          } else {
            const result = await addEducation({
              id: user._id,
              newEducation: edu,
            }).unwrap();
            return result;
          }
        })
      );
      onSave(updatedEducations);
      onClose();
    } catch (error) {
      console.error("Failed to save education:", error);
      setErrors({ ...errors, saveEducation: "Failed to save education" });
    }
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
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 flex flex-col h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 px-10 py-4 border-b mt-4 mb-4  border-gray-200 ">
          <div className="flex justify-between items-center">
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
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-8 py-4">
          <EducationForm
            education={education}
            onChange={handleFormChange}
            errors={errors}
            onAddEducation={handleAddEducation}
            onDeleteEducation={handleDeleteEducation}
          />

          {errors.saveEducation && (
            <p className="text-red-500 text-sm mt-2">{errors.saveEducation}</p>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              disabled={isUpdating || isAdding || isDeleting}
            >
              {isUpdating || isAdding || isDeleting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEducationModal;

