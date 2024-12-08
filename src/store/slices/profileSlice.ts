// profileSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for the state and the profile data
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: Address;
  linkedinProfile: string;
  portfolioWebsite: string;
  githubProfile: string;
  workExperiences: Array<any>;
  educations: Array<any>;
  skills: {
    technicalSkills: string;
    softSkills: string;
  };
  projects: Array<any>;
  languages: string;
  certifications: string;
  awards: string;
}

// Define the initial state structure
interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Create an async thunk for creating a profile
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (
    profileData: { userId: string; profileData: ProfileData },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/profile/create",
        {
          userId: profileData.userId,
          profileData: profileData.profileData,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      return response.data.profile; // Return the created profile
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to create profile"
      );
    }
  }
);

// Create the slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
