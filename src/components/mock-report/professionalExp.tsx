import React from 'react';
import { ExperienceItem } from '@/pages/MockReportPage';

interface ProfessionalExperienceProps {
  experiences: ExperienceItem[];
  matchPercentage?: number;
}

// Helper function to calculate duration between two dates and format as "Xy Zm"
const calculateDuration = (startDate: string, endDate: string | Date): string => {
  const start = new Date(startDate);
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  if (years > 0 && months > 0) {
    return `${years}y ${months}m`;
  } else if (years > 0) {
    return `${years}y`;
  } else {
    return `${months}m`;
  }
};

// Helper function to calculate total experience
const calculateTotalExperience = (experiences: ExperienceItem[]): number => {
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.currently_working ? new Date() : exp.end_date ? new Date(exp.end_date) : new Date();
    
    const diffInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          (endDate.getMonth() - startDate.getMonth());
    
    totalMonths += diffInMonths;
  });
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  return years + (months / 10); // Format as decimal (e.g., 3.5 years)
};

// Helper function to format date as "MMM YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getCompanyInitials = (company: string): string => {
  return company.split(' ').map(word => word[0]).join('').toUpperCase();
};

const ProfessionalExperience: React.FC<ProfessionalExperienceProps> = ({ 
  experiences, 
  matchPercentage = 90 // Default value if not provided
}) => {
  const totalExperience = calculateTotalExperience(experiences);
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with total experience and match percentage */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill="currentColor"/>
            </svg>
          </span>
          <h2 className="text-lg font-semibold">Professional experience</h2>
        </div>
        <div className="flex items-center">
          <span className="mr-4 font-bold">{totalExperience.toFixed(1)} years</span>
          <span className="text-green-500 font-semibold">{matchPercentage}% Match</span>
        </div>
      </div>
      
      {/* "Previous Experience" section */}
      <div className="mb-6">
        <h3 className="text-gray-500 mb-4">Previous Experience</h3>
        
        {experiences.map((exp, index) => (
          <div key={index} className="flex justify-between py-4 border-b border-gray-100">
            <div className="flex">
              <div className="w-12 h-12 mr-4 flex-shrink-0">
                <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-xs font-bold text-black">
                  {getCompanyInitials(exp.company)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-md">{exp.title}</h4>
                <p className="text-sm text-gray-500">{exp.company} • {exp.employment_type}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {calculateDuration(
                  exp.start_date, 
                  exp.currently_working ? new Date() : (exp.end_date || new Date().toISOString())
                )}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
              </div>
            </div>
          </div>
        ))}
        
        <button className="text-blue-600 mt-4 font-medium">View All</button>
      </div>
      
      {/* "Relevant Experience" section */}
      {/* <div className="mb-6">
        <h3 className="text-gray-500 mb-4">Relevant Experience</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-gray-700">
            You have worked on various web application projects, particularly in e-commerce and content
            management systems, which align well with our needs for robust and scalable solutions.
          </li>
        </ul>
      </div> */}
      
      {/* "Strengths in the Role" section */}
      {/* <div>
        <h3 className="text-gray-500 mb-4">Strengths in the Role</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-gray-700">
            You have proven your ability to deliver comprehensive full-stack solutions with a strong emphasis on
            code quality, ensuring maintainability and performance across all stages of development.
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default ProfessionalExperience;