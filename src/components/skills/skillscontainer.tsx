import React, { useEffect, useState } from "react";
import { useGetUserSkillsQuery } from "@/api/skillsApiSlice";
import SkillsHeader from "@/components/skills/skillsheader";
import SkillList from "@/components/skills/skillslist";
import SuggestedSkills from "@/components/skills/suggestedskills";
import EmployabilityScore from "@/components/skills/employabiltyscore";
import SkillSummary from "@/components/skills/skillssummary";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SkillsContainer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isUpdated, setIsUpdated] = useState<boolean>(false); // Track if skills were updated
  const userId = useSelector((state: RootState) => state.auth.user._id);

  // Fetch user skills by userId
  const { data: skillsData, error, isLoading, refetch } = useGetUserSkillsQuery(userId);

  // Re-fetch user skills if `isUpdated` is true
  useEffect(() => {
    if (isUpdated) {
      console.log("Perform actions like fetching updated data here.");
      refetch();
      console.log("Skills updated");
      setIsUpdated(false); // Reset the update flag
    }
  }, [isUpdated, refetch]);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  // The `skillsData` object contains the list of skills
  const skills = skillsData ? skillsData : []; // Ensure skills is always an array

  return (
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="flex w-full max-w-[1300px] gap-6">
        {/* Left Section - 70% width */}
        <div className="flex-[7] w-full h-full overflow-y-auto scrollbar-hide">
          {/* Sticky Header */}
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
            <SkillsHeader onSkillsStatusChange={setIsUpdated} />
          </div>
          {/* Content below the header */}
          <div className="mt-[110px]"> {/* Ensure spacing matches header height */}
            <SkillList isDashboard={false}/>
            <SuggestedSkills />
          </div>
        </div>

        {/* Right Section - 30% width */}
        <div className="flex-[3] w-full space-y-4">
          <EmployabilityScore skills={skills} />
          <SkillSummary isSkillsUpdated={isUpdated} />
        </div>
      </div>
    </section>
  );
};

export default SkillsContainer;
