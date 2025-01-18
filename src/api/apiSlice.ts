import { createApi, fetchBaseQuery, BaseQueryFn, BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '@/features/authentication/authSlice';

interface QueryArgs {
  url: string;
  method?: string;
  body?: any;
}

// const baseUrl = process.env.VITE_API_BASE_URL as string;
// const xApiKey = process.env.VITE_X_API_KEY as string;
const xApiKey = 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj';
const baseUrl = 'http://localhost:3000/';

const baseQuery: BaseQueryFn<QueryArgs, unknown, unknown> = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }: Pick<BaseQueryApi, 'getState'>) => {
    headers.set('x-api-key', xApiKey);
    const token = (getState() as any).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<QueryArgs, unknown, unknown> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if ((result?.error as any)?.status === 403) {
    const refreshToken = (api.getState() as any).auth.refreshToken;
    const refreshResult = await baseQuery({ 
      url: '/token/refresh',
      method: 'POST',
      body: JSON.stringify({ refreshToken }) 
    }, api, extraOptions);
    
    if ((refreshResult as any)?.data) {
      const user = (api.getState() as any).auth.user;
      api.dispatch(setCredentials({ ...(refreshResult as any).data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  if ((result?.error as any)?.status === 401) {
    api.dispatch(logOut());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
