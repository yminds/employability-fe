import React from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';
import { useGetUserSkillsQuery } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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


const SkillList: React.FC= () => {
  // Replace the hardcoded skills array with the actual data from the API
  const userId = useSelector((state :RootState) => state.auth.user._id);

  // Fetch user skills by userId
  const { data: skillsData, error, isLoading } = useGetUserSkillsQuery(userId);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  // The `skillsData` object contains the list of skills
  const skills = skillsData && Array.isArray(skillsData.data) ? skillsData.data : []; // Ensure skills is always an array
  

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[42px] mb-4">
      <div className='w-full h-full bg-white  flex flex-col  rounded-t-[8px]  px-4'>
        <div className="text-gray-900 text-base font-medium leading-5 mb-5">
          Mandatory Skills ({skills.length})
        </div>
        <div>
          <div className="">
            {skills.map((skill: Skill) => (
              <>

              <SkillCard
                key={skill._id}
                skillId={skill._id}
                skill={skill.skill_pool_id.name}
                skillImg={skill.skill_pool_id.icon}
                verified_rating={skill.verified_rating}
                selfRating={skill.self_rating}
                initialStatus="Verified" // Hardcoded initial status for now
              />
              <div className=' w-full h-[1px] my-4 bg-black bg-opacity-10'></div>
              </>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default SkillList;
