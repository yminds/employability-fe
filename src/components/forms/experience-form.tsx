import React, { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import type { ExperienceItem } from "@/features/profile/types";
import {
  useDeleteExperienceMutation,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
} from "@/api/experienceApiSlice";
import { useSelector } from "react-redux";
interface ExperienceFormProps {
  experiences: ExperienceItem[];
  onChange: (experiences: ExperienceItem[]) => void;
  errors?: { [key: string]: string };
  onDeleteExperience?: (id: string) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences = [],
  onChange,
  errors = {},
  onDeleteExperience,
}) => {
  const [isFresher, setIsFresher] = useState(false);
  const [deleteExperience] = useDeleteExperienceMutation();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const user = useSelector((state: any) => state.auth.user);

  console.log(user);

  // const [deleteExperience] = useDeleteExperienceMutation;

  useEffect(() => {
    if (experiences && experiences.length === 0 && !isFresher) {
      handleAddExperience();
    }
  }, [experiences, isFresher]);

  const handleAddExperience = () => {
    const newExperience: ExperienceItem = {
      // id: Date.now().toString(),
      jobTitle: "",
      employmentType: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: null,
      company: "",
      jobType: undefined,
      isVerified: undefined,
      duration: undefined,
      companyLogo: "",
      currentlyWorking: false,
      currentCTC: "",
      expectedCTC: "",
      description: "",
    };
    onChange([...(experiences || []), newExperience]);
  };

  const removeExperience = async (index: number) => {
    try {
      const experienceToDelete = experiences[index];

      // Only call API if experience has an ID (exists in backend)
      if (experienceToDelete.id) {
        await deleteExperience(experienceToDelete.id).unwrap();

        // If onDeleteExperience callback exists, call it
        if (onDeleteExperience) {
          onDeleteExperience(experienceToDelete.id);
        }
      }

      // Update local state by removing the experience
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      onChange(updatedExperiences);
    } catch (error) {
      console.error("Failed to delete experience:", error);
      // Optionally show an error message to the user
      alert("Failed to delete experience. Please try again.");
    }
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
    if (!experiences) return;
    const updatedExperiences = experiences.map((exp, i) => {
      if (i === index) {
        if (field === "currentlyWorking" && value === true) {
          return { ...exp, [field]: value, endDate: null };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  if (!experiences) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Fresher Checkbox */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Experience</h3>
        {experiences.length === 0 && (
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isFresher}
              onChange={(e) => setIsFresher(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-600">I am a fresher</span>
          </label>
        )}
      </div>

      {!isFresher &&
        experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4 relative"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              disabled={experiences.length === 1}
              type="button"
              aria-label={`Remove experience ${index + 1}`}
            >
              <Trash className="w-5 h-5" />
            </button>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>
                  handleUpdateExperience(index, "jobTitle", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.jobTitle`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter job title"
              />
              {getError(`experience.${index}.jobTitle`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.jobTitle`)}
                </p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  handleUpdateExperience(
                    index,
                    "employmentType",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.employmentType`)
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">Select employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              {getError(`experience.${index}.employmentType`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.employmentType`)}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) =>
                  handleUpdateExperience(index, "companyName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.companyName`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter company name"
              />
              {getError(`experience.${index}.companyName`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.companyName`)}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  handleUpdateExperience(index, "location", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.location`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter location"
              />
              {getError(`experience.${index}.location`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.location`)}
                </p>
              )}
            </div>

            {/* Currently Working */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`currentlyWorking-${index}`}
                checked={exp.currentlyWorking}
                onChange={(e) =>
                  handleUpdateExperience(
                    index,
                    "currentlyWorking",
                    e.target.checked
                  )
                }
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor={`currentlyWorking-${index}`}
                className="text-sm text-gray-600"
              >
                I currently work here
              </label>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    handleUpdateExperience(index, "startDate", e.target.value)
                  }
                  max={new Date().toISOString().slice(0, 7)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`experience.${index}.startDate`)
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {getError(`experience.${index}.startDate`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`experience.${index}.startDate`)}
                  </p>
                )}
              </div>
              {!exp.currentlyWorking && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      handleUpdateExperience(index, "endDate", e.target.value)
                    }
                    min={exp.startDate}
                    max={new Date().toISOString().slice(0, 7)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      getError(`experience.${index}.endDate`)
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {getError(`experience.${index}.endDate`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`experience.${index}.endDate`)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={exp.description}
                onChange={(e) =>
                  handleUpdateExperience(index, "description", e.target.value)
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.description`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Describe your responsibilities and achievements"
              />
              {getError(`experience.${index}.description`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.description`)}
                </p>
              )}
            </div>
          </div>
        ))}

      {!isFresher && (
        <button
          onClick={handleAddExperience}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add experience
        </button>
      )}
    </div>
  );
};

export default ExperienceForm;
