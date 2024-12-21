import React, { useState } from 'react';
import SkillList from './skills-list';
import SuggestedSkills from './suggested-skills';
import SkillSummary from './skills-deatils';
import EmployabilityScore from './employabilty-score';
import SkillsFilter from './skills-filter';

// Images
import arrow from '@/assets/skills/arrow.svg';

// Example skills data
const skills = [
  {
    skill: 'Java',
    skillImg: '/images/java-icon.png',
    rating: 9.4,
    selfRating: 8,
    initialStatus: 'Verified',
  },
  {
    skill: 'JavaScript',
    skillImg: '/images/javascript-icon.png',
    rating: 9.2,
    selfRating: 8.5,
    initialStatus: 'Verified',
  },
  {
    skill: 'Python',
    skillImg: '/images/python-icon.png',
    rating: 8.9,
    selfRating: 7.5,
    initialStatus: 'Verified',
  },
  {
    skill: 'C++',
    skillImg: '/images/cpp-icon.png',
    rating: 8.2,
    selfRating: 7,
    initialStatus: 'Unverified',
  },
];

const SkillsContaineer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  return (
    <div className="grid grid-flow-col min-w-[80vw] gap-4">
      {/* Left Section */}
      <div className="col-span-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button>
              <img src={arrow} alt="Back" />
            </button>
            <h1 className="text-lg font-bold">Skills</h1>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          {/* Skills Filter */}
          <SkillsFilter activeFilter={activeFilter} setFilter={setActiveFilter} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Skills
          </button>
        </div>

        {/* Filtered Skills List */}
        <SkillList skills={skills} activeFilter={activeFilter} />

        {/* Suggested Skills */}
        <SuggestedSkills />
      </div>

      {/* Right Section */}
      <div className="col-span-1 space-y-4">
        <EmployabilityScore />
        <SkillSummary />
      </div>
    </div>
  );
};

export default SkillsContaineer;
