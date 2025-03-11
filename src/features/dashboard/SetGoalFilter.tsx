import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SetGoalFilterProps {
  filters: any;
  onFilterChange: (updatedFilters: any) => void;
}

const SetGoalFilter: React.FC<SetGoalFilterProps> = ({ filters, onFilterChange }) => {
  const [filterParams, setFilterParams] = useState<any>({});
  const [tempMinSalary, setTempMinSalary] = useState<number>(0);
  const [tempMaxSalary, setTempMaxSalary] = useState<number>(50);

  useEffect(() => {
    setFilterParams(filters);
    // If needed, update for min salary as well:
    setTempMinSalary(filters.min_salary_range ? filters.min_salary_range / 100000 : 0);
    setTempMaxSalary(filters.max_salary_range ? filters.max_salary_range / 100000 : 50);
  }, [filters]);

  const updateFilters = (newParams: any) => {
    const updatedFilters = { ...filterParams, ...newParams };
    setFilterParams(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSelect = (level: string) => {
    const newLevels = level === '1' ? ['1'] : level === '2' ? ['2'] : ['3'];
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
    // Ensure we store them with min < max, just in case.
    const minValue = Math.min(tempMinSalary, tempMaxSalary);
    const maxValue = Math.max(tempMinSalary, tempMaxSalary);

    updateFilters({
      // If you also need to set `min_salary_range`, do so here:
      min_salary_range: minValue * 100000,
      max_salary_range: maxValue * 100000,
    });
  };

  return (
    <>
      {/* Experience Level */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
          Experience Level
        </label>
        <div className="flex flex-col items-start gap-3 self-stretch">

          {/* All option */}
          <div
            className={`flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${
              // "All" is active if experience_level is empty or missing
              Array.isArray(filterParams.experience_level) &&
                filterParams.experience_level.length === 0
                ? 'border-[#000000] bg-none'
                : 'bg-white border-[#B4B4B5]'
              }`}
            onClick={() => updateFilters({ experience_level: [] })}
          >
            <div className="grid gap-1.5 leading-none">
              <label
                className={`text-sm font-medium leading-5 tracking-tight cursor-pointer ${
                  // If array is empty, highlight text
                  Array.isArray(filterParams.experience_level) &&
                    filterParams.experience_level.length === 0
                    ? 'text-black font-medium'
                    : 'text-gray-500'
                  }`}
              >
                All
              </label>
            </div>
          </div>

          {/* Individual levels */}
          {['1', '2', '3'].map((level) => (
            <div
              key={level}
              onClick={() => handleSelect(level)}
              className={`flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.experience_level?.includes(level)
                  ? 'border-[#000000] bg-none'
                  : 'bg-white border-[#B4B4B5]'
                }`}
            >
              <input
                type="checkbox"
                id={`level-${level}`}
                checked={filterParams.experience_level?.includes(level)}
                onChange={() => handleSelect(level)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`level-${level}`}
                  className={`text-sm font-medium leading-5 tracking-tight cursor-pointer ${filterParams.experience_level?.includes(level)
                      ? 'text-black font-medium'
                      : 'text-gray-500'
                    }`}
                >
                  {level === '1'
                    ? 'Entry Level'
                    : level === '2'
                      ? 'Mid Level'
                      : 'Senior Level'}
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

        {/* Double Slider */}
        <div className="relative w-full h-6">
          {/* Background track */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
          {/* Filled area (between min & max) */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-black rounded-full"
            style={{
              left: `${(tempMinSalary / 50) * 100}%`,
              width: `${((tempMaxSalary - tempMinSalary) / 50) * 100}%`,
            }}
          />

          {/* Min slider */}
          <input
            type="range"
            min={0}
            max={50}
            value={tempMinSalary}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              // Don’t let the min go above the current max
              if (newValue > tempMaxSalary) {
                setTempMinSalary(tempMaxSalary);
              } else {
                setTempMinSalary(newValue);
              }
            }}
            className="absolute w-full pointer-events-auto bg-transparent"
            style={{ top: 10, left: 0 }}
          />

          {/* Max slider */}
          <input
            type="range"
            min={0}
            max={50}
            value={tempMaxSalary}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              // Don’t let the max go below the current min
              if (newValue < tempMinSalary) {
                setTempMaxSalary(tempMinSalary);
              } else {
                setTempMaxSalary(newValue);
              }
            }}
            className="absolute w-full pointer-events-auto bg-transparent"
            style={{ top: 10, left: 0 }}
          />

          {/* Slider thumb styling */}
          <style>
            {`
              input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 6px;
                outline: none;
                
              }

              input[type="range"]::-webkit-slider-runnable-track {
                height: 6px;
                background: transparent;
                border: none;
                border-radius: 0;
              }

              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #fff;
                border: 1px solid #001630;
                cursor: pointer;
                margin-top: -5px; /* centers thumb relative to track */
                position: relative;
                z-index: 2;
              }

              input[type="range"]::-moz-range-thumb {
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #fff;
                border: 1px solid #001630;
                cursor: pointer;
                position: relative;
                z-index: 2;
              }
            `}
          </style>
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
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
          Job Market Demand
        </label>
        <div className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3'].map(demand => (
            <div
              key={demand}
              onClick={() => handleSelectDemand(demand)}
              className={`flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.job_market_demand === demand
                  ? 'border-[#000000] bg-none'
                  : 'bg-white border-[#B4B4B5]'
                }`}
            >
              <input
                type="checkbox"
                id={`demand-${demand}`}
                checked={filterParams.job_market_demand === demand}
                onChange={() => handleSelectDemand(demand)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`demand-${demand}`}
                  className={`text-sm font-medium leading-5 tracking-tight cursor-pointer ${filterParams.job_market_demand === demand
                      ? "text-black font-medium"
                      : "text-gray-500"
                    }`}
                >
                  {demand === '1'
                    ? 'High Demand'
                    : demand === '2'
                      ? 'Mid Demand'
                      : 'Low Demand'}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Learning Time */}
      <div className="flex flex-col items-start w-[280px] gap-5 border-b border-[#E0E0E0] pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
          Est. Learning Time
        </label>
        <RadioGroup
          value={filterParams.learning_time}
          className="flex flex-col items-start gap-3 self-stretch"
        >
          {['1', '2', '3', '4'].map(option => (
            <div
              key={option}
              onClick={() => handleSelectOption(option)}
              className={`flex items-center space-x-2 p-2 px-3 rounded border cursor-pointer w-full ${filterParams.learning_time === option
                  ? 'border-[#000000] bg-none'
                  : 'bg-white border-[#B4B4B5]'
                }`}
            >
              <RadioGroupItem value={option} id={`option-${option}`} />
              <label
                htmlFor={`option-${option}`}
                className={`text-sm font-medium leading-5 tracking-tight cursor-pointer ${filterParams.learning_time === option
                    ? "text-black font-medium"
                    : "text-gray-500"
                  }`}
              >
                {option === '1'
                  ? '1-3 Months'
                  : option === '2'
                    ? '3-6 Months'
                    : option === '3'
                      ? '6-12 Months'
                      : 'Over 1 Year'}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Difficulty Level */}
      <div className="flex flex-col items-start w-[280px] gap-5 pb-6">
        <label className="text-[#414447] text-base font-medium leading-6 tracking-wide">
          Difficulty Level
        </label>
        <div className="flex flex-col items-start gap-3 self-stretch">
          {['1', '2', '3'].map(difficulty => (
            <div
              key={difficulty}
              onClick={() => handleDiffcultSelect(difficulty)}
              className={`flex space-x-2 p-2 px-3 items-center self-stretch rounded border cursor-pointer ${filterParams.difficulty_level === difficulty
                  ? 'border-[#000000] bg-none'
                  : 'bg-white border-[#B4B4B5]'
                }`}
            >
              <input
                type="checkbox"
                id={`difficulty-${difficulty}`}
                checked={filterParams.difficulty_level === difficulty}
                onChange={() => handleDiffcultSelect(difficulty)}
                className="hidden"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`difficulty-${difficulty}`}
                  className={`text-sm font-medium leading-5 tracking-tight cursor-pointer ${filterParams.difficulty_level === difficulty
                      ? "text-black font-medium"
                      : "text-gray-500"
                    }`}
                >
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
