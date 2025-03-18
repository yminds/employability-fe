import React, { useState } from 'react';
import { useGetAllPreDefinedGoalsQuery } from '@/api/predefinedGoalsApiSlice';
import { useNavigate } from 'react-router-dom';
import { useCreateInterview } from '@/hooks/useCreateInterview';
import {  } from '@/api/fundementalSlice';

const MockInterviewsList: React.FC = () => {
  const { data: allGoals,  isLoading: isFetching } = useGetAllPreDefinedGoalsQuery();
  const navigate = useNavigate();
  // Maintain both the selected goal and whether the slider is open.
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);


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
      state: {title: `${selectedGoal.title}`, type : 'Mock', jobDescription: selectedGoal},
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
              {allGoals?.data.map((goal: any) => (
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
          <div className="p-6 h-full flex flex-col  overflow-y-auto">
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
            
            <div className="mt-auto">
              <button className="w-full bg-button text-white py-3 px-4 rounded" onClick={() => handleTakeInterview(selectedGoal)}>
                Take Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewsList;
