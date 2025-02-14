import React from "react";

interface LevelOptionProps {
  level: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  imgScr: string;
  className: string;
}

const LevelOption: React.FC<LevelOptionProps> = ({
  level,
  description,
  isSelected,
  onClick,
  imgScr,
  className,
}) => {
  return (
    <div
      className={`flex items-center gap-6 px-7 py-5 pl-7 min-h-[140px] cursor-pointer transition-all duration-200 rounded-[10px] border ${
        isSelected
          ? "bg-green-100 border-green-500"
          : "border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-6">
        <div className="w-[100px] flex items-center ">
          <img className={className} src={imgScr} alt="" />
        </div>
        <div className="flex-grow">
          <h2 className="text-[#333] text-h2 mb-2">{level}</h2>
          <p className="text-[#666] text-body2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LevelOption;
