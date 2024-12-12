import { useState } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

interface LocationSelectorProps {
  onCountryChange?: (country: any) => void;
  onStateChange?: (state: any) => void;
  onCityChange?: (city: any) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  const [countryId, setCountryId] = useState<number>(0);
  const [stateId, setStateId] = useState<number>(0);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Country</label>
        <CountrySelect
          onChange={(e: any) => {
            setCountryId(e.id);
            setStateId(0); // Reset state when country changes
            onCountryChange?.(e);
          }}
          placeHolder="Select Country"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">State</label>
        <StateSelect
          countryid={countryId}
          onChange={(e: any) => {
            setStateId(e.id);
            onStateChange?.(e);
          }}
          placeHolder="Select State"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">City</label>
        <CitySelect
          countryid={countryId}
          stateid={stateId}
          onChange={(e: any) => {
            onCityChange?.(e);
          }}
          placeHolder="Select City"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </div>
    </div>
  );
};

export default LocationSelector;
