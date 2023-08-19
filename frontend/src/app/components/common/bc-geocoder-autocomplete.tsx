import { FC, useEffect, useState } from "react";
import axios from "axios";
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
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>();
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState<string>(`${value}`);

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

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleSelect = (selectedOption: AddressOption | null) => {
    setSelectedAddress(selectedOption);
  };

  useEffect(() => {
    fetchAddresses(inputValue);
  }, [inputValue]);

  return (
    <CreatableSelect
      options={addressOptions}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      inputValue={inputValue}
      isClearable
      classNamePrefix="comp-select"
      placeholder="Search for an address"
      id={id}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
    />
  );
};
