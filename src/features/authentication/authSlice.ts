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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("api/executeMutation/fulfilled");
        },
        (
          state,
          action: {
            meta: {
              arg: {
                endpointName: string;
              };
            };
            payload: {
              user_info: User;
              token: string;
            };
          }
        ) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "login") {
            console.log("action.payload.data", action);
            state.user = action.payload.user_info;
            state.token = action.payload.token;
            // state.refreshToken = action.payload.refreshToken;
          }
        }
      )
      .addMatcher(
        (action: { type: string }) => {
          return action.type.endsWith("api/executeQuery/fulfilled");
        },
        (
          state,
          action: {
            meta: {
              arg: {
                endpointName: string;
              };
            };
            payload: {
              data: User;
            };
          }
        ) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "profile") {
            state.user = action.payload.data;
          }
        }
      );
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
