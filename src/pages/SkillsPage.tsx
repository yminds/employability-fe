import SkillsContainer from '@/components/skills/skillscontainer';
import React from 'react';


const Skills: React.FC = () => {
  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className=" flex-col bg-[#F5F5F5] w-[90%] max-w-[1800px] p-5 h-full sm:p-0">
        <SkillsContainer/>
      </main>
    </div>
  );
};

export default Skills;
