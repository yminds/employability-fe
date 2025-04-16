// Utility functions for job-related data

interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

// Helper function to extract skill name from various formats
const getSkillName = (skill: any): string => {
  // String case - might be a name or an ID
  if (typeof skill === 'string') {
    return skill;
  } 
  // Object case - could be a skill object, ObjectId, or other structure
  else if (skill && typeof skill === 'object') {
    // If it has a name property, that's our first choice
    if (skill.name) {
      return skill.name;
    }
    // Next try for _id or id
    if (skill._id) {
      return typeof skill._id === 'string' ? skill._id : String(skill._id);
    }
    if (skill.id) {
      return typeof skill.id === 'string' ? skill.id : String(skill.id);
    }
  }
  // Fallback
  return 'Unknown Skill';
};

export const jobUtils = {
  formatJobType: (type: string): string => {
    const types: Record<string, string> = {
      "full-time": "Full Time",
      "part-time": "Part Time",
      "contract": "Contract",
      "remote": "Remote",
      "internship": "Internship"
    };
    return types[type] || type.replace(/\b\w/g, l => l.toUpperCase()).replace('-', ' ');
  },
  
  formatExperienceLevel: (level: string): string => {
    const levels: Record<string, string> = {
      "entry": "Entry Level",
      "mid": "Mid Level",
      "senior": "Senior Level"
    };
    return levels[level] || level;
  },
  
  formatSalaryRange: (range: ISalaryRange): string => {
    return `${range.currency} ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
  },
  
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      "active": "bg-[#DBFFEA] text-[#10B754]",
      "inactive": "bg-gray-100 text-gray-800",
      "draft": "bg-yellow-100 text-yellow-800",
      "applied": "bg-blue-100 text-blue-800",
      "shortlisted": "bg-purple-100 text-purple-800",
      "rejected": "bg-red-100 text-red-800",
      "hired": "bg-teal-100 text-teal-800",
      "passed": "bg-green-100 text-green-800",
      "failed": "bg-red-100 text-red-800",
      "invited": "bg-purple-100 text-purple-800",
      "not_invited": "bg-gray-100 text-gray-800",
      "closed": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  },
  
  getTimeAgo: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (secondsAgo < 60) return 'just now';
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(secondsAgo / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return date.toLocaleDateString();
  },
  
  // Get skills from various formats for display
  getSkillsForDisplay: (skills_required: any[] | undefined): string[] => {
    if (!skills_required || !Array.isArray(skills_required)) {
      return [];
    }
    
    return skills_required.map(getSkillName);
  },
  
  // Filter jobs based on given filters
  filterJobs: (jobs: any[], filters: any) => {
    if (!jobs) return [];
    
    return jobs.filter((job) => {
      // Use job_type with fallback to type for compatibility
      const jobType = job.job_type || job.type || '';
      
      // If filter is 'all', don't filter by this field
      const typeMatch = !filters.type || filters.type === 'all' || 
                       jobType === filters.type;
      
      const levelMatch = !filters.experience_level || filters.experience_level === 'all' || 
                         job.experience_level === filters.experience_level;
      
      const statusMatch = !filters.status || filters.status === 'all' || 
                         job.status === filters.status;
      
      // Handle search across various fields including skills in different formats
      let searchMatch = true;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const title = (job.title || '').toLowerCase();
        const description = (job.description || '').toLowerCase();
        
        // Extract skill names for searching
        const skillNames = job.skills_required ? 
          jobUtils.getSkillsForDisplay(job.skills_required).map((s: string) => s.toLowerCase()) : [];
        
        searchMatch = title.includes(searchTerm) || 
                     description.includes(searchTerm) ||
                     skillNames.some((skill: string) => skill.includes(searchTerm));
      }
      
      return typeMatch && levelMatch && statusMatch && searchMatch;
    });
  }
};