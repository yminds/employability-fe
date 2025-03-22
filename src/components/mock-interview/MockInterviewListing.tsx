import React, { useState } from 'react';
import { useGetAllPreDefinedGoalsQuery } from '@/api/predefinedGoalsApiSlice';
import { useNavigate } from 'react-router-dom';
import { useCreateInterview } from '@/hooks/useCreateInterview';
import { useGetFundamentalsByPredefinedGoalQuery } from '@/api/fundementalSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';

// Define the interface for the API response
interface GoalsResponse {
  data: any[];
}

const MockInterviewsList: React.FC = () => {
  const { data: allGoals,  isLoading: isFetching } = useGetAllPreDefinedGoalsQuery() as { data: GoalsResponse | undefined, isLoading: boolean };
  const navigate = useNavigate();
  // Maintain both the selected goal and whether the slider is open.
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const { data:fundamentals, isLoading, error } = useGetFundamentalsByPredefinedGoalQuery(selectedGoal?._id ?? skipToken);

  const fundamentalsData = fundamentals?.data;
  // Extract all concept names from fundamentalsData
  const conceptNames = fundamentalsData?.flatMap((fundamental: any) => 
    fundamental.concepts.map((concept: any) => concept.name)
  );
  
  // Create a CSV string from concept names
  const conceptNamesCSV = conceptNames?.join(', ');

  // When clicking a row, open the slider.
  const handleGoalClick = (goal: any) => {
    setSelectedGoal(goal);
    setIsSliderOpen(true);
  };

  // When closing, animate out then clear the selected goal.
  const closeSlider = () => {
    setIsSliderOpen(false);
    setTimeout(() => {
      setSelectedGoal(null);
    }, 500); // match the transition duration
  };
  const { createInterview } = useCreateInterview();
  const handleTakeInterview = async (selectedGoal: any) => {
    const interviewId = await createInterview({
      title: `${selectedGoal.title}`,
      type: "Mock",
    });

    // Start the interview directly if tutorial is disabled
    navigate(`/interview/${interviewId}`, {
      state: {title: `${selectedGoal.title}`, type : 'Mock', jobDescription: selectedGoal, mockFundamentals: conceptNamesCSV},
    });
  };
  // Choose the skills list that includes level info if available.
  const skills = selectedGoal?.skill_pool_id || selectedGoal?.skills_pool_ids || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 font-dm-sans">Mock Interviews</h2>
      
      {isFetching && <p>Loading interviews...</p>}

      
      {allGoals && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border text-left text-sub-header">Job Role</th>
                <th className="py-3 px-4 border text-left text-sub-header">Description</th>
              </tr>
            </thead>
            <tbody>
              {allGoals?.data?.map((goal: any) => (
                <tr
                  key={goal._id}
                  className="cursor-pointer hover:bg-gray-50 border-b"
                  onClick={() => handleGoalClick(goal)}
                >
                  <td className="py-3 px-4 text-body1">{goal.title}</td>
                  <td className="py-3 px-4 text-body2">{goal.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Always render the slider container */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[50vw] md:w-1/3 bg-white shadow-xl transition-transform duration-500 transform ${
          isSliderOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedGoal && (
          <div className="p-6 h-full flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-sub-header">{selectedGoal.title} - {selectedGoal.experience_level == '1' ? "Entry level": selectedGoal.experience_level == '2'? "Mid Level" : "Senior level"}</h3>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={closeSlider}
              >
                Close
              </button>
            </div>
            <p className="mb-4 text-gray-700">{selectedGoal.description}</p>
            
            <h4 className="font-semibold text-lg mb-3">Skills</h4>
            {skills.length > 0 ? (
              <ul className="mb-6">
                {skills.map((skillItem: any) => (
                  <li key={skillItem._id} className="flex items-center mb-3">
                    {skillItem.skills_pool?.icon && (
                      <img
                        src={skillItem.skills_pool.icon}
                        alt={skillItem.skills_pool.name}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    <span className="font-medium">{skillItem.skills_pool?.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No skills available.</p>
            )}
            
        
            {isLoading && (
              <div className="my-4 p-4 bg-gray-50 rounded">
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-button mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Loading fundamentals...</p>
                </div>
              </div>
            )}
            
            {error !== undefined && (
              <div className="my-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">
                <p className="font-medium">Error loading fundamentals</p>
                <p className="text-sm mt-1">Please try again later or select a different job role.</p>
              </div>
            )}
            
            <div className="mt-auto">
              <button 
                className="w-full bg-button text-white py-3 px-4 rounded disabled:opacity-50" 
                onClick={() => handleTakeInterview(selectedGoal)}
                disabled={isLoading || !!error}
              >
                {isLoading ? 'Loading...' : 'Take Interview'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewsList;
