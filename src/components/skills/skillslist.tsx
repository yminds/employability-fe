import React, { useEffect, useState } from "react";
import SkillCard from "@/components/cards/skills/skillsCard";
import {
  useGetUserSkillsMutation,
  useRemoveGoalFromSkillMutation,
  useUpdateSelfRatingMutation,
} from "@/api/skillsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import search from "@/assets/skills/search.svg";
import AddSkillsModal from "./addskills";
import { ChevronDown } from "lucide-react";

export interface SkillPoolId {
  _id: string;
  name: string;
  icon?: string;
}

interface LatestInterviewStatus {
  interview_id: string;
  isCompleted: boolean;
}

export interface Skill {
  _id: string;
  skill_pool_id: SkillPoolId;
  verified_rating: number;
  self_rating: number | null;
  level?: string;
  best_interview?: string;
  latest_interview_status?: LatestInterviewStatus;
}
interface SkillListProps {
  isDashboard: boolean;
  goalId: string | null;
  onSkillsUpdate: (isUpdated: boolean) => void;
  isSkillsUpdated?: boolean;
  goals:
    | {
        message: string;
        data: [
          {
            experience: string | undefined;
            _id: string;
            name: string;
          }
        ];
      }
    | undefined;
  selectedGoalName: string;
}

type SkillCategory = "mandatory" | "optional" | "all";

