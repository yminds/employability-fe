import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/models/User";

interface ProfileCompletionStatus {
  basic: "pending" | "updated";
  skills: "pending" | "updated";
  education: "pending" | "updated";
  experience: "pending" | "updated";
  certification: "pending" | "updated";
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: {
    name: string;
  };
  profileCompletionStatus: ProfileCompletionStatus;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  role: {
    name: "",
  },
  profileCompletionStatus: {
    basic: "pending",
    skills: "pending",
    education: "pending",
    experience: "pending",
    certification: "pending",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      // Initialize profile completion status
      state.profileCompletionStatus = {
        basic: user.is_basic_info ? "updated" : "pending",
        skills: "pending",
        education:
          user.education && user.education.length > 0 ? "updated" : "pending",
        experience:
          user.experience && user.experience.length > 0 ? "updated" : "pending",
        certification:
          user.certificates && user.certificates.length > 0
            ? "updated"
            : "pending",
      };
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    updateUserProfile: (state, action: { payload: Partial<User> }) => {
      if (state.user) {
        // Merge the existing user data with the new data
        state.user = {
          ...state.user,
          ...action.payload,
          // Ensure arrays are properly updated
          bio:
            action.payload.bio !== undefined
              ? action.payload.bio
              : state.user.bio,
          current_status:
            action.payload.current_status !== undefined
              ? action.payload.current_status
              : state.user.current_status,
          skills: action.payload.skills || state.user.skills,
          education: action.payload.education || state.user.education,
          experience: action.payload.experience || state.user.experience,
          certificates: action.payload.certificates || state.user.certificates,
          // Update nested objects
          address: action.payload.address
            ? { ...state.user.address, ...action.payload.address }
            : state.user.address,
        };

        // Update profile completion status
        if (action.payload.education) {
          state.profileCompletionStatus.education =
            action.payload.education.length > 0 ? "updated" : "pending";
        }
        if (action.payload.experience) {
          state.profileCompletionStatus.experience =
            action.payload.experience.length > 0 ? "updated" : "pending";
        }
        if (action.payload.certificates) {
          state.profileCompletionStatus.certification =
            action.payload.certificates.length > 0 ? "updated" : "pending";
        }
      }
    },
    updateUserEmail: (state, action: { payload: string }) => {
      if (state.user) {
        state.user = {
          ...state.user,
          email: action.payload,
        };
      }
    },
    updateEmailVerification: (state) => {
      if (state.user) {
        state.user = {
          ...state.user,
          is_email_verified: true,
          account_status: "active",
        };
      }
    },
    updateSkillsStatus: (
      state,
      action: PayloadAction<"pending" | "updated">
    ) => {
      state.profileCompletionStatus.skills = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("api/executeMutation/fulfilled"),
        (
          state,
          action: { payload: any; meta: { arg: { endpointName: string } } }
        ) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "login") {
            state.user = action.payload.user_info;
            state.token = action.payload.token;
            if (state.user) {
              state.profileCompletionStatus = {
                basic: state.user.is_basic_info ? "updated" : "pending",
                skills: "pending",
                education:
                  state.user.education && state.user.education.length > 0
                    ? "updated"
                    : "pending",
                experience:
                  state.user.experience && state.user.experience.length > 0
                    ? "updated"
                    : "pending",
                certification:
                  state.user.certificates && state.user.certificates.length > 0
                    ? "updated"
                    : "pending",
              };
            }
          } else if (endpointName === "updateUser") {
            if (action.payload.data) {
              state.user = action.payload.data;
              if (state.user) {
                state.profileCompletionStatus = {
                  ...state.profileCompletionStatus,
                  basic: state.user.is_basic_info ? "updated" : "pending",
                  education:
                    state.user.education && state.user.education.length > 0
                      ? "updated"
                      : "pending",
                  experience:
                    state.user.experience && state.user.experience.length > 0
                      ? "updated"
                      : "pending",
                  certification:
                    state.user.certificates &&
                    state.user.certificates.length > 0
                      ? "updated"
                      : "pending",
                };
              }
            }
          } else if (endpointName === "getUserSkills") {
            const hasSkills = action.payload.data.optional.length > 0;
            state.profileCompletionStatus.skills = hasSkills
              ? "updated"
              : "pending";
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("api/executeQuery/fulfilled"),
        (
          state,
          action: { payload: any; meta: { arg: { endpointName: string } } }
        ) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "profile") {
            state.user = action.payload.data;
          }
        }
      );
  },
});

export const {
  setCredentials,
  logOut,
  updateUserProfile,
  updateUserEmail,
  updateEmailVerification,
  updateSkillsStatus,
} = authSlice.actions;

export default authSlice.reducer;
