import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "@/features/authentication/authSlice";
import {
  setEmployerCredentials,
  logOutEmployer,
} from "@/features/authentication/employerAuthSlice";

interface QueryArgs {
  url: string;
  method?: string;
  body?: any;
}

const baseUrl = process.env.VITE_API_BASE_URL as string;
const xApiKey = process.env.VITE_X_API_KEY as string;
// const xApiKey = 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj';
// const baseUrl = 'http://localhost:3000/';
console.log("=================== ");
console.log(xApiKey);
console.log("=================== ");

const baseQuery: BaseQueryFn<QueryArgs, unknown, unknown> = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }: Pick<BaseQueryApi, "getState">) => {
    headers.set("x-api-key", xApiKey);
    const token = (getState() as any).auth?.token;
    const employerToken = (getState() as any).employerAuth?.token;

    if (employerToken) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<QueryArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  const isEmployerEndpoint = args.url.startsWith("/api/v1/employer");

  if ((result?.error as any)?.status === 403) {
    const state = api.getState() as any;
    const refreshToken = isEmployerEndpoint
      ? state.employerAuth?.refreshToken
      : state.auth?.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: isEmployerEndpoint
            ? "/api/v1/employer/token/refresh"
            : "/token/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if ((refreshResult as any)?.data) {
        // Update credentials based on endpoint type
        if (isEmployerEndpoint) {
          const employer = (api.getState() as any).employerAuth?.employer;
          api.dispatch(
            setEmployerCredentials({
              ...(refreshResult as any).data,
              employer_info: employer,
            })
          );
        } else {
          const user = (api.getState() as any).auth?.user;
          api.dispatch(
            setCredentials({
              ...(refreshResult as any).data,
              user,
            })
          );
        }

        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Logout based on endpoint type
        if (isEmployerEndpoint) {
          api.dispatch(logOutEmployer());
        } else {
          api.dispatch(logOut());
        }
      }
    }
  }

  if ((result?.error as any)?.status === 401) {
    if (isEmployerEndpoint) {
      api.dispatch(logOutEmployer());
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Experience",
    "Education",
    "Certification",
    "Employer",
    "Company",
    "Job",
    "SkillAnalysis",
    "VerifiedContent",
    "FeaturedInterview"
  ],
  endpoints: () => ({}),
});
