import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import PublicSkillCard from "@/components/cards/skills/publicSkillsCard";
import noExperience from "@/assets/profile/noskills.svg";

export interface Skill {
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
    icon?: string;
  };
  verified_rating: number;
  self_rating: number | null;
  level?: string;
  best_interview: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isPublic?: boolean;
  username?: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, username }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displaySkills = isExpanded ? skills : skills.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <h2 className="text-base font-medium text-black font-['Ubuntu'] leading-[22px]">
          Skills ({skills.length})
        </h2>
      </CardHeader>

      <CardContent className="p-0">
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <img
              src={noExperience || "/placeholder.svg"}
              alt="No skills entries"
              className="w-20 h-20 mb-6 sm:mb-1"
            />
            <h3 className="text-body2 text-[#414447] mb-2 text-center">
              No skills added yet.
            </h3>
          </div>
        ) : (
          <>
            <div>
              {displaySkills.map((skill: Skill, index: number) => (
                <React.Fragment key={skill._id}>
                  <PublicSkillCard
                    skillId={skill._id}
                    skill={skill.skill_pool_id.name}
                    skillPoolId={skill.skill_pool_id._id}
                    skillImg={skill.skill_pool_id.icon}
                    verified_rating={skill.verified_rating}
                    selfRating={skill.self_rating ?? 0}
                    initialStatus={
                      skill.verified_rating > 0 ? "Verified" : "Unverified"
                    }
                    level={skill.level}
                    best_interview={skill.best_interview}
                    username={username}
                    isFirst={index === 0}
                  />
                </React.Fragment>
              ))}
            </div>
            {!isExpanded && skills.length > 3 && (
              <>
                <div className="absolute bottom-0 left-0 right-0 ">
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[211px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, #FFF 100%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                    <button
                      className="flex items-center text-sm text-[#000] hover:text-gray-900"
                      onClick={toggleExpand}
                    >
                      View all
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </>
            )}
            {isExpanded && skills.length > 3 && (
              <div className="flex justify-center pb-4">
                <button
                  className="flex items-center text-sm text-[#000] hover:text-gray-900"
                  onClick={toggleExpand}
                >
                  Show less
                  <ChevronUp className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
