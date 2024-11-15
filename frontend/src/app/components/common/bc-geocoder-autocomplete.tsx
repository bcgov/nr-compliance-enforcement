import { FC, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getComplaintLocationByAddress, selectGeocodedComplaintCoordinates } from "@store/reducers/complaints";

interface Props {
  value?: string;
  id?: string;
  maxResults: number;
  parentOnChange: Function;
}

interface AddressOption {
  value: string;
  label: string;
}

/**
 *  Component that uses the BC Geocoder to autocomplete address input.
 */
export const BCGeocoderAutocomplete: FC<Props> = ({ value, id, maxResults, parentOnChange }) => {
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState<string>(`${value ?? ""}`);

  const handleInputChange = (inputValue: string) => {
    /*let options = addressOptions;
    options.pop();
    options.push({ value: inputValue, label: inputValue });
    setAddressOptions(options);*/
    setInputValue(inputValue);
    parentOnChange(inputValue);
  };

  const dispatch = useAppDispatch();
  const complaintLocation = useAppSelector(selectGeocodedComplaintCoordinates);

  useEffect(() => {
    const fetchAddresses = async (inputValue: string) => {
      dispatch(getComplaintLocationByAddress(inputValue));

      try {
        if (complaintLocation) {
          if (complaintLocation.features.length > 0) {
            let options = complaintLocation.features.map((feature: any) => ({
              value: feature.properties.fullAddress,
              label: feature.properties.fullAddress,
            }));
            if (options) {
              options.push({ value: inputValue, label: inputValue });
              setAddressOptions(options);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    if (inputValue) {
      fetchAddresses(inputValue);
    }
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
