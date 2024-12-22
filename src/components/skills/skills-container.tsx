import React, { useState } from 'react';
import SkillList from './skills-list';
import SuggestedSkills from './suggested-skills';
import SkillSummary from './skills-summary';
import EmployabilityScore from './employabilty-score';
import SkillsFilter from './skills-filter';

// Images
import arrow from '@/assets/skills/arrow.svg';

// Example skills data
const skills = [
  {
    skill: 'Java',
    skillImg: '/images/java-icon.png',
    verified_rating: 9.4,
    selfRating: 8,
    initialStatus: 'Verified',
  },
  {
    skill: 'JavaScript',
    skillImg: '/images/javascript-icon.png',
    verified_rating: 9.2,
    selfRating: 8.5,
    initialStatus: 'Verified',
  },
  {
    skill: 'Python',
    skillImg: '/images/python-icon.png',
    verified_rating: 8.9,
    selfRating: 7.5,
    initialStatus: 'Verified',
  },
  {
    skill: 'C++',
    skillImg: '/images/cpp-icon.png',
    verified_rating: 8.2,
    selfRating: 7,
    initialStatus: 'Unverified',
  },
];

const SkillsContaineer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  return (
    <section className=' w-full h-full flex bg-[#F5F5F5] justify-center  '>
      <div className="grid grid-flow-col w-[1300px] gap-4 m-0">
        {/* Left Section */}
        <div className="col-span-2 w-[920px] h-[46px]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 gap-3">
              <button className='w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center'>
                <img className='w-[10px] h-[10px]' src={arrow} alt="Back" />
              </button>
              <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">Skills</h1>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            {/* Skills Filter */}
            <SkillsFilter activeFilter={activeFilter} setFilter={setActiveFilter} />
            <button className="px-4 py-2 w-[138px] h-[44px] bg-black text-white rounded-md hover:bg-green-600">
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
    </section>
  );
};

export default SkillsContaineer;
