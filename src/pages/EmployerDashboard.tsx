import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, CheckCircle } from 'lucide-react';

// Mock Data
const MOCK_JOBS = [
  {
    _id: '1',
    title: 'Senior React Developer',
    location: 'Bangalore',
    type: 'full-time',
    description: 'We are looking for an experienced React developer to join our team.',
    requirements: [
      'Five years of experience with React',
      'Strong TypeScript skills',
      'Experience with state management'
    ],
    skills_required: ['React', 'TypeScript', 'Redux', 'Node.js'],
    experience_level: 'senior',
    salary_range: {
      min: 2000000,
      max: 3500000,
      currency: 'INR'
    },
    posted_date: '2024-02-15',
    candidates: {
      applied: [
        { name: 'John Doe', email: 'john@example.com', skills: ['React', 'TypeScript', 'Node.js'] },
        { name: 'Jane Smith', email: 'jane@example.com', skills: ['React', 'Redux', 'JavaScript'] }
      ],
      shortlisted: [],
      rejected: [],
      hired: []
    }
  },
  {
    _id: '2',
    title: 'UI/UX Designer',
    location: 'Mumbai',
    type: 'remote',
    description: 'Looking for a creative UI/UX designer with modern design skills.',
    requirements: [
      'Three years of UI/UX experience',
      'Proficiency in Figma',
      'Portfolio of web/mobile designs'
    ],
    skills_required: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
    experience_level: 'mid',
    salary_range: {
      min: 1500000,
      max: 2500000,
      currency: 'INR'
    },
    posted_date: '2024-02-10',
    candidates: {
      applied: [
        { name: 'Alice Johnson', email: 'alice@example.com', skills: ['Figma', 'UI Design', 'Sketch'] }
      ],
      shortlisted: [
        { name: 'Bob Wilson', email: 'bob@example.com', skills: ['UI Design', 'User Research'] }
      ],
      rejected: [],
      hired: []
    }
  }
];

// Utility functions
const formatJobType = (type) => {
  const types = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'remote': 'Remote'
  };
  return types[type] || type;
};

const formatSalaryRange = (range) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: range.currency,
    maximumFractionDigits: 0
  });
  return `${formatter.format(range.min)} - ${formatter.format(range.max)}`;
};

const formatExperienceLevel = (level) => {
  const levels = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level'
  };
  return levels[level] || level;
};

// Job Posting Form Component
const JobPostingForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time',
    experience_level: 'entry',
    salary_range: {
      min: 0,
      max: 0,
      currency: 'INR'
    },
    skills_required: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      skills_required: formData.skills_required.split(',').map(skill => skill.trim())
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Requirements (one per line)</label>
        <Textarea
          value={formData.requirements}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          required
          rows={3}
          placeholder="Enter each requirement on a new line"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Experience Level</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.experience_level}
            onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
            required
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salary Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={formData.salary_range.min}
              onChange={(e) => setFormData({
                ...formData, 
                salary_range: {...formData.salary_range, min: Number(e.target.value)}
              })}
              required
            />
            <Input
              type="number"
              placeholder="Max"
              value={formData.salary_range.max}
              onChange={(e) => setFormData({
                ...formData, 
                salary_range: {...formData.salary_range, max: Number(e.target.value)}
              })}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Required Skills (comma-separated)</label>
        <Input
          value={formData.skills_required}
          onChange={(e) => setFormData({...formData, skills_required: e.target.value})}
          placeholder="e.g. React, TypeScript, Node.js"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Post Job</Button>
      </div>
    </form>
  );
};

