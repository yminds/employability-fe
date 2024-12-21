import React from 'react';

const suggestedSkills = [
  { name: 'Bootstrap', description: 'Popular framework for responsive design.' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework for fast UI development.' },
  { name: 'JavaScript', description: 'Cross-platform scripting language.' },
];

const SuggestedSkills: React.FC = () => {
  return (
    <section className="p-4 bg-gray-50 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Suggested Skills</h2>
      <div className="space-y-2">
        {suggestedSkills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
            <div>
              <h3 className="text-sm font-semibold">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.description}</p>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Skill</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedSkills;
