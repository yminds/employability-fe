import React from "react";
import { Plus } from "lucide-react";

interface Experience {
  jobTitle: string | number | readonly string[] | undefined;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  currentCTC: string;
  expectedCTC: string;
}

interface ExperienceFormProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
  errors: { [key: string]: string };
}

export default function ExperienceForm({
  experience,
  onChange,
  errors,
}: ExperienceFormProps) {
  const formatMonthYear = (dateString: string) => {
    if (!dateString) return "";

    try {
      const [month, year] = dateString.split(" ");
      const monthNum = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
      return `${year}-${monthNum.toString().padStart(2, "0")}`;
    } catch {
      return dateString;
    }
  };

  const formatToMonthYear = (dateString: string) => {
    if (!dateString) return "";

    try {
      const [year, month] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const addExperience = () => {
    onChange([
      ...experience,
      {
        jobTitle: "",
        company: "",
        employmentType: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        currentCTC: "",
        expectedCTC: "",
      },
    ]);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const updatedExperience = experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperience);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Experience</h3>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-600">I am a fresher</span>
        </label>
      </div>

      {experience.map((exp, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>
                  updateExperience(index, "jobTitle", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.jobTitle`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.jobTitle`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.jobTitle`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Employment type
              </label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  updateExperience(index, "employmentType", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.employmentType`)
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
              {getError(`experience.${index}.employmentType`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.employmentType`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.company`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.company`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.company`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.location`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.location`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.location`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start date
              </label>
              <input
                type="month"
                value={formatMonthYear(exp.startDate)}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "startDate",
                    formatToMonthYear(e.target.value)
                  )
                }
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
            <div>
              <label className="block text-sm font-medium mb-1">End date</label>
              <div className="flex items-center gap-4">
                <input
                  type="month"
                  value={formatMonthYear(exp.endDate)}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "endDate",
                      formatToMonthYear(e.target.value)
                    )
                  }
                  disabled={exp.currentlyWorking}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                    Currently working
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  getError(`experience.${index}.currentCTC`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.currentCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.currentCTC`)}
                </p>
              )}
            </div>
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
                  getError(`experience.${index}.expectedCTC`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.expectedCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.expectedCTC`)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
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
}
