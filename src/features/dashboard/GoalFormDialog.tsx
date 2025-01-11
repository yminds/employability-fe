import React, { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useAddUserGoalMutation, useGetMultipleSkillsNameQuery } from "@/api/predefinedGoalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
    goal: z.string().min(1, "Goal is required"),
    techStack: z.array(z.string()).min(1, "Tech stack is required"),
    description: z.string().optional(),
});

interface Goal {
    _id: string;
    title: string;
    description: string;
    skill_pool_id: string[];
    predefined_goal_id: string;
}

interface GoalFormDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGoal: Goal | null;
    setJourneyDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoalFormDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal, setJourneyDialog }) => {
    const user_id = useSelector((state: RootState) => state.auth.user?._id || "");
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal, setGoal] = useState(selectedGoal ? selectedGoal.title : "");
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
    const [description, setDescription] = useState(selectedGoal ? selectedGoal.description : "");
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        goal: "",
        techStack: "",
        description: "",
    });

    const [createGoal] = useAddUserGoalMutation();
    const { data: skills } = useGetMultipleSkillsQuery("");
    const { data: skillsName } = useGetMultipleSkillsNameQuery(goalId, {
        skip: !goalId,
    });

    const handleSkillSelect = (skillId: string) => {
        if (!selectedTechStack.includes(skillId)) {
            setSelectedTechStack((prev) => [...prev, skillId]);
            setOpen(false); // Close the popover after selection
        }
    };

    const handleSkillRemove = (skillId: string) => {
        setSelectedTechStack((prev) => prev.filter((id) => id !== skillId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ goal, techStack: selectedTechStack, description });
        
        const result = goalSchema.safeParse({ goal, techStack: selectedTechStack, description });

        if (!result.success) {
            const newErrors: any = {};
            result.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);

            setTimeout(() => {
                setErrors({
                    goal: "",
                    techStack: "",
                    description: "",
                });
            }, 2000);

            return;
        }

        const goalData = { user_id: user_id, name: goal, skill_pool_ids: selectedTechStack, description };
        setIsSaving(true);
        try {
            await createGoal(goalData).unwrap();
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                setIsOpen(false);
                setJourneyDialog(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to save goal:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 max-w-2xl max-h-[100vh] overflow-y-auto rounded-[12px] minimal-scrollbar font-ubuntu">
                <DialogTitle className="hidden">Define Your Custom Goal</DialogTitle>
                <DialogDescription className="hidden">Enter your goal and tailor your learning path.</DialogDescription>

                <div className="flex items-center justify-center">
                    <div className="w-full inline-flex p-[42px] flex-col justify-center items-start gap-[40px]">
                        <div>
                            <h2 className="text-gray-900 text-2xl font-medium leading-8 tracking-tight">
                                Define Your Custom Goal
                            </h2>
                            <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide font-sf-pro">
                                Enter your goal and tailor your learning path.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start gap-8">
                            {/* Goal Input */}
                            <div className="w-full">
                                <div className="flex flex-col items-start gap-3.5">
                                    <label htmlFor="goal" className="text-gray-900 text-base font-medium leading-5">
                                        What is your Goal?
                                    </label>
                                    <input
                                        type="text"
                                        id="goal"
                                        placeholder="e.g., Mobile App Developer"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        autoComplete="off"
                                        className="flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none font-sf-pro"
                                    />
                                </div>
                                {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
                            </div>

                            {/* Tech Stack Command */}
                            <div className="w-full">
                                <div className="flex flex-col items-start gap-3.5">
                                    <label className="text-gray-900 text-base font-medium leading-5 flex flex-col items-start gap-1">
                                        Pick Your Tech Stack
                                        <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide font-sf-pro">
                                            Select the technologies you'll be using for this goal
                                        </p>
                                    </label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between h-12"
                                            >
                                                Select skills...
                                                {open ? (
                                                    <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50 transition duration-300 ease-linear" />
                                                    ) : (
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 transition duration-300 ease-linear" />
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 overflow-hidden">
                                            <Command className=" w-[350px] ">
                                                <CommandInput placeholder="Search skills..." />
                                                <CommandEmpty>No skill found.</CommandEmpty>
                                                <CommandGroup className="max-h-60">
                                                    {skills?.data?.map((skill: any) => {
                                                        const isSelected = selectedTechStack.includes(skill._id);
                                                        return (
                                                            <CommandItem
                                                                key={skill._id}
                                                                onSelect={() => !isSelected && handleSkillSelect(skill._id)}
                                                                disabled={isSelected}
                                                                className={cn(
                                                                    isSelected && "opacity-50 cursor-not-allowed",
                                                                    "cursor-pointer"
                                                                )}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        isSelected ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    {skill.icon && (
                                                                        <img src={skill.icon} alt={skill.name} className="w-4 h-4" />
                                                                    )}
                                                                    {skill.name}
                                                                </div>
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}

                                {/* Display selected skills */}
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {skillsName?.data?.skill_pool_id?.length > 0 ? (
                                            skillsName.data.skill_pool_id.map((skill: any) => (
                                                <span key={skill._id} className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5 font-sf-pro">
                                                    {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                    {skill.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSkillRemove(skill._id)}
                                                        className="ml-2 text-white bg-gray-400 rounded-full w-5 h-5 text-xs"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            selectedTechStack.map((skillId) => {
                                                const skill = skills?.data?.find((s: { _id: string }) => s._id === skillId);
                                                return skill && (
                                                    <span key={skillId} className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5 font-sf-pro">
                                                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                        {skill.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSkillRemove(skillId)}
                                                            className="ml-2 text-white bg-gray-400 rounded-full w-5 h-5 text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="flex flex-col items-start gap-3.5 w-full">
                                <label htmlFor="description" className="text-gray-900 text-base font-medium leading-5">
                                    Description <span className="text-[#B3B3B3]">(Optional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="e.g., Mern GEN AI engineer"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full flex h-[150px] p-2 px-4 justify-between items-start rounded-[6px] border border-black/10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none font-sf-pro"
                                    rows={3}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="flex h-[44px] p-4 justify-center items-center gap-2 self-stretch rounded bg-[#001630] text-white hover:bg-[#062549] text-[16px] font-medium leading-[24px] tracking-[0.24px]"
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Goal"}
                            </button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GoalFormDialog;