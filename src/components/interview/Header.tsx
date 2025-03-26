import logo from "@/assets/branding/logo.svg?url";
interface HeaderProbs {
  SkillName:string
  type:string
  skillLevel:"1" | "2" | "3"
}
const Header: React.FC<HeaderProbs> = ({SkillName, type, skillLevel}) => {
  const experience = {1:"Enter Level", 2:"Intermediate Level", 3:"Senior Level"}
  return (
    <div className="flex  justify-between items-center">
      <div className=" text-h1">
        {type} interview : {SkillName}, {experience[skillLevel]}
      </div>
      <div>
        <img src={logo} />
      </div>
    </div>
  );
};

export default Header;
