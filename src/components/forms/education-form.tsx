import type React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import plusIcon from "@/assets/profile/plusicon.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Education } from "@/features/profile/types";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  errors: { [key: string]: string };
  onAddEducation: () => void;
  onDeleteEducation: (index: number) => void;
  mode: "add" | "edit" | null;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  errors,
  onAddEducation,
  onDeleteEducation,
  mode,
}) => {
  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updatedEducation);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  return (
    <div className="space-y-6 w-full">
      {education.map((edu, index) => (
        <div
          key={edu._id || index}
          className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
        >
          <button
            type="button"
            onClick={() => onDeleteEducation(index)}
            className="absolute right-4 top-4"
            aria-label={`Remove education ${index + 1}`}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Education Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={edu.education_level}
                onValueChange={(value) =>
                  updateEducation(index, "education_level", value)
                }
              >
                <SelectTrigger
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                    getError(`education.${index}.education_level`)
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">Ph.D.</SelectItem>
                  <SelectItem value="associate degree">
                    Associate Degree
                  </SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
              {getError(`education.${index}.education_level`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.education_level`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Degree/Board <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`education.${index}.degree`) ? "border-red-500" : ""
                }`}
                placeholder="Enter degree"
              />
              {getError(`education.${index}.degree`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.degree`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2 col-span-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Institute/University <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={edu.institute}
                onChange={(e) =>
                  updateEducation(index, "institute", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`education.${index}.institute`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter institute name"
              />
              {getError(`education.${index}.institute`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.institute`)}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-1">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                From Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formatDateForInput(edu.from_date)}
                onChange={(e) =>
                  updateEducation(index, "from_date", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

            <div className="space-y-2 col-span-1">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Till Date
              </Label>
              <Input
                type="date"
                value={formatDateForInput(edu.till_date)}
                onChange={(e) =>
                  updateEducation(index, "till_date", e.target.value)
                }
                min={formatDateForInput(edu.from_date)}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              CGPA/Marks <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={edu.cgpa_or_marks}
              onChange={(e) =>
                updateEducation(index, "cgpa_or_marks", e.target.value)
              }
              className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                getError(`education.${index}.cgpa_or_marks`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Enter CGPA or marks"
            />
            {getError(`education.${index}.cgpa_or_marks`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`education.${index}.cgpa_or_marks`)}
              </p>
            )}
          </div>
        </div>
      ))}

      {mode === "add" && (
        <Button
          type="button"
          onClick={onAddEducation}
          variant="ghost"
          className="text-[#03963F] hover:text-[#03963F]/90 hover:bg-transparent p-0 font-sf-pro text-base font-medium leading-6 tracking-[0.24px]"
        >
          <img
            src={plusIcon || "/placeholder.svg"}
            alt="Plus Icon"
            className="mr-2"
          />
          Add Education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
