import { X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import plusIcon from "@/assets/profile/plusicon.svg";
import type { Skill } from "@/features/profile/types";
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  errors: { [key: string]: string };
  goalId: string | null;
  userId: string | undefined;
  onDeleteSkill: (index: number) => void;
}

export default function SkillsForm({
  skills = [],
  onChange,
  errors = {},
  goalId,
  userId,
  onDeleteSkill
}: SkillsFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openSkillPopovers, setOpenSkillPopovers] = useState<boolean[]>(
    skills.map(() => false)
  );
  const [openRatingPopovers, setOpenRatingPopovers] = useState<boolean[]>(
    skills.map(() => false)
  );
  const [openLevelPopovers, setOpenLevelPopovers] = useState<boolean[]>(
    skills.map(() => false)
  );

  const [getUserSkills, { data: userSkillsData }] = useGetUserSkillsMutation();

  const { data: skillsData, isLoading: skillsLoading } =
    useGetMultipleSkillsQuery(searchValue);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (userId && goalId) {
          await getUserSkills({ userId, goalId }).unwrap();
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [userId, goalId, getUserSkills]);

  const handleSkillChange = (
    index: number,
    field: "rating" | "_id" | "level",
    value: number | string
  ) => {
    const updatedSkills = skills.map((skill: Skill, i: number) => {
      if (i === index) {
        if (field === "_id") {
          const selectedSkill = skillsData?.data.find(
            (s: any) => s._id === value
          );

          if (selectedSkill) {
            return {
              ...selectedSkill,
              skill_Id: selectedSkill._id,
              rating: skill.rating,
              level: skill.level,
            };
          }
        }
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange(
      updatedSkills.filter((skill): skill is Skill => skill !== undefined)
    );
  };

  const addSkill = () => {
    const newSkill: Skill = {
      skill_Id: "",
      name: "",
      rating: "0",
      level: "1",
      visibility: "All users",
    };
    onChange([...skills, newSkill]);
    setOpenSkillPopovers([...openSkillPopovers, false]);
    setOpenRatingPopovers([...openRatingPopovers, false]);
    setOpenLevelPopovers([...openLevelPopovers, false]);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  const handlePopoverOpenChange = (
    index: number,
    isOpen: boolean,
    setOpenFunction: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    setOpenFunction((prevState) =>
      prevState.map((open, i) => (i === index ? isOpen : open))
    );
  };

  if (!Array.isArray(skills)) {
    return null;
  }

  return (
    <div className="space-y-6 w-full">
      {skills.map((skill: Skill, index: number) => (
        <div
          key={skill.skill_Id || index}
          className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB] mb-6"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#fafafa] hover:bg-[#e5e7eb]"
            onClick={() => onDeleteSkill(index)}
          >
            <X className="h-4 w-4 text-[#909091]" />
          </Button>
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor={`skill-${index}`}
                className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Skill {index + 1}
              </Label>
              <Popover
                open={openSkillPopovers[index]}
                onOpenChange={(isOpen) =>
                  handlePopoverOpenChange(index, isOpen, setOpenSkillPopovers)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSkillPopovers[index]}
                    className={`w-full justify-between text-[#000000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                      getError(`skills.${index}.name`) ? "border-red-500" : ""
                    }`}
                  >
                    {skill.name || "Select skill"}
                    {openSkillPopovers[index] ? (
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
                    <CommandList>
                      <CommandEmpty>No skill found.</CommandEmpty>
                      <CommandGroup>
                        {skillsData?.data?.map((item: any) => {
                          const isSkillAlreadyAdded =
                            userSkillsData?.data?.all.some(
                              (userSkill: any) =>
                                userSkill.skill_pool_id._id === item._id
                            );

                          return (
                            <CommandItem
                              key={item._id}
                              value={item.name}
                              disabled={isSkillAlreadyAdded}
                              onSelect={() => {
                                if (!isSkillAlreadyAdded) {
                                  handleSkillChange(index, "_id", item._id);
                                  handlePopoverOpenChange(
                                    index,
                                    false,
                                    setOpenSkillPopovers
                                  );
                                }
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
                              {isSkillAlreadyAdded && " (Already added)"}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <Popover
                open={openRatingPopovers[index]}
                onOpenChange={(isOpen) =>
                  handlePopoverOpenChange(index, isOpen, setOpenRatingPopovers)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between text-[#000000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                      getError(`skills.${index}.rating`) ? "border-red-500" : ""
                    }`}
                  >
                    {skill.rating || "Select rating"}
                    {openRatingPopovers[index] ? (
                      <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {Array.from({ length: 11 }, (_, i) => (
                          <CommandItem
                            key={i}
                            onSelect={() => {
                              handleSkillChange(index, "rating", i.toString());
                              handlePopoverOpenChange(
                                index,
                                false,
                                setOpenRatingPopovers
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                skill.rating === i.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {i}/10
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {getError(`skills.${index}.rating`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`skills.${index}.rating`)}
                </p>
              )}
            </div>
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor={`level-${index}`}
                className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Level
              </Label>
              <Popover
                open={openLevelPopovers[index]}
                onOpenChange={(isOpen) =>
                  handlePopoverOpenChange(index, isOpen, setOpenLevelPopovers)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between text-[#000000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                      getError(`skills.${index}.level`) ? "border-red-500" : ""
                    }`}
                  >
                    {skill.level === "1"
                      ? "Basic"
                      : skill.level === "2"
                      ? "Intermediate"
                      : "Advanced"}
                    {openLevelPopovers[index] ? (
                      <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {[
                          { value: "1", label: "Basic" },
                          { value: "2", label: "Intermediate" },
                          { value: "3", label: "Advanced" },
                        ].map((level) => (
                          <CommandItem
                            key={level.value}
                            onSelect={() => {
                              handleSkillChange(index, "level", level.value);
                              handlePopoverOpenChange(
                                index,
                                false,
                                setOpenLevelPopovers
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                skill.level === level.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {level.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {getError(`skills.${index}.level`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`skills.${index}.level`)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={addSkill}
        variant="ghost"
        className="text-[#03963F] hover:text-[#03963F]/90 hover:bg-transparent p-0 font-sf-pro text-base font-medium leading-6 tracking-[0.24px]"
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
