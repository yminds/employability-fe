import React from 'react';

interface LevelOptionProps {
  level: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  imgScr: string
  className: string
}

const LevelOption: React.FC<LevelOptionProps> = ({ level, description, isSelected, onClick, imgScr, className }) => {
  return (
    <div
      className={`border rounded-lg p-7 h-[140px] cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-green-100 border-green-500' : 'border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-6">
        <div className="w-[100px] flex items-center ">
           <img className={className} src={imgScr} alt="" />
        </div>
        <div>
          <h2 className="text-gray-800 font-ubuntu text-2xl font-medium leading-normal">{level}</h2>
          <p className="text-gray-600 font-sf-pro-display text-base font-normal leading-6 tracking-[0.24px]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LevelOption