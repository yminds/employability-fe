import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const suggestedSkills = [
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    description: 'Popular framework for developing responsive, mobile-first websites.',
    icon: 'https://img.icons8.com/color/48/000000/bootstrap.png',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Utility first CSS framework designed to create applications faster and easier.',
    icon: 'https://img.icons8.com/color/48/000000/tailwind-css.png',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description:
      'Cross-platform, object-oriented programming language for making web pages interactive.',
    icon: 'https://img.icons8.com/color/48/000000/javascript.png',
  },
  {
    id: 'react',
    name: 'React',
    description: 'A JavaScript library for building user interfaces.',
    icon: 'https://img.icons8.com/color/48/000000/react-native.png',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome’s V8 JavaScript engine.',
    icon: 'https://img.icons8.com/color/48/000000/nodejs.png',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL database used for high-volume data storage.',
    icon: 'https://img.icons8.com/color/48/000000/mongodb.png',
  },
  {
    id: 'express',
    name: 'Express.js',
    description: 'Minimal and flexible Node.js web application framework.',
    icon: 'https://img.icons8.com/ios/50/000000/api.png',
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Version control system for tracking changes in code.',
    icon: 'https://img.icons8.com/color/48/000000/git.png',
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Platform to develop, ship, and run applications in containers.',
    icon: 'https://img.icons8.com/color/48/000000/docker.png',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript.',
    icon: 'https://img.icons8.com/color/48/000000/typescript.png',
  },
];

const SuggestedSkills: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const displayedSkills = showAll ? suggestedSkills : suggestedSkills.slice(0, 3);

  const handleAddSkill = (id: string) => {
    navigate(`/skills/suggestedskills/${id}`);
  };

  return (
    <div className='sm:max-w-[90vw] overflow-auto '>
      <section className="p-6 bg-white rounded-lg sm:flex sm:flex-col sm:items-start  sm:w-[68vw] sm:p-4 ">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 w-full sm:max-w-[90vw]">
          <h2 className="text-[20px] font-medium leading-[26px] sm:text-sm">Suggested Skills ({suggestedSkills.length})</h2>
          <button
            className="text-[14px] text-green-600 font-medium hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All →'}
          </button>
        </div>
        {/* Skills Flex */}
          <div className="flex flex-wrap gap-4 ">
            {displayedSkills.map((skill, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg  flex-1 flex-col space-y-4 min-w-[280px] "
              >
                {/* Icon and Title */}
                <div className="flex items-center space-x-3">
                  <div className="w-[42px] h-[42px] rounded-full flex justify-center items-center bg-white">
                    <img src={skill.icon} alt={skill.name} className="w-[22px] h-[22px]" />
                  </div>
                  <h3 className="text-[16px] font-medium text-gray-800">{skill.name}</h3>
                    </div>
                      {/* Description */}
                      <p className="text-[14px] text-gray-600 leading-[20px]">{skill.description}</p>
                      {/* Button */}
                      <button
                        className="text-[14px] text-left text-green-600 font-medium hover:text-green-700 hover:underline"
                        onClick={() => handleAddSkill(skill.id)}
                            >
                        Add Skill
                      </button>
                    </div>
             ))}
          </div>
      </section>      
    </div>
  );
};

export default SuggestedSkills;
