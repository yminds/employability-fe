import React from 'react';
import grid from "@/assets/set-goal/grid lines.svg"

interface BannerProps {
  bgColor: string; // Background color
  className?: string; // Additional classes for customization
}

const Banner: React.FC<BannerProps> = ({ bgColor, className = '' }) => {
  return (
    <div
      className={`relative w-full h-[200px] bg-[${bgColor}] ${className}`}
    >
      <img className='w-full' src={grid} alt="" />
    </div>
  );
};

export default Banner;
