import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateGoalMutation } from "@/api/goalsApiSlice";
import { useSelector } from "react-redux";

// Define Zod schema for validation
const goalSchema = z.object({
    goal: z.string().min(1, "Goal is required"),
    techStack: z.array(z.string()).min(1, "Tech stack is required"),
    description: z.string().optional(),
})

interface Skills {
    _id: string
    name: string
}

interface SkillsData {
    data: Skills[] // Array of Goal objects
}

interface Props {
    isLoading: boolean
    error: boolean
    data?: SkillsData // The data could be undefined if the API request hasn't completed yet
}

const GoalFormDialog: React.FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false)
    const user_id = useSelector((state) => state.auth.user._id)
    const [goal, setGoal] = useState("")
    const [techStack, setTechStack] = useState("")
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]); // Array to store selected skill IDs
    const [description, setDescription] = useState("")
    const [errors, setErrors] = useState({
        user_id: "",
        goal: "",
        techStack: "",
        description: "",
    })

    const { data: skills, error, isLoading } = useGetMultipleSkillsQuery(techStack);
    useEffect(() => {
    }, [skills, error, isLoading]);

    const [createGoal] = useCreateGoalMutation();

    const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTechStack(e.target.value); // Update the search term immediately
    };

    const handleSkillSelect = (skillId: string, skillName: string) => {
        if (!selectedTechStack.includes(skillId)) {
            setSelectedTechStack((prev) => [...prev, skillId]); // Add the selected skill ID to the array
        }
    };

    const handleSkillRemove = (skillId: string) => {
        setSelectedTechStack((prev) => prev.filter((id) => id !== skillId)); // Remove the skill ID from the array
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsOpen(true) // Open the dialog
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate using Zod
        const result = goalSchema.safeParse({ goal, techStack: selectedTechStack, description })

        if (!result.success) {
            // Handle errors if validation fails
            const newErrors: any = {}
            result.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message
            })
            setErrors(newErrors)

            // Set timeout to clear errors after 2 seconds
            setTimeout(() => {
                setErrors({
                    user_id: "",
                    goal: "",
                    techStack: "",
                    description: "",
                })
            }, 2000)

            return
        }

        // If valid, proceed with form submission (sending the data)
        try {
            const goalData = { user_id: user_id, name: goal, skill_pool_ids: selectedTechStack, description: description };
            await createGoal(goalData).unwrap(); // Send data using the mutation hook
            alert("Goal saved successfully!");
            setIsOpen(false) // Close dialog
        } catch (err) {
            console.error("Failed to save goal:", err);
        }
    }

    return (
        <>
            {/* Link to trigger dialog */}
            <Link to="" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#1FD167]"
                onClick={handleLinkClick}>
                <div className="flex flex-col items-start gap-8 relative p-6">
                    <div className="h-[50px]">
                        <img
                            src="./src/assets/set-goal/custom_goal.svg"
                            alt="Skills"
                            className="mt-3"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-3.5 self-stretch">
                        <h3 className="text-gray-800 text-lg font-medium leading-6 tracking-tight"
                        >Create Custom Goal</h3>
                        <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Define your own career path and learning journey.</p>
                    </div>
                </div>
            </Link>

            {/* Conditionally render the GoalFormDialog */}
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="p-0 max-w-2xl max-h-[100vh] overflow-y-auto">
                        {/* Visually hidden title */}
                        <DialogTitle className="hidden">Define Your Custom Goal</DialogTitle>

                        <div className="flex items-center justify-center">
                            <div className="w-full inline-flex p-[42px] flex-col justify-center items-start gap-[40px]">
                                <div>
                                    <h2 className="text-gray-900 text-2xl font-medium leading-8 tracking-tight">Define Your Custom Goal</h2>
                                    <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">
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
                                                className="flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none"
                                            />
                                        </div>
                                        {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
                                    </div>

                                    {/* Tech Stack Input */}
                                    <div className="w-full">
                                        <div className="flex flex-col items-start gap-3.5">
                                            <label htmlFor="tech-stack" className="text-gray-900 text-base font-medium leading-5 flex flex-col items-start gap-1">
                                                Pick Your Tech Stack
                                                <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">
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
                                                    className="w-full flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none pl-12"
                                                />
                                                {isLoading && <p>Loading skills...</p>}
                                                {error && <p className="text-red-500 text-sm">Failed to load skills.</p>}
                                                {/* Show skills list if no skills are selected */}
                                                {skills.data && selectedTechStack.length === 0 && (
                                                    <ul className="mt-2 max-h-40 overflow-y-auto border rounded-lg bg-white absolute w-full p-2">
                                                        {skills.data.map((skill: any) => (
                                                            <li
                                                                key={skill._id}
                                                                className="p-2 hover:bg-gray-100 hover:rounded-sm cursor-pointer"
                                                                onClick={() => handleSkillSelect(skill._id, skill.name)} // Select the skill
                                                            >
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
                                                {selectedTechStack.map((skillId) => {
                                                    const skill = skills.data?.find((s) => s._id === skillId); // Find skill by ID
                                                    return (
                                                        skill && (
                                                            <span key={skillId} className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5">
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
                                                })}
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
                                            className="w-full flex h-[150px] p-2 px-4 justify-between items-start rounded-[6px] border border-black/10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none"
                                            rows={3}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex h-[44px] p-4 justify-center items-center gap-2 self-stretch rounded bg-[#10B754] text-white text-[16px] font-medium leading-[24px] tracking-[0.24px]"
                                    >
                                        Save Goal
                                    </button>
                                </form>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default GoalFormDialog
