import React, { useState } from 'react';

const suggestedSkills = [
  {
    name: 'Bootstrap',
    description: 'Popular framework for developing responsive, mobile-first websites.',
    icon: 'https://img.icons8.com/color/48/000000/bootstrap.png',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility first CSS framework designed to create applications faster and easier.',
    icon: 'https://img.icons8.com/color/48/000000/tailwind-css.png',
  },
  {
    name: 'JavaScript',
    description:
      'Cross-platform, object-oriented programming language for making web pages interactive.',
    icon: 'https://img.icons8.com/color/48/000000/javascript.png',
  },
  {
    name: 'React',
    description: 'A JavaScript library for building user interfaces.',
    icon: 'https://img.icons8.com/color/48/000000/react-native.png',
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome’s V8 JavaScript engine.',
    icon: 'https://img.icons8.com/color/48/000000/nodejs.png',
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database used for high-volume data storage.',
    icon: 'https://img.icons8.com/color/48/000000/mongodb.png',
  },
  {
    name: 'Express.js',
    description: 'Minimal and flexible Node.js web application framework.',
    icon: 'https://img.icons8.com/ios/50/000000/api.png',
  },
  {
    name: 'Git',
    description: 'Version control system for tracking changes in code.',
    icon: 'https://img.icons8.com/color/48/000000/git.png',
  },
  {
    name: 'Docker',
    description: 'Platform to develop, ship, and run applications in containers.',
    icon: 'https://img.icons8.com/color/48/000000/docker.png',
  },
  {
    name: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript.',
    icon: 'https://img.icons8.com/color/48/000000/typescript.png',
  },
];

const SuggestedSkills: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedSkills = showAll ? suggestedSkills : suggestedSkills.slice(0, 3);

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-medium leading-[26px]">Suggested Skills ({suggestedSkills.length})</h2>
        <button
          className="text-[14px] text-green-600 font-medium hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'View All →'}
        </button>
      </div>
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedSkills.map((skill, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col space-y-4"
          >
            {/* Icon and Title */}
            <div className="flex items-center  space-x-3">
              <div className='w-[42px] h-[42px] rounded-full flex justify-center items-center bg-white'>
                <img  src={skill.icon} alt={skill.name} className="w-[22px] h-[22px]" />
              </div>
              <h3 className="text-[16px] font-medium text-gray-800">{skill.name}</h3>
            </div>
            {/* Description */}
            <p className="text-[14px] text-gray-600 leading-[20px]">{skill.description}</p>
            {/* Button */}
            <button
              className="text-[14px] text-left text-green-600 font-medium hover:text-green-700 hover:underline"
              onClick={() => alert(`Added skill: ${skill.name}`)}
            >
              Add Skill
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedSkills;
