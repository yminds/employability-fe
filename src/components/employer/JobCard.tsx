import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, ChevronRight, Users } from 'lucide-react';

// Import utility functions
import { jobUtils } from '@/utils/jobUtils';

interface ISkill {
  _id: string;
  name: string;
  icon?: string;
  importance?: "Very Important" | "Important" | "Good-To-Have";
}


interface ISkillRequired {
  skill: string; 
  importance: "Very Important" | "Important" | "Good-To-Have";
}

// Candidate Interface
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
  company?: any;
  employer?: any; 
  job_type: "full-time" | "part-time" | "contract" | "internship";
  work_place_type: "remote" | "hybrid" | "on-site";
  experience_level: "entry" | "mid" | "senior";
  location: string;
  
  skills_required: (ISkill | ISkillRequired | string)[];
  screening_questions?: Array<{
    question: string;
    type: "multiple_choice" | "yes_no" | "text" | "numeric";
    options?: string[];
    is_mandatory: boolean;
    is_eliminatory: boolean;
    ideal_answer?: string;
    customField?: string;
    customFieldValue?: string;
  }>;
  interview_questions?: Array<{
    id: string;
    question: string;
    category?: string;
  }>;
  status: "active" | "closed";
  created_at?: Date | string;
  updated_at?: Date | string;
  
  candidates?: {
    applied?: ICandidate[];
    shortlisted?: ICandidate[];
    rejected?: ICandidate[];
    hired?: ICandidate[];
  };
  views?: number;
  applications?: number;
  
  // Legacy fields for backward compatibility
  createdAt?: string;
  posted_date?: string;
  type?: string;
  work_type?: string;
  requirements?: string[];
  responsibilities?: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface JobCardProps {
  job: IJob;
  onSelect: (job: IJob) => void;
  onEdit?: (job: IJob) => void;
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

const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onEdit }) => {
  // Determine job type (using updated fields with fallbacks for backward compatibility)
  const jobType = job.job_type || job.type || job.work_type || 'full-time';
  
  // Use appropriate date field, with fallbacks and type checking
  const postedDate = typeof job.created_at === 'string' ? job.created_at : 
                    typeof job.posted_date === 'string' ? job.posted_date : 
                    typeof job.createdAt === 'string' ? job.createdAt : '';
  
  // Safely get counts with defaults
  const appliedCount = job.candidates?.applied?.length || 0;
  const shortlistedCount = job.candidates?.shortlisted?.length || 0;
  const rejectedCount = job.candidates?.rejected?.length || 0;
  const hiredCount = job.candidates?.hired?.length || 0;
  
  // Enhanced function to get the skill name from different skill formats
  const getSkillName = (skillItem: any): string => {
    // String case - direct string representing a skill name or ID
    if (typeof skillItem === 'string') {
      return skillItem;
    } 
    
    // Object case - could be a direct skill object or a skill with importance
    if (skillItem && typeof skillItem === 'object') {
      // Direct skill object format like in form data (JobPostingPage sends this)
      if (skillItem.name) {
        return skillItem.name;
      }
      
      // Backend model format with skill reference and importance
      if (skillItem.skill) {
        // If skill is a string (most likely an ID)
        if (typeof skillItem.skill === 'string') {
          return skillItem.skill;
        }
        // If skill is an object with name or _id
        if (typeof skillItem.skill === 'object') {
          return skillItem.skill.name || skillItem.skill._id || 'Unknown Skill';
        }
      }
      
      // Try getting _id directly if it exists
      if (skillItem._id) {
        return typeof skillItem._id === 'string' ? skillItem._id : String(skillItem._id);
      }
    }
    
    // Fallback
    return 'Unknown Skill';
  };
  
  // Transform skills_required to an array of skill names for display
  const getSkillsForDisplay = (): string[] => {
    if (!job.skills_required || !Array.isArray(job.skills_required)) {
      return [];
    }
    
    return job.skills_required.map(getSkillName);
  };
  
  const skillsToDisplay = getSkillsForDisplay();
  
  // Format experience level for display
  const formatExperienceLevel = (level: string = ''): string => {
    const mapping: Record<string, string> = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      // Legacy mappings for backward compatibility
      'intermediate': 'Mid Level',
      'executive': 'Senior Level',
      'entry-level': 'Entry Level',
      'mid-level': 'Mid Level',
      'senior-level': 'Senior Level'
    };
    
    return mapping[level.toLowerCase()] || level;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white rounded-lg">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-h2 font-semibold">{job.title}</h3>
                <Badge 
                  className={`ml-2 text-sm font-dm-sans ${jobUtils.getStatusColor(job.status)}`}
                  variant="outline"
                >
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-body2 text-gray-500">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{jobUtils.formatJobType(jobType)}</span>
                {job.work_place_type && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{job.work_place_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </>
                )}
                {job.experience_level && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{formatExperienceLevel(job.experience_level)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end font-dm-sans">
              <span className="text-xs text-gray-500">
                {postedDate ? jobUtils.getTimeAgo(postedDate) : 'Recently posted'}
              </span>
              <div className="mt-1 flex items-center">
                <div className="flex items-center text-sm text-gray-500 mr-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{job.applications || 0} applicants</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{job.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {skillsToDisplay.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-body2 bg-[#ECECEC]">
                  {skill}
                </Badge>
              ))}
              {skillsToDisplay.length > 4 && (
                <Badge variant="outline" className="text-body2 bg-[#ECECEC]">
                  +{skillsToDisplay.length - 4} more
                </Badge>
              )}
            </div>
            
            <p className="text-body2 text-gray-600 line-clamp-2">
              {job.description}
            </p>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-blue-700">{appliedCount}</p>
              <p className="text-xs text-blue-800">Applied</p>
            </div>
            <div className="bg-purple-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-purple-700">{shortlistedCount}</p>
              <p className="text-xs text-purple-800">Shortlisted</p>
            </div>
            <div className="bg-red-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-red-700">{rejectedCount}</p>
              <p className="text-xs text-red-800">Rejected</p>
            </div>
            <div className="bg-green-50 rounded-md p-2 text-center">
              <p className="text-lg font-semibold text-green-700">{hiredCount}</p>
              <p className="text-xs text-green-800">Hired</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 flex justify-end font-dm-sans">
          <Button variant="outline" onClick={() => onSelect(job)}>
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          {onEdit && (
            <Button variant="outline" className="ml-2" onClick={() => onEdit(job)}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;