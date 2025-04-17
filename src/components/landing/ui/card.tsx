import React, { useState, useRef } from "react";

interface CardProps {
  title: string;
  description: string;
  iconSrc: string;
  gradientColorStart: string;
  gradientColorEnd: string;
  iconHeight?: string | number;
  iconWidth?: string | number;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  iconSrc,
  gradientColorStart,
  gradientColorEnd,
  iconHeight = "6rem",
  iconWidth = "6rem",
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div 
      ref={cardRef}
      className="px-8 pb-8 flex min-w-80 flex-col items-start self-stretch rounded-xl border border-[#181A1A] bg-[radial-gradient(98.19%_98.19%_at_50%_1.81%,#131414_0%,#0B0C0D_100%)] backdrop-blur-[10px] relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute w-24 h-24 rounded-full opacity-60"
        style={{
          background: `linear-gradient(180deg, ${gradientColorStart} 0%, ${gradientColorEnd} 133.04%)`,
          filter: "blur(72.84px)",
          zIndex: 0,
          transition: isHovering ? "none" : "all 0.7s ease-out",
          transform: isHovering 
            ? `translate(${position.x - 50}px, ${position.y - 50}px)` 
            : "translate(12px, 12px)",
        }}
      />
      <div className="relative z-10 mb-6 mt-6 h-24 w-24 flex items-center justify-center">
        <img 
          src={iconSrc} 
          alt={title} 
          style={{ 
            width: iconWidth, 
            height: iconHeight 
          }} 
          className="object-contain" 
        />
      </div>
      <div className="flex flex-col gap-3 justify-start relative z-10 w-full">
        <span className="text-white font-ubuntu text-xl font-medium leading-8 tracking-tight">
          {title}
        </span>
        <span className="text-[#B4B4B5] font-ubuntu text-sm font-normal leading-6 tracking-[-0.14px]">
          {description}
        </span>
      </div>
    </div>
  );
};

export default Card;
