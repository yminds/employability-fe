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
  employers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Employer {
  _id: string;
  employerName: string;
  email: string;
  company: Company;
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
  company: Company | null;
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

// Define the expected payload structure for setEmployerCredentials
interface SetEmployerCredentialsPayload {
  employer_info: {
    _id: string;
    employerName: string;
    email: string;
    role: "admin" | "member";
    is_email_verified: boolean;
    account_status: "active" | "disabled" | "suspended";
    posted_jobs?: string[];
    active_jobs?: string[];
    createdAt: string;
    updatedAt: string;
    company: string;
  };
  token: string;
  company: Company;
}

const employerAuthSlice = createSlice({
  name: "employerAuth",
  initialState,
  reducers: {
    setEmployerCredentials: (state, action: PayloadAction<SetEmployerCredentialsPayload>) => {
      const { employer_info, token, company } = action.payload;
      
      state.employer = {
        ...employer_info,
        company: company,
        role: employer_info.role || "member",
        is_email_verified: employer_info.is_email_verified || false,
        account_status: employer_info.account_status || "active",
      } as Employer;
      
      state.token = token;
      state.role = employer_info.role;
      state.company = company;
      
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

    updateEmployerProfile: (state, action: PayloadAction<Partial<Employer>>) => {
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

    updateCompanyDetails: (state, action: PayloadAction<Partial<Company>>) => {
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
        (state, action: { 
          payload: { 
            data: {
              _id: string;
              employerName: string;
              email: string;
              role: "admin" | "member";
              is_email_verified: boolean;
              account_status: "active" | "disabled" | "suspended";
              posted_jobs?: string[];
              active_jobs?: string[];
              createdAt: string;
              updatedAt: string;
              company: Company;
              token: string;
            }
          }; 
          meta: { 
            arg: { 
              endpointName: string 
            } 
          } 
        }) => {
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "employerLogin" || endpointName === "employerSignup") {
            const employerData = action.payload.data;
            
            state.employer = {
              _id: employerData._id,
              employerName: employerData.employerName,
              email: employerData.email,
              role: employerData.role,
              is_email_verified: employerData.is_email_verified,
              account_status: employerData.account_status,
              posted_jobs: employerData.posted_jobs || [],
              active_jobs: employerData.active_jobs || [],
              createdAt: employerData.createdAt,
              updatedAt: employerData.updatedAt,
              company: employerData.company
            } as Employer;
            
            state.token = employerData.token;
            state.role = employerData.role;
            state.company = employerData.company;
            
            state.profileCompletionStatus = {
              basic: employerData.is_email_verified ? "updated" : "pending",
              company: employerData.company ? "updated" : "pending",
            };
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("api/executeQuery/fulfilled"),
        (state, action: { 
          payload: { 
            data: Employer 
          }; 
          meta: { 
            arg: { 
              endpointName: string 
            } 
          } 
        }) => {
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