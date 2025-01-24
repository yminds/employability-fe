// AddSkillsModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation, useGetUserSkillsMutation } from "@/api/skillsApiSlice";
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
import { useGetSkillSuggestionsMutation } from "@/api/skillSuggestionsApiSlice";

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  level: string;
  visibility: string;
}


interface AddSkillsModalProps {
  goalId: string | null;
  onClose: () => void;
  userId: string | undefined;
  onSkillsUpdate: (isUpdated: boolean) => void;
  goals:
  | {
    message: string;
    data: [
      {
        experience: string | undefined;
        _id: string;
        name: string;
      }
    ];
  }
  | undefined;
  prefillSkills: Skill[]; // Prefilled skills data
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  goalId,
  onClose,
  userId,
  onSkillsUpdate,
  goals,
  prefillSkills
}) => {
  console.log(prefillSkills)
  const [isGoalPopoverOpen, setIsGoalPopoverOpen] = useState(false);
  const [user_Id] = useState<string>(userId ?? "");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    goalId
  );
  const transformSkills = (prefillSkills: any[]) => {
    return prefillSkills.map(skill => ({
      skill_Id: skill.id,
      name: skill.name,
      rating: "0",
      level: "1",
      visibility: "All users"
    }));
  };
  
  // In your component's state initialization
  const [skills, setSkills] = useState<Skill[]>(
    prefillSkills.length > 0 
      ? transformSkills(prefillSkills)
      : [{
          skill_Id: "",
          name: "",
          rating: "0",
          level: "1", 
          visibility: "All users",
        }]
  );


  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [getSuggestedSkills] = useGetSkillSuggestionsMutation();
  const [isSuggestedLoading, setIsLoading] = useState(false);


  const [suggestedSkillsData, setSuggestedSkillsData] = useState<any[]>([]);
  console.log(suggestedSkillsData);


  const getSkillNames = (skills: any[]) => {
    return skills.map(skill => skill.skill_pool_id.name).join(',');
  };
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Separate fetch calls
      const userSkills = await getUserSkills({ userId, goalId }).unwrap();
      const allSkillNames = getSkillNames(userSkills.data.all);

      const suggestedSkills = await getSuggestedSkills({ query: allSkillNames }).unwrap();
      setSuggestedSkillsData(suggestedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
      fetchData()
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
      level: "1",
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
          level: skill.level, // Include skill level
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

  const experienceLevelObj = { 1: "Entry-level", 2: "Mid-level", 3: "Senior-level" };


  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg p-[42px] w-full gap-2 max-w-2xl max-h-[98vh]">
        <DialogHeader className="flex justify-between items-start max-h-[54px] mb-6">
          <div className=" flex flex-col items-start">
            <DialogTitle className="text-xl font-bold">Add Skills</DialogTitle>
            <p className="text-sm text-gray-500">
              Select the skills you want to appear in the profile
            </p>
          </div>
          <DialogClose asChild className="h-6 w-6 p-0 outline-none">
          </DialogClose>
        </DialogHeader>

        {/* Goal Selection Popover */}
        <div className=" flex items-center max-h-[46px]">
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
                  ? `${goals?.data.find((goal) => goal._id === selectedGoalId)?.name} (${experienceLevelObj[goals?.data.find((goal) => goal._id === selectedGoalId)?.experience as unknown as keyof typeof experienceLevelObj] || 'N/A'})`
                  : "Select a goal"}
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
                      {goal.name} ({experienceLevelObj[goal.experience as unknown as keyof typeof experienceLevelObj || 0] })
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div
          ref={skillsRef}
          className="max-h-[354px] xl:max-h-[236px] overflow-y-auto space-y-4 snap-y p-1 snap-proximity minimal-scrollbar"
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border p-4 snap-start m-1"
            >
              <div className="grid grid-cols-3 gap-4 relative">
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
                      onOpenChange={(isOpen) => handleRatingPopoverOpenChange(index, isOpen)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={
                            userSkillsData?.data?.allUserSkills?.some(
                              (userSkill: any) =>
                                userSkill.skill_pool_id?._id === skill.skill_Id
                            ) ?? false // Default to false if undefined
                          }
                        >
                          {userSkillsData?.data?.allUserSkills?.find(
                            (userSkill: any) => userSkill.skill_pool_id?._id === skill.skill_Id
                          )?.self_rating
                            ? `${userSkillsData?.data?.allUserSkills?.find(
                              (userSkill: any) =>
                                userSkill.skill_pool_id?._id === skill.skill_Id
                            )?.self_rating}/10`
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
                                    skill.rating === rating ? "opacity-100" : "opacity-0"
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
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Skill level
                  </label>
                  <Popover
                    open={open[index]}
                    onOpenChange={(isOpen) =>
                      setOpen((prevState) =>
                        prevState.map((openState, i) => (i === index ? isOpen : openState))
                      )
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {skill.level === "1"
                          ? "Basic"
                          : skill.level === "2"
                            ? "Intermediate"
                            : "Advanced"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandGroup>
                          {["1", "2", "3"].map((level) => (
                            <CommandItem
                              key={level}
                              onSelect={() => {
                                setSkills(
                                  skills.map((s, i) =>
                                    i === index ? { ...s, level } : s
                                  )
                                );
                                setOpen((prevState) =>
                                  prevState.map((openState, i) =>
                                    i === index ? false : openState
                                  )
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  skill.level === level ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {level === "1"
                                ? "Basic"
                                : level === "2"
                                  ? "Intermediate"
                                  : "Advanced"}
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
                  onClick={() => handleRemoveSkill(index)}
                >
                  <img src={icon} alt="Remove Skill" />
                </Button>

              </div>
            </div>
          ))}
        </div>
        <div>
          {/* Add Skill Button */}
          <Button
            variant="outline"
            className="text-green-600 border-0 flex-1 px-0 hover:bg-white hover:text-green-600"
            onClick={handleAddSkill}
            type="button"
          >
            <span>
              <img className="w-6 h-6" src={addicon} alt="Add Skill" />
            </span>
            Add Skill
          </Button>
        </div>


        {/* Suggested Skills */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-2">Suggested</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkillsData?.map((suggestedSkill) => (
              <Button
                key={suggestedSkill.id}
                variant="outline"
                className="text-[16px] text-[#414447] font-normal leading-[22px] rounded-full bg-[#FAFBFE]"
                onClick={() => {
                  // Check if the first skill is empty (no name selected)
                  if (skills.length === 1 && skills[0].name === "") {
                    // Replace the 0th skill with the suggested skill
                    setSkills([
                      {
                        skill_Id: suggestedSkill.id,
                        name: suggestedSkill.name,
                        rating: "0",
                        level: "1",
                        visibility: "All users",
                      },
                    ]);
                  } else {
                    // Otherwise, add the suggested skill as a new entry
                    const newSkill = {
                      skill_Id: suggestedSkill.id,
                      name: suggestedSkill.name,
                      rating: "0",
                      level: "1",
                      visibility: "All users",
                    };
                    setSkills([...skills, newSkill]);
                    setOpen([...open, false]);
                  }
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
