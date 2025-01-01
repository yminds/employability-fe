import React, { useState } from 'react';
import GoalList from "@/features/dashboard/GoalList";
import GoalFormDialog from "@/features/dashboard/GoalFormDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Goal {
    title: string;
    _id: string;
    name: string;
    description: string;
    image?: string;
    skill_pool_id: string[]; // Array of skill IDs associated with the goal
    predefined_goal_id: string;
}

const SetGoalCard: React.FC<{ setJourneyDialog: any; }> = ({ setJourneyDialog }) => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); // State to store selected goal
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    const handleLinkClick = () => {
        setSelectedGoal(null); // Set the selected goal
        setIsDialogOpen(true); // Open the dialog
    };

    const [selectedLevels, setSelectedLevels] = useState<string[]>(['entry']);
    const handleSelect = (level: string) => {
        if (selectedLevels.includes(level)) {
            // Remove the level if it's already selected
            setSelectedLevels(selectedLevels.filter((item) => item !== level));
        }
        else {
            // Add the level if it's not selected
            setSelectedLevels([...selectedLevels, level]);
        }
    };

    const [selectedDemands, setSelectedDemands] = useState<any[]>([]);
    const handleSelectDemand = (demand: any) => {
        if (selectedDemands.includes(demand)) {
            // Remove the demand if it's already selected
            setSelectedDemands(selectedDemands.filter((item) => item !== demand));
        }
        else {
            // Add the demand if it's not selected
            setSelectedDemands([...selectedDemands, demand]);
        }
    };

    const [selectedOption, setSelectedOption] = useState('1-3 Months');
    const handleSelectOption = (value: React.SetStateAction<string>) => {
        setSelectedOption(value);
    };

    const [selectedDiffcultLevels, setSelectedDiffcultLevels] = useState<string[]>(['easy']);

    const handleDiffcultSelect = (level: any) => {
        if (selectedDiffcultLevels.includes(level)) {
            setSelectedDiffcultLevels(selectedDiffcultLevels.filter((item) => item !== level));
        } else {
            setSelectedDiffcultLevels([...selectedDiffcultLevels, level]);
        }
    };

    const [salaryRange, setSalaryRange] = useState([0, 50]);

    const handleMinChange = (e: { target: { value: any; }; }) => {
        const minValue = Math.min(Number(e.target.value), salaryRange[1]);
        setSalaryRange([minValue, salaryRange[1]]);
    };

    const handleMaxChange = (e) => {
        const maxValue = Math.max(Number(e.target.value), salaryRange[0]);
        setSalaryRange([salaryRange[0], maxValue]);
    };

    return <>
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 flex flex-col gap-10 shrink-0">
                {/* Experience Level */}
                <div className="flex flex-col items-start w-[280px] gap-5">
                    <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Experience Level</label>
                    <div className="flex flex-col items-start gap-3 self-stretch">
                        {/* Entry Level */}
                        <div
                            onClick={() => handleSelect('entry')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('entry')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="entry"
                                checked={selectedLevels.includes('entry')}
                                onChange={() => handleSelect('entry')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="entry"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Entry Level
                                </label>
                            </div>
                        </div>

                        {/* Mid Level */}
                        <div
                            onClick={() => handleSelect('mid')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('mid')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="mid"
                                checked={selectedLevels.includes('mid')}
                                onChange={() => handleSelect('mid')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="mid"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Mid Level
                                </label>
                            </div>
                        </div>

                        {/* Senior Level */}
                        <div
                            onClick={() => handleSelect('senior')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('senior')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="senior"
                                checked={selectedLevels.includes('senior')}
                                onChange={() => handleSelect('senior')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="senior"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Senior Level
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expected Salary Range */}
                <div className="flex flex-col items-start w-[280px] gap-5">
                    <div>
                        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Expected Salary Range</label>
                        <p className="text-[#909091] text-sm font-medium leading-5 tracking-[0.21px]">Choose a range</p>
                    </div>
                    {/* Slider */}
                    <div className="relative w-full flex items-center">
                        {/* Range Track */}
                        <div
                            className="absolute h-1 bg-[#1FD167] rounded-full"
                            style={{
                                left: `${(salaryRange[0] / 50) * 100}%`,
                                right: `${100 - (salaryRange[1] / 50) * 100}%`,
                            }}
                        ></div>
                        {/* Min Slider */}
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={salaryRange[0]}
                            onChange={handleMinChange}
                            className="absolute w-full h-1 bg-[#1FD167] appearance-none focus:outline-none pointer-events-auto"
                            style={{ zIndex: 2 }}
                        />
                        {/* Max Slider */}
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={salaryRange[1]}
                            onChange={handleMaxChange}
                            className="absolute w-full h-1 bg-[#1FD167] appearance-none focus:outline-none pointer-events-auto"
                            style={{ zIndex: 2 }}
                        />
                        {/* Highlighted Range */}
                        <div
                            className="h-1 bg-[#1FD167] z-10 rounded-full"
                            style={{
                                left: `${(salaryRange[0] / 50) * 100}%`,
                                right: `${100 - (salaryRange[1] / 50) * 100}%`,
                            }}
                        >
                        </div>
                    </div>

                    {/* Range Labels */}
                    <div className="flex justify-between w-full text-sm text-gray-600">
                        <span>0 LPA</span>
                        <span>50 LPA</span>
                    </div>

                    {/* Apply Button */}
                    <button className="py-2 text-sm w-[80px] font-medium text-[#001630] rounded-md border border-solid border-[#001630] float-end">
                        Apply
                    </button>
                </div>

                {/* Job Market Demand  */}
                <div className="flex flex-col items-start w-[280px] gap-5">
                    <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Job Market Demand</label>
                    <div className="flex flex-col items-start gap-3 self-stretch">
                        {/* High Demand */}
                        <div
                            onClick={() => handleSelectDemand('high-demand')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('high-demand')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="high-demand"
                                checked={selectedDemands.includes('high-demand')}
                                onChange={() => handleSelectDemand('high-demand')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="high-demand"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    High Demand
                                </label>
                            </div>
                        </div>

                        {/* Mid Demand */}
                        <div
                            onClick={() => handleSelectDemand('mid-demand')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('mid-demand')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="mid-demand"
                                checked={selectedDemands.includes('mid-demand')}
                                onChange={() => handleSelectDemand('mid-demand')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="mid-demand"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Mid Demand
                                </label>
                            </div>
                        </div>

                        {/* Low Demand */}
                        <div
                            onClick={() => handleSelectDemand('low-demand')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('low-demand')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="low-demand"
                                checked={selectedDemands.includes('low-demand')}
                                onChange={() => handleSelectDemand('low-demand')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="low-demand"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Low Demand
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estimated Learning Time */}
                <div className="flex flex-col items-start w-[280px] gap-5">
                    <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
                        Est. Learning Time
                    </label>
                    <RadioGroup
                        value={selectedOption}
                        className="flex flex-col items-start gap-3 self-stretch"
                    >
                        {/* 1-3 Months */}
                        <div
                            className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '1-3 Months'
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                            onClick={() => handleSelectOption('1-3 Months')}
                        >
                            <RadioGroupItem value="1-3 Months" id="option-one" />
                            <label
                                htmlFor="option-one"
                                className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                            >
                                1-3 Months
                            </label>
                        </div>

                        {/* 3-6 Months */}
                        <div
                            className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '3-6 Months'
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                            onClick={() => handleSelectOption('3-6 Months')}
                        >
                            <RadioGroupItem value="3-6 Months" id="option-two" />
                            <label
                                htmlFor="option-two"
                                className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                            >
                                3-6 Months
                            </label>
                        </div>

                        {/* 6-12 Months */}
                        <div
                            className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '6-12 Months'
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                            onClick={() => handleSelectOption('6-12 Months')}
                        >
                            <RadioGroupItem value="6-12 Months" id="option-three" />
                            <label
                                htmlFor="option-three"
                                className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                            >
                                6-12 Months
                            </label>
                        </div>

                        {/* Over 1 Year */}
                        <div
                            className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === 'Over 1 Year'
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                            onClick={() => handleSelectOption('Over 1 Year')}
                        >
                            <RadioGroupItem value="Over 1 Year" id="option-four" />
                            <label
                                htmlFor="option-four"
                                className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                            >
                                Over 1 Year
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Difficulty Level */}
                <div className="flex flex-col items-start w-[280px] gap-5">
                    <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Difficulty Level</label>
                    <div className="flex flex-col items-start gap-3 self-stretch">
                        {/* Easy */}
                        <div
                            onClick={() => handleDiffcultSelect('easy')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('easy')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="easy"
                                checked={selectedDiffcultLevels.includes('easy')}
                                onChange={() => handleDiffcultSelect('easy')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="easy"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Easy
                                </label>
                            </div>
                        </div>

                        {/* Medium */}
                        <div
                            onClick={() => handleDiffcultSelect('medium')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('medium')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="medium"
                                checked={selectedDiffcultLevels.includes('medium')}
                                onChange={() => handleDiffcultSelect('medium')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="medium"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Medium
                                </label>
                            </div>
                        </div>

                        {/* Hard */}
                        <div
                            onClick={() => handleDiffcultSelect('hard')}
                            className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('hard')
                                ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                                : 'bg-white border-[#B4B4B5]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                id="hard"
                                checked={selectedDiffcultLevels.includes('hard')}
                                onChange={() => handleDiffcultSelect('hard')}
                                className="hidden"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="hard"
                                    className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                                >
                                    Hard
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-span-3 flex flex-col items-start gap-6 flex-1">
                <div className="flex items-center gap-5 self-stretch relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <img src="./src/assets/set-goal/mail.svg" alt="Search" />
                    </span>
                    <input
                        type="text"
                        id="tech-stack"
                        placeholder="Search"
                        autoComplete="off"
                        className="flex h-[50px] p-2 px-12 justify-between items-center flex-[1_0_0] rounded-[6px] border border-black/10 bg-[#FAFBFE] focus:outline-none"
                    />
                    <button className="flex p-3 px-6 py-3 gap-3 rounded bg-[#00183D] hover:bg-[#062549] text-white text-base font-medium leading-6 font-sf-pro" onClick={() => handleLinkClick()}>
                        <img
                            src="./src/assets/dashboard/add.svg"
                            className="w-3 h-3 mt-1"
                        />
                        Create Custom Goal</button>
                    {isDialogOpen && (
                        <GoalFormDialog
                            isOpen={isDialogOpen}
                            setIsOpen={setIsDialogOpen}
                            selectedGoal={selectedGoal}
                            setJourneyDialog={setJourneyDialog}
                        />
                    )}
                </div>

                <section className="flex flex-col items-start gap-4 self-stretch">
                    <h5 className="text-[20px] font-medium leading-[26px] tracking[-0.2px]">All Goals</h5>
                    <GoalList isLoading={false} error={false} setJourneyDialog={setJourneyDialog} />
                </section>
            </div>
        </div>
    </>
};

export default SetGoalCard;