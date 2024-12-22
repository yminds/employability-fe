// import React from 'react'
// import { Plus } from 'lucide-react'

// interface EducationFormProps {
//   education: Array<{
//     level: string;
//     degree: string;
//     institute: string;
//     fromDate: string;
//     tillDate: string;
//     cgpa: string;
//   }>;
//   certifications: Array<{
//     title: string;
//     issuedBy: string;
//     issueDate: string;
//     expirationDate: string;
//     credentialURL: string;
//   }>;
//   onChange: (education: any[], certifications: any[]) => void;
// }

// export default function EducationForm({
//   education,
//   certifications,
//   onChange,
// }: EducationFormProps) {
//   const addEducation = () => {
//     onChange(
//       [
//         ...education,
//         {
//           level: '',
//           degree: '',
//           institute: '',
//           fromDate: '',
//           tillDate: '',
//           cgpa: '',
//         },
//       ],
//       certifications
//     )
//   }

//   const addCertification = () => {
//     onChange(education, [
//       ...certifications,
//       {
//         title: '',
//         issuedBy: '',
//         issueDate: '',
//         expirationDate: '',
//         credentialURL: '',
//       },
//     ])
//   }

//   const updateEducation = (index: number, field: string, value: string) => {
//     const updatedEducation = education.map((edu, i) => {
//       if (i === index) {
//         return { ...edu, [field]: value }
//       }
//       return edu
//     })
//     onChange(updatedEducation, certifications)
//   }

//   const updateCertification = (index: number, field: string, value: string) => {
//     const updatedCertifications = certifications.map((cert, i) => {
//       if (i === index) {
//         return { ...cert, [field]: value }
//       }
//       return cert
//     })
//     onChange(education, updatedCertifications)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-6">
//         <h3 className="font-medium">Education</h3>
        
//         {education.map((edu, index) => (
//           <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Select your highest level of education
//                 </label>
//                 <select
//                   value={edu.level}
//                   onChange={(e) => updateEducation(index, 'level', e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 >
//                   <option value="">Select</option>
//                   <option value="bachelors">Bachelor's Degree</option>
//                   <option value="masters">Master's Degree</option>
//                   <option value="phd">Ph.D.</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Degree/Board/Certification
//                 </label>
//                 <input
//                   type="text"
//                   value={edu.degree}
//                   onChange={(e) => updateEducation(index, 'degree', e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                   placeholder="Enter here"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Institute/University
//               </label>
//               <input
//                 type="text"
//                 value={edu.institute}
//                 onChange={(e) => updateEducation(index, 'institute', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">From</label>
//                 <input
//                   type="date"
//                   value={edu.fromDate}
//                   onChange={(e) => updateEducation(index, 'fromDate', e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Till</label>
//                 <input
//                   type="date"
//                   value={edu.tillDate}
//                   onChange={(e) => updateEducation(index, 'tillDate', e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 CGPA/Marks scored
//               </label>
//               <input
//                 type="text"
//                 value={edu.cgpa}
//                 onChange={(e) => updateEducation(index, 'cgpa', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Enter here"
//               />
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={addEducation}
//           className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
//         >
//           <Plus className="w-4 h-4 mr-1 " />
//           Add education
//         </button>

//         {/* Certifications */}
//         <div className="mt-8">
//           <h3 className="font-medium mb-4">Certifications</h3>
          
//           {certifications.map((cert, index) => (
//             <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={cert.title}
//                     onChange={(e) => updateCertification(index, 'title', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="Enter here"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Issued by</label>
//                   <input
//                     type="text"
//                     value={cert.issuedBy}
//                     onChange={(e) => updateCertification(index, 'issuedBy', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="Enter here"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Issue date</label>
//                   <input
//                     type="date"
//                     value={cert.issueDate}
//                     onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Expiration</label>
//                   <input
//                     type="date"
//                     value={cert.expirationDate}
//                     onChange={(e) => updateCertification(index, 'expirationDate', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Credential URL
//                 </label>
//                 <input
//                   type="url"
//                   value={cert.credentialURL}
//                   onChange={(e) => updateCertification(index, 'credentialURL', e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                   placeholder="Enter here"
//                 />
//               </div>
//             </div>
//           ))}

//           <button
//             onClick={addCertification}
//             className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
//           >
//             <Plus className="w-4 h-4 mr-1" />
//             Add certification
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }



// src/forms/education-form.tsx

import React from 'react';
import { Plus } from 'lucide-react';

interface Education {
  level: string;
  degree: string;
  institute: string;
  fromDate: string;
  tillDate: string;
  cgpa: string;
}

