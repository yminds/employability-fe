import React from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';

interface Skill {
  skill: string;
  skillImg: string;
  rating: number;
  selfRating: number;
  initialStatus: string; // Verification status
}

interface SkillListProps {
  skills: Skill[];
  activeFilter: string;
}

const SkillList: React.FC<SkillListProps> = ({ skills, activeFilter }) => {
  // Filter the skills based on the active filter
  const filteredSkills =
    activeFilter === 'All'
      ? skills
      : skills.filter((skill) => skill.initialStatus === activeFilter);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Skills</h2>

      {/* Render Filtered Skills */}
      <div className="flex flex-col gap-2">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill.skill}
              skillImg={skill.skillImg}
              rating={skill.rating}
              selfRating={skill.selfRating}
              initialStatus={skill.initialStatus}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No skills match the selected filter.</p>
        )}
      </div>
    </section>
  );
};

export default SkillList;
