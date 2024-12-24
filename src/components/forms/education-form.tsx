import React from "react";
import { Plus } from "lucide-react";

interface Education {
  institution?: string;
  institute?: string;
  level: string;
  degree: string;
  fromDate: string;
  tillDate: string;
  cgpa: string;
  graduationYear?: number;
  location?: string;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  errors: { [key: string]: string };
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  errors,
}) => {
  console.log("Education data:", education);

  const addEducation = () => {
    const newEducation: Education = {
      level: "",
      degree: "",
      institute: "",
      institution: "",
      fromDate: "",
      tillDate: "",
      cgpa: "",
    };
    onChange([...education, newEducation]);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string | number
  ) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        const updatedEdu = { ...edu, [field]: value };
        // Sync both institute and institution fields
        if (field === "institute") {
          updatedEdu.institution = value as string;
        } else if (field === "institution") {
          updatedEdu.institute = value as string;
        }
        return updatedEdu;
      }
      return edu;
    });
    onChange(updatedEducation);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Education</h3>

      {education.map((edu, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select your highest level of education
              </label>
              <select
                value={edu.level}
                onChange={(e) =>
                  updateEducation(index, "level", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.level`) ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">Ph.D.</option>
                <option value="associate">Associate Degree</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
              {getError(`education.${index}.level`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.level`)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Degree/Board
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.degree`) ? "border-red-500" : ""
                }`}
                placeholder="Enter your degree or board"
              />
              {getError(`education.${index}.degree`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.degree`)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Institute/University
            </label>
            <input
              type="text"
              value={edu.institute || edu.institution || ""}
              onChange={(e) =>
                updateEducation(index, "institute", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`education.${index}.institute`) ? "border-red-500" : ""
              }`}
              placeholder="Enter the name of your institute or university"
            />
            {getError(`education.${index}.institute`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`education.${index}.institute`)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="month"
                value={edu.fromDate}
                onChange={(e) =>
                  updateEducation(index, "fromDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.fromDate`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`education.${index}.fromDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.fromDate`)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Till</label>
              <input
                type="month"
                value={edu.tillDate}
                onChange={(e) =>
                  updateEducation(index, "tillDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.tillDate`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`education.${index}.tillDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.tillDate`)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              CGPA/Marks Scored
            </label>
            <input
              type="text"
              value={edu.cgpa}
              onChange={(e) => updateEducation(index, "cgpa", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`education.${index}.cgpa`) ? "border-red-500" : ""
              }`}
              placeholder="Enter your CGPA or marks scored"
            />
            {getError(`education.${index}.cgpa`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`education.${index}.cgpa`)}
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;