// Job Details Dialog Component
const JobDetailsDialog = ({ job, onClose }) => {
  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Job Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Job Description</h3>
              <p className="text-gray-600 mt-2">{job.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Requirements</h3>
              <ul className="list-disc pl-5 mt-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-600">{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills_required.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Job Type</h4>
                    <p className="text-gray-600">{formatJobType(job.type)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Experience Level</h4>
                    <p className="text-gray-600">{formatExperienceLevel(job.experience_level)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Salary Range</h4>
                    <p className="text-gray-600">{formatSalaryRange(job.salary_range)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xl font-bold">{job.candidates.applied.length}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xl font-bold">{job.candidates.shortlisted.length}</p>
                    <p className="text-sm text-gray-600">Shortlisted</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xl font-bold">{job.candidates.rejected.length}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xl font-bold">{job.candidates.hired.length}</p>
                    <p className="text-sm text-gray-600">Hired</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidates Management Section */}
        <div className="mt-8 border-t pt-6">
          <Tabs defaultValue="existingCandidates" className="space-y-4">
            <TabsList className="grid grid-cols-2 gap-4">
              <TabsTrigger value="existingCandidates" className="w-full">
                Existing Candidates
              </TabsTrigger>
              <TabsTrigger value="verifiedUsers" className="w-full">
                Verified Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existingCandidates">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Candidates</CardTitle>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        className="pl-10" 
                        placeholder="Search candidates..." 
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.candidates.applied.map((candidate, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-semibold">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                          <div className="flex gap-2 mt-1">
                            {candidate.skills.map((skill, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View CV</Button>
                          <Button variant="outline" size="sm">Schedule Interview</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifiedUsers">
              <Card>
                <CardHeader>
                  <CardTitle>Verified Users</CardTitle>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        className="pl-10" 
                        placeholder="Search verified users..." 
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-semibold">Verified User {index + 1}</h4>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-sm text-gray-600">Skills match: 85%</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Technical Assessment: 92%
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Skills Verified
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button variant="outline" size="sm">Invite to Apply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DialogContent>
  );
};

// Main Dashboard Component
const EmployerDashboard = () => {
  const [isJobPostingOpen, setIsJobPostingOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const handleJobSubmit = (jobData) => {
    const newJob = {
      ...jobData,
      _id: String(jobs.length + 1),
      posted_date: new Date().toISOString(),
      candidates: {
        applied: [],
        shortlisted: [],
        rejected: [],
        hired: []
      }
    };
    setJobs([newJob, ...jobs]);
    setIsJobPostingOpen(false);
  };

  return (
    <main className="h-screen w-full overflow-hidden font-ubuntu">
      <div className="h-full flex flex-col bg-[#F5F5F5]">
        <div className="flex-1 p-[55px] min-h-0">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-gray-600 text-2xl flex items-center gap-3">
              Welcome Back, John Doe
              <span className="wave">
                <img src="/api/placeholder/24/24" alt="Wave" className="w-6" />
              </span>
            </h1>
            <Button 
              onClick={() => setIsJobPostingOpen(true)}
              className="bg-[#001630] text-white hover:bg-[#062549]"
            >
              Post New Job
            </Button>
          </header>

          {/* Main Content */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <Card key={job._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {job.location} • {formatJobType(job.type)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {job.skills_required.slice(0, 3).map((skill, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills_required.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              +{job.skills_required.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-gray-600 mb-2">
                          Posted {new Date(job.posted_date).toLocaleDateString('en-GB')}
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedJob(job)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{job.candidates.applied.length}</p>
                        <p className="text-xs text-gray-600">Applied</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{job.candidates.shortlisted.length}</p>
                        <p className="text-xs text-gray-600">Shortlisted</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{job.candidates.rejected.length}</p>
                        <p className="text-xs text-gray-600">Rejected</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{job.candidates.hired.length}</p>
                        <p className="text-xs text-gray-600">Hired</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Job Posting Dialog */}
          <Dialog open={isJobPostingOpen} onOpenChange={setIsJobPostingOpen}>
            <DialogContent className="max-w-2xl">
              <DialogTitle>Post a New Job</DialogTitle>
              <JobPostingForm 
                onClose={() => setIsJobPostingOpen(false)}
                onSubmit={handleJobSubmit}
              />
            </DialogContent>
          </Dialog>

          {/* Job Details Dialog */}
          {selectedJob && (
            <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
              <JobDetailsDialog 
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
              />
            </Dialog>
          )}
        </div>
      </div>
    </main>
  );
};

export default EmployerDashboard;