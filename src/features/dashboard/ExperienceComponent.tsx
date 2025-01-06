interface Filter {
    [key: string]: string | number | (string | number)[] | null | undefined; // Allow null or undefined for removed filters
  }
  
  const experienceLevelObj = {
    1: 'Entry Level',
    2: 'Mid Level',
    3: 'Senior Level'
  };
  
  const difficultyLevelObj = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };
  
  const jobsMarketDemandObj = {
    1: 'High Demand',
    2: 'Mid Demand',
    3: 'Low Demand'
  };
  
  const learningTimeObj = {
    1: '1-3 Months',
    2: '3-6 Months',
    3: '6-12 Months',
    4: 'Over 1 Year'
  };
  
  // Format salary range to Lakhs (1L, 2L, etc.)
  const formatSalaryToLakhs = (salary: number) => {
    if (salary >= 100000) {
      return `${(salary / 100000).toFixed(1)}L`; // Format to Lakhs with one decimal
    }
    return `${salary}`; // Return salary as is if it's less than 1 Lakh
  };
  
  const formatSalaryRange = (min: number, max: number) => {
    const minFormatted = formatSalaryToLakhs(min);
    const maxFormatted = formatSalaryToLakhs(max);
    return `${minFormatted} - ${maxFormatted}`;
  };
  
  const ExperienceComponent: React.FC<{ filters: Filter }> = ({ filters }) => (
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
  
        // Check if the value is an array (multiple values for the same filter)
        if (Array.isArray(value)) {
          displayValue = value
            .map((v) => {
              // For each value, format it based on the key
              if (key === 'experience_level') {
                return experienceLevelObj[v as keyof typeof experienceLevelObj];
              } else if (key === 'difficulty_level') {
                return difficultyLevelObj[v as keyof typeof difficultyLevelObj];
              } else if (key === 'job_market_demand') {
                return jobsMarketDemandObj[v as keyof typeof jobsMarketDemandObj];
              } else if (key === 'learning_time') {
                return learningTimeObj[v as keyof typeof learningTimeObj];
              } else {
                return v;
              }
            })
            .join(', '); // Join multiple values with a comma
        } else {
          // If the value is not an array, format it normally
          displayValue = value;
          if (key === 'experience_level') {
            displayValue = experienceLevelObj[value as keyof typeof experienceLevelObj];
          } else if (key === 'difficulty_level') {
            displayValue = difficultyLevelObj[value as keyof typeof difficultyLevelObj];
          } else if (key === 'job_market_demand') {
            displayValue = jobsMarketDemandObj[value as keyof typeof jobsMarketDemandObj];
          } else if (key === 'min_salary_range' || key === 'max_salary_range') {
            // If min salary is undefined, show 0
            const minSalary = Number(filters.min_salary_range) || 0; // If undefined, use 0
            const maxSalary = Number(filters.max_salary_range) || 0; // If undefined, use 0
            displayValue = formatSalaryRange(minSalary, maxSalary);
          } else if (key === 'learning_time') {
            displayValue = learningTimeObj[value as keyof typeof learningTimeObj];
          }
        }
  
        return (
          <div
            key={key}
            className="flex p-[5px_20px_5px_16px] justify-center items-center gap-[10px] rounded-[57px] bg-[rgba(31,209,103,0.10)] text-[var(--Greens-G7,#10B754)] text-[16px] font-medium leading-[22px]"
          >
            {key.replace('_', ' ').toUpperCase()}: {displayValue}
          </div>
        );
      })}
    </div>
  );
  
  export default ExperienceComponent;
  