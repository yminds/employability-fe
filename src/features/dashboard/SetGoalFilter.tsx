import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SetGoalFilter: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
    const [filterParams, setFilterParams] = useState<any>({});

    // Update filter parameters and notify the parent component
    const updateFilters = (newParams: any) => {
      const updatedFilters = { ...filterParams, ...newParams };
      setFilterParams(updatedFilters);
      onFilterChange(updatedFilters); // Notify the parent
    };
  
    // Level Selection
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['1']);
    const handleSelect = (level: string) => {
      setSelectedLevels((prevSelectedLevels) => {
        const updatedLevels = prevSelectedLevels.includes(level)
          ? prevSelectedLevels.filter((item) => item !== level)
          : [...prevSelectedLevels, level];
  
        updateFilters({ experience_level: updatedLevels });
        return updatedLevels;
      });
    };
  
    // Demand Selection
    const [selectedDemands, setSelectedDemands] = useState<any[]>([]);
    const handleSelectDemand = (demand: any) => {
      setSelectedDemands((prevSelectedDemands) => {
        const updatedDemands = prevSelectedDemands.includes(demand)
          ? prevSelectedDemands.filter((item) => item !== demand)
          : [...prevSelectedDemands, demand];
  
        updateFilters({ job_market_demand: updatedDemands });
        return updatedDemands;
      });
    };
  
    // Learning Time Selection
    const [selectedOption, setSelectedOption] = useState('1');
    const handleSelectOption = (value: string) => {
      setSelectedOption(value);
      updateFilters({ learning_time: value });
    };
  
    // Difficulty Level Selection
    const [selectedDiffcultLevels, setSelectedDifficultyLevels] = useState<string[]>(['1']);
    const handleDiffcultSelect = (level: string) => {
      setSelectedDifficultyLevels((prevLevels) => {
        const updatedLevels = prevLevels.includes(level)
          ? prevLevels.filter((item) => item !== level)
          : [...prevLevels, level];
  
        updateFilters({ difficulty_level: updatedLevels });
        return updatedLevels;
      });
    };
  
    // Salary Range
    const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 50]);
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const minValue = Math.min(Number(e.target.value), salaryRange[1]);
      setSalaryRange([minValue, salaryRange[1]]);
       updateFilters({ min_salary_range: minValue * 100000 });
    };
  
    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maxValue = Math.max(Number(e.target.value), salaryRange[0]);
      setSalaryRange([salaryRange[0], maxValue]);
      updateFilters({ max_salary_range: maxValue * 100000 });
    };
  
    return <>
        {/* Experience Level */}
        <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
            <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Experience Level</label>
            <div className="flex flex-col items-start gap-3 self-stretch">
                {/* Entry Level */}
                <div
                    onClick={() => handleSelect('1')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('1')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="entry"
                        checked={selectedLevels.includes('1')}
                        onChange={() => handleSelect('1')}
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
                    onClick={() => handleSelect('2')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('2')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="mid"
                        checked={selectedLevels.includes('2')}
                        onChange={() => handleSelect('2')}
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
                    onClick={() => handleSelect('3')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedLevels.includes('3')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="senior"
                        checked={selectedLevels.includes('3')}
                        onChange={() => handleSelect('3')}
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
        <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
            <div>
                <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Expected Salary Range</label>
                <p className="text-[#909091] text-sm font-medium leading-5 tracking-[0.21px]">Choose a range</p>
            </div>

            {/* Range Labels */}
            <div className="flex justify-between w-full text-[#414447] text-[14px] font-medium leading-[21px] tracking-[0.21px]">
                <span>0 LPA</span>
                <span>50 LPA</span>
            </div>
            <div className="relative w-full flex items-center">
                {/* Track (background line) */}
                <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>

                {/* Highlighted Range */}
                <div
                    className="absolute h-1 bg-[#2EE578] rounded-full"
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
                    className="absolute w-full h-1 appearance-none focus:outline-none pointer-events-auto z-10"
                    style={{
                        background: "transparent",
                    }}
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={salaryRange[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full h-1 appearance-none focus:outline-none pointer-events-auto z-10"
                    style={{
                        background: "transparent",
                    }}
                />
            </div>

            {/* Apply Button */}
            <button className="py-2 text-sm w-[80px] font-medium text-[#001630] rounded-md border border-solid border-[#001630] float-end mt-2">
                Apply
            </button>
        </div>

        {/* Job Market Demand  */}
        <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
            <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Job Market Demand</label>
            <div className="flex flex-col items-start gap-3 self-stretch">
                {/* High Demand */}
                <div
                    onClick={() => handleSelectDemand('1')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('1')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="high-demand"
                        checked={selectedDemands.includes('1')}
                        onChange={() => handleSelectDemand('1')}
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
                    onClick={() => handleSelectDemand('2')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('2')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="mid-demand"
                        checked={selectedDemands.includes('2')}
                        onChange={() => handleSelectDemand('2')}
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
                    onClick={() => handleSelectDemand('3')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDemands.includes('3')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="low-demand"
                        checked={selectedDemands.includes('3')}
                        onChange={() => handleSelectDemand('3')}
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
        <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
            <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
                Est. Learning Time
            </label>
            <RadioGroup
                value={selectedOption}
                className="flex flex-col items-start gap-3 self-stretch"
            >
                {/* 1-3 Months */}
                <div
                    className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '1'
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                    onClick={() => handleSelectOption('1')}
                >
                    <RadioGroupItem value="1" id="option-one" />
                    <label
                        htmlFor="option-one"
                        className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                    >
                        1-3 Months
                    </label>
                </div>

                {/* 3-6 Months */}
                <div
                    className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '2'
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                    onClick={() => handleSelectOption('2')}
                >
                    <RadioGroupItem value="2" id="option-two" />
                    <label
                        htmlFor="option-two"
                        className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                    >
                        3-6 Months
                    </label>
                </div>

                {/* 6-12 Months */}
                <div
                    className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '3'
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                    onClick={() => handleSelectOption('3')}
                >
                    <RadioGroupItem value="3" id="option-three" />
                    <label
                        htmlFor="option-three"
                        className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer"
                    >
                        6-12 Months
                    </label>
                </div>

                {/* Over 1 Year */}
                <div
                    className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${selectedOption === '4'
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                    onClick={() => handleSelectOption('4')}
                >
                    <RadioGroupItem value="4" id="option-four" />
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
        <div className="flex flex-col items-start w-[280px] gap-5 pb-6">
            <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Difficulty Level</label>
            <div className="flex flex-col items-start gap-3 self-stretch">
                {/* Easy */}
                <div
                    onClick={() => handleDiffcultSelect('1')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('1')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="easy"
                        checked={selectedDiffcultLevels.includes('1')}
                        onChange={() => handleDiffcultSelect('1')}
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
                    onClick={() => handleDiffcultSelect('2')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('2')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="medium"
                        checked={selectedDiffcultLevels.includes('2')}
                        onChange={() => handleDiffcultSelect('2')}
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
                    onClick={() => handleDiffcultSelect('3')}
                    className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${selectedDiffcultLevels.includes('3')
                        ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]'
                        : 'bg-white border-[#B4B4B5]'
                        }`}
                >
                    <input
                        type="checkbox"
                        id="hard"
                        checked={selectedDiffcultLevels.includes('3')}
                        onChange={() => handleDiffcultSelect('3')}
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
    </>
};

export default SetGoalFilter;
