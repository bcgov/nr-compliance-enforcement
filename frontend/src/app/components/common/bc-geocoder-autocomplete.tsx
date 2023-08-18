import { FC, useEffect, useState } from "react";
import axios from "axios";
import CreatableSelect from 'react-select/creatable';

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
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>({
    value: `${value}`,
    label: `${value}`,
  });
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const fetchAddresses = async (inputValue: string) => {
    const apiKey = "YOUR_GOOGLE_API_KEY";
    const apiUrl = `https://geocoder.api.gov.bc.ca/addresses.json?addressString=${inputValue}&locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=true&setBack=0&outputSRS=4326&minScore=2`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data.features?.length > 0) {
      const options = response.data.features.map((feature: any) => ({
        value: feature.properties.fullAddress,
        label: feature.properties.fullAddress,
      }));
      if (options) {
        setAddressOptions(options);
      }
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
