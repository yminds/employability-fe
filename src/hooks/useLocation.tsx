import { useMemo } from "react";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@/api/locationApiSlice";

export interface Address {
  country?: string;
  state?: string;
  city?: string;
}

export interface LocationData {
  selectedCountry: any | null;
  selectedState: any | null;
  selectedCity: any | null;
}

export function useLocation(address: Address): LocationData {
  const { data: countries = [] } = useGetCountriesQuery();

  const { data: states = [] } = useGetStatesQuery(address?.country || "", {
    skip: !address?.country,
  });

  const selectedCountry = useMemo(
    () =>
      address?.country
        ? countries.find((c) => c.isoCode === address.country)
        : null,
    [address?.country, countries]
  );

  const selectedState = useMemo(
    () =>
      address?.state && address?.country
        ? states.find((s) => s.isoCode === address.state)
        : null,
    [address?.state, address?.country, states]
  );

  const selectedCity = address?.city;

  return {
    selectedCountry,
    selectedState,
    selectedCity,
  };
}
