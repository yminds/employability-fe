import SkillsContaineer from '@/components/skills/skillscontainer';
import React from 'react';


const Skills: React.FC = () => {
  return (
    <div className="flex justify-center">
      <main className="w-screen h-screen flex bg-[#F5F5F5] justify-center pt-[50px] pr-[32px] ">
        <SkillsContaineer/>
      </main>
    </div>
  );
};

export default Skills;
