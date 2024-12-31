import React, { useState, useEffect } from "react";
import ExperienceForm from "../forms/experience-form";
import type { ExperienceItem } from "@/features/profile/types";
import { useSelector } from "react-redux";
import {
  useAddExperienceMutation,
  useUpdateExperienceMutation,
} from "@/api/experienceApiSlice";

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
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (isOpen) {
      setExperience(initialExperience);
      setErrors({});
    }
  }, [isOpen, initialExperience]);

  const handleFormChange = (updatedExperience: ExperienceItem[]) => {
    setExperience(updatedExperience);
  };

  const validateExperience = (exp: ExperienceItem) => {
    const newErrors: { [key: string]: string } = {};

    if (!exp.jobTitle) newErrors["jobTitle"] = "Job title is required";
    if (!exp.employmentType)
      newErrors["employmentType"] = "Employment type is required";
    if (!exp.companyName) newErrors["companyName"] = "Company name is required";
    if (!exp.location) newErrors["location"] = "Location is required";
    if (!exp.startDate) newErrors["startDate"] = "Start date is required";
    if (!exp.currentlyWorking && !exp.endDate) {
      newErrors["endDate"] = "End date is required when not currently working";
    }
    if (!exp.description) newErrors["description"] = "Description is required";

    return newErrors;
  };

  const handleSave = async () => {
    try {
      // const validationErrors = experience.reduce((acc, exp, index) => {
      //   const errors = validateExperience(exp);
      //   if (Object.keys(errors).length > 0) {
      //     Object.keys(errors).forEach((key) => {
      //       acc[`experience.${index}.${key}`] = errors[key];
      //     });
      //   }
      //   return acc;
      // }, {} as { [key: string]: string });

      // if (Object.keys(validationErrors).length > 0) {
      //   setErrors(validationErrors);
      //   return;
      // }

      // Map the experience data first
      const experienceData = experience.map((exp) => ({
        user_id: user._id,
        title: exp.jobTitle,
        employment_type: exp.employmentType,
        company: exp.companyName,
        location: exp.location,
        start_date: exp.startDate,
        end_date: exp.currentlyWorking ? null : exp.endDate,
        currently_working: exp.currentlyWorking,
        description: exp.description,
      }));

      // Separate experiences into existing and new
      const existingExperiences = experience.filter((exp) => exp.id);
      const newExperiences = experience.filter((exp) => !exp.id);

      // Update existing experiences
      if (existingExperiences.length > 0) {
        console.log("Updating experiences:", existingExperiences);
        await Promise.all(
          existingExperiences.map((exp, index) =>
            updateExperience({
              id: exp.id!,
              updatedExperience: experienceData[index],
            }).unwrap()
          )
        );
      }

      // Add new experiences
      if (newExperiences.length > 0) {
        console.log("Adding new experiences:", newExperiences);
        await Promise.all(
          newExperiences.map((exp, index) =>
            addExperience(
              experienceData[existingExperiences.length + index]
            ).unwrap()
          )
        );
      }

      // Call onSave with the updated experiences
      onSave(experience);
      onClose();
    } catch (error) {
      console.error("Failed to save experiences:", error);
      alert("Failed to save experiences. Please try again.");
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

        <div className="mt-6 border-t pt-6 bg-white text-right">
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditExperienceModal;
