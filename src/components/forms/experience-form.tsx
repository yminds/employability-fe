import type React from "react";
import { X } from "lucide-react";
import type { ExperienceItem } from "@/features/profile/types";
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

interface ExperienceFormProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
  errors: { [key: string]: string };
  onAddExperience: () => void;
  onDeleteExperience: (index: number) => void;
  mode: "add" | "edit" | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  onChange,
  errors,
  onAddExperience,
  onDeleteExperience,
  mode,
}) => {
  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string | boolean
  ) => {
    const updatedExperience = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updatedExperience);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  const currencySymbol = "₹";

  return (
    <div className="space-y-6 w-full">
      {experience.map((exp, index) => (
        <div
          key={exp.id || index}
          className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
        >
          <button
            type="button"
            onClick={() => onDeleteExperience(index)}
            className="absolute right-4 top-4"
            aria-label={`Remove experience ${index + 1}`}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={exp.title}
                onChange={(e) =>
                  updateExperience(index, "title", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`experience.${index}.title`) ? "border-red-500" : ""
                }`}
                placeholder="Enter job title"
              />
              {getError(`experience.${index}.title`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.title`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Employment Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={exp.employment_type}
                onValueChange={(value) =>
                  updateExperience(index, "employment_type", value)
                }
              >
                <SelectTrigger
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                    getError(`experience.${index}.employment_type`)
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              {getError(`experience.${index}.employment_type`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.employment_type`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`experience.${index}.company`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter company name"
              />
              {getError(`experience.${index}.company`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.company`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`currentlyWorking-${index}`}
              checked={exp.currently_working}
              onChange={(e) =>
                updateExperience(index, "currently_working", e.target.checked)
              }
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label
              htmlFor={`currently_working-${index}`}
              className="text-sm text-gray-600"
            >
              I currently work here
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formatDateForInput(exp.start_date)}
                onChange={(e) =>
                  updateExperience(index, "start_date", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`experience.${index}.start_date`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`experience.${index}.start_date`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.start_date`)}
                </p>
              )}
            </div>
            {!exp.currently_working && (
              <div className="space-y-2">
                <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formatDateForInput(exp.end_date || "")}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  min={exp.start_date}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                    getError(`experience.${index}.end_date`)
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {getError(`experience.${index}.end_date`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`experience.${index}.end_date`)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Current CTC ({currencySymbol}){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={exp.current_ctc || ""}
                onChange={(e) =>
                  updateExperience(index, "current_ctc", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`experience.${index}.current_ctc`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter current CTC"
              />
              {getError(`experience.${index}.current_ctc`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.current_ctc`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Expected CTC ({currencySymbol}){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={exp.expected_ctc || ""}
                onChange={(e) =>
                  updateExperience(index, "expected_ctc", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError(`experience.${index}.expected_ctc`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter expected CTC"
              />
              {getError(`experience.${index}.expected_ctc`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.expected_ctc`)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              value={exp.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
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

      {mode === "add" && (
        <Button
          type="button"
          onClick={onAddExperience}
          variant="ghost"
          className="text-[#03963F] hover:text-[#03963F]/90 hover:bg-transparent p-0 font-sf-pro text-base font-medium leading-6 tracking-[0.24px]"
        >
          <img
            src={plusIcon || "/placeholder.svg"}
            alt="Plus Icon"
            className="mr-2"
          />
          Add Experience
        </Button>
      )}
    </div>
  );
};

export default ExperienceForm;
