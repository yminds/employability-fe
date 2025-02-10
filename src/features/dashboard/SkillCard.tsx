import React from 'react';
import { PuzzleIcon, FileText, Users, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import verified from "@/assets/skills/verified.svg";
import verifiedGrey from "@/assets/skills/verified-grey.svg";

interface SkillCardProps {
  type: "profile"|"skills" | "projects" | "interview";
  total: number | null;
  verifiedSkills?: number;
  totalMandatorySkills?: number;
  verifiedProjects?: number;
  totalProjects?: number;
  completedProfileSections?: number;
}

const cardConfig = {
  profile:{
    title: "Profile",
    icon: Users,
    iconColor: "text-[#4361ee]",
    bgColor: "bg-[#eef1ff]",
  },
  skills: {
    title: "Skills",
    icon: PuzzleIcon,
    iconColor: "text-[#1fd167]",
    bgColor: "bg-[#dbffea]",
  },
  projects: {
    title: "Projects",
    icon: FileText,
    iconColor: "text-[#ff8c3f]",
    bgColor: "bg-[#fff2ea]",
  },
  interview: {
    title: "Interview",
    icon: MessageSquare,
    iconColor: "text-[#a855f7]",
    bgColor: "bg-[#f3e8ff]",
  },
};

export function SkillCard({
  type,
  total,
  verifiedSkills,
  totalMandatorySkills,
  verifiedProjects,
  totalProjects,
  completedProfileSections = 0,
}: SkillCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;

  const isCompleted = () => {
    if (type === "skills" && verifiedSkills !== undefined && totalMandatorySkills !== undefined) {
      return verifiedSkills === totalMandatorySkills && totalMandatorySkills > 0;
    }
    if (type === "projects" && verifiedProjects !== undefined && totalProjects !== undefined) {
      return verifiedProjects === totalProjects && totalProjects > 0;
    }
    if (type === "profile") {
      return completedProfileSections === 100;
    }
    if (type === "interview") {
      return total === 10;
    }
    return false;
  };

  const renderContent = () => {
    if (type === "skills" && verifiedSkills !== undefined && totalMandatorySkills !== undefined) {
      return (
        <div className="flex items-baseline space-x-1">
          <span className="text-[#202326] text-l font-bold">{verifiedSkills}</span>
          <span className="text-[#68696B] text-sm">/ {totalMandatorySkills}</span>
        </div>
      );
    }
    if (type === "projects") {
      return (
        <div className="flex items-baseline space-x-1">
          <span className="text-[#202326] text-l font-bold">{verifiedProjects}</span>
          <span className="text-[#68696B] text-sm">/ {totalProjects}</span>
        </div>
      );
    }
    if (type === "profile") {
      return (
        <div className="flex items-baseline space-x-1">
          <span className="text-[#202326] text-l font-bold">{completedProfileSections}</span>
          <span className="text-[#68696B] text-sm">%</span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline">
        <span className="text-[#202326] text-l font-bold">{total}</span>
      </div>
    );
  };

  return (
    <Card className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-[#eee] hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#414447] text-sub-header">{config.title}</span>
              <img 
                src={isCompleted() ? verified : verifiedGrey} 
                alt={isCompleted() ? "verified" : "not verified"} 
                className="w-4 h-4 flex-shrink-0 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            {renderContent()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillCard;