import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import PublicSkillCard from "@/components/cards/skills/publicSkillsCard";
import noExperience from "@/assets/profile/noeducation.svg";

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
}

interface SkillsSectionProps {
  skills: Skill[];
  isPublic?: boolean;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displaySkills = isExpanded ? skills : skills.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-2">
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
              className="w-20 h-20 mb-6"
            />
            <h3 className="text-base text-[#414447] font-normal mb-2 text-center font-sans leading-6 tracking-[0.24px]">
              No skills added yet.
            </h3>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#E5E7EB] py-4 px-6">
              {displaySkills.map((skill: Skill) => (
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
                  />
                </React.Fragment>
              ))}
            </div>
            {skills.length > 3 && (
              <div className="flex justify-center py-4">
                <button
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  onClick={toggleExpand}
                >
                  {isExpanded ? "Show less" : "View all"}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
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
