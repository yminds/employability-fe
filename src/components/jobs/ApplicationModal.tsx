import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ApplicantResumeUpload } from './ApplicantResumeUpload';
import { ScreeningQuestions } from './ScreeningQuestions';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyId: string;
  employerId: string;
}

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  jobId,
  companyId,
  employerId
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedResume, setUploadedResume] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [candidate, setCandidate] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch job details including screening questions
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/jobs/${jobId}`);
        setJobDetails(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error fetching job details');
        setLoading(false);
      }
    };

    if (isOpen && jobId) {
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  const handleResumeUploadClick = () => {
    setIsResumeModalOpen(true);
  };

  const handleResumeModalClose = () => {
    setIsResumeModalOpen(false);
  };

  const handleResumeUploaded = (candidateData: any, fileInfo: any) => {
    setUploadedResume(fileInfo);
    setCandidate(candidateData);
    setIsResumeModalOpen(false);
    // Start a simulated progress to show upload/processing
    simulateProgress();
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (responses: any) => {
    try {
      setLoading(true);
      const payload = {
        candidate_id: candidate._id,
        job_id: jobId,
        company_id: companyId,
        responses,
        status: 'completed',
        completed_at: new Date()
      };
      
      await axios.post('/api/candidates/screening-responses', payload);
      onClose();
      // Show success message or redirect
      alert('Application submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Apply For {jobDetails?.title || 'Position'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Stepper */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              ✓
            </div>
            <div className="ml-2 mr-8">Your Details</div>
            
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              {currentStep >= 2 ? '✓' : '2'}
            </div>
            <div className="ml-2">Application Questions</div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4">
          {currentStep === 1 && (
            <div>
              <div className="bg-green-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Join Employability, Get Ahead</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Build Your Profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Take AI-Driven Interviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Get Verified</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stand Out to Employers</span>
                  </li>
                </ul>
                
                <button 
                  className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-md"
                >
                  Signup & Apply
                </button>
              </div>

              <div className="text-center">
                <div className="border-t border-b py-4 my-4">
                  <span className="text-gray-500">Or Apply by uploading resume</span>
                </div>
                
                {uploadedResume ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-red-500 text-white p-2 rounded">PDF</div>
                      <div className="ml-4 text-left">
                        <div>{uploadedResume.originalName}</div>
                        <div className="text-gray-500 text-sm">{Math.round(uploadedResume.size / 1024 / 1024 * 10) / 10} MB</div>
                      </div>
                    </div>
                    
                    {uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">{uploadProgress}%</div>
                      </div>
                    )}
                    
                    {uploadProgress === 100 && (
                      <div className="flex justify-end mt-4">
                        <button 
                          className="text-blue-600 hover:underline"
                          onClick={handleResumeUploadClick}
                        >
                          Change Resume
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    className="text-green-600 hover:underline"
                    onClick={handleResumeUploadClick}
                  >
                    Upload Resume & Apply
                  </button>
                )}
              </div>

              {/* Resume Upload Modal */}
              {isResumeModalOpen && (
                <ApplicantResumeUpload 
                  isOpen={isResumeModalOpen}
                  onClose={handleResumeModalClose}
                  jobId={jobId}
                  companyId={companyId}
                  onUploadSuccess={handleResumeUploaded}
                />
              )}
            </div>
          )}

          {currentStep === 2 && jobDetails?.screening_questions && (
            <ScreeningQuestions 
              questions={jobDetails.screening_questions}
              onSubmit={handleSubmitApplication}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              Back
            </button>
          )}
          {currentStep === 1 ? (
            <button
              onClick={handleNextStep}
              disabled={!candidate}
              className={`px-6 py-2 rounded ${candidate ? 'bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Next
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing when button is hidden
          )}
        </div>
      </div>
    </div>
  );
};