import type React from "react";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import type { ExperienceItem } from "@/features/profile/types";
import {
  useDeleteExperienceMutation,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
} from "@/api/experienceApiSlice";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import plusIcon from "@/assets/profile/plusicon.svg";

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

  useEffect(() => {
    if (experiences.length === 0 && !isFresher) {
      handleAddExperience();
    }
  }, [experiences, isFresher]);

  const handleAddExperience = () => {
    const newExperience: ExperienceItem = {
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
    onChange([...experiences, newExperience]);
  };

  const removeExperience = async (index: number) => {
    try {
      const experienceToDelete = experiences[index];
      if (experienceToDelete.id) {
        await deleteExperience(experienceToDelete.id).unwrap();
        if (onDeleteExperience) {
          onDeleteExperience(experienceToDelete.id);
        }
      }
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      onChange(updatedExperiences);
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience. Please try again.");
    }
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
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

  return (
    <div className="space-y-6 w-full">
      {experiences.length === 0 && (
        <label className="inline-flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => setIsFresher(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-600">I am a fresher</span>
        </label>
      )}

      {!isFresher &&
        experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
          >
            <button
              type="button"
              onClick={() => removeExperience(index)}
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
                  value={exp.jobTitle}
                  onChange={(e) =>
                    handleUpdateExperience(index, "jobTitle", e.target.value)
                  }
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

              <div className="space-y-2">
                <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={exp.employmentType}
                  onValueChange={(value) =>
                    handleUpdateExperience(index, "employmentType", value)
                  }
                >
                  <SelectTrigger className="w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                {getError(`experience.${index}.employmentType`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`experience.${index}.employmentType`)}
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
                  value={exp.companyName}
                  onChange={(e) =>
                    handleUpdateExperience(index, "companyName", e.target.value)
                  }
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

              <div className="space-y-2">
                <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    handleUpdateExperience(index, "location", e.target.value)
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    handleUpdateExperience(index, "startDate", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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
                <div className="space-y-2">
                  <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      handleUpdateExperience(index, "endDate", e.target.value)
                    }
                    min={exp.startDate}
                    max={new Date().toISOString().split("T")[0]}
                    className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Description <span className="text-red-500">*</span>
              </Label>
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
        <Button
          type="button"
          onClick={handleAddExperience}
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
