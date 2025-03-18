import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import JobListingPage from './JobListingPage';

const JobListingContainer: React.FC = () => {
  const navigate = useNavigate();
  
  // Get authentication state
  const token = useSelector((state: RootState) => state.employerAuth.token);
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  
  // Get job_id from URL params
  const { jobId } = useParams<{ jobId: string }>();
  
  // Check authentication
  useEffect(() => {
    if (!token || !employer) {
      navigate('/employer/login', { replace: true });
    }
  }, [token, employer, navigate]);
  
  if (!jobId) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-red-500">No job ID provided</p>
      </div>
    );
  }
  
  // Simply pass the job_id to the JobListingPage
  return <JobListingPage job_id={jobId} />;
};

export default JobListingContainer;