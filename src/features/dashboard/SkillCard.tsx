// import CompleteProfile from '../../assets/dashboard/Complete-profile.svg';
// import InCompleteProfile from '../../assets/dashboard/Incomplete-profile.svg'
// import InterviewsUnverified from '../../assets/dashboard/Interview-unverified.svg';
// import InterviewsVerified from '../../assets/dashboard/Interview-verified.svg';
// import ProjectsUnverified from '../../assets/dashboard/Projects-unverified.svg';
// import ProjectsVerified from '../../assets/dashboard/Projects-verified.svg';
// import SkillsUnverified from '../../assets/dashboard/Skills-unverified.svg';
// import SkillsVerified from '../../assets/dashboard/Skills-verified.svg';

// type CardType = "profile" | "skills" | "projects" | "interview";

// interface BaseCardConfig {
//   title: string;
// }

// interface OtherCardConfig extends BaseCardConfig {
//   type: 'skills' | 'projects' | 'interview' | 'profile';
//   verifiedIcon: string;
//   unverifiedIcon: string;
// }

// type CardConfig = OtherCardConfig;

// interface SkillCardProps {
//   type: CardType;
//   total: number | null;
//   verifiedSkills?: number;
//   totalMandatorySkills?: number;
//   verifiedProjects?: number;
//   totalProjects?: number;
//   completedProfileSections?: number;
// }

// const cardConfig: Record<CardType, CardConfig> = {
//   profile: {
//     type: 'profile',
//     title: "Basic details",
//     verifiedIcon: CompleteProfile,
//     unverifiedIcon: InCompleteProfile,
//   },
//   skills: {
//     type: 'skills',
//     title: "Skills verified",
//     verifiedIcon: SkillsVerified,
//     unverifiedIcon: SkillsUnverified,
//   },
//   projects: {
//     type: 'projects',
//     title: "Projects verified",
//     verifiedIcon: ProjectsVerified,
//     unverifiedIcon: ProjectsUnverified,
//   },
//   interview: {
//     type: 'interview',
//     title: "Interviews",
//     verifiedIcon: InterviewsVerified,
//     unverifiedIcon: InterviewsUnverified,
//   },
// };

// export function SkillCard({
//   type,
//   total,
//   verifiedSkills,
//   totalMandatorySkills,
//   verifiedProjects,
//   totalProjects,
//   completedProfileSections = 0,
// }: SkillCardProps) {
//   const config = cardConfig[type];

//   const isCompleted = () => {
//     if (type === "skills" && verifiedSkills !== undefined && totalMandatorySkills !== undefined) {
//       return verifiedSkills === totalMandatorySkills && totalMandatorySkills > 0;
//     }
//     if (type === "projects" && verifiedProjects !== undefined && totalProjects !== undefined) {
//       return verifiedProjects === totalProjects && totalProjects > 0;
//     }
//     if (type === "profile") {
//       return completedProfileSections === 100;
//     }
//     if (type === "interview") {
//       return total === 10;
//     }
//     return false;
//   };

//   const renderContent = () => {
//     if (type === "skills" && verifiedSkills !== undefined && totalMandatorySkills !== undefined) {
//       return (
//         <div className="whitespace-nowrap">
//           <span className="text-black text-sub-header">{verifiedSkills}</span>
//           <span className="text-black/60 text-sub-header">/{totalMandatorySkills}</span>
//         </div>
//       );
//     }
//     if (type === "projects") {
//       return (
//         <div className="whitespace-nowrap">
//           <span className="text-black text-sub-header">{verifiedProjects}</span>
//           <span className="text-black/60 text-sub-header">/{totalProjects}</span>
//         </div>
//       );
//     }
//     if (type === "profile") {
//       return (
//         <div className="text-black text-sub-header">
//           {completedProfileSections}%
//         </div>
//       );
//     }
//     return (
//       <div className="text-black text-sub-header">
//         {total}
//       </div>
//     );
//   };

//   const getIconSrc = () => {
//     return isCompleted() ? config.verifiedIcon : config.unverifiedIcon;
//   };

//   return (
//     <div className="w-full h-20 p-3 bg-white rounded-lg border border-black/5 flex items-center">
//       <div className="flex items-center gap-4 ">
//         <div className="flex-shrink-0 w-12 h-12">
//           <img 
//             src={getIconSrc()}
//             alt={`${config.title} ${isCompleted() ? 'verified' : 'unverified'}`}
//             className="w-full h-full"
//           />
//         </div>
//         <div className="flex flex-col justify-start">
//           {renderContent()}
//           <div className="text-[#414347] text-body2 whitespace-nowrap">
//             {config.title}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SkillCard;
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import arrowIcon from "@/assets/components/arrow_drop_down.svg";

interface SkillProgressProps {
  completedProfileSections: number;
  verifiedSkillsCount: number;
  totalMandatorySkillsCount: number;
  verifiedProjects: number;
  totalProjects: number;
  mockInterviews?: number;
  userId?: string;
  goals?: {
    message: string;
    data: Array<{
      experience: string | undefined;
      _id: string;
      name: string;
    }>;
  };
  selectedGoalName?: string;
  onSkillsStatusChange?: (isUpdated: boolean) => void;
  onGoalChange?: (goalId: string) => void;
  selectedGoalExperienceLevel?: string | null;
}

