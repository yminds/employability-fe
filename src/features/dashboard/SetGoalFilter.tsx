import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SetGoalFilterProps {
  filters: any; // Filter data passed from the parent
  onFilterChange: (updatedFilters: any) => void; // Function to update filters
}

const SetGoalFilter: React.FC<SetGoalFilterProps> = ({ filters, onFilterChange }) => {
  const [filterParams, setFilterParams] = useState<any>({});
  const [tempMinSalary, setTempMinSalary] = useState<number>(0); // Temporary state for min salary
  const [tempMaxSalary, setTempMaxSalary] = useState<number>(50); // Temporary state for max salary

  useEffect(() => {
    setFilterParams(filters);
    // setTempMinSalary(filters.min_salary_range ? filters.min_salary_range / 100000 : 0);
    setTempMaxSalary(filters.max_salary_range ? filters.max_salary_range / 100000 : 50);
  }, [filters]);

  const updateFilters = (newParams: any) => {
    const updatedFilters = { ...filterParams, ...newParams };
    setFilterParams(updatedFilters);
    onFilterChange(updatedFilters); // Notify the parent
  };

  // Handle selection updates
  const handleSelect = (level: string) => {
    const newLevels = level === '1' ? ['1'] : level === '2' ? ['2'] : ['3']; // handle single selection
    updateFilters({ experience_level: newLevels });
  };

  const handleSelectDemand = (demand: string) => {
    updateFilters({ job_market_demand: demand });
  };

  const handleSelectOption = (value: string) => {
    updateFilters({ learning_time: value });
  };

  const handleDiffcultSelect = (level: string) => {
    updateFilters({ difficulty_level: level });
  };

  const handleApply = () => {
    // Update filterParams with temporary state values for salary range
    updateFilters({
    //   min_salary_range: tempMinSalary * 100000,
      max_salary_range: tempMaxSalary * 100000,
    });
  };

  return (
    <>
      {/* Experience Level */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Experience Level</label>
        <div className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3'].map(level => (
            <div
              key={level}
              onClick={() => handleSelect(level)}
              className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.experience_level?.includes(level) ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]' : 'bg-white border-[#B4B4B5]'}`}
            >
              <input
                type="checkbox"
                id={`level-${level}`}
                checked={filterParams.experience_level?.includes(level)}
                onChange={() => handleSelect(level)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor={`level-${level}`} className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer">
                  {level === '1' ? 'Entry Level' : level === '2' ? 'Mid Level' : 'Senior Level'}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <div>
          <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
            Expected Salary Range
          </label>
          <p className="text-[#909091] text-sm font-medium leading-5 tracking-[0.21px]">
            Choose a range
          </p>
        </div>
        <div className="flex justify-between w-full text-[#414447] text-[14px] font-medium leading-[21px] tracking-[0.21px]">
          <span>{tempMinSalary} LPA</span>
          <span>{tempMaxSalary} LPA</span>
        </div>
        <div className="relative w-full flex items-center">
          <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
          <div
            className="absolute h-1 bg-[#2EE578] rounded-full"
            style={{
              left: `${(tempMinSalary / 50) * 100}%`,
              right: `${100 - (tempMaxSalary / 50) * 100}%`,
            }}
          ></div>
          <input
            type="range"
            min="0"
            max="50"
            value={tempMinSalary}
            onChange={(e) => setTempMinSalary(Math.min(Number(e.target.value), tempMaxSalary))}
            className="absolute w-full h-1 appearance-none focus:outline-none pointer-events-auto z-10"
            style={{ background: "transparent" }}
          />
          <input
            type="range"
            min="0"
            max="50"
            value={tempMaxSalary}
            onChange={(e) => setTempMaxSalary(Math.max(Number(e.target.value), tempMinSalary))}
            className="absolute w-full h-1 appearance-none focus:outline-none pointer-events-auto z-10"
            style={{ background: "transparent" }}
          />
        </div>
        <button
          className="py-2 text-sm w-[80px] font-medium text-[#001630] rounded-md border border-solid border-[#001630] float-end mt-2"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>

      {/* Job Market Demand */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Job Market Demand</label>
        <div className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3'].map(demand => (
            <div
              key={demand}
              onClick={() => handleSelectDemand(demand)}
              className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.job_market_demand === demand ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]' : 'bg-white border-[#B4B4B5]'}`}
            >
              <input
                type="checkbox"
                id={`demand-${demand}`}
                checked={filterParams.job_market_demand === demand}
                onChange={() => handleSelectDemand(demand)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor={`demand-${demand}`} className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer">
                  {demand === '1' ? 'High Demand' : demand === '2' ? 'Mid Demand' : 'Low Demand'}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Learning Time */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Est. Learning Time</label>
        <RadioGroup value={filterParams.learning_time} className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3', '4'].map(option => (
            <div
              key={option}
              onClick={() => handleSelectOption(option)}
              className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${filterParams.learning_time === option ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]' : 'bg-white border-[#B4B4B5]'}`}
            >
              <RadioGroupItem value={option} id={`option-${option}`} />
              <label htmlFor={`option-${option}`} className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer">
                {option === '1' ? '1-3 Months' : option === '2' ? '3-6 Months' : option === '3' ? '6-12 Months' : 'Over 1 Year'}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Difficulty Level */}
      <div className="flex flex-col items-start w-[280px] gap-5 pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">Difficulty Level</label>
        <div className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3'].map(difficulty => (
            <div
              key={difficulty}
              onClick={() => handleDiffcultSelect(difficulty)}
              className={`items-top flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.difficulty_level === difficulty ? 'border-[#1FD167] bg-[rgba(31,209,103,0.15)]' : 'bg-white border-[#B4B4B5]'}`}
            >
              <input
                type="checkbox"
                id={`difficulty-${difficulty}`}
                checked={filterParams.difficulty_level === difficulty}
                onChange={() => handleDiffcultSelect(difficulty)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor={`difficulty-${difficulty}`} className="text-gray-500 text-sm font-medium leading-5 tracking-tight cursor-pointer">
                  {difficulty === '1' ? 'Easy' : difficulty === '2' ? 'Medium' : 'Hard'}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SetGoalFilter;
