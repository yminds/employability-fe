import React from "react";
import SkillCard from "@/components/cards/skills/skillsCard";
import { useGetUserSkillsQuery } from "@/api/skillsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

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

interface SkillListProps {
  isDashboard: boolean; // Define the prop type here
}

const SkillList: React.FC<SkillListProps> = (isDashboard) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const handleLinkClick = (route: string) => {
    navigate(route); // Navigate to the specified route
  };

  // Replace the hardcoded skills array with the actual data from the API
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  // Fetch user skills by userId
  const {
    data: skillsData,
    error,
    isLoading,
  } = useGetUserSkillsQuery(userId ?? "");

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  // The `skillsData` object contains the list of skills
  //const skills = skillsData && Array.isArray(skillsData.data) ? skillsData.data : []; // Ensure skills is always an array

  let skills: any[] = []; // Declare skills outside the condition
  if (isDashboard.isDashboard) {
    skills =
      skillsData && Array.isArray(skillsData.data)
        ? skillsData.data.slice(0, 5)
        : []; // Get only the first 5 items
  } else {
    skills =
      skillsData && Array.isArray(skillsData.data) ? skillsData.data : []; // Ensure skills is always an array
  }

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[42px] mb-4">
      <div className="w-full h-full bg-white  flex flex-col  rounded-t-[8px]  px-4">
        <div className="text-gray-900 text-base font-medium leading-5 mb-5">
          {isDashboard.isDashboard ? (
            <>
              Skills ({skills.length})
              <button
                className="px-4 py-0 text-sm font-medium rounded-md text-[#001630] underline float-end"
                onClick={() => handleLinkClick("/skills")}
              >
                View All
              </button>
            </>
          ) : (
            <>Mandatory Skills ({skills.length})</>
          )}
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
                  initialStatus={
                    skill.verified_rating > 0 ? "Verified" : "Unverified"
                  } // Hardcoded initial status for now
                />
                <div className=" w-full h-[1px] my-6 bg-[#E0E0E0]"></div>
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillList;
