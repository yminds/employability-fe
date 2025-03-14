// types/candidate.ts

export interface Contact {
    email: string;
    phone: string;
    linkedin?: string;
    address?: string;
    github?: string;
    portfolio?: string;
  }
  
  export interface Education {
    degree: string;
    institution: string;
    location: string;
    graduationYear?: number;
  }
  
  export interface Experience {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }
  
  export interface CandidateGroups {
    applied?: ICandidate[];
    shortlisted?: ICandidate[];
    rejected?: ICandidate[];
  }
  
  // Main Candidate interface matching backend schema
  export interface ICandidate {
    _id: string;
    name: string;
    contact: Contact;
    summary?: string;
    company_id?: string;
    employer_id?: string;
    job_id?: string[];
    screeningCard?: string[];
    skills: string[];
    softSkills?: string[];
    education: Education[];
    experience: Experience[];
    certifications?: any[];
    projects?: any[];
    languages?: any[];
    awards?: any[];
    interests?: string[];
    role?: string;
    experience_level?: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  // Define Job interface referenced in ScreeningCard
  export interface IJob {
    _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  type?: "full-time" | "part-time" | "contract" | "remote";
  work_type?: string;
  experience_level: "entry" | "mid" | "senior";
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  skills_required: string[];
  posted_date?: string;
  createdAt?: string;
  status: "active" | "inactive" | "draft";
  
  applications?: number;
  company?: string;
    
  }
  
  // Define the ScreeningCard interface to match the API response
  export interface ScreeningCard {
    _id: string;
    candidate_id: ICandidate | string;
    status: "passed" | "failed";
    matching_score: number;
    reason: string;
    invite_status: "not_invited" | "invited";
    createdAt?: string;
    updatedAt?: string;
    job_id?: string | IJob;
    invite_date?: string | null;
    __v?: number;
  }
  
  // Interface for candidate invitation response
  export interface CandidateInvitation {
    _id: string;
    candidate_id: string | ICandidate;
    job_id: string | IJob;
    employer_id: string;
    company_id: string;
    status: "pending" | "accepted" | "rejected";
    message?: string;
    interview_date?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ProcessedResume {
    _id?: string;
    name: string;
    contact: {
      email: string;
      phone: string;
    };
    skills: string[];
    role?: string;
    experience_level?: string;
   
  }