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
  const [isSaving, setIsSaving] = useState(false);
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
      setIsSaving(false); // Reset saving state
    }
  }, [isOpen, initialEducation]);
  const handleFormChange = (updatedEducation: Education[]) => {
    setEducation(updatedEducation);
  };

  const handleAddEducation = async (newEducation: Education) => {
    // Update the local state first to show the new form immediately
    setEducation((prevEducation) => [...prevEducation, newEducation]);

    // Optional: If you want to save to API immediately
    try {
      const result = await addEducation({
        ...newEducation,
        user_id: user._id,
      }).unwrap();

      // Update the education array with the returned data from API
      setEducation((prevEducation) =>
        prevEducation.map((edu) =>
          edu._id === newEducation._id ? result : edu
        )
      );
    } catch (err) {
      console.error("Failed to save new education entry:", err);
      // Optionally show error message
      setErrors((prev) => ({
        ...prev,
        addEducation: "Failed to add education entry",
      }));
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
      setIsSaving(true);
      console.log("Starting save process with education:", education);

      const updatedEducations = await Promise.all(
        education.map(async (edu) => {
          if (edu._id) {
            console.log("Updating existing education:", edu);
            const result = await updateEducation({
              id: edu._id,
              updatedEducation: edu,
            }).unwrap();
            console.log("Update result:", result);
            return result;
          } else {
            console.log("Adding new education:", edu);
            const result = await addEducation({
              ...edu,
              user_id: user._id,
            }).unwrap();
            console.log("Add result:", result);
            return result;
          }
        })
      );

      console.log("All educations saved:", updatedEducations);
      onSave(updatedEducations);
      onClose();
    } catch (error) {
      console.error("Failed to save education:", error);
      setErrors({ ...errors, saveEducation: "Failed to save education" });
    } finally {
      setIsSaving(false);
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
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEducationModal;
