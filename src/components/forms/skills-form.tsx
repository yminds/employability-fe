import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserSkill } from "@/types/userSkillsType";
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

interface SkillsFormProps {
  skills: UserSkill[];
  onChange: (skills: UserSkill[]) => void;
  errors: { [key: string]: string };
}

export default function SkillsForm({
  skills = [],
  onChange,
  errors = {},
}: SkillsFormProps) {
  const [availableSkills, setAvailableSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/skills_pool/skills"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setAvailableSkills(data.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillChange = (
    index: number,
    field: "rating" | "_id",
    value: number | string
  ) => {
    const updatedSkills = skills.map((skill: UserSkill, i: number) => {
      if (i === index) {
        if (field === "_id") {
          const selectedSkill = availableSkills.find((s) => s._id === value);
          if (selectedSkill) {
            return { ...selectedSkill, rating: skill.rating || 0 };
          }
        }
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange(updatedSkills);
  };

  const addSkill = () => {
    const newSkill: UserSkill = {
      _id: "",
      name: "",
      description: "",
      rating: 0,
    };
    onChange([...skills, newSkill]);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    onChange(updatedSkills);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  if (!Array.isArray(skills)) {
    return null;
  }

  return (
    <div className="space-y-6 w-full">
      {skills.map((skill: UserSkill, index: number) => (
        <div
          key={skill._id || index}
          className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB] mb-6"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#fafafa] hover:bg-[#e5e7eb]"
            onClick={() => removeSkill(index)}
          >
            <X className="h-4 w-4 text-[#909091]" />
          </Button>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor={`skill-${index}`}
                className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Skill {index + 1}
              </Label>
              <Select
                value={skill._id}
                onValueChange={(value) =>
                  handleSkillChange(index, "_id", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  id={`skill-${index}`}
                  className={`w-full text-[#000000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                    getError(`skills.${index}.name`) ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {availableSkills.map((availableSkill) => (
                    <SelectItem
                      key={availableSkill._id}
                      value={availableSkill._id}
                    >
                      {availableSkill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError(`skills.${index}.name`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`skills.${index}.name`)}
                </p>
              )}
            </div>
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor={`rating-${index}`}
                className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Self rating
              </Label>
              <Select
                value={skill.rating?.toString() || "0"}
                onValueChange={(value) =>
                  handleSkillChange(index, "rating", Number.parseInt(value))
                }
              >
                <SelectTrigger
                  id={`rating-${index}`}
                  className={`w-full text-[#000000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                    getError(`skills.${index}.rating`) ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}/10
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError(`skills.${index}.rating`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`skills.${index}.rating`)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={addSkill}
        variant="link"
        className="text-[#10b754] hover:text-[#10b754]/90 hover:bg-transparent p-0 font-sf-pro text-base font-medium leading-6 tracking-[0.24px]"
        type="button"
        disabled={isLoading}
      >
        <img
          src={plusIcon || "/placeholder.svg"}
          alt="Plus Icon"
          className="mr-2"
        />
        Add skill
      </Button>
    </div>
  );
}
