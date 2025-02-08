import { Role } from "./Role";

interface Address {
  country: string;
  state: string;
  city: string;
}

interface Resume {
  name: string;
  url: string;
  key: string;
}

export type User = {
  experience_level: string;
  _id: string;
  email: string;
  role: Role;
  name: string;
  isProfileCompleted: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  skills: string[]; // Array of skill IDs
  address: Address;
  education: string[]; // Array of education IDs
  experience: string[]; // Array of experience IDs
  certificates: string[]; // Array of certificate IDs
  date_of_birth: string;
  is_email_verified: boolean;
  email_verification_token?: string;
  email_verification_token_expiry?: Date;
  account_status?: "active" | "disabled";
  gender: string;
  resume: Resume[];
  profile_image?: string;
  bio?: string;
  current_status?: string;
  phone_number?: string;
  gitHub: string;
  linkedIn: string;
  portfolio: string;
  parsedData: any;
  parsedResume: any;
};

// Optional: Define separate interfaces for nested objects if needed
export interface EducationItem {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export interface ExperienceItem {
  _id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string;
}

export interface CertificateItem {
  _id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
}

export interface SkillItem {
  _id: string;
  name: string;
  description: string;
}
