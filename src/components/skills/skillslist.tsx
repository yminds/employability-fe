import React from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';

interface Skill {
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
    icon: string; // Add the `icon` property to the `skill_pool_id` object
  };
  verified_rating: number;
  self_rating: number;
}

interface SkillsData {
  data: [
    Skill
  ]; // The `data` key contains an array of `Skill` objects
}

interface SkillListProps {
  skills: SkillsData | null ; // Accept nullable or undefined `skills`
  activeFilter: string;
}

const SkillList: React.FC<SkillListProps> = ({ skills, activeFilter }) => {

  if (activeFilter === 'Suggested') {
    return null; // Do not display anything
  }

  // Extract and filter skills array from the `skills.data` object
  const filteredSkills = skills && Array.isArray(skills.data)
    ? skills.data.filter((skill) => {
        if (activeFilter === 'Verified') {
          return skill.verified_rating > 0;
        } else if (activeFilter === 'Unverified') {
          return skill.verified_rating === 0;
        }
        return true; // For "All" filter
      })
    : []; // Default to an empty array if `skills.data` is not an array

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 mb-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <SkillCard 
              id={skill._id}
              key={skill._id}// Add a unique key for each SkillCard
              skill={skill.skill_pool_id.name}
              skillImg={skill.skill_pool_id.icon} // Replace with actual image source if available
              verified_rating={skill.verified_rating}
              selfRating={skill.self_rating}
              initialStatus={skill.verified_rating > 0 ? 'Verified' : 'Unverified'}
            />
          ))
        ) : (
          <p className="text-gray-600">No skills to display.</p>
        )}
      </div>
    </section>
  );
};

export default SkillList;
