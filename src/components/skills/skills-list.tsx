import React from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';

interface Skill {
  skill: string;
  skillImg: string;
  verified_rating: number;
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
      {/* Render Filtered Skills */}
      <div className="flex flex-col gap-4 mb-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill.skill}
              skillImg={skill.skillImg}
              verified_rating={skill.verified_rating}
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
