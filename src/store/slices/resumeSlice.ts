import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000/api";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Contact {
  github: string;
  portfolio: string;
  email: string;
  phone: string;
  linkedin: string;
  address: Address;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationYear: number;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ParsedData {
  name: string;
  contact: Contact;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certifications: string[];
  projects: Project[];
  languages: string[];
  awards: string[];
  interests: string[];
}

interface UploadResumeResponse {
  parsedData: ParsedData;
  message: string;
}

export const resumeApiSlice = createApi({
  reducerPath: "resumeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    uploadResume: builder.mutation<
      UploadResumeResponse,
      { file: File; userId: string }
    >({
      query: ({ file, userId }) => {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", userId);

        return {
          url: "/upload-resume",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadResumeMutation } = resumeApiSlice;
