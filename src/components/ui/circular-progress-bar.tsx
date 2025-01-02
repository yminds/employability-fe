import React from 'react';

interface CircularProgressProps {
  progress: number; // Progress value between 0 and 100
  size?: number; // Diameter of the circle in pixels
  strokeWidth?: number; // Thickness of the stroke
  showText?: boolean; // Whether to show the text in the center
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Progress Circle */}
      <svg
        className="absolute"
        width={size}
        height={size}
        style={{
          transform: 'rotate(90deg)', // Start from the bottom
          transformOrigin: 'center',
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-[#01FF85]"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // Rounded edges for the progress
          style={{
            stroke: 'currentColor',
            transition: 'stroke-dashoffset 0.35s',
          }}
        />
      </svg>

      {/* Conditional Text */}
      {showText && (
        <span className="absolute text-base font-semibold">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default CircularProgress;
