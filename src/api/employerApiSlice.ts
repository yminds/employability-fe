import { apiSlice } from "./apiSlice";

export interface Company{
    name:string;
    industry:string;
}

export interface Employer{
    _id:string;
    employerName:string;
    email?:string;
    company:Company
    createdAt:Date;
    updatedAt:Date;
}

interface EmployerAuthResponse{
    success:boolean
    message:string
    token:string
    employer_info:Employer;
}

interface EmployerResponse{
    success:boolean;
    data:Employer
}

interface SignupPayload {
    employerName: string;
    email: string;
    password: string;
    companyName: string;
    industry: string;
  }
  
interface LoginPayload {
    email: string;
    password: string;
  }

  
export const employerApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) =>({
        signup: builder.mutation<EmployerAuthResponse,SignupPayload>({
            query:(data)=>({
                url:"/api/v1/employer/signup",
                method:"POST",
                body:{
                    employerName:data.employerName,
                    email:data.email,
                    password:data.password,
                    company:{
                        name:data.companyName,
                        industry:data.industry
                    },
                },
            }),
        }),

         login: builder.mutation<EmployerAuthResponse,LoginPayload>({
            query:(data)=>({
                url:"/api/v1/employer/login",
                method:"POST",
                body:data
             }),
         }),

         getEmployerDetails: builder.query<EmployerResponse, string>({
            query: (employerId) => ({
              url: `/api/employer/getEmployerDetails/${employerId}`,
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }),
          }),
    })
})

export const {
    useSignupMutation,
    useLoginMutation,
    useGetEmployerDetailsQuery,
    
} = employerApiSlice;