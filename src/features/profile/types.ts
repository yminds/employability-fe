export interface ProfileFormData {
  education: Education[];
  basicInfo: {
    name: string;
    mobile: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    country: string;
    state: string;
    city: string;
    profileImage?: File;
  };
  socialProfiles: {
    github: string;
    linkedin: string;
    dribbble: string;
    behance: string;
    portfolio: string;
  };
  skills: Array<{
    name: string;
    rating: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    employmentType: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    currentCTC: string;
    expectedCTC: string;
  }>;

  certifications: Array<{
    title: string;
    issuedBy: string;
    issueDate: string;
    expirationDate: string;
    credentialURL: string;
  }>;
}

// src/types.ts

export interface Education {
  id: string;
  _id?: any;
  education_level: any; // e.g., "bachelors", "masters", etc.
  degree: any;
  institute: any;
  board_or_certification: any;
  from_date: any; // ISO date string
  till_date: any; // ISO date string
  cgpa_or_marks: any;
  highest_education_level: any;
}

// src/features/profile/types.ts

export interface Certification {
  certificate_s3_url: any;
  issue_date: ReactNode;
  expiration_date: string;
  issued_by: ReactNode;
  _id: string;
  title: string;
  issuedBy: string;
  issueDate: string;
  expirationDate: string | null;
  credentialURL: string;
}

// types.ts (or your designated types file)
export interface ExperienceItem {
  _id?: string;
  company: string;
  jobType: string | number | readonly string[] | undefined;
  isVerified: boolean | undefined;
  duration: string | number | readonly string[] | undefined;
  id: string;
  jobTitle: string;
  employmentType: string;
  companyName: string;
  companyLogo: string;
  location: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  currentCTC: string;
  expectedCTC: string;
  description: string;
}

export interface ExperienceProps {
  experiences: ExperienceItem[];
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
