import React from 'react';
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

const SkillList: React.FC<SkillListProps> = ({ isDashboard }) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { data: skillsData, error, isLoading } = useGetUserSkillsQuery(userId ?? "");

  const handleLinkClick = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  const renderSkillSection = (skills: Skill[], title: string) => {
    const displaySkills = isDashboard ? skills.slice(0, 5) : skills;

    return displaySkills.length > 0 ? (
      <div className="mb-8 last:mb-0">
        {!isDashboard && (
          <div className="text-gray-900 text-base font-medium leading-5 mb-5">
            {title} ({skills.length})
          </div>
        )}
        <div>
          {displaySkills.map((skill: Skill, index: number) => (
            <React.Fragment key={skill._id}>
              <SkillCard
                skill_id={skill._id}
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
      </div>
    ) : null;
  };

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[42px] mb-4">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px] px-4">
        {isDashboard ? (
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-gray-900 text-base font-medium leading-5">
              Skills ({skillsData?.data?.mandatory.length || 0})
            </h2>
            <button
              className="px-4 py-0 text-sm font-medium rounded-md text-[#001630] underline"
              onClick={() => handleLinkClick("/skills")}
            >
              View All
            </button>
          </div>
        ) : null}

        {skillsData?.data && (
          <>
            {renderSkillSection(skillsData.data.mandatory, "Mandatory Skills")}
            {!isDashboard && renderSkillSection(skillsData.data.optional, "Optional Skills")}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillList;