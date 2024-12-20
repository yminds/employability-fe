import React from "react";

interface ToggleProps {
  isChecked: boolean;
  onToggle: () => void;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ isChecked, onToggle, label }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Toggle Switch */}
      <div
        onClick={onToggle}
        className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer ${
          isChecked ? "bg-primary-500" : "bg-gray-300"
        }`} // Applied primary-500 when checked
      >
        <div
          className={`h-4 w-4 bg-white rounded-full shadow-md transform duration-300 ${
            isChecked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>

      {/* Label */}
      {label && <span className={`text-sm ${"text-secondary-400"}`}>{label}</span>}
    </div>
  );
};

export default Toggle;
