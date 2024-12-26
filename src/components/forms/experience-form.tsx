import React, { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";

interface ExperienceItem {
  // id: string;
  jobTitle: string;
  employmentType: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string | null;
}

interface ExperienceFormProps {
  experiences: ExperienceItem[];
  onChange: (experiences: ExperienceItem[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
}) => {
  const [isFresher, setIsFresher] = useState(false);

  useEffect(() => {
    if (!experiences.length && !isFresher) {
      addExperience();
    }
  }, [experiences, isFresher]);

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      // id: Date.now().toString(),
      jobTitle: "",
      employmentType: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: null,
    };
    onChange([...experiences, newExperience]);
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    onChange(updatedExperiences);
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      {/* Fresher Checkbox */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Experience</h3>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => setIsFresher(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-600">I am a fresher</span>
        </label>
      </div>

      {/* Experience Form */}
      {!isFresher &&
        experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4 relative"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              disabled={experiences.length === 1}
              aria-label={`Remove experience ${index + 1}`}
            >
              <Trash className="w-5 h-5" />
            </button>

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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter job title"
              />
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) =>
                  updateExperience(index, "companyName", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter company name"
              />
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter location"
              />
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        ))}

      {!isFresher && (
        <button
          onClick={addExperience}
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