const SkillList: React.FC<SkillListProps> = ({
  isDashboard,
  goalId,
  onSkillsUpdate,
  isSkillsUpdated,
  goals,
  selectedGoalName,
}) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [getUserSkills, { data: skillsData, isLoading }] =
    useGetUserSkillsMutation();
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [isSelfRatingEdited, setSelfRatingChange] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mutation hooks
  const [removeGoalFromSkill] = useRemoveGoalFromSkillMutation();
  const [updateSelfRating] = useUpdateSelfRatingMutation();

  useEffect(() => {
    if (userId && goalId) {
      fetchSkills(userId, goalId);
    }
  }, [userId, goalId]);

  useEffect(() => {
    if (isSkillsUpdated && userId && goalId) {
      fetchSkills(userId, goalId);
    }
  }, [isSkillsUpdated]);

  const fetchSkills = async (
    userId: string | undefined,
    goalId: string | null
  ) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (skillsData?.data) {
      const selectedSkills = getSelectedSkills();
      const filtered = selectedSkills.filter((skill) =>
        skill.skill_pool_id.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      const reorderedSkills = moveUnverifiedToIndexZero(filtered);
      setFilteredSkills(reorderedSkills);
    }
  }, [searchQuery, skillsData, selectedCategory]);

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await removeGoalFromSkill({ userId, goalId, skillId }).unwrap();
        onSkillsUpdate(true);
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  const handleCategorySelect = (category: SkillCategory) => {
    setSelectedCategory(category);
  };

  const moveUnverifiedToIndexZero = (skills: Skill[]): Skill[] => {
    const unverifiedSkills = skills.filter(
      (skill) => skill.verified_rating <= 3
    );
    const verifiedSkills = skills.filter((skill) => skill.verified_rating > 3);
    return unverifiedSkills.length > 0
      ? [unverifiedSkills[0], ...verifiedSkills, ...unverifiedSkills.slice(1)]
      : skills;
  };

  const getSelectedSkills = (): Skill[] => {
    if (!skillsData?.data) return [];

    switch (selectedCategory) {
      case "mandatory":
        return skillsData.data?.mandatory || [];
      case "optional":
        return skillsData.data?.optional || [];
      case "all":
      default:
        return skillsData.data?.all || [];
    }
  };

  const handleEditSkill = async (skillId: string, selfRating: number) => {
    try {
      await updateSelfRating({
        userId: userId!,
        skillId,
        selfRating,
      }).unwrap();
      setSelfRatingChange(true);
    } catch (err) {
      console.error("Error updating self-rating:", err);
    }
  };

  const getMandatorySkillIds = (): string[] => {
    if (!skillsData?.data) return [];
    return (skillsData.data.mandatory || []).map((skill: Skill) => skill._id);
  };

  const renderSkillChips = () => {
    if (isDashboard) return null;

    const categories = [
      { id: "all", label: "All" },
      { id: "mandatory", label: "Mandatory" },
      { id: "optional", label: "Added by you" },
    ];

    return (
      <div className="flex gap-1 items-center mb-10 sm:max-w-[100%] sm:flex sm:flex-col-reverse sm:items-start md:items-start sm:gap-5">
        <div className="sm:flex h-[46px]">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id as SkillCategory)}
              className={`px-4 py-2 rounded-[3px] text-body2 transition-all sm:px-2 sm:py-2 ${
                selectedCategory === category.id
                  ? "bg-[#001630] text-white hover:bg-[#062549]"
                  : "text-[#68696B]"
              }`}
            >
              {category.label}
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
                src={search}
                alt="Search Icon"
                className="w-4 h-4 text-gray-400"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden py-2 text-sm w-[138px] h-[38px] md:h[50px] md:w[150px] md:px-2 md:py-0.5 font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC] sm:block"
            >
              Add Skills
            </button>
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
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Skeleton height={30} width={100} />
            <Skeleton height={30} width={100} />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Skeleton height={1} width={720} />
      </div>
    </div>
  );

  const renderSkills = (skills: Skill[]) => {
    const displaySkills = isDashboard ? skills.slice(0, 5) : skills;
    const mandatorySkillIds = getMandatorySkillIds();
    const totalSkills = skills.length;

    if (displaySkills.length === 0) {
      return (
        <div className="text-gray-500 text-body2 text-center py-4">No skills found</div>
      );
    }

    return (
      <div className="scroll-smooth snap-y snap-proximity minimal-scrollbar sm:min-w-[290px]">
        {displaySkills.map((skill: Skill, index: number) => {
          const isMandatorySkill =
            selectedCategory === "all"
              ? mandatorySkillIds.includes(skill._id)
              : selectedCategory === "mandatory";

          return (
            <React.Fragment key={skill._id}>
              <SkillCard
                skillId={skill._id}
                skill={skill.skill_pool_id.name}
                skillPoolId={skill.skill_pool_id._id}
                skillImg={skill.skill_pool_id.icon}
                verified_rating={skill.verified_rating}
                selfRating={skill.self_rating ?? 0}
                initialStatus={
                  skill.verified_rating > 3 ? "Verified" : "Unverified"
                }
                level={skill.level}
                onDelete={handleDeleteSkill}
                onEdit={handleEditSkill}
                isMandatory={isMandatorySkill}
                isDashboard={isDashboard}
                bestInterview={skill.best_interview}
                goalName={selectedGoalName}
                latest_interview_status={skill?.latest_interview_status}
              />
              {index < displaySkills.length - 1 && (
                <div className="w-full h-[1px] my-4 bg-[#E0E0E0]" />
              )}
              {isDashboard && index === 4 && totalSkills > 5 && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[180px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, #FFF 100%)",
                  }}
                />
              )}
              {isDashboard && index === 4 && totalSkills > 5 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                  <button
                    onClick={() => navigate("/skills")}
                    className="flex items-center gap-1 text-[#001630] text-sm font-medium"
                  >
                    View all
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[32px] sm:p-6 overflow-x-auto scrollbar-hide">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px]">
        {isDashboard && (
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-medium text-black font-['Ubuntu'] leading-[22px]">
              Skills ({skillsData?.data?.all.length || 0})
            </h2>
          </div>
        )}

        {renderSkillChips()}

        {isLoading
          ? Array.from({ length: 3 }).map((_) => renderLoadingSkeleton())
          : renderSkills(filteredSkills)}
      </div>

      {isModalOpen && goalId && (
        <AddSkillsModal
          goalId={goalId}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          onSkillsUpdate={onSkillsUpdate}
          goals={goals}
          prefillSkills={[]}
        />
      )}
    </section>
  );
};

export default SkillList;
