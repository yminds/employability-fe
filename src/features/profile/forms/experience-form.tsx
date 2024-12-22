// import React from 'react'
// import { Plus } from 'lucide-react'

// interface ExperienceFormProps {
//   experience: Array<{
//     title: string;
//     company: string;
//     employmentType: string;
//     location: string;
//     startDate: string;
//     endDate: string;
//     currentlyWorking: boolean;
//     currentCTC: string;
//     expectedCTC: string;
//   }>;
//   onChange: (experience: any[]) => void;
// }

// export default function ExperienceForm({ experience, onChange }: ExperienceFormProps) {
//   const addExperience = () => {
//     onChange([
//       ...experience,
//       {
//         title: '',
//         company: '',
//         employmentType: '',
//         location: '',
//         startDate: '',
//         endDate: '',
//         currentlyWorking: false,
//         currentCTC: '',
//         expectedCTC: '',
//       }
//     ])
//   }

//   const updateExperience = (index: number, field: string, value: string | boolean) => {
//     const updatedExperience = experience.map((exp, i) => {
//       if (i === index) {
//         return { ...exp, [field]: value }
//       }
//       return exp
//     })
//     onChange(updatedExperience)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="font-medium">Experience</h3>
//         <label className="inline-flex items-center">
//           <input
//             type="checkbox"
//             className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
//           />
//           <span className="ml-2 text-sm text-gray-600">I am a fresher</span>
//         </label>
//       </div>

//       {experience.map((exp, index) => (
//         <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 type="text"
//                 value={exp.title}
//                 onChange={(e) => updateExperience(index, 'title', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Employment type</label>
//               <select
//                 value={exp.employmentType}
//                 onChange={(e) => updateExperience(index, 'employmentType', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               >
//                 <option value="">Select</option>
//                 <option value="full-time">Full-time</option>
//                 <option value="part-time">Part-time</option>
//                 <option value="contract">Contract</option>
//                 <option value="internship">Internship</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Company</label>
//               <input
//                 type="text"
//                 value={exp.company}
//                 onChange={(e) => updateExperience(index, 'company', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Location</label>
//               <select
//                 value={exp.location}
//                 onChange={(e) => updateExperience(index, 'location', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               >
//                 <option value="">Select</option>
//                 {/* Add location options */}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Start date</label>
//               <input
//                 type="date"
//                 value={exp.startDate}
//                 onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">End date</label>
//               <div className="flex items-center gap-4">
//                 <input
//                   type="date"
//                   value={exp.endDate}
//                   onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
//                   disabled={exp.currentlyWorking}
//                   className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//                 <label className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={exp.currentlyWorking}
//                     onChange={(e) => updateExperience(index, 'currentlyWorking', e.target.checked)}
//                     className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-600">currently working</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Current CTC</label>
//               <input
//                 type="text"
//                 value={exp.currentCTC}
//                 onChange={(e) => updateExperience(index, 'currentCTC', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Expected CTC</label>
//               <input
//                 type="text"
//                 value={exp.expectedCTC}
//                 onChange={(e) => updateExperience(index, 'expectedCTC', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>
//           </div>
//         </div>
//       ))}

//       <button
//         onClick={addExperience}
//         className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
//       >
//         <Plus className="w-4 h-4 mr-1" />
//         Add experience
//       </button>
//     </div>
//   )
// }



// src/forms/experience-form.tsx

import React from 'react';
import { Plus } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  currentCTC: string;
  expectedCTC: string;
}

interface ExperienceFormProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
  errors: { [key: string]: string };
}

export default function ExperienceForm({ experience, onChange, errors }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experience,
      {
        title: '',
        company: '',
        employmentType: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        currentCTC: '',
        expectedCTC: '',
      }
    ]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    const updatedExperience = experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperience);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Experience</h3>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-600">I am a fresher</span>
        </label>
      </div>

      {experience.map((exp, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.title`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.title`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.title`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment type</label>
              <select
                value={exp.employmentType}
                onChange={(e) => updateExperience(index, 'employmentType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.employmentType`) ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              {getError(`experience.${index}.employmentType`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.employmentType`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.company`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.company`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.company`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.location`) ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                {/* Add location options */}
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
                <option value="Berlin">Berlin</option>
                {/* ... other locations */}
              </select>
              {getError(`experience.${index}.location`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.location`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.startDate`) ? "border-red-500" : ""
                }`}
              />
              {getError(`experience.${index}.startDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.startDate`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End date</label>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`experience.${index}.endDate`) ? "border-red-500" : ""
                  }`}
                />
                {getError(`experience.${index}.endDate`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`experience.${index}.endDate`)}
                  </p>
                )}
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) => updateExperience(index, 'currentlyWorking', e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">currently working</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current CTC</label>
              <input
                type="text"
                value={exp.currentCTC}
                onChange={(e) => updateExperience(index, 'currentCTC', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.currentCTC`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.currentCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.currentCTC`)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected CTC</label>
              <input
                type="text"
                value={exp.expectedCTC}
                onChange={(e) => updateExperience(index, 'expectedCTC', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`experience.${index}.expectedCTC`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`experience.${index}.expectedCTC`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`experience.${index}.expectedCTC`)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
      <button
        onClick={addExperience}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add experience
      </button>
    </div>
  );
}
