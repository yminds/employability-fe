import { Country, State, City } from "country-state-city";

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
    const allCountries = Country.getAllCountries();
    return allCountries.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.isoCode.toLowerCase() === name.toLowerCase()
    );
  };

  // Helper function to find a state
  const findState = (name: string, countryCode = "") => {
    let allStates = [];
    if (countryCode) {
      allStates = State.getStatesOfCountry(countryCode);
    } else {
      allStates = State.getAllStates();
    }
    return allStates.find(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() ||
        s.isoCode.toLowerCase() === name.toLowerCase()
    );
  };

  // Start parsing from the end
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];

    if (!country) {
      const foundCountry = findCountry(part);
      if (foundCountry) {
        country = foundCountry.name;
        countryCode = foundCountry.isoCode;
        continue;
      }
    }

    if (!state) {
      const foundState = findState(part, countryCode);
      if (foundState) {
        state = foundState.name;
        stateCode = foundState.isoCode;
        countryCode = foundState.countryCode;
        country = Country.getCountryByCode(countryCode)?.name || "";
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
      country = Country.getCountryByCode(countryCode)?.name || "";
      city = parts[1];
    }
  }

  // If we still don't have a state but have a city, try to infer the state
  if (!state && city) {
    const allStates = State.getAllStates();
    const citiesOfStates = allStates.flatMap((s) =>
      City.getCitiesOfState(s.countryCode, s.isoCode)
    );
    const foundCity = citiesOfStates.find(
      (c) => c.name.toLowerCase() === city.toLowerCase()
    );
    if (foundCity) {
      const foundState = allStates.find(
        (s) =>
          s.isoCode === foundCity.stateCode &&
          s.countryCode === foundCity.countryCode
      );
      if (foundState) {
        state = foundState.name;
        stateCode = foundState.isoCode;
        countryCode = foundState.countryCode;
        country = Country.getCountryByCode(countryCode)?.name || "";
      }
    }
  }

  return { city, state, stateCode, country, countryCode };
}
