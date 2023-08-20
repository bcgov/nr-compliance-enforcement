import { FC, useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import { getGeocodedFeatures } from "../../hooks/geocoder";

interface Props {
  value?: string;
  id?: string;
  maxResults: number;
}

interface AddressOption {
  value: string;
  label: string;
}

/**
 *  Component that uses the BC Geocoder to autocomplete address input.
 */
export const BCGeocoderAutocomplete: FC<Props> = ({
  value,
  id,
  maxResults,
}) => {
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState<string>(`${value ?? ''}`);

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  useEffect(() => {
    const fetchAddresses = async (inputValue: string) => {
      const features = await getGeocodedFeatures(inputValue, maxResults);
      try {
        
        if (features.features.length > 0) {
        const options = features.features.map((feature: any) => ({
          value: feature.properties.fullAddress,
          label: feature.properties.fullAddress,
        }));
        if (options) {
          setAddressOptions(options);
        }
      } else {
        console.log("Feature length 0");
      }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses(inputValue);
  }, [inputValue, maxResults]);

  return (
    <CreatableSelect
      options={addressOptions}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      isClearable
      classNamePrefix="comp-select"
      placeholder="Search for an address"
      id={id}
      formatCreateLabel={() => undefined}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
    />
  );
};
