import SkillsContaineer from '@/components/skills/skills-container';
import React from 'react';


const Skills: React.FC = () => {
  return (
    <div className="flex h-screen justify-center">
      <main className=" min-w-[80vw] mx-auto py-5 ">
        <SkillsContaineer/>
      </main>
    </div>
  );
};

export default Skills;
