import React, { useMemo } from "react";
import Banner from "./BannerBackGround";

interface SkillIconsProps {
  data?:any;
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
        { top: "22%", right: "18%", width: "85px", height: "85px", rotate: "0deg" },
        { top: "40%", right: "39%", width: "75px", height: "75px", rotate: "-15deg" },
        { top: "60%", right: "5%", width: "60px", height: "60px", rotate: "-30deg" },
        { top: "12%", right: "38%", width: "35px", height: "35px", rotate: "15deg" }
      ]
    : [
        { top: "50%", right: "20%", width: "160px", height: "160px", rotate: "0deg" },
        { top: "64%", right: "30%", width: "145px", height: "145px", rotate: "-10deg" },
        { top: "70%", right: "12%", width: "130px", height: "130px", rotate: "-30deg" },
        { top: "31%", right: "29%", width: "100px", height: "100px", rotate: "15deg" }
      ];

    const getIconStyles = (style: any, index: number) => {
      const darkenedColor = darkenColor(color, index * 0.2);
      const shadowColor = darkenColor(color,0.2); 
    
      const baseSize = Math.min(parseInt(style.width), parseInt(style.height)) * 0.7;
      const fontSize = baseSize;
    
      return {
        backgroundColor: darkenedColor,
        top: style.top,
        right: style.right,
        width: style.width,
        height: style.height,
        zIndex: 15 - index,
        transform: `rotate(${style.rotate})`,
        boxShadow: isGoalsList
          ? `10px 10px 30px ${shadowColor}` // Shadow for goals list
          : `0px 4px 12px ${shadowColor}`, // Shadow for non-goals list
        border: isGoalsList ? "4px solid white" : "2px solid white",
        fontSize: `${fontSize}px`
      };
    };

  return (
    <div className={`absolute w-full h-full top-0 left-0 overflow-hidden bg-gradient-to-r from-white via-white to-cyan-400`}   style={{
        background: !isGoalsList
          ? `linear-gradient(126deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 36%, ${color} 100%)`
          : color, // fallback for solid color when isGoalsList is true
      }}>
    <Banner bgColor={color} />
      {skillIcons.map((iconClass, index) => {
        const baseStyle = goalsCardsStyles[index % goalsCardsStyles.length];
        const iconStyles = getIconStyles(baseStyle, index);

        return (
          <div
            key={index}
            className="absolute flex items-center justify-center rounded-full overflow-visible"
            style={iconStyles}
          >
            <i className={`${iconClass} text-white`} style={{ fontSize: iconStyles.fontSize }}></i>
          </div>
        );
      })}
    </div>
  );
};

export default BannerSkillsIcons;
