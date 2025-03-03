import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, ChevronRight, Users } from 'lucide-react';

// Import utility functions
import { jobUtils } from '@/utils/jobUtils';

// Job Interface
interface ICandidate {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface IJob {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  experience_level: "entry" | "mid" | "senior";
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  skills_required: string[];
  posted_date: string;
  status: "active" | "inactive" | "draft";
  candidates: {
    applied: ICandidate[];
    shortlisted: ICandidate[];
    rejected: ICandidate[];
    hired: ICandidate[];
  };
  views: number;
  applications: number;
}

interface JobCardProps {
  job: IJob;
  onSelect: (job: IJob) => void;
}

// Eye icon component
const Eye = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <Badge 
                  className={`ml-2 ${jobUtils.getStatusColor(job.status)}`}
                  variant="outline"
                >
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{jobUtils.formatJobType(job.type)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">{jobUtils.getTimeAgo(job.posted_date)}</span>
              <div className="mt-1 flex items-center">
                <div className="flex items-center text-sm text-gray-500 mr-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{job.applications} applicants</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{job.views} views</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {job.skills_required.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
              {job.skills_required.length > 4 && (
                <Badge variant="outline" className="font-normal">
                  +{job.skills_required.length - 4} more
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-blue-700">{job.candidates.applied.length}</p>
              <p className="text-xs text-blue-800">Applied</p>
            </div>
            <div className="bg-purple-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-purple-700">{job.candidates.shortlisted.length}</p>
              <p className="text-xs text-purple-800">Shortlisted</p>
            </div>
            <div className="bg-red-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-red-700">{job.candidates.rejected.length}</p>
              <p className="text-xs text-red-800">Rejected</p>
            </div>
            <div className="bg-green-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-green-700">{job.candidates.hired.length}</p>
              <p className="text-xs text-green-800">Hired</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={() => onSelect(job)}>
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;