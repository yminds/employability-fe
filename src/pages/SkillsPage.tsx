import SkillsContaineer from '@/components/skills/skillscontainer';
import React from 'react';


const Skills: React.FC = () => {
  return (
    <div className="flex w-full  h-screen  justify-center">
      <main className=" flex bg-[#F5F5F5] w-[95%] lg:max-w-[1300px] p-5 h-full">
        <SkillsContaineer/>
      </main>
    </div>
  );
};

export default Skills;
