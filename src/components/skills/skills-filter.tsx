import React from 'react';

interface SkillsFilterProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const SkillsFilter: React.FC<SkillsFilterProps> = ({ activeFilter, setFilter }) => {
  const filters = ['All', 'Suggested', 'Verified', 'Unverified'];

  return (
    <div className="flex space-x-4 bg-gray-100 p-2 rounded-md shadow-sm">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`px-4 py-2 text-sm font-medium rounded-md 
            ${
              activeFilter === filter
                ? 'bg-green-100 text-green-600'
                : 'bg-transparent text-gray-700 hover:text-green-600'
            }
          `}
        >
          {filter}
      </button>
      ))}
    </div>
  );
};

export default SkillsFilter;
