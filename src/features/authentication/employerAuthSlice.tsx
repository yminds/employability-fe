import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileCompletionStatus {
  basic: "pending" | "updated";
  company: "pending" | "updated";
}

export interface Company {
    _id: string;
    name: string;
    website: string;
    industry?: string;
    location?: {
        country: string;
        state: string;
        city: string;
    };
}

export interface Employer {
    _id: string;
    employerName: string;
    email: string;
    company_id: Company;
    role: "admin" | "member";
    profile_image?: string;
    contact?: {
        phone?: string;
        alternative_email?: string;
    };
    is_email_verified: boolean;
    account_status: "active" | "disabled" | "suspended";
    posted_jobs?: string[];
    active_jobs?: string[];
    createdAt: string;
    updatedAt: string;
}

interface EmployerAuthState {
  employer: Employer | null;
  token: string | null;
  role: "admin" | "member";
  company: {
    _id: string;
    name: string;
    website: string;
    industry?: string;
    location?: {
      country: string;
      state: string;
      city: string;
    };
  } | null;
  profileCompletionStatus: ProfileCompletionStatus;
}

const initialState: EmployerAuthState = {
  employer: null,
  token: null,
  role: "member",
  company: null,
  profileCompletionStatus: {
    basic: "pending",
    company: "pending",
  },
};

const employerAuthSlice = createSlice({
  name: "employerAuth",
  initialState,
  reducers: {
    setEmployerCredentials: (state, action) => {
      const { employer_info, token, company } = action.payload;
      state.employer = employer_info;
      state.token = token;
      state.role = employer_info.role;
      state.company = company;
      
      // Initialize profile completion status
      state.profileCompletionStatus = {
        basic: employer_info.is_email_verified ? "updated" : "pending",
        company: company ? "updated" : "pending",
      };
    },
    logOutEmployer: (state) => {
      state.employer = null;
      state.token = null;
      state.role = "member";
      state.company = null;
      state.profileCompletionStatus = {
        basic: "pending",
        company: "pending",
      };
    },
    updateEmployerProfile: (state, action: { payload: Partial<Employer> }) => {
      if (state.employer) {
        state.employer = {
          ...state.employer,
          ...action.payload,
          contact: action.payload.contact
            ? { ...state.employer.contact, ...action.payload.contact }
            : state.employer.contact,
        };
      }
    },
    updateCompanyDetails: (state, action) => {
      if (state.company) {
        state.company = {
          ...state.company,
          ...action.payload,
          location: action.payload.location
            ? { ...state.company.location, ...action.payload.location }
            : state.company.location,
        };
        state.profileCompletionStatus.company = "updated";
      }
    },
    updateEmailVerification: (state) => {
      if (state.employer) {
        state.employer.is_email_verified = true;
        state.profileCompletionStatus.basic = "updated";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("api/executeMutation/fulfilled"),
        (state, action: { payload: any; meta: { arg: { endpointName: string } } }) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "employerLogin" || endpointName === "employerSignup") {
            const { employer_info, token, company } = action.payload.data;
            state.employer = employer_info;
            state.token = token;
            state.role = employer_info.role;
            state.company = company;
            
            state.profileCompletionStatus = {
              basic: employer_info.is_email_verified ? "updated" : "pending",
              company: company ? "updated" : "pending",
            };
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("api/executeQuery/fulfilled"),
        (state, action: { payload: any; meta: { arg: { endpointName: string } } }) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "getEmployerProfile") {
            state.employer = action.payload.data;
          }
        }
      );
  },
});

export const {
  setEmployerCredentials,
  logOutEmployer,
  updateEmployerProfile,
  updateCompanyDetails,
  updateEmailVerification,
} = employerAuthSlice.actions;

export default employerAuthSlice.reducer;