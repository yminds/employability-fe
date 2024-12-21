import React from 'react';

const SkillSummary: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>
      <p>6/10 Skills Verified</p>
      <ul className="mt-2">
        <li>3 Excellent</li>
        <li>2 Intermediate</li>
        <li>1 Weak</li>
      </ul>
    </div>
  );
};

export default SkillSummary;
