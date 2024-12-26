import React, { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateGoalMutation, useGetMultipleSkillsNameQuery } from "@/api/predefinedGoalsApiSlice";
import { useSelector } from "react-redux";

// Define Zod schema for validation
const goalSchema = z.object({
    goal: z.string().min(1, "Goal is required"),
    techStack: z.array(z.string()).min(1, "Tech stack is required"),
    description: z.string().optional(),
});

interface Goal {
    _id: string;
    title: string;
    description: string;
    skill_pool_id: string[]; // Assuming the selected skills are passed here
    predefined_goal_id: string;
}

interface GoalFormDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGoal: Goal; // Goal data passed as a prop
    setJourneyDialog: boolean;
}

const GoalFormDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal, setJourneyDialog }) => {
    const user_id = useSelector((state) => state.auth.user._id)
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal, setGoal] = useState(selectedGoal ? selectedGoal.title : "");
    const [techStack, setTechStack] = useState(""); // Tech stack search term
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
    const [description, setDescription] = useState(selectedGoal ? selectedGoal.description : "");
    const [isSaved, setIsSaved] = useState(false); // State to handle success message visibility
    const [isSaving, setIsSaving] = useState(false); // State to handle saving/loading state
    const [errors, setErrors] = useState({
        goal: "",
        techStack: "",
        description: "",
    });
    const [createGoal] = useCreateGoalMutation();
    const [callAPI, setCallAPI] = useState(true);
    const { data: skills, error, isLoading } = useGetMultipleSkillsQuery(techStack, {
        skip: callAPI
    });

    const { data: skillsName } = useGetMultipleSkillsNameQuery(goalId, {
        skip: !goalId,
    });

    const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCallAPI(false);
        setTechStack(e.target.value); // Update the search term immediately
    };

    const handleSkillSelect = (skillId: string) => {
        if (!selectedTechStack.includes(skillId)) {
            setSelectedTechStack((prev) => [...prev, skillId]); // Add the selected skill ID to the array
        }
    };

    const handleSkillRemove = (skillId: string) => {
        setSelectedTechStack((prev) => prev.filter((id) => id !== skillId)); // Remove the skill ID from the array
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate using Zod
        const result = goalSchema.safeParse({ goal, techStack: selectedTechStack, description });

        if (!result.success) {
            const newErrors: any = {};
            result.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);

            // Set timeout to clear errors after 2 seconds
            setTimeout(() => {
                setErrors({
                    goal: "",
                    techStack: "",
                    description: "",
                });
            }, 2000);

            return;
        }

        // Prepare goal data
        const goalData = { user_id: user_id, name: goal, skill_pool_ids: selectedTechStack, description };
        setIsSaving(true); // Set saving state to true when submitting
        try {
            await createGoal(goalData).unwrap();
            setIsSaved(true); // Show success message
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
            <DialogContent className="p-0 max-w-2xl max-h-[100vh] overflow-y-auto minimal-scrollbar font-ubuntu">
                <DialogTitle className="hidden">Define Your Custom Goal</DialogTitle>

                <div className="flex items-center justify-center">
                    <div className="w-full inline-flex p-[42px] flex-col justify-center items-start gap-[40px]">
                        <div>
                            <h2 className="text-gray-900 text-2xl font-medium leading-8 tracking-tight">Define Your Custom Goal</h2>
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

                            <div className="w-full">
                                <div className="flex flex-col items-start gap-3.5">
                                    <label htmlFor="tech-stack" className="text-gray-900 text-base font-medium leading-5 flex flex-col items-start gap-1">
                                        Pick Your Tech Stack
                                        <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide font-sf-pro">
                                            Select the technologies you'll be using for this goal
                                        </p>
                                    </label>
                                    <div className="relative w-full">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <img src="./src/assets/set-goal/mail.svg" alt="Search" />
                                        </span>
                                        <input
                                            type="text"
                                            id="tech-stack"
                                            placeholder="Search"
                                            value={techStack}
                                            onChange={handleTechStackChange}
                                            autoComplete="off"
                                            className="w-full flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none pl-12 font-sf-pro"
                                        />

                                        {isLoading && <p>Loading skills...</p>}
                                        {error && <p className="text-red-500 text-sm">Failed to load skills.</p>}
                                        {/* Show skills list if no skills are selected */}
                                        {skills && selectedTechStack.length === 0 && (
                                            <ul className="mt-2 max-h-40 overflow-y-auto border rounded-lg bg-white absolute w-full p-2 font-sf-pro">
                                                {skills.data.map((skill: any) => (
                                                    <li
                                                        key={skill._id}
                                                        className="p-2 hover:bg-gray-100 hover:rounded-sm cursor-pointer flex gap-2 leading-5"
                                                        onClick={() => handleSkillSelect(skill._id)} // Select the skill
                                                    >
                                                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                        {skill.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    </div>
                                </div>
                                {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}

                                {/* Display selected skills */}
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {
                                            skillsName?.data?.skill_pool_id?.length > 0 ? (
                                                skillsName.data.skill_pool_id.map((skill: any) => (
                                                    <span key={skill._id} className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5 font-sf-pro">
                                                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                        {skill.name}
                                                        {console.log(skill.icon)}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSkillRemove(skill._id)} // Remove skill
                                                            className="ml-2 text-white bg-gray-400 rounded-full w-5 h-5 text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                selectedTechStack.map((skillId) => {
                                                    const skill = skills.data?.find((s: { _id: string }) => s._id === skillId); // Find skill by ID
                                                    return (
                                                        skill && (
                                                            <span key={skillId} className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5 font-sf-pro">
                                                                {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                                {skill.name}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSkillRemove(skillId)} // Remove skill
                                                                    className="ml-2 text-white bg-gray-400 rounded-full w-5 h-5 text-xs"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </span>
                                                        )
                                                    );
                                                })
                                            )
                                        }
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

                            {/* Disable the button when saving */}
                            <button
                                type="submit"
                                className="flex h-[44px] p-4 justify-center items-center gap-2 self-stretch rounded bg-[#00183D] text-white hover:bg-gray-600 text-[16px] font-medium leading-[24px] tracking-[0.24px]"
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