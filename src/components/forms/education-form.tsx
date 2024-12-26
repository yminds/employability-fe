
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

interface Education {
  _id?: any;
  education_level: any; // e.g., "bachelors", "masters", etc.
  degree: any;
  institute: any;
  board_or_certification: any;
  from_date: any; // ISO date string
  till_date: any; // ISO date string
  cgpa_or_marks: any;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  errors: { [key: string]: string };
  onAddEducation: (newEducation: Education) => void;
  onDeleteEducation: (educationId: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  errors,
  onAddEducation,
  onDeleteEducation,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const addEducation = () => {
    const newEducation: Education = {
      _id: "",
      education_level: "",
      degree: "",
      institute: "",
      board_or_certification: "",
      from_date: "",
      till_date: "",
      cgpa_or_marks: "",
    };
    // Append the new education entry
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
          updatedEdu.institute = value as string;
        } else if (field === "education_level") {
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
        <div
          key={edu._id || index}
          className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4 relative"
        >
          {/* Delete Button */}
          <button
            onClick={() => edu._id && onDeleteEducation(edu._id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            type="button"
            aria-label="Delete education"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Education Level and Degree Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select your highest level of education
              </label>
              <select
                value={edu.education_level}
                onChange={(e) =>
                  updateEducation(index, "education_level", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.education_level`)
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">Select Education Level</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">Ph.D.</option>
                <option value="associate">Associate Degree</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
              {getError(`education.${index}.education_level`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.education_level`)}
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
              value={edu.institute || edu.institute || ""}
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
                type="date"
                value={edu.from_date || ""}
                onChange={(e) =>
                  updateEducation(index, "from_date", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.from_date`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`education.${index}.from_date`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.from_date`)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Till</label>
              <input
                type="date"
                value={edu.till_date || ""}
                onChange={(e) =>
                  updateEducation(index, "till_date", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.till_date`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`education.${index}.till_date`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.till_date`)}
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
              value={edu.cgpa_or_marks}
              onChange={(e) =>
                updateEducation(index, "cgpa_or_marks", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`education.${index}.cgpa_or_marks`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Enter your CGPA or marks scored"
            />
            {getError(`education.${index}.cgpa_or_marks`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`education.${index}.cgpa_or_marks`)}
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
        Add New Education
      </button>
    </div>
  );
};

export default EducationForm;
