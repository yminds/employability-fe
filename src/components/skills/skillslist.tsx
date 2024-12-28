import React, { useState } from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';
import { useGetUserSkillsQuery } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';

interface SkillPoolId {
  _id: string;
  name: string;
  icon?: string;
}

interface Skill {
  _id: string;
  skill_pool_id: SkillPoolId;
  verified_rating: number;
  self_rating: number | null;
}

interface SkillsData {
  mandatory: Skill[];
  optional: Skill[];
  all: Skill[];
}

interface SkillListProps {
  isDashboard: boolean;
}

type SkillCategory = 'mandatory' | 'optional' | 'all';

const SkillList: React.FC<SkillListProps> = ({ isDashboard }) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { data: skillsData, error, isLoading } = useGetUserSkillsQuery(userId ?? "");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('mandatory');

  const handleLinkClick = (route: string) => {
    navigate(route);
  };

  const handleCategorySelect = (category: SkillCategory) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  const renderSkillChips = () => {
    if (isDashboard) return null;

    const categories = [
      { id: 'mandatory', label: `Mandatory (${skillsData?.data?.mandatory.length || 0})` },
      { id: 'optional', label: `Optional (${skillsData?.data?.optional.length || 0})` },
      { id: 'all', label: `All (${skillsData?.data?.all.length || 0})` }
    ];

    return (
      <div className="flex gap-4 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id as SkillCategory)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedCategory === category.id
                ? 'bg-[#001630] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    );
  };

  const renderSkills = (skills: Skill[]) => {
    const displaySkills = isDashboard ? skills.slice(0, 5) : skills;

    return displaySkills.length > 0 ? (
      <div>
        {displaySkills.map((skill: Skill, index: number) => (
          <React.Fragment key={skill._id}>
            <SkillCard
              skillId={skill._id}
              skill={skill.skill_pool_id.name}
              skillImg={skill.skill_pool_id.icon}
              verified_rating={skill.verified_rating}
              selfRating={skill.self_rating ?? 0}
              initialStatus={skill.verified_rating > 0 ? "Verified" : "Unverified"}
            />
            {index < displaySkills.length - 1 && (
              <div className="w-full h-[1px] my-6 bg-[#E0E0E0]" />
            )}
          </React.Fragment>
        ))}
      </div>
    ) : (
      <div className="text-gray-500 text-center py-4">No skills found in this category</div>
    );
  };

  const getSelectedSkills = () => {
    if (!skillsData?.data) return [];
    
    if (isDashboard) {
      return skillsData.data.all;
    }

    switch (selectedCategory) {
      case 'mandatory':
        return skillsData.data.mandatory;
      case 'optional':
        return skillsData.data.optional;
      case 'all':
        return skillsData.data.all;
      default:
        return skillsData.data.all;
    }
  };

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[42px] mb-4">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px] px-4">
        {isDashboard ? (
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-gray-900 text-base font-medium leading-5">
              Skills ({skillsData?.data?.all.length || 0})
            </h2>
            <button
              className="px-4 py-0 text-sm font-medium rounded-md text-[#001630] underline"
              onClick={() => handleLinkClick("/skills")}
            >
              View All
            </button>
          </div>
        ) : null}

        {renderSkillChips()}
        {skillsData?.data && renderSkills(getSelectedSkills())}
      </div>
    </section>
  );
};

export default SkillList;