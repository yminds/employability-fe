import { apiSlice } from "./apiSlice";

type Country = {
  isoCode: string;
  name: string;
};

type State = {
  isoCode: string;
  name: string;
};

type City = {
  name: string;
};

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => ({
        url: `/api/v1/location/countries`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getStates: builder.query<State[], string>({
      query: (countryCode) => ({
        url: `/api/v1/location/states?country=${countryCode}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getCities: builder.query<
      City[],
      { countryCode: string; stateCode: string }
    >({
      query: ({ countryCode, stateCode }) => ({
        url: `/api/v1/location/states/${stateCode}/cities?country=${countryCode}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery } =
  locationApi;
