import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterUserPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData: LoginUserPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, loginData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching the authenticated user's profile
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/status`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.status === 200) {
        console.log(response.data.user);
        return response.data.user; // Expecting { user: { ... } }
      }
      return rejectWithValue("Not authenticated");
    } catch (err: any) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// Async thunk for logging out a user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      return response.data.message; // Expecting { message: "Logout successful." }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Logout failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ user: User; message: string }>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; message: string }>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch User Cases
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Optionally handle errors if needed
      })

      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;