const SkillProgress: React.FC<SkillProgressProps> = ({
  completedProfileSections = 0,
  verifiedSkillsCount = 0,
  totalMandatorySkillsCount = 0,
  verifiedProjects = 0,
  totalProjects = 100,
  mockInterviews = 0,
  userId,
  goals,
  selectedGoalName,
  onGoalChange,
  selectedGoalExperienceLevel,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const experienceLevelObj = { 1: "Entry-level", 2: "Mid-level", 3: "Senior-level" };

  const handleGoalChange = (goalName: string) => {
    setSelectedGoal(goalName);
    const foundGoal = goals?.data.find((goal) => goal.name === goalName);
    if (foundGoal && onGoalChange) {
      onGoalChange(foundGoal._id);
    }
  };

  useEffect(() => {
    if (goals?.data.length && selectedGoalName) {
      const initialGoal = goals.data.find((goal) => goal.name === selectedGoalName);
      if (initialGoal) {
        setSelectedGoal(initialGoal.name);
      } else {
        setSelectedGoal(goals.data[0].name);
      }
    }
  }, [goals, selectedGoalName]);

  const steps = [
    { 
      type: 'profile',
      title: "Basic details",
      value: completedProfileSections,
      total: 100,
      step: 1,
      isCompleted: completedProfileSections === 100,
      showAsPercentage: true
    },
    { 
      type: 'skills',
      title: "Skills",
      value: verifiedSkillsCount,
      total: totalMandatorySkillsCount,
      step: 2,
      isCompleted: verifiedSkillsCount === totalMandatorySkillsCount && totalMandatorySkillsCount > 0,
      showAsPercentage: false
    },
    { 
      type: 'projects',
      title: "Projects",
      value: verifiedProjects,
      total: totalProjects,
      step: 3,
      isCompleted: verifiedProjects === 100,
      showAsPercentage: true
    },
    { 
      type: 'interview',
      title: "Mock Interviews",
      value: mockInterviews,
      total: 8,
      step: 4,
      isCompleted: mockInterviews === 8,
      showAsPercentage: false
    }
  ];

  const getStepStatus = (step: { type: string; value: number; isCompleted: boolean }) => {
    if (step.isCompleted) return 'completed';
    if (step.value === 0) return 'pending';
    if (step.value > 0) return 'in-progress';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#10B754]';
      case 'in-progress': return 'text-[#589BFF]';
      default: return 'text-[#909091]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  const renderProgressIndicator = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-[#24D680] rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-8 h-8 rounded-full border border-[#589BFF] flex items-center justify-center">
            <div className="w-6 h-6 bg-[#589BFF] rounded-full" />
          </div>
        );
      default:
        return <div className="w-8 h-8 bg-[#B4B4B5] rounded-full" />;
    }
  };

  const renderValue = (step: { type: string; value: number; total: number; showAsPercentage: boolean }) => {
    if (step.showAsPercentage) {
      return (
        <div className="text-[#414447] text-base font-medium font-['Ubuntu'] leading-snug">
          {step.value}%
        </div>
      );
    } else if (step.type === 'interview') {
      return (
        <div className="text-[#414447] text-base font-medium font-['Ubuntu'] leading-snug">
          {step.value}
        </div>
      );
    } else {
      return (
        <div className="text-[#414447] text-base font-medium font-['Ubuntu'] leading-snug">
          <span>{step.value}</span>
          <span className="text-black/60">/{step.total}</span>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-black text-base font-normal font-['DM Sans'] leading-normal tracking-tight">
          Let's build your verified profile that employers trust 
        </div>
        <div className="ml-4 inline-flex items-center h-[46px] rounded-lg bg-white pl-4">
          <span className="text-[#00000066] font-medium mr-2">Goal:</span>
          {selectedGoal ? (
            <DropdownMenu onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger className="flex items-center text-base font-normal leading-6 tracking-[0.015rem] bg-transparent border-none outline-none cursor-pointer">
                <span className="font-medium truncate">
                  {selectedGoal} ({experienceLevelObj[selectedGoalExperienceLevel as unknown as keyof typeof experienceLevelObj]})
                </span>
                <img 
                  className={`ml-2 h-8 w-8 text-[#1C1B1F] ${dropdownOpen ? 'rotate-180' : ''} duration-75`}
                  src={arrowIcon} 
                  alt="arrow img" 
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                {goals?.data.map((goal) => (
                  <DropdownMenuItem
                    key={goal._id}
                    onClick={() => handleGoalChange(goal.name)}
                    className={`${
                      selectedGoal === goal.name ? "bg-gray-100" : ""
                    } cursor-pointer hover:bg-[#001630] hover:text-white`}
                  >
                    {goal.name} ({experienceLevelObj[goal.experience as unknown as keyof typeof experienceLevelObj]})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-500 italic">Loading...</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 pl-10">
        <div className="flex">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            return (
              <div key={step.type} className="flex-1">
                <div className="px-4">
                  <div className="text-[#414447] text-h2 mb-4">
                    {step.title}
                  </div>

                  <div className="flex items-center">
                    {renderProgressIndicator(status)}
                    {index < steps.length - 1 && (
                      <div className="h-0.5 bg-[#D9D9D9] flex-1 ml-5" />
                    )}
                  </div>

                  <div className="mt-4">
                    {renderValue(step)}
                    <div className={`text-xs mt-1 font-medium font-['DM Sans'] ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillProgress;