import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/models/User";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: {
    name: string;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  role: {
    name: "",
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
          parsedData: action.payload.parsedData || state.user.parsedData,
          // Update nested objects
          address: action.payload.address
            ? { ...state.user.address, ...action.payload.address }
            : state.user.address,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("api/executeMutation/fulfilled"),
        (state, action) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "login") {
            state.user = action.payload.user_info;
            state.token = action.payload.token;
          } else if (endpointName === "updateUser") {
            if (action.payload.data) {
              state.user = action.payload.data;
            }
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("api/executeQuery/fulfilled"),
        (state, action) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "profile") {
            state.user = action.payload.data;
          }
        }
      );
  },
});

export const { setCredentials, logOut, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
