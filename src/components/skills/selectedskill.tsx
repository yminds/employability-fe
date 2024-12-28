import React from 'react';

interface SelectedSkillProps {
  skill: string;
  icon: string;
  description: string;
}

const SelectedSkill: React.FC<SelectedSkillProps> = ({ skill, icon, description }) => {
  return (
    <section className="p-6 bg-white rounded-lg mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <img src={icon} alt={`${skill} Icon`} className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">{skill}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Start Learning
        </button>
      </div>

      {/* Progress Section */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
        <div>
          <h3 className="text-gray-700 font-medium text-lg">0%</h3>
          <p className="text-sm text-gray-600">Yet to start</p>
        </div>
        <p className="text-gray-600 text-sm">
          Your progress will appear here. Once it’s measured by AI, it’ll reflect the topics you’ve
          covered.
        </p>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2">How does it work?</h3>
        <ul className="list-decimal list-inside text-gray-600 text-sm space-y-2">
          <li>
            The AI will assist you by curating articles, videos, and courses tailored to your needs.
          </li>
          <li>
            Engage with the AI by answering the provided tests to measure your understanding.
          </li>
          <li>
            After completion, you’ll receive a skill score to showcase your performance.
          </li>
          <li>
            Share the score on social media or with potential employers to highlight your skills.
          </li>
        </ul>
      </div>

      {/* Learning Outline Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">What you’ll learn</h3>
        <div className="space-y-4">
          {['Introduction to Bootstrap', 'Intermediate-level Learning', 'Advanced-level Projects', 'Interview Preparation'].map((phase, index) => (
            <div key={index} className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{`Phase ${index + 1}: ${phase}`}</h4>
              <p className="text-sm text-gray-600">
                {index === 0
                  ? 'Develop foundational knowledge of the skill, its applications, and best practices.'
                  : index === 1
                  ? 'Build on core concepts with hands-on exercises and projects.'
                  : index === 2
                  ? 'Work on advanced-level projects to solidify knowledge.'
                  : 'Prepare for job interviews with skill-specific guidance.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills and Career Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Skills Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Top skills you will learn</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Responsive Grid System',
              'Utility Classes',
              'Custom Components',
              'Bootstrap with Flask',
              'Animation Techniques',
            ].map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-sm rounded-full border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Career Paths Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Career paths you’ll be able to explore</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Frontend Developer',
              'React Developer',
              'UI/UX Designer',
              'Web Developer',
              'Data Analyst',
            ].map((career, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-sm rounded-full border border-gray-200"
              >
                {career}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedSkill;
