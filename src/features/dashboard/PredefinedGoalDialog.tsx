import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateGoalMutation, useGetMultipleSkillsNameQuery } from "@/api/predefinedGoalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    selectedGoal: Goal | null; // Goal data passed as a prop
    setJourneyDialog: boolean;
}

const PredefinedGoalDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal }) => {
    const user_id = useSelector((state: RootState) => state.auth.user?._id || "");
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal] = useState(selectedGoal ? selectedGoal.title : "");
    const [description] = useState(selectedGoal ? selectedGoal.description : "");
    const [isSaved, setIsSaved] = useState(false); // State to handle success message visibility
    const [isSaving, setIsSaving] = useState(false); // State to handle saving/loading state

    const { data: skillsName, error, isLoading } = useGetMultipleSkillsNameQuery(goalId, {
        skip: !goalId,
    });

    const [createGoal] = useCreateGoalMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare goal data
        const goalData = {
            user_id: user_id,
            name: goal || '',
            skill_pool_ids: selectedGoal?.skill_pool_id || [],
            description: description || '',
            predefined_goal_id: selectedGoal?._id || '',
        };
        setIsSaving(true); // Set saving state to true when submitting
        try {
            await createGoal(goalData).unwrap();
            setIsSaved(false);
            setIsOpen(false);
            //setJourneyDialog(false);
        } catch (err) {
            console.error("Failed to save goal:", err);
        }
    };

    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Skills", "Market Trend", "Active Jobs"];

    // SKills
    const skillsData = [
        { skill: "JavaScript", proficiency: "Intermediate", importance: "High" },
        { skill: "HTML", proficiency: "Basic", importance: "Medium" },
        { skill: "CSS", proficiency: "Basic", importance: "Low" },
        { skill: "Node.js", proficiency: "Intermediate", importance: "Medium" },
        { skill: "MongoDB", proficiency: "Advanced", importance: "Medium" },
        { skill: "React.js", proficiency: "Intermediate", importance: "High" },
        { skill: "Express.js", proficiency: "Advanced", importance: "Medium" },
        { skill: "Git Version Control", proficiency: "Basic", importance: "Medium" },
        { skill: "Agile Methodology", proficiency: "Intermediate", importance: "High" },
        { skill: "Communication", proficiency: "Basic", importance: "High" },
        { skill: "Problem Solving", proficiency: "Basic", importance: "High" },
    ];

    const getBadgeColor = (type: string, value: string) => {
        if (type === "proficiency") {
            return value === "Basic"
                ? "bg-blue-100 text-blue-600"
                : value === "Intermediate"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-indigo-100 text-indigo-600";
        }
        if (type === "importance") {
            return value === "Low"
                ? "bg-green-100 text-green-600"
                : value === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-orange-100 text-orange-600";
        }
    };

    // Market Trend
    const chartData = [
        { month: "Jan", jobs: 1200 },
        { month: "Feb", jobs: 1600 },
        { month: "Mar", jobs: 1500 },
        { month: "Apr", jobs: 1400 },
        { month: "May", jobs: 1300 },
        { month: "Jun", jobs: 1400 },
        { month: "Jul", jobs: 1500 },
        { month: "Aug", jobs: 1800 },
        { month: "Sep", jobs: 2200 },
        { month: "Oct", jobs: 2400 },
        { month: "Nov", jobs: 2600 },
        { month: "Dec", jobs: 2800 },
    ];

    const chartConfig = {
        jobs: {
            label: "Jobs",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    // Jobs
    const jobs = [
        {
            id: 1,
            logo: "https://via.placeholder.com/40", // Replace with actual logo URL
            title: "Product Engineer",
            company: "Zoho",
            type: "Freelance",
            salary: "$120k-$160k",
            location: "Kochi, Kerala, India",
        },
        {
            id: 2,
            logo: "https://via.placeholder.com/40", // Replace with actual logo URL
            title: "Technical Lead",
            company: "Paypal",
            type: "Full-time",
            salary: "$120k-$160k",
            location: "Mountain View, California, USA",
        },
        {
            id: 3,
            logo: "https://via.placeholder.com/40", // Replace with actual logo URL
            title: "Frontend Developer",
            company: "Facebook",
            type: "Full-time",
            salary: "$120k-$160k",
            location: "Menlo Park, California, USA",
        },
        {
            id: 4,
            logo: "https://via.placeholder.com/40", // Replace with actual logo URL
            title: "Frontend Developer",
            company: "EY",
            type: "Full-time",
            salary: "$120k-$160k",
            location: "Menlo Park, California, USA",
        },
    ];

    const handleCloseGoals = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 max-w-5xl h-[80vh] overflow-y-auto rounded-[12px] scrollbar-default font-ubuntu [&>button:last-child]:hidden">
                <DialogTitle className="hidden">Predefined Goals</DialogTitle>
                <div>
                    {/* Header Section */}
                    <div className="flex flex-col items-start justify-center gap-5 p-6 px-8 relative h-[245px] ">
                        <button className="flex items-center gap-4 text-gray-600 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro"
                            onClick={handleCloseGoals}>
                            <img
                                src={"./src/assets/dashboard/back.svg"}
                                alt=""
                                className="w-4 z-[9999]"
                            /> Back to Goals
                        </button>

                        <div className="flex flex-col items-start gap-5 z-[9999]">
                            <div className="flex-col items-end gap-3 self-stretch inline-block">
                                <span className="text-[#414447] text-[32px] font-medium leading-[42px] tracking-[-0.5px]">{goal}</span>
                                <span className="p-2 px-4 ml-3 justify-center items-center gap-2 rounded-[42px] bg-[#DBFFEA] text-[#10B754] text-[16px] font-medium leading-[25.6px] tracking-[-0.5px]">
                                    Entry Level
                                </span>
                            </div>
                            <button className="flex w-[196px] h-[44px] p-4 px-8 justify-center items-center gap-2 rounded bg-[#00183D] text-white text-[16px] font-medium leading-[150%] font-sf-pro" onClick={handleSubmit}>
                                Set This Goal
                            </button>
                        </div>

                        <img
                            src={"./src/assets/dashboard/goal_banner.png"}
                            alt="Fullstack Developer"
                            className="rounded-tl-[9px] rounded-tr-[9px] w-full absolute top-0 right-0 h-[245px] object-cover"
                        />
                    </div>

                    <div className="p-6 px-8 font-sf-pro">
                        {/* Tab Navigation */}
                        <div className="flex pb-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex h-[36px] justify-center items-center gap-[10px] flex-[1_0_0] text-center text-base font-normal leading-6 tracking-wide ${activeTab === tab
                                        ? "border-b-2 border-[#00183D] text-[#00183D]"
                                        : "text-[#909091] hover:text-[#00183D]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Section */}
                        {activeTab === "Overview" && (
                            <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
                                <p className="text-black text-opacity-80 text-base font-normal leading-6 tracking-[0.24px]">
                                    {description}
                                </p>

                                {/* Info Cards */}
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#DBFFEA]">
                                        <img
                                            src={"./src/assets/dashboard/entry.svg"}
                                            alt="Entry"
                                            className="w-4"
                                        />
                                        <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                                            <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Entry level salary</p>
                                            <p className="text-[#03963F] text-[20px] font-bold leading-[24px] tracking-[0.3px]">6-15 LPA</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#FFF2DB]">
                                        <img
                                            src={"./src/assets/dashboard/demand.svg"}
                                            alt="Demand"
                                            className="w-4"
                                        />
                                        <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                                            <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Demand</p>
                                            <p className="text-[#D48A0C] text-[20px] font-bold leading-[24px] tracking-[0.3px]">High</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#E5F0FF]">
                                        <img
                                            src={"./src/assets/dashboard/difficult.svg"}
                                            alt="Difficult"
                                            className="w-4"
                                        />
                                        <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                                            <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Difficulty Level</p>
                                            <p className="text-[#3888FF] text-[20px] font-bold leading-[24px] tracking-[0.3px]">High</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#EEEBFF]">
                                        <img
                                            src={"./src/assets/dashboard/estimate.svg"}
                                            alt="Estimate"
                                            className="w-4"
                                        />
                                        <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                                            <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Est. Learning Time</p>
                                            <p className="text-[#8C76FB] text-[20px] font-bold leading-[24px] tracking-[0.3px]">3-6 Months</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#E5F6FF]">
                                        <img
                                            src={"./src/assets/dashboard/engineering.svg"}
                                            alt="Engineering"
                                            className="w-4"
                                        />
                                        <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                                            <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Engineering</p>
                                            <p className="text-[#1FB4FF] text-[20px] font-bold leading-[24px] tracking-[0.3px]">NO!</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px self-stretch bg-[#D9D9D9]"></div>

                                {/* Skills Section */}
                                <div className="flex flex-col items-start gap-6 self-stretch">
                                    <h2 className="flex items-center gap-2 text-gray-600 text-base font-medium leading-5 font-ubuntu">
                                        <img
                                            src={"./src/assets/dashboard/puzzle_piece.svg"}
                                            alt=""
                                            className="w-5 h-5"
                                        />Skills required</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Handle skillsName */}
                                        {isLoading && <p>Loading skills...</p>}
                                        {error && <p className="text-red-500 text-sm">Failed to load skills.</p>}
                                        {
                                            // Ensure skillsName is properly accessed and handled
                                            skillsName?.data?.skill_pool_id?.length > 0 ? (
                                                skillsName.data.skill_pool_id.map((skill: any) => (
                                                    <span
                                                        key={skill._id}
                                                        className="flex p-3 px-5 justify-center items-center gap-2.5 border rounded border-green-600/30 bg-[#EFFBF4] text-black/80 text-base font-normal leading-6 tracking-[0.24px]"
                                                    >
                                                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <p></p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills Tabs */}
                        {activeTab === "Skills" && (
                            <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
                                <div className="w-full mx-auto">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200 rounded-[12px]">
                                            <thead>
                                                <tr className="bg-[#FAFAFA] border-b">
                                                    <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Skills</th>
                                                    <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Proficiency Required</th>
                                                    <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Importance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {skillsData.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                    >
                                                        <td className="p-3 px-6 text-gray-600 text-base font-medium leading-6 tracking-wide">{item.skill}</td>
                                                        <td className="p-3 px-6">
                                                            <span
                                                                className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                                    "proficiency",
                                                                    item.proficiency
                                                                )}`}
                                                            >
                                                                {item.proficiency}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 px-6">
                                                            <span
                                                                className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                                    "importance",
                                                                    item.importance
                                                                )}`}
                                                            >
                                                                {item.importance}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Market Trend Tabs */}
                        {activeTab === "Market Trend" && (
                            <div className="flex flex-col items-start gap-6 flex-1 self-stretch">
                                <div className="flex flex-col items-start gap-3 self-stretch">
                                    <h5 className="text-black text-opacity-80 text-base font-medium leading-5 font-ubuntu">Demand</h5>
                                    <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px]">Full Stack Developers rank among the top 10 most in-demand roles, valued for their front-end and back-end versatility. Demand has risen by 30% in the last three years, driven by startups and large enterprises.</p>
                                </div>

                                <div className="flex justify-center items-center w-full bg-white rounded-lg border">
                                    <div className="w-full">
                                        <div className="flex flex-col justify-center items-start gap-5 self-stretch border-b border-b-[rgba(0,0,0,0.10)] bg-[#FAFAFA] p-5 px-6 rounded-tl-[9px] rounded-tr-[9px]">
                                            <h2 className="flex items-center gap-4 self-stretch text-gray-600 text-base font-medium leading-5 font-ubuntu">
                                                <img
                                                    src={"./src/assets/dashboard/work.svg"}
                                                    alt=""
                                                    className="w-5 h-5"
                                                />Job Demand Over Time</h2>
                                        </div>
                                        <div className="p-6 pt-8 pl-3">
                                            <ChartContainer config={chartConfig}>
                                                <AreaChart
                                                    accessibilityLayer
                                                    data={chartData}
                                                    margin={{
                                                        left: 12,
                                                        right: 12,
                                                    }}
                                                >
                                                    <CartesianGrid vertical={false} />
                                                    <XAxis
                                                        dataKey="month"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                        fontSize={14}
                                                        tickFormatter={(value) => value.slice(0, 3)}
                                                    />
                                                    <YAxis
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                        fontSize={14}
                                                        tickFormatter={(value) => value.toLocaleString()}
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent indicator="dot" hideLabel />}
                                                    />
                                                    <Area
                                                        dataKey="jobs"
                                                        type="linear"
                                                        fillOpacity={0.4}
                                                        stroke="#007BFF"
                                                        fill="rgba(0, 123, 255, 0.4)"
                                                        strokeWidth={3}
                                                    />
                                                </AreaChart>
                                            </ChartContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center w-full bg-white rounded-lg border">
                                    <div className="w-full">
                                        <div className="flex flex-col justify-center items-start gap-5 self-stretch border-b border-b-[rgba(0,0,0,0.10)] bg-[#FAFAFA] p-5 px-6 rounded-tl-[9px] rounded-tr-[9px]">
                                            <h2 className="flex items-center gap-4 self-stretch text-gray-600 text-base font-medium leading-5 font-ubuntu">
                                                <img
                                                    src={"./src/assets/dashboard/work.svg"}
                                                    alt=""
                                                    className="w-5 h-5"
                                                />Interest Over Time</h2>
                                        </div>
                                        <div className="p-6 pt-8 pl-3">
                                            <ChartContainer config={chartConfig}>
                                                <AreaChart
                                                    accessibilityLayer
                                                    data={chartData}
                                                    margin={{
                                                        left: 12,
                                                        right: 12,
                                                    }}
                                                >
                                                    <CartesianGrid vertical={false} />
                                                    <XAxis
                                                        dataKey="month"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                        fontSize={14}
                                                        tickFormatter={(value) => value.slice(0, 3)}
                                                    />
                                                    <YAxis
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                        fontSize={14}
                                                        tickFormatter={(value) => value.toLocaleString()}
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent indicator="dot" hideLabel />}
                                                    />
                                                    <Area
                                                        dataKey="jobs"
                                                        type="linear"
                                                        fillOpacity={0.4}
                                                        stroke="#007BFF"
                                                        fill="rgba(0, 123, 255, 0.4)"
                                                        strokeWidth={3}
                                                    />
                                                </AreaChart>
                                            </ChartContainer>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* Active Jobs Tabs */}
                        {activeTab === "Active Jobs" && (
                            <div className="flex flex-col items-start gap-6 flex-1 self-stretch">
                                <h5 className="text-black text-opacity-80 text-base font-medium leading-5 font-ubuntu">400 Active Jobs in India</h5>
                                <div className="flex flex-col items-start gap-3 w-full">
                                    {jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="flex items-center gap-4 p-6 border border-gray-200 bg-[#FAFAFA] rounded-md w-full"
                                        >
                                            {/* Logo */}
                                            <img
                                                src={job.logo}
                                                alt={job.company}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />

                                            {/* Job Details */}
                                            <div className="flex-1 flex flex-col items-start gap-1">
                                                <h3 className="text-black text-base font-medium leading-5 font-ubuntu">
                                                    {job.title}
                                                </h3>
                                                <div>
                                                    <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px]">
                                                        {job.company} • {job.type} • {job.salary}
                                                    </p>
                                                    <p className="text-gray-500 text-sm font-normal leading-6 tracking-[0.21px]">{job.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PredefinedGoalDialog;