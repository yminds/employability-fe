import React, { useMemo } from "react";
import Banner from "./BannerBackGround";

interface SkillIconsProps {
  data?: any;
  color: string;
  isGoalsList: boolean;
}

const BannerSkillsIcons: React.FC<SkillIconsProps> = ({ data, color, isGoalsList }) => {
  const generateSkillIcons = (iconUrls: string[]): string[] => {
    return iconUrls.map((url) => `devicon-${url.split("/").pop()?.replace("-original.svg", "")}-plain`);
  };

  const skillIconsData = useMemo(
    () =>
      data?.skills_pool_ids
        ?.filter((skill: any) => skill.icon)
        .map((skill: any) => skill.icon)
        .slice(0, 4),
    [data]
  );

  const skillIcons = generateSkillIcons(skillIconsData || []);

  // Function to darken a color
  const darkenColor = (hex: string, amount: number): string => {
    hex = hex.replace("#", "");
    let [r, g, b] = [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];

    [r, g, b] = [r, g, b].map((val) => Math.max(0, Math.floor(val * (1 - amount))));

    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0")
    );
  };

  // Predefined styles for icons
  const goalsCardsStyles = isGoalsList
    ? [
      "absolute top-[30%] right-[20%] w-[100px] h-[100px] rotate-0",
      "absolute top-[50%] right-[45%] xl:right-[45%] lg:right-[40%] w-[80px] h-[80px] rotate-[-10deg]",
      "absolute top-[60%] right-[3%] xl:right-[4%] lg:right-[5%] w-[70px] h-[70px] rotate-[-30deg]",
      "absolute top-[10%] right-[40%] xl:right-[40%] lg:right-[40%] w-[60px] h-[60px] rotate-[15deg]",
    ]
    : [
        "absolute top-[50%] right-[50%] w-[160px] h-[160px] rotate-0",
        "absolute top-[62%] right-[80%] xl:right-[80%] lg:right-[91%] sm:right-[100%] w-[145px] h-[145px] rotate-[-10deg]",
        "absolute top-[73%] right-[28%] xl:right-[28%] lg:right-[15%] sm:right-[10%] w-[130px] h-[130px] rotate-[-30deg]",
        "absolute top-[28%] right-[71%] xl:right-[75%] lg:right-[85%] sm:right-[90%] w-[100px] h-[100px] rotate-[15deg]",
      ];

  const getFontSize = (style: string): string => {
    const widthMatch = style.match(/w-\[(\d+)px\]/);
    const heightMatch = style.match(/h-\[(\d+)px\]/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 0;
    const height = heightMatch ? parseInt(heightMatch[1]) : 0;
    const baseSize = Math.min(width, height) * 0.7;
    return `${baseSize}px`;
  };

  return (
    <div 
      className="absolute w-full h-full top-0 left-0 overflow-hidden"
      style={{
        background: !isGoalsList
          ? `linear-gradient(126deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 36%, ${color} 100%)`
          : color,
      }}
    >
      <Banner bgColor={color} />
      
      {!isGoalsList ? (
        // Container for goals list view - aligned to the right
        <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center">
          <div className="relative w-full h-[200px]">
            {skillIcons.map((iconClass, index) => {
              const baseStyle = goalsCardsStyles[index % goalsCardsStyles.length];
              const fontSize = getFontSize(baseStyle);
              const shadowColor = darkenColor(color, 1 * 0.2);
              
              // Calculate positions within the container
              const positions = [
                "absolute top-0 right-[20%]",
                "absolute top-[25%] right-[40%]",
                "absolute top-[50%] right-[10%]",
                "absolute top-[10%] right-[60%]"
              ];

              return (
                <div
                  key={index}
                  className={`rounded-full flex justify-center items-center border-white border-4 shadow-lg ${baseStyle} ${positions[index]}`}
                  style={{
                    background: darkenColor(color, index * 0.2),
                    zIndex: 15 - index,
                    boxShadow: `-2px -10px 15px -5px ${shadowColor}`,
                  }}
                >
                  <i className={`${iconClass} text-white`} style={{ fontSize }}></i>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Original layout for non-goals list view
        skillIcons.map((iconClass, index) => {
          const baseStyle = goalsCardsStyles[index % goalsCardsStyles.length];
          const fontSize = getFontSize(baseStyle);
          const shadowColor = darkenColor(color, 1 * 0.2);

          return (
            <div
              key={index}
              className={`rounded-full flex justify-center items-center border-white border-[4px] shadow-md ${baseStyle}`}
              style={{
                background: darkenColor(color, index * 0.2),
                zIndex: 15 - index,
                boxShadow: `-2px -10px 15px -5px ${shadowColor}`,
              }}
            >
              <i className={`${iconClass} text-white`} style={{ fontSize }}></i>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BannerSkillsIcons;