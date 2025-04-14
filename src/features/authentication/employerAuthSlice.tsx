import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { string } from "zod";

interface ProfileCompletionStatus {
  basic: "pending" | "updated";
  company: "pending" | "updated";
}

export interface Company {
  _id: string;
  name: string;
  website: string;
  industry?: string;
  organization_size?: string;
  tagline?: string;
  location?: string;
  logo?: string;
  logoKey?: string; // Added to track the S3 key for the logo
  employers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Employer {
  _id: string;
  employerName: string;
  email: string;
  company?: Company;
  role: "admin" | "member";
  profile_image?: string;
  contact?: {
    phone?: string;
    alternative_email?: string;
  };
  is_email_verified: boolean;
  account_status: "active" | "disabled" | "suspended";
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
    profile_image?: string;
    is_email_verified: boolean;
    account_status: "active" | "disabled" | "suspended";
    contact?: {
      phone?: string;
      alternative_email?: string;
    };
    createdAt: string;
    updatedAt: string;
    company?: string;
  };
  token: string;
  company?: Company;
}

const employerAuthSlice = createSlice({
  name: "employerAuth",
  initialState,
  reducers: {
    setEmployerCredentials: (state, action: PayloadAction<SetEmployerCredentialsPayload>) => {
      const { employer_info, token, company } = action.payload;
      
      // Ensure we have valid employer_info before setting state
      if (employer_info) {
        state.employer = {
          ...employer_info,
          company: company || null,
          role: employer_info.role || "member",
          is_email_verified: employer_info.is_email_verified || false,
          account_status: employer_info.account_status || "active",
        } as Employer;
        
        state.token = token;
        state.role = employer_info.role;
        state.company = company || null;
        
        state.profileCompletionStatus = {
          basic: employer_info.is_email_verified ? "updated" : "pending",
          company: company ? "updated" : "pending",
        };
      }
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
      // Check if payload exists before processing
      if (!action.payload) return;
      
      if (state.company) {
        // Preserve logo and logoKey if they're not included in the payload
        const logo = action.payload.logo || state.company.logo;
        const logoKey = action.payload.logoKey || state.company.logoKey;
        
        state.company = {
          ...state.company,
          ...action.payload,
          logo,
          logoKey
        };
        state.profileCompletionStatus.company = "updated";
        
        // Update the company reference in the employer object as well
        if (state.employer) {
          state.employer.company = state.company;
        }
      } else if (action.payload && action.payload._id) {
        // Fixed: Check that we have both payload and _id property
        state.company = action.payload as Company;
        state.profileCompletionStatus.company = "updated";
        
        // Update the employer object with the new company
        if (state.employer) {
          state.employer.company = state.company;
        }
      }
    },
    
    updateCompanyLogo: (state, action: PayloadAction<{url: string, key: string}>) => {
      if (state.company) {
        state.company.logo = action.payload.url;
        state.company.logoKey = action.payload.key;
      }
    },

    updateEmailVerification: (state) => {
      if (state.employer) {
        state.employer.is_email_verified = true;
      }
    },

    updateEmployerEmail:(state,action:PayloadAction<{email:string}>) =>{
      if(state.employer){
        state.employer.email = action.payload.email;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("api/executeMutation/fulfilled"),
        (state, action: { 
          payload?: { 
            data?: {
              _id: string;
              employerName: string;
              email: string;
              role: "admin" | "member";
              profile_image?: string;
              is_email_verified: boolean;
              account_status: "active" | "disabled" | "suspended";
              contact?: {
                phone?: string;
                alternative_email?: string;
              };
              createdAt: string;
              updatedAt: string;
              company?: Company;
              token: string;
            }
          }; 
          meta: { 
            arg: { 
              endpointName: string 
            } 
          } 
        }) => {
          // Guard against undefined payload
          if (!action.payload?.data) return;
          
          const endpointName = action.meta.arg.endpointName;
          if (endpointName === "employerLogin" || endpointName === "employerSignup" || endpointName === "createCompany") {
            const employerData = action.payload.data;
            
            // Only update if we have valid data
            if (employerData && employerData._id) {
              state.employer = {
                _id: employerData._id,
                employerName: employerData.employerName,
                email: employerData.email,
                role: employerData.role,
                profile_image: employerData.profile_image,
                is_email_verified: employerData.is_email_verified,
                account_status: employerData.account_status,
                contact: employerData.contact,
                createdAt: employerData.createdAt,
                updatedAt: employerData.updatedAt,
                company: employerData.company
              } as Employer;
              
              state.token = employerData.token;
              state.role = employerData.role;
              
              // Handle company data which might be directly in the response for createCompany
              if (employerData.company) {
                state.company = employerData.company;
              } else {
                state.company = null;
              }
              
              state.profileCompletionStatus = {
                basic: employerData.is_email_verified ? "updated" : "pending",
                company: state.company ? "updated" : "pending",
              };
            }
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("api/executeQuery/fulfilled"),
        (state, action: { 
          payload?: { 
            data?: Employer & { company?: Company }
          }; 
          meta: { 
            arg: { 
              endpointName: string 
            } 
          } 
        }) => {
          // Guard against undefined payload
          if (!action.payload?.data) return;
          
          const endpointName = action.meta.arg.endpointName;
          const data = action.payload.data;
          
          if (endpointName === "getEmployerProfile" && data) {
            state.employer = data;
            
            if (data.company) {
              state.company = data.company;
              state.profileCompletionStatus.company = "updated";
            }
          } else if (endpointName === "getCompanyDetails") {
            // Handle fetching company details separately
            const companyData = data?.company;
            if (companyData) {
              state.company = companyData;
              state.profileCompletionStatus.company = "updated";
              
              // Update the company reference in the employer object as well
              if (state.employer) {
                state.employer.company = companyData;
              }
            }
          } else if (endpointName === "uploadCompanyLogo") {
            // Handle response from logo upload if it's a separate API call
            const logoData = data as unknown as { fileUrl: string; key: string };
            if (logoData?.fileUrl && state.company) {
              state.company.logo = logoData.fileUrl;
              state.company.logoKey = logoData.key;
            }
          }
        }
      )
  }
});

export const {
  setEmployerCredentials,
  logOutEmployer,
  updateEmployerProfile,
  updateCompanyDetails,
  updateCompanyLogo,
  updateEmailVerification,
  updateEmployerEmail
} = employerAuthSlice.actions;

export default employerAuthSlice.reducer;