import React from "react";

export const AnimatedGrid = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full">
      <div className="absolute inset-0 bg-slate-900" />
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30" />
    </div>
  );
}; 