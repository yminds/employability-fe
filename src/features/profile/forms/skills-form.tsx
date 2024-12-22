// import React from 'react'
// import { Plus } from 'lucide-react'

// interface SkillsFormProps {
//   skills: Array<{
//     name: string;
//     rating: number;
//   }>;
//   onChange: (skills: Array<{ name: string; rating: number }>) => void;
// }

// export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
//   const suggestedSkills = ['React', 'MongoDB', 'Node.js', 'GraphQL', 'MySQL', 'Express']

//   const addSkill = (skillName: string) => {
//     onChange([...skills, { name: skillName, rating: 0 }])
//   }

//   const handleSkillChange = (index: number, field: string, value: string | number) => {
//     const updatedSkills = skills.map((skill, i) => {
//       if (i === index) {
//         return { ...skill, [field]: value }
//       }
//       return skill
//     })
//     onChange(updatedSkills)
//   }

//   return (
//     <div className="space-y-6">
//       <h3 className="font-medium">Skills</h3>
      
//       {/* Skills Input */}
//       {skills.map((skill, index) => (
//         <div key={index} className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Skill {index + 1}
//             </label>
//             <select
//               value={skill.name}
//               onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             >
//               <option value="">Select one</option>
//               {suggestedSkills.map(skill => (
//                 <option key={skill} value={skill}>{skill}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Self rating
//             </label>
//             <select
//               value={skill.rating}
//               onChange={(e) => handleSkillChange(index, 'rating', parseInt(e.target.value))}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             >
//               <option value="">__/10</option>
//               {[...Array(11)].map((_, i) => (
//                 <option key={i} value={i}>{i}/10</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       ))}

//       {/* Suggested Skills */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Suggested</label>
//         <div className="flex flex-wrap gap-2">
//           {suggestedSkills.map(skill => (
//             <button
//               key={skill}
//               onClick={() => addSkill(skill)}
//               className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
//             >
//               {skill}
//               <Plus className="w-4 h-4 ml-1" />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Add Skill Button */}
//       <button
//         onClick={() => addSkill('')}
//         className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
//       >
//         <Plus className="w-4 h-4 mr-1" />
//         Add skill
//       </button>
//     </div>
//   )
// }

// src/forms/skills-form.tsx

import React from 'react';
import { Plus } from 'lucide-react';

interface Skill {
  name: string;
  rating: number;
}

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  errors: { [key: string]: string };
}

export default function SkillsForm({ skills, onChange, errors }: SkillsFormProps) {
  const suggestedSkills = ['React', 'MongoDB', 'Node.js', 'GraphQL', 'MySQL', 'Express'];

  const addSkill = (skillName: string = '') => {
    onChange([...skills, { name: skillName, rating: 0 }]);
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange(updatedSkills);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Skills</h3>
      
      {/* Skills Input */}
      {skills.map((skill, index) => (
        <div key={index} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Skill {index + 1}
            </label>
            <select
              value={skill.name}
              onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`skills.${index}.name`) ? "border-red-500" : ""
              }`}
            >
              <option value="">Select one</option>
              {suggestedSkills.map(skillOption => (
                <option key={skillOption} value={skillOption}>{skillOption}</option>
              ))}
            </select>
            {getError(`skills.${index}.name`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`skills.${index}.name`)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Self rating
            </label>
            <select
              value={skill.rating}
              onChange={(e) => handleSkillChange(index, 'rating', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`skills.${index}.rating`) ? "border-red-500" : ""
              }`}
            >
              <option value="">__/10</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}/10</option>
              ))}
            </select>
            {getError(`skills.${index}.rating`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`skills.${index}.rating`)}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Suggested Skills */}
      <div>
        <label className="block text-sm font-medium mb-2">Suggested</label>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map(skillOption => (
            <button
              key={skillOption}
              onClick={() => addSkill(skillOption)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              type="button"
            >
              {skillOption}
              <Plus className="w-4 h-4 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Add Skill Button */}
      <button
        onClick={() => addSkill()}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add skill
      </button>
    </div>
  );
}
