import React, { useState, useMemo } from 'react';
import InterviewInvites from '@/features/dashboard/InterviewsInvites';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetAllUserInterviewsQuery } from '@/api/interviewApiSlice';
import { useNavigate } from 'react-router-dom';

const InterviewsListingPage: React.FC = () => {
  const user_id = useSelector((state: RootState) => state.auth.user?._id);
  const { data: userInterviews, isLoading: interviewsLoading } = useGetAllUserInterviewsQuery(user_id);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Using useMemo to prevent unnecessary re-calculations
  const sortedAndFilteredInterviews = useMemo(() => {
    if (!userInterviews?.data || !Array.isArray(userInterviews.data)) {
      return [];
    }
    
    // First, create a copy of the array to avoid mutating the original data
    const interviewsCopy = [...userInterviews.data];
    
    // Sort by date (most recent first)
    interviewsCopy.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
    
    // Then filter based on active filter
    return interviewsCopy.filter((interview) => {
      if (activeFilter === 'all') return true;
      return interview.type && interview.type.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [userInterviews?.data, activeFilter]);
  
  const navigate = useNavigate();

  const handleViewReport = (interview_id : string,type:string) => {
    navigate(`/skill/report/${interview_id}`, {
      state: { best_interview: interview_id, type: type },
    });
  };

  const handleViewMockReport = (interview_id : string,type:string) => {
    navigate(`/skill/report/${type}/${interview_id}`, {
      state: { best_interview: interview_id, type: type },
    });
  };

  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className="flex-col bg-[#F5F5F5] w-[95%] max-w-[1800px] p-5 h-full sm:p-0">
        <InterviewInvites />
        <div>
          <h2 className="text-[#1f2226] text-lg font-medium font-['Ubuntu'] leading-snug">
            Interviews
          </h2>
          <div className="mt-4">
            {interviewsLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex border-b">
                    <button
                      onClick={() => handleFilterChange('all')}
                      className={`py-2 px-4 font-medium ${
                        activeFilter === 'all'
                          ? 'border-b-2 border-blue-500 text-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleFilterChange('skill')}
                      className={`py-2 px-4 font-medium ${
                        activeFilter === 'skill'
                          ? 'border-b-2 border-blue-500 text-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Skill
                    </button>
                    <button
                      onClick={() => handleFilterChange('mock')}
                      className={`py-2 px-4 font-medium ${
                        activeFilter === 'mock'
                          ? 'border-b-2 border-blue-500 text-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Mock
                    </button>
                    <button
                      onClick={() => handleFilterChange('job')}
                      className={`py-2 px-4 font-medium ${
                        activeFilter === 'job'
                          ? 'border-b-2 border-blue-500 text-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Job
                    </button>
                  </div>
                </div>
                
                {/* Debug info - uncomment to troubleshoot */}
                {/* <div className="mb-4 p-2 bg-gray-100 rounded">
                  <p>Active Filter: {activeFilter}</p>
                  <p>Total Interviews: {userInterviews?.data?.length || 0}</p>
                  <p>Sorted & Filtered Interviews: {sortedAndFilteredInterviews?.length || 0}</p>
                </div> */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[45vh] overflow-auto minimal-scrollbar">
                  {sortedAndFilteredInterviews.length > 0 ? ( 
                    sortedAndFilteredInterviews.map((interview: any) => (
                      <div key={interview._id} className="bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{interview.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                            {interview.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">Rating: {interview.rating}/5</p>
                        {interview.skills && interview.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {interview.skills.map((skill: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <button className="px-4 py-2 bg-button text-white rounded hover:bg-[#00163099] transition-colors" onClick={()=>(interview.type === 'Mock'|| interview.type === "Job") ? handleViewMockReport(interview._id,interview.type) : handleViewReport(interview._id,interview.type)}>
                            View Report
                          </button>
                          <span className="text-sm text-gray-400">
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No interviews found for this filter.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewsListingPage;