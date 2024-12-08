import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the types for parsed resume data
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

interface ResumeState {
  uploading: boolean;
  error: string | null;
  parsedData: ParsedData | null;
}

const initialState: ResumeState = {
  uploading: false,
  error: null,
  parsedData: null,
};

// Async thunk for uploading and parsing the resume
export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async (
    { file, userId }: { file: File; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", userId);

      const response = await fetch("http://localhost:3000/api/upload-resume", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload resume");
      }

      // Return the parsed data from the backend
      console.log(data.parsedData);
      return data.parsedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // Reset state when needed
    resetResumeState: (state) => {
      state.uploading = false;
      state.error = null;
      state.parsedData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(
        uploadResume.fulfilled,
        (state, action: PayloadAction<ParsedData>) => {
          state.uploading = false;
          state.parsedData = action.payload;
        }
      )
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetResumeState } = resumeSlice.actions;

export default resumeSlice.reducer;
