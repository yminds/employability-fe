import CompleteProfile from '../../assets/dashboard/Complete-profile.svg';
import InCompleteProfile from '../../assets/dashboard/Incomplete-profile.svg'
import InterviewsUnverified from '../../assets/dashboard/Interview-unverified.svg';
import InterviewsVerified from '../../assets/dashboard/Interview-verified.svg';
import ProjectsUnverified from '../../assets/dashboard/Projects-unverified.svg';
import ProjectsVerified from '../../assets/dashboard/Projects-verified.svg';
import SkillsUnverified from '../../assets/dashboard/Skills-unverified.svg';
import SkillsVerified from '../../assets/dashboard/Skills-verified.svg';

type CardType = "profile" | "skills" | "projects" | "interview";

interface BaseCardConfig {
  title: string;
}

interface OtherCardConfig extends BaseCardConfig {
  type: 'skills' | 'projects' | 'interview' | 'profile';
  verifiedIcon: string;
  unverifiedIcon: string;
}

type CardConfig = OtherCardConfig;

interface SkillCardProps {
  type: CardType;
  total: number | null;
  verifiedSkills?: number;
  totalMandatorySkills?: number;
  verifiedProjects?: number;
  totalProjects?: number;
  completedProfileSections?: number;
}

const cardConfig: Record<CardType, CardConfig> = {
  profile: {
    type: 'profile',
    title: "Basic details",
    verifiedIcon: CompleteProfile,
    unverifiedIcon: InCompleteProfile,
  },
  skills: {
    type: 'skills',
    title: "Skills verified",
    verifiedIcon: SkillsVerified,
    unverifiedIcon: SkillsUnverified,
  },
  projects: {
    type: 'projects',
    title: "Projects verified",
    verifiedIcon: ProjectsVerified,
    unverifiedIcon: ProjectsUnverified,
  },
  interview: {
    type: 'interview',
    title: "Interviews",
    verifiedIcon: InterviewsVerified,
    unverifiedIcon: InterviewsUnverified,
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
        <div className="whitespace-nowrap">
          <span className="text-black text-sub-header">{verifiedSkills}</span>
          <span className="text-black/60 text-sub-header">/{totalMandatorySkills}</span>
        </div>
      );
    }
    if (type === "projects") {
      return (
        <div className="whitespace-nowrap">
          <span className="text-black text-sub-header">{verifiedProjects}</span>
          <span className="text-black/60 text-sub-header">/{totalProjects}</span>
        </div>
      );
    }
    if (type === "profile") {
      return (
        <div className="text-black text-sub-header">
          {completedProfileSections}%
        </div>
      );
    }
    return (
      <div className="text-black text-sub-header">
        {total}
      </div>
    );
  };

  const getIconSrc = () => {
    return isCompleted() ? config.verifiedIcon : config.unverifiedIcon;
  };

  return (
    <div className="w-full h-20 p-3 bg-white rounded-lg border border-black/5 flex items-center">
      <div className="flex items-center gap-4 ">
        <div className="flex-shrink-0 w-12 h-12">
          <img 
            src={getIconSrc()}
            alt={`${config.title} ${isCompleted() ? 'verified' : 'unverified'}`}
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-start">
          {renderContent()}
          <div className="text-[#414347] text-body2 whitespace-nowrap">
            {config.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillCard;