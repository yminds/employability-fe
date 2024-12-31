import React, { useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation } from "@/api/skillsApiSlice";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

import plusicon from "@/assets/skills/add_icon.png";
import icon from "@/assets/skills/icon.svg"
import addicon from "@/assets/skills/add_circle.svg";

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  visibility: string;
}
interface skillsSelected {
  data:[
    {
      _id: string;
      skill_pool_id: {
        _id: string;
        name: string;
        icon: string
      };
      verified_rating: number;
      self_rating: number;
  }
  ]
}

interface AddSkillsModalProps {
  selectedSkills: skillsSelected
  onClose: () => void;
  userId: string;
  onSkillsUpdate: (isUpdated: boolean) => void;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  selectedSkills,
  onClose,
  userId,
  onSkillsUpdate,
}) => {
  // console.log("selected in Add Modal skills ",selectedSkills);
  
  const [user_Id] = useState<string>(userId);
  const [skills, setSkills] = useState<Skill[]>([
    {
      skill_Id: "",
      name: "",
      rating: "0",
      visibility: "All users",
    },
  ]);

  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [suggestedSkills] = useState([
    { id: "1", name: "React" },
    { id: "2", name: "MongoDB" },
    { id: "3", name: "Node.js" },
    { id: "4", name: "GraphQL" },
    { id: "5", name: "MySQL" },
    { id: "6", name: "Express" },
  ]);

  const ratings = Array.from({ length: 10 }, (_, i) => `${i + 1}/10`);
  const [open, setOpen] = useState<boolean[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    data: skillsData,
    error,
    isLoading,
  } = useGetMultipleSkillsQuery(searchValue);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      skill_Id: "",
      name: "",
      rating: "0",
      visibility: "All users",
    };
    setSkills([...skills, newSkill]);
    setOpen([...open, false]);
  };

  const handleRemoveSkill = (id: string) => {
    const index = skills.findIndex((skill) => skill.skill_Id === id);
    const newSkills = skills.filter((skill) => skill.skill_Id !== id);
    const newOpen = [...open];
    newOpen.splice(index, 1);
    setSkills(newSkills);
    setOpen(newOpen);
  };

  const [createUserSkills, { isLoading: isSaving }] =
    useCreateUserSkillsMutation();

  const handleSave = async () => {
    if (!userId || typeof userId !== "string") {
      console.error("Invalid user ID.");
      return;
    }

    const payload = {
      user_id: user_Id,
      skills: skills.map((skill) => ({
        skill_pool_id: skill.skill_Id,
        self_rating: parseInt(skill.rating.split("/")[0]),
      })),
      goal_id: "676fa3a381861bd29ac93134",
    };

    
    try {
      const response = await createUserSkills(payload).unwrap();
      console.log("Skills added successfully:", response);
      onSkillsUpdate(true);
      onClose();
    } catch (error) {
      console.error("Failed to add skills:", error);
      onSkillsUpdate(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">Add Skills</h2>
            <p className="text-sm text-gray-500">
              Select the skills you want to appear in the profile
            </p>
          </div>
          <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
            <img src={icon} alt="" />
          </Button>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-gray-50 rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-4 relative">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Skill {index + 1}
                  </label>
                  <Popover
                    open={isSkillOpen}
                    onOpenChange={(isOpen) => setIsSkillOpen(isOpen)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isSkillOpen}
                        className="w-full justify-between"
                      >
                        {skill.name || "Select skill"}
                        {isSkillOpen ? (
                          <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full  p-0">
                      <Command className="w-full max-h-[375px]">
                        <CommandInput
                          placeholder="Search skills"
                          onValueChange={setSearchValue}
                        />
                        <CommandEmpty>No skill found.</CommandEmpty>
                        <CommandGroup>
                          {skillsData?.data?.map((item: any) => (
                            <CommandItem
                            disabled={selectedSkills.data?.map((skill) => skill.skill_pool_id._id).includes(item._id)}  
                              key={item._id}
                              value={item.name}
                              onSelect={() => {
                                // Update selected skill and close dropdown
                                setSkills(
                                  skills.map((s, i) =>
                                    i === index
                                      ? {
                                          ...s,
                                          skill_Id: item._id,
                                          name: item.name,
                                        }
                                      : s
                                  )
                                );
                                setIsSkillOpen(false); // Close dropdown
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  skill.skill_Id === item._id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Self rating
                  </label>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {skill.rating || "Select rating..."}
                        {isOpen ? (
                          <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandGroup>
                          {ratings.map((rating) => (
                            <CommandItem
                              key={rating}
                              onSelect={() => {
                                // Update the rating and close the popover
                                setSkills(
                                  skills.map((s, i) =>
                                    i === index ? { ...s, rating } : s
                                  )
                                );
                                setIsOpen(false); // Close the popover after selecting
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  skill.rating === rating
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {rating}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  variant="ghost"
                  className="absolute right-0 top-[-10px] h-6 w-6 p-0"
                  onClick={() => handleRemoveSkill(skill.skill_Id)}
                >
                  <img src={icon} alt="" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <Button
          variant="outline"
          className="text-green-600 border-0 flex-1 px-0 mt-6 hover:bg-white hover:text-green-600"
          onClick={handleAddSkill}
          type="button"
        >
          <span>
            {" "}
            <img className="w-6 h-6" src={addicon} alt="" />
          </span>
          Add Skill
        </Button>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Suggested</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((suggestedSkill) => (
              <Button
                key={suggestedSkill.id}
                variant="outline"
                className="text-[16px] text-[#414447] font-normal leading-[22px] rounded-full bg-[#FAFBFE]"
                onClick={() => {
                  const newSkill = {
                    skill_Id: suggestedSkill.id,
                    name: suggestedSkill.name,
                    rating: "0",
                    visibility: "All users",
                  };
                  setSkills([...skills, newSkill]);
                  setOpen([...open, false]);
                }}
              >
                {suggestedSkill.name} <img src={plusicon} alt="" />
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddSkillsModal;