interface Certification {
  title: string;
  issuedBy: string;
  issueDate: string;
  expirationDate: string;
  credentialURL: string;
}

interface EducationFormProps {
  education: Education[];
  certifications: Certification[];
  onChange: (education: Education[], certifications: Certification[]) => void;
  errors: { [key: string]: string };
}

export default function EducationForm({ education, certifications, onChange, errors }: EducationFormProps) {
  const addEducation = () => {
    onChange(
      [
        ...education,
        {
          level: '',
          degree: '',
          institute: '',
          fromDate: '',
          tillDate: '',
          cgpa: '',
        },
      ],
      certifications
    );
  };

  const addCertification = () => {
    onChange(
      education,
      [
        ...certifications,
        {
          title: '',
          issuedBy: '',
          issueDate: '',
          expirationDate: '',
          credentialURL: '',
        },
      ]
    );
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updatedEducation, certifications);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange(education, updatedCertifications);
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h3 className="font-medium">Education</h3>
        
        {education.map((edu, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select your highest level of education
                </label>
                <select
                  value={edu.level}
                  onChange={(e) => updateEducation(index, 'level', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`education.${index}.level`) ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                </select>
                {getError(`education.${index}.level`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`education.${index}.level`)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Degree/Board/Certification
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`education.${index}.degree`) ? "border-red-500" : ""
                  }`}
                  placeholder="Enter here"
                />
                {getError(`education.${index}.degree`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`education.${index}.degree`)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Institute/University
              </label>
              <input
                type="text"
                value={edu.institute}
                onChange={(e) => updateEducation(index, 'institute', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.institute`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`education.${index}.institute`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.institute`)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <input
                  type="date"
                  value={edu.fromDate}
                  onChange={(e) => updateEducation(index, 'fromDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`education.${index}.fromDate`) ? "border-red-500" : ""
                  }`}
                />
                {getError(`education.${index}.fromDate`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`education.${index}.fromDate`)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Till</label>
                <input
                  type="date"
                  value={edu.tillDate}
                  onChange={(e) => updateEducation(index, 'tillDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`education.${index}.tillDate`) ? "border-red-500" : ""
                  }`}
                />
                {getError(`education.${index}.tillDate`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`education.${index}.tillDate`)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CGPA/Marks scored
              </label>
              <input
                type="text"
                value={edu.cgpa}
                onChange={(e) => updateEducation(index, 'cgpa', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`education.${index}.cgpa`) ? "border-red-500" : ""
                }`}
                placeholder="Enter here"
              />
              {getError(`education.${index}.cgpa`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`education.${index}.cgpa`)}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          type="button"
        >
          <Plus className="w-4 h-4 mr-1 " />
          Add education
        </button>

        {/* Certifications */}
        <div className="mt-8">
          <h3 className="font-medium mb-4">Certifications</h3>
          
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => updateCertification(index, 'title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      getError(`certifications.${index}.title`) ? "border-red-500" : ""
                    }`}
                    placeholder="Enter here"
                  />
                  {getError(`certifications.${index}.title`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`certifications.${index}.title`)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Issued by</label>
                  <input
                    type="text"
                    value={cert.issuedBy}
                    onChange={(e) => updateCertification(index, 'issuedBy', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      getError(`certifications.${index}.issuedBy`) ? "border-red-500" : ""
                    }`}
                    placeholder="Enter here"
                  />
                  {getError(`certifications.${index}.issuedBy`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`certifications.${index}.issuedBy`)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Issue date</label>
                  <input
                    type="date"
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      getError(`certifications.${index}.issueDate`) ? "border-red-500" : ""
                    }`}
                  />
                  {getError(`certifications.${index}.issueDate`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`certifications.${index}.issueDate`)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiration</label>
                  <input
                    type="date"
                    value={cert.expirationDate}
                    onChange={(e) => updateCertification(index, 'expirationDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      getError(`certifications.${index}.expirationDate`) ? "border-red-500" : ""
                    }`}
                  />
                  {getError(`certifications.${index}.expirationDate`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`certifications.${index}.expirationDate`)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Credential URL
                </label>
                <input
                  type="url"
                  value={cert.credentialURL}
                  onChange={(e) => updateCertification(index, 'credentialURL', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    getError(`certifications.${index}.credentialURL`) ? "border-red-500" : ""
                  }`}
                  placeholder="Enter here"
                />
                {getError(`certifications.${index}.credentialURL`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`certifications.${index}.credentialURL`)}
                  </p>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addCertification}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
            type="button"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add certification
          </button>
        </div>
      </div>
    </div>
  );
}
