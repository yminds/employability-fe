// AddSkillsModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation } from "@/api/skillsApiSlice";
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Ensure correct import path
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import plusicon from "@/assets/skills/add_icon.png";
import icon from "@/assets/skills/icon.svg";
import addicon from "@/assets/skills/add_circle.svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  visibility: string;
}

interface AddSkillsModalProps {
  goalId: string | undefined;
  onClose: () => void;
  userId: string | undefined;
  onSkillsUpdate: (isUpdated: boolean) => void;
  goals:
    | {
        message: string;
        data: [
          {
            _id: string;
            name: string;
          }
        ];
      }
    | undefined;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  goalId,
  onClose,
  userId,
  onSkillsUpdate,
  goals,
}) => {
  const [isGoalPopoverOpen, setIsGoalPopoverOpen] = useState(false);
  const [user_Id] = useState<string>(userId ?? "");
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(
    goalId
  );
  const [skills, setSkills] = useState<Skill[]>([
    {
      skill_Id: "",
      name: "",
      rating: "0",
      visibility: "All users",
    },
  ]);

  const [isSkillOpen, setIsSkillOpen] = useState(false);

  const [suggestedSkills] = useState([
    { id: "1", name: "React" },
    { id: "2", name: "MongoDB" },
    { id: "3", name: "Node.js" },
    { id: "4", name: "GraphQL" },
    { id: "5", name: "MySQL" },
    { id: "6", name: "Express" },
  ]);

  const [getUserSkills, { data: userSkillsData, isLoading }] =
    useGetUserSkillsMutation();

  const fetchSkills = async (userId: string, goalId: string) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (goalId !== selectedGoalId) {
      setSelectedGoalId(goalId);
    }
  }, [goalId]);

  useEffect(() => {
    if (userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [userId, selectedGoalId]);

  const ratings = Array.from({ length: 10 }, (_, i) => `${i + 1}/10`);
  const [open, setOpen] = useState<boolean[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    data: skillsData,
    error: skillserror,
    isLoading: skillsLoading,
  } = useGetMultipleSkillsQuery(searchValue);

  const [openSkillPopovers, setOpenSkillPopovers] = useState<boolean[]>(
    skills.map(() => false)
  );

  const [openRatingPopovers, setOpenRatingPopovers] = useState<boolean[]>(
    skills.map(() => false)
  );

  const handleAddSkill = () => {
    const newSkill: Skill = {
      skill_Id: "",
      name: "",
      rating: "0",
      visibility: "All users",
    };
    setSkills([...skills, newSkill]);
    setOpenSkillPopovers([...openSkillPopovers, false]); // Add new popover state
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    setOpenSkillPopovers(openSkillPopovers.filter((_, i) => i !== index)); // Remove corresponding popover state
  };

  const handleSkillPopoverOpenChange = (index: number, isOpen: boolean) => {
    setOpenSkillPopovers((prevState) =>
      prevState.map((open, i) => (i === index ? isOpen : open))
    );
  };

  const handleRatingPopoverOpenChange = (index: number, isOpen: boolean) => {
    setOpenRatingPopovers((prevState) =>
      prevState.map((open, i) => (i === index ? isOpen : open))
    );
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
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
      skills: skills.map((skill) => {
        const existingSkill = userSkillsData?.data?.allUserSkills.find(
          (userSkill: any) => userSkill.skill_pool_id._id === skill.skill_Id
        );

        return {
          skill_pool_id: skill.skill_Id,
          self_rating: existingSkill
            ? existingSkill.self_rating // Use existing self_rating if the skill already exists
            : parseInt(skill.rating.split("/")[0]), // Otherwise, use the current rating
        };
      }),
      goal_id: selectedGoalId ?? "",
    };
    console.log("Payload:", payload);
    // Remove the 'return' to allow the code to proceed to try-catch
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

  useEffect(() => {
    setOpenRatingPopovers(skills.map(() => false));
  }, [skills]);

  const skillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Automatically scroll to the last skill when the list changes
    if (skillsRef.current) {
      skillsRef.current.scrollTop = skillsRef.current.scrollHeight;
    }
  }, [skills]);

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <DialogHeader className="flex justify-between items-start mb-6">
          <div>
            <DialogTitle className="text-xl font-bold">Add Skills</DialogTitle>
            <p className="text-sm text-gray-500">
              Select the skills you want to appear in the profile
            </p>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" className="h-6 w-6 p-0">
              <img src={icon} alt="Close" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Goal Selection Popover */}
        <div className="mb-6 flex items-center">
          <span className="text-sm font-medium block">Goal : </span>
          <Popover
            open={isGoalPopoverOpen}
            onOpenChange={(isOpen) => setIsGoalPopoverOpen(isOpen)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={isGoalPopoverOpen}
                className="w-2/6 justify-between hover:bg-white"
              >
                {goals?.data.find((goal) => goal._id === selectedGoalId)
                  ?.name || "Select a goal"}
                {isGoalPopoverOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-h-[200px] p-0">
              <Command className="w-full">
                <CommandInput placeholder="Search goals" />
                <CommandEmpty>No goals found.</CommandEmpty>
                <CommandGroup>
                  {goals?.data.map((goal) => (
                    <CommandItem
                      key={goal._id}
                      onSelect={() => {
                        handleGoalChange(goal._id);
                        setIsGoalPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedGoalId === goal._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {goal.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div
          ref={skillsRef}
          className="max-h-[36vh] overflow-y-auto space-y-4 snap-y snap-proximity minimal-scrollbar"
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border p-4 snap-start m-1"
            >
              <div className="grid grid-cols-2 gap-4 relative">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Skill {index + 1}
                  </label>
                  {isLoading ? (
                    // Show skeleton when loading
                    Array.from({ length: 1 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg border p-2"
                      >
                        <Skeleton height={20} />
                      </div>
                    ))
                  ) : (
                    <Popover
                      open={openSkillPopovers[index]}
                      onOpenChange={(isOpen) =>
                        handleSkillPopoverOpenChange(index, isOpen)
                      }
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
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full max-h-[375px]">
                          <CommandInput
                            placeholder="Search skills"
                            onValueChange={setSearchValue}
                          />
                          <CommandEmpty>No skill found.</CommandEmpty>
                          <CommandGroup>
                            {skillsData?.data?.map((item: any) => {
                              // Check if the skill is already in userSkillsData.all
                              const isSkillAlreadyAdded =
                                userSkillsData?.data?.all.some(
                                  (skill: any) =>
                                    skill.skill_pool_id._id === item._id
                                );

                              return (
                                <CommandItem
                                  key={item._id}
                                  value={item.name}
                                  disabled={isSkillAlreadyAdded} // Disable the item if it's already added
                                  onSelect={() => {
                                    if (!isSkillAlreadyAdded) {
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
                                    }
                                    handleSkillPopoverOpenChange(index, false); // Close dropdown
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
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Self rating
                  </label>
                  {isLoading ? (
                    // Show skeleton when loading
                    Array.from({ length: 1 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg border p-2"
                      >
                        <Skeleton height={20} />
                      </div>
                    ))
                  ) : (
                    <Popover
                      open={openRatingPopovers[index]}
                      onOpenChange={(isOpen) =>
                        handleRatingPopoverOpenChange(index, isOpen)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={
                            userSkillsData?.data?.allUserSkills.some(
                              (userSkill: any) =>
                                userSkill.skill_pool_id._id === skill.skill_Id
                            )
                          } // Disable if the skill already exists
                        >
                          {userSkillsData?.data?.allUserSkills.find(
                            (userSkill: any) =>
                              userSkill.skill_pool_id._id === skill.skill_Id
                          )?.self_rating
                            ? `${userSkillsData?.data?.allUserSkills.find(
                                (userSkill: any) =>
                                  userSkill.skill_pool_id._id === skill.skill_Id
                              ).self_rating
                            }/10`
                            : skill.rating || "Select rating..."}
                          {openRatingPopovers[index] ? (
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
                                  setSkills(
                                    skills.map((s, i) =>
                                      i === index ? { ...s, rating } : s
                                    )
                                  );
                                  handleRatingPopoverOpenChange(index, false);
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
                  )}
                </div>

                <Button
                  variant="ghost"
                  className="absolute right-0 top-[-10px] h-6 w-6 p-0"
                  onClick={() => handleRemoveSkill(index)}
                >
                  <img src={icon} alt="Remove Skill" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Skill Button */}
        <Button
          variant="outline"
          className="text-green-600 border-0 flex-1 px-0 mt-6 hover:bg-white hover:text-green-600"
          onClick={handleAddSkill}
          type="button"
        >
          <span>
            <img className="w-6 h-6" src={addicon} alt="Add Skill" />
          </span>
          Add Skill
        </Button>

        {/* Suggested Skills */}
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
                {suggestedSkill.name} <img src={plusicon} alt="Add" />
              </Button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillsModal;
