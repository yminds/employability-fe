import logo from "@/assets/branding/logo.svg?url";
interface HeaderProbs {
  SkillName:string
}
const Header: React.FC<HeaderProbs> = ({SkillName}) => {
  return (
    <div className="flex  justify-between items-center">
      <div>
        <img src={logo} />
      </div>
      <div className=" text-h1">
        {SkillName}'s Interview
      </div>
    </div>
  );
};

export default Header;
