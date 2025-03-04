import React, { useState } from 'react';
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

// Import utility functions
import { jobUtils } from '@/utils/jobUtils';
import { IJob } from './JobCard';
import JobDetailsTabs from './JobDetailsTabs';

interface JobDetailsDialogProps {
  job: IJob;
  onClose: () => void;
  onEdit?: (job: IJob) => void;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ job, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('jobDetails');
  
  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
        <Badge 
          className={`${jobUtils.getStatusColor(job.status)}`}
          variant="outline"
        >
          {job.status}
        </Badge>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="jobDetails" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="jobDetails">Job Details</TabsTrigger>
            <TabsTrigger value="uploadResume">Upload Resumes</TabsTrigger>
            <TabsTrigger value="screening">Screening Results</TabsTrigger>
            <TabsTrigger value="invited">Invited Candidates</TabsTrigger>
          </TabsList>
          
          {/* Job Details Tab */}
          <TabsContent value="jobDetails">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Main Job Info */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Description</h3>
                      <p className="text-gray-600 mt-2">{job.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-700">Requirements</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-gray-600">{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-700">Responsibilities</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="text-gray-600">{resp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700">Required Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills_required.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Applied</span>
                          <span className="text-sm font-medium">{job.candidates.applied.length}</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Shortlisted</span>
                          <span className="text-sm font-medium">
                            {job.candidates.shortlisted.length} / {job.candidates.applied.length}
                          </span>
                        </div>
                        <Progress 
                          value={job.candidates.applied.length ? 
                            (job.candidates.shortlisted.length / job.candidates.applied.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Rejected</span>
                          <span className="text-sm font-medium">
                            {job.candidates.rejected.length} / {job.candidates.applied.length}
                          </span>
                        </div>
                        <Progress 
                          value={job.candidates.applied.length ? 
                            (job.candidates.rejected.length / job.candidates.applied.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Hired</span>
                          <span className="text-sm font-medium">
                            {job.candidates.hired.length} / {job.candidates.shortlisted.length || 1}
                          </span>
                        </div>
                        <Progress 
                          value={job.candidates.shortlisted.length ? 
                            (job.candidates.hired.length / job.candidates.shortlisted.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Additional Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium">Location</h4>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium">Job Type</h4>
                        <p className="text-sm text-gray-600">{jobUtils.formatJobType(job.type)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium">Experience Level</h4>
                        <p className="text-sm text-gray-600">{jobUtils.formatExperienceLevel(job.experience_level)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium">Salary Range</h4>
                        <p className="text-sm text-gray-600">{jobUtils.formatSalaryRange(job.salary_range)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium">Posted Date</h4>
                        <p className="text-sm text-gray-600">{new Date(job.posted_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xl font-bold">{job.views}</p>
                        <p className="text-sm text-gray-600">Views</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xl font-bold">{job.applications}</p>
                        <p className="text-sm text-gray-600">Applications</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xl font-bold">{Math.round((job.applications / Math.max(job.views, 1)) * 100)}%</p>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xl font-bold">{job.candidates.shortlisted.length}</p>
                        <p className="text-sm text-gray-600">Shortlisted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-3">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Job
                    </Button>
                  )}
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Other tabs using the JobDetailsTabs component */}
          <JobDetailsTabs 
            job={job} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </Tabs>
      </div>
    </DialogContent>
  );
};

export default JobDetailsDialog;