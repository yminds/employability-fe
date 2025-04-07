import logo from "@/assets/branding/logo.svg?url";
interface HeaderProbs {
  SkillName: string;
  type: string;
  skillLevel: "1" | "2" | "3";
  interviewIcon?: string;
}

const Header: React.FC<HeaderProbs> = ({ SkillName, type, skillLevel, interviewIcon }) => {
  const experience = { 1: "Enter Level", 2: "Intermediate Level", 3: "Senior Level" };

  console.log("interviewIcon", interviewIcon);
  return (
    <div className="flex  justify-between items-center h-[40px]">
      <div className="interviewIcon flex gap-6 items-center">
        {type === "Skill" && (
          <div className="h-16 w-16 flex items-center justify-center rounded-full border border-gray-200">
            <img src={interviewIcon} alt="" className="w-[70%] h-[70%] " />
          </div>
        )}
        <div className="">
          <p className="text-base font-normal leading-3 text-[#68696B]">{type} interview</p>
          <p className="text-[20px] font-medium leading-8 ">
            {SkillName}, {experience[skillLevel]}
          </p>
        </div>
      </div>
      <div>
        <img src={logo} />
      </div>
    </div>
  );
};

export default Header;
