import eLogo from "@/assets/branding/eLogo.svg";

export default function JobHeader() {
  return (
    <header className="w-full py-4 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <img src={eLogo} alt="e logo" className="w-8 h-8"/>
          <span className="font-ubuntu text-[18px] font-bold leading-normal text-[#001630]">
            Employ<span className="text-[#0AD472]">Ability.AI</span>
          </span>
        </div>
      </div>
    </header>
  );
}
