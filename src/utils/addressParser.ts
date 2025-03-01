// import { Country, State, City } from "country-state-city";

interface ParsedAddress {
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
}

export function parseAddress(address: string): ParsedAddress {
  const parts = address.split(",").map((part) => part.trim());
  let city = "",
    state = "",
    stateCode = "",
    country = "",
    countryCode = "";

  // Helper function to find a country
  const findCountry = (name: string) => {
    const allCountries:any = []
  };

  // Helper function to find a state
  const findState = (name: string, countryCode = "") => {
    let allStates:any = [];
    if (countryCode) {
      allStates = []
    } else {
      allStates = []
    }
    return allStates.find(
      (s:any) =>
        s.name.toLowerCase() === name.toLowerCase() ||
        s.isoCode.toLowerCase() === name.toLowerCase()
    );
  };

  // Start parsing from the end
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];

    if (!country) {
      const foundCountry = findCountry(part);
      // if (foundCountry) {
      //   country = foundCountry.name;
      //   countryCode = foundCountry.isoCode;
      //   continue;
      // }
    }

    if (!state) {
      const foundState = findState(part, countryCode);
      if (foundState) {
        state = foundState.name;
        stateCode = foundState.isoCode;
        countryCode = foundState.countryCode;
        country = "";
        continue;
      }
    }

    if (!city) {
      city = part;
    }
  }

  // Handle case where only state (possibly abbreviated) and city are given
  if (!state && parts.length === 2) {
    const possibleState = parts[0];
    const foundState = findState(possibleState);
    if (foundState) {
      state = foundState.name;
      stateCode = foundState.isoCode;
      countryCode = foundState.countryCode;
      country =  "";
      city = parts[1];
    }
  }

  // If we still don't have a state but have a city, try to infer the state
  if (!state && city) {
    const allStates:any = []
    const citiesOfStates:any = []
    const foundCity = citiesOfStates.find(
      (c:any) => c.name.toLowerCase() === city.toLowerCase()
    );
    if (foundCity) {
      const foundState = allStates.find(
        (s:any) =>
          s.isoCode === foundCity.stateCode &&
          s.countryCode === foundCity.countryCode
      );
      if (foundState) {
        state = foundState.name;
        stateCode = foundState.isoCode;
        countryCode = foundState.countryCode;
        country =  "";
      }
    }
  }

  return { city, state, stateCode, country, countryCode };
}
