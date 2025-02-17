import React from 'react';
import close from '@/assets/dashboard/close.svg';

interface Filter {
  [key: string]: string | number | (string | number)[] | null | undefined; // Allow null or undefined for removed filters
}

const experienceLevelObj = {
  1: 'Entry Level',
  2: 'Mid Level',
  3: 'Senior Level',
};

const difficultyLevelObj = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

const jobsMarketDemandObj = {
  1: 'High Demand',
  2: 'Mid Demand',
  3: 'Low Demand',
};

const learningTimeObj = {
  1: '1-3 Months',
  2: '3-6 Months',
  3: '6-12 Months',
  4: 'Over 1 Year',
};

// Format salary range to Lakhs (1L, 2L, etc.)
const formatSalaryToLakhs = (salary: number) => {
  if (salary >= 100000) {
    return `${(salary / 100000).toFixed(0)}L`; // Format to Lakhs with one decimal
  }
  return `${salary}`; // Return salary as is if it's less than 1 Lakh
};

const formatSalaryRange = (min: number, max: number) => {
  const minFormatted = formatSalaryToLakhs(min);
  const maxFormatted = formatSalaryToLakhs(max);
  return `${minFormatted} - ${maxFormatted}`;
};

const FilterLabels: React.FC<{
  filters: Filter;
  removeFilter: (key: string) => void; // Function to remove the filter
}> = ({ filters, removeFilter }) => (
  <div className="flex gap-2 flex-wrap">
    {/* Iterate through the filters and display them */}
    {Object.keys(filters).map((key) => {
      // Get the value(s) for the filter key
      const value = filters[key];

      // Skip if the filter is null, undefined, or empty
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return null; // Don't render anything for removed filters
      }

      let displayValue;
      let label = '';

      // Determine the label and display value based on the key
      switch (key) {
        case 'experience_level':
          label = 'Experience';
          displayValue = experienceLevelObj[value as keyof typeof experienceLevelObj];
          break;
        case 'difficulty_level':
          label = 'Difficulty Level';
          displayValue = difficultyLevelObj[value as keyof typeof difficultyLevelObj];
          break;
        case 'job_market_demand':
          label = 'Demand';
          displayValue = jobsMarketDemandObj[value as keyof typeof jobsMarketDemandObj];
          break;
        case 'min_salary_range':
        case 'max_salary_range':
          label = 'Salary Range';
          const minSalary = Number(filters.min_salary_range) || 0;
          const maxSalary = Number(filters.max_salary_range) || 0;
          displayValue = formatSalaryRange(minSalary, maxSalary);
          break;
        case 'learning_time':
          label = 'Learning Time';
          displayValue = learningTimeObj[value as keyof typeof learningTimeObj];
          break;
        default:
          displayValue = value;
          label = key.replace('_', ' ').toUpperCase(); // Default label if not found
      }

      // Check if the value is an array (multiple values for the same filter)
      if (Array.isArray(value)) {
        return value.map((v, index) => {
          let displayItem = v;
          if (key === 'experience_level') {
            displayItem = experienceLevelObj[v as keyof typeof experienceLevelObj];
          } else if (key === 'difficulty_level') {
            displayItem = difficultyLevelObj[v as keyof typeof difficultyLevelObj];
          } else if (key === 'job_market_demand') {
            displayItem = jobsMarketDemandObj[v as keyof typeof jobsMarketDemandObj];
          } else if (key === 'learning_time') {
            displayItem = learningTimeObj[v as keyof typeof learningTimeObj];
          } else {
            displayItem = v;
          }

          return (
            <div
              key={`${key}-${index}`}
              className="flex p-[5px_20px_5px_16px] justify-center items-center gap-[10px] rounded-[57px] bg-[#F4F7F9] text-grey-4 text-[16px] font-medium font-ubuntu leading-[22px]"
            >
              {label}: <span className=' text-grey-6'> {displayItem} </span> 
              {/* Remove button (X) */}
              <button
                onClick={() => removeFilter(key)}
                className="ml-2"
              >
                <img src={close} alt="Remove filter" />
              </button>
            </div>
          );
        });
      }

      return (
        <div
          key={key}
          className="flex p-[5px_20px_5px_16px] justify-center items-center gap-[10px] rounded-[57px] bg-[#F4F7F9] text-grey-4 text-[16px] font-medium font-ubuntu leading-[22px]"
        >
          {label}: <span className=' text-grey-6 font-medium'> {displayValue} </span>
          {/* Remove button (X) */}
          <button
            onClick={() => removeFilter(key)}
            className="ml-2"
          >
            <img src={close} alt="Remove filter" />
          </button>
        </div>
      );
    })}
  </div>
);

export default FilterLabels;
