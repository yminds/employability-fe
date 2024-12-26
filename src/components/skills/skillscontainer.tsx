import React, { useState } from 'react';
import { useGetUserSkillsQuery } from '@/api/skillsApiSlice';
import SkillsHeader from '@/components/skills/skillsheader';
import SkillList from '@/components/skills/skillslist';
import SuggestedSkills from '@/components/skills/suggestedskills';
import EmployabilityScore from '@/components/skills/employabiltyscore';
import SkillSummary from '@/components/skills/skillssummary';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const SkillsContainer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const userId = useSelector((state :RootState) => state.auth.user._id);

  // Fetch user skills by userId
  const { data: skillsData, error, isLoading } = useGetUserSkillsQuery(userId);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }
  const handleAddSkills = (newSkills: any[]) => {
    setSkills((prev) => [...prev, ...newSkills]); 
  };

  // The `skillsData` object contains the list of skills
  const skills = skillsData ? skillsData : []; // Ensure skills is always an array
  
  return (
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="grid grid-flow-col w-[1300px] gap-4 m-0">
        {/* Left Section */}
        <div className="w-[920px] h-full overflow-y-auto scrollbar-hide">
          {/* Sticky Header */}
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
          <SkillsHeader
            activeFilter={activeFilter}
            setFilter={setActiveFilter}
            onSkillsAdded={handleAddSkills} 
            skills={skills} // Pass the skills array to the header
          />
          
          </div>
          {/* Content below the header */}
          <div className="mt-[120px]"> {/* Ensure spacing matches header height */}
            <SkillList skills={skills} activeFilter={activeFilter} />
            <SuggestedSkills />
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 space-y-4">
          <EmployabilityScore skills={skills}/>
          <SkillSummary />
        </div>
      </div>
    </section>
  );
};

export default SkillsContainer;
