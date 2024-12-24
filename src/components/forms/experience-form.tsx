import React from "react";
import { Plus, Trash } from "lucide-react";
import type { ExperienceItem } from "@/features/profile/types";

interface ExperienceFormProps {
  experiences: ExperienceItem[];
  onChange: (experiences: ExperienceItem[]) => void;
  errors: { [key: string]: string };
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  errors,
}) => {

  // Function to add a new experience entry
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(), // Generate a unique ID
      jobTitle: "",
      employmentType: "",
      companyName: "",
      companyLogo: "",
      location: "",
      startDate: "",
      endDate: null,
      currentlyWorking: false,
      currentCTC: "",
      expectedCTC: "",
      description: "",
      jobType: undefined,
      isVerified: undefined,
      duration: undefined,
    };
    onChange([...experiences, newExperience]);
  };

  // Function to remove an experience entry
  const removeExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    onChange(updatedExperiences);
  };

  // Function to update a specific field in an experience entry
  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string | boolean | null
  ) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updatedExperiences);
  };

  // Helper function to retrieve error messages based on the field path
  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Experience</h3>
      </div>

      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4 relative"
        >
          {/* Remove Button */}
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            aria-label={`Remove experience ${index + 1}`}
          >
            <Trash className="w-5 h-5" />
          </button>

          {/* Job Title and Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>
                  updateExperience(index, "jobTitle", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.jobTitle`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter job title"
              />
              {getError(`experiences.${index}.jobTitle`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.jobTitle`)}
                </p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employment Type
              </label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  updateExperience(index, "employmentType", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.employmentType`)
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">Select</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              {getError(`experiences.${index}.employmentType`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.employmentType`)}
                </p>
              )}
            </div>
          </div>

          {/* Company Name and Location */}
          <div className="grid grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={exp.companyName || exp.company}
                onChange={(e) =>
                  updateExperience(index, "companyName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.companyName`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter company name"
              />
              {getError(`experiences.${index}.companyName`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.companyName`)}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.location`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter location"
              />
              {getError(`experiences.${index}.location`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.location`)}
                </p>
              )}
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Logo URL
            </label>
            <input
              type="url"
              value={exp.companyLogo}
              onChange={(e) =>
                updateExperience(index, "companyLogo", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`experiences.${index}.companyLogo`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Enter company logo URL"
            />
            {getError(`experiences.${index}.companyLogo`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`experiences.${index}.companyLogo`)}
              </p>
            )}
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.startDate`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`experiences.${index}.startDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.startDate`)}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <div className="flex items-center gap-4">
                <input
                  type="month"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                  disabled={exp.currentlyWorking}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`experiences.${index}.endDate`)
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      updateExperience(
                        index,
                        "currentlyWorking",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Currently Working
                  </span>
                </label>
              </div>
              {getError(`experiences.${index}.endDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.endDate`)}
                </p>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) =>
                updateExperience(index, "duration", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`experiences.${index}.duration`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="e.g., 2 years 3 months"
            />
            {getError(`experiences.${index}.duration`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`experiences.${index}.duration`)}
              </p>
            )}
          </div>

          {/* Current CTC and Expected CTC */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current CTC */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Current CTC
              </label>
              <input
                type="text"
                value={exp.currentCTC}
                onChange={(e) =>
                  updateExperience(index, "currentCTC", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.currentCTC`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter current CTC"
              />
              {getError(`experiences.${index}.currentCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.currentCTC`)}
                </p>
              )}
            </div>

            {/* Expected CTC */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Expected CTC
              </label>
              <input
                type="text"
                value={exp.expectedCTC}
                onChange={(e) =>
                  updateExperience(index, "expectedCTC", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experiences.${index}.expectedCTC`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter expected CTC"
              />
              {getError(`experiences.${index}.expectedCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experiences.${index}.expectedCTC`)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={exp.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`experiences.${index}.description`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Describe your role and achievements"
              rows={4}
            ></textarea>
            {getError(`experiences.${index}.description`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`experiences.${index}.description`)}
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add experience
      </button>
    </div>
  );
};

export default ExperienceForm;
