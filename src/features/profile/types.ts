export interface ProfileFormData {
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
    education: Array<{
      level: string;
      degree: string;
      institute: string;
      fromDate: string;
      tillDate: string;
      cgpa: string;
    }>;
    certifications: Array<{
      title: string;
      issuedBy: string;
      issueDate: string;
      expirationDate: string;
      credentialURL: string;
    }>;
  }
  
  