import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useState, useEffect } from "react";
import Option from "@apptypes/app/option";
import { useAppDispatch } from "@hooks/hooks";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import { getCachedParkName, setCachedParkName } from "@common/cache/park-name-cache";

type Props = {
  id?: string;
  initialParkGuid?: string | Option; //this component is used as a filter which stores it as an Option.
  onChange?: (value: Option | undefined) => void;
  errorMessage?: string;
  isInEdit?: boolean;
};

export const Park: FC<Props> = ({
  id = "parks",
  onChange = () => {},
  errorMessage = "",
  initialParkGuid = null,
  isInEdit = false,
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parkOption, setParkOption] = useState<Option | undefined>(undefined);
  const [parks, setParks] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const guid =
      typeof initialParkGuid === "object" && initialParkGuid !== null ? initialParkGuid?.value : initialParkGuid;

    if (guid) {
      const cachedName = getCachedParkName(guid);

      if (cachedName) {
        setParkOption({ label: cachedName, value: guid });
      } else {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/shared-data/park/${guid}`);
        get(dispatch, parameters, {}, false).then((response: any) => {
          if (response) {
            setCachedParkName(guid, response.name);
            setParkOption({ label: response.name, value: response.parkGuid } as Option);
          } else {
            setParkOption(undefined);
          }
        });
      }
    } else {
      setParkOption(undefined);
    }
    setIsLoading(false);
  }, [initialParkGuid, dispatch]);

  const handleChange = (selected: any[]) => {
    if (selected.length > 0) {
      setParkOption(selected[0]);
      onChange(selected[0]);
    } else {
      setParkOption(undefined);
      onChange(undefined);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/shared-data/park?search=${query}&take=50&skip=0`,
    );
    const response: any = await get(dispatch, parameters, {}, false);
    if (response) {
      const parkSearchOptions = response.map(
        (park: any) =>
          ({
            label: park.name,
            value: park.parkGuid,
          }) as Option,
      );
      setParks(parkSearchOptions);
    }
    setIsLoading(false);
  };

  return isInEdit ? (
    <div id="park-select-id">
      <AsyncTypeahead
        clearButton
        id={id}
        selected={parkOption ? [parkOption] : []}
        labelKey="label"
        minLength={0}
        isLoading={isLoading}
        onSearch={handleSearch}
        onChange={handleChange}
        onFocus={() => handleSearch("")}
        options={parks}
        placeholder="Search for a park"
        isInvalid={errorMessage.length > 0}
        useCache={true}
        className="comp-select comp-details-input full-width comp-async comp-async-select"
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  ) : (
    <span>{parkOption?.label}</span>
  );
};
