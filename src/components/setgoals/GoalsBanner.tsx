import Banner from "@/components/setgoals/BannerBackGround";
import BannerSkillsIcons from "@/components/setgoals/BannerSkillsIcon";

interface GoalsBannerProps {
  className?: string;
  data?: any;
  color: string;
  isGoalsList: boolean;
}

const GoalsBanner: React.FC<GoalsBannerProps> = ({
  className = "",
  data = [],
  color,
  isGoalsList
}) => {

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ backgroundColor: color }}
    >
      {/* Banner Background */}
      <Banner bgColor={color} />

      {/* Skill Icons */}
      <BannerSkillsIcons data={data} color={color} isGoalsList={isGoalsList} />
    </div>
  );
};

export default GoalsBanner;
