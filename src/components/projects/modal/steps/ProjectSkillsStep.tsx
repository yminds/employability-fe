"use client";

import React from "react";
import SkillSelector from "../../SkillSelector";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
}

interface ProjectSkillsStepProps {
  selectedSkills: Skill[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const ProjectSkillsStep: React.FC<ProjectSkillsStepProps> = ({
  selectedSkills,
  setSelectedSkills,
}) => {
  return (
    <div className="space-y-6">
        
        <SkillSelector
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          label="Pick Your Skills"
          placeholder="Search for skills..."
        />

    </div>
  );
};

export default ProjectSkillsStep;