// Utility functions for job-related data

interface ISalaryRange {
    min: number;
    max: number;
    currency: string;
  }
  
  export const jobUtils = {
    formatJobType: (type: string): string => {
      const types: Record<string, string> = {
        "full-time": "Full Time",
        "part-time": "Part Time",
        "contract": "Contract",
        "remote": "Remote"
      };
      return types[type] || type;
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
        "active": "bg-green-100 text-green-800",
        "inactive": "bg-gray-100 text-gray-800",
        "draft": "bg-yellow-100 text-yellow-800",
        "applied": "bg-blue-100 text-blue-800",
        "shortlisted": "bg-purple-100 text-purple-800",
        "rejected": "bg-red-100 text-red-800",
        "hired": "bg-teal-100 text-teal-800",
        "passed": "bg-green-100 text-green-800",
        "failed": "bg-red-100 text-red-800",
        "invited": "bg-purple-100 text-purple-800",
        "not_invited": "bg-gray-100 text-gray-800"
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
    
    // Filter jobs based on given filters
    filterJobs: (jobs: any[], filters: any) => {
      if (!jobs) return [];
      
      return jobs.filter((job) => {
        // If filter is 'all', don't filter by this field
        const typeMatch = !filters.type || filters.type === 'all' || job.type === filters.type;
        const levelMatch = !filters.experience_level || filters.experience_level === 'all' || job.experience_level === filters.experience_level;
        const statusMatch = !filters.status || filters.status === 'all' || job.status === filters.status;
        
        const searchMatch = !filters.search || 
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.skills_required.some((skill: string) => 
            skill.toLowerCase().includes(filters.search.toLowerCase())
          );
        
        return typeMatch && levelMatch && statusMatch && searchMatch;
      });
    }
  };