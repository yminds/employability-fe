export interface ProfileFormData {
  education: Education[];
  basicInfo: {
    name: string;
    mobile: string;
    email: string;
    date_of_birth: string;
    gender: string;
    country: string;
    state: string;
    city: string;
    profile_image?: string;
  };
  socialProfiles: {
    gitHub: string;
    linkedIn: string;
    portfolio: string;
  };
  skills: Skill[];
  experience: ExperienceItem[];

  certifications: Certification[];
}

export interface BasicInfo {
  name: string;
  mobile: string;
  email: string;
  date_of_birth: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  profile_image?: string;
}

export interface SocialProfiles {
  gitHub: string;
  linkedIn: string;
  portfolio: string;
}

// src/types.ts

export interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  level: string;
  visibility: string;
}

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
  _id?: string;
  user_id?: string;
  title: string;
  issued_by: string;
  issue_date: string;
  expiration_date: string | null;
  certificate_s3_url: string;
}

// types.ts (or your designated types file)
export interface ExperienceItem {
  _id?: string;
  company: string;
  // jobType: string | number | readonly string[] | undefined;
  isVerified: boolean | undefined;
  // duration: string | number | readonly string[] | undefined;
  id: string;
  title: string;
  employment_type: string;
  // companyName: string;
  companyLogo: string;
  location: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  current_ctc: number;
  expected_ctc: number;
  description: string;
}

export interface ExperienceProps {
  experiences: ExperienceItem[];
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
