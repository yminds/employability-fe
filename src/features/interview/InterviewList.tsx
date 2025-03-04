import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetVerifiedSkillsMutation } from "@/api/interviewDetailsApiSlice";
import InterviewCard from "./InterviewCard";
import search from "@/assets/skills/search.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type InterviewType = "all" | "skill" | "project" | "mock";

interface InterviewListProps {
  goalId: string | null;
}

const InterviewList: React.FC<InterviewListProps> = ({ goalId }) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [getVerifiedSkills, { data: skillsData, isLoading }] =
    useGetVerifiedSkillsMutation();
  const [selectedType, setSelectedType] = useState<InterviewType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);

  useEffect(() => {
    if (userId && goalId) {
      fetchSkills(userId, goalId);
    }
  }, [userId, goalId]);

  const fetchSkills = async (
    userId: string | undefined,
    goalId: string | null
  ) => {
    try {
      await getVerifiedSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error("Error fetching verified skills:", err);
    }
  };

  useEffect(() => {
    if (skillsData?.data) {
      // Apply search filter
      const filtered = skillsData.data.userSkills.filter((skill: any) =>
        skill.skill_pool_id.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setFilteredSkills(filtered);
    }
  }, [searchQuery, skillsData]);

  const renderInterviewTypes = () => {
    const types = [
      { id: "all", label: "All" },
      { id: "skill", label: "Skill" },
      { id: "project", label: "Project" },
      { id: "mock", label: "Mock" },
    ];

    return (
      <div className="flex gap-1 items-center mb-10 sm:max-w-[100%] sm:flex sm:flex-col-reverse sm:items-start md:items-start sm:gap-5">
        <div className="sm:flex h-[46px]">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as InterviewType)}
              className={`px-4 py-2 rounded-[3px] text-body2 transition-all sm:px-2 sm:py-2 ${
                selectedType === type.id
                  ? "bg-[#001630] text-white hover:bg-[#062549]"
                  : "text-[#68696B]"
              }`}
              disabled={type.id !== "all" && type.id !== "skill"} // Only enable 'all' and 'skill' for now
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between ml-auto sm:ml-0 sm:w-[100%]">
          <div className="relative w-64 sm:max-w-[100%]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#D6D7D9] rounded-[6px] text-body2 px-4 py-2 pl-10 text-sm w-full focus:outline-none"
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <img
                src={search || "/placeholder.svg"}
                alt="Search Icon"
                className="w-4 h-4 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div key={Math.random()} className="mb-4">
      <div className="flex items-center justify-between w-full bg-white p-4 rounded-md border-gray-200">
        <div className="flex items-center">
          <Skeleton circle={true} height={40} width={40} className="mr-4" />
          <div>
            <Skeleton height={16} width={100} className="mb-2" />
            <Skeleton height={12} width={80} />
          </div>
        </div>
        <div>
          <Skeleton height={16} width={120} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[32px] sm:p-6">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px]">
        {renderInterviewTypes()}

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map(() => renderLoadingSkeleton())
          ) : filteredSkills.length > 0 ? (
            filteredSkills.map((skill: any, index: number) => (
              <React.Fragment key={skill._id}>
                <InterviewCard
                  skillId={skill._id}
                  skill={skill.skill_pool_id.name}
                  skillImg={skill.skill_pool_id.icon}
                  verified_rating={skill.verified_rating}
                  bestInterview={skill.best_interview}
                  interviews={skill.interviews}
                />
                {index < filteredSkills.length - 1 && (
                  <div className="w-full h-[1px] bg-[#E0E0E0]" />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="text-gray-500 text-body2 text-center py-4">
              No verified skills found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InterviewList;
