import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useState, useEffect } from "react";
import Option from "@apptypes/app/option";
import { useAppDispatch } from "@hooks/hooks";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import { Badge } from "react-bootstrap";
import { Park } from "@/app/types/app/shared/park";
import { useSelector } from "react-redux";
import { selectAllParks, setPark } from "@/app/store/reducers/park";

type Props = {
  id?: string;
  initialParkGuid?: string | Option; //this component is used as a filter which stores it as an Option.
  onChange?: (value: Option | undefined) => void;
  errorMessage?: string;
  isInEdit?: boolean;
};

export const ParkPicker: FC<Props> = ({
  id = "parks",
  onChange = () => {},
  errorMessage = "",
  initialParkGuid = null,
  isInEdit = false,
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parkOption, setParkOption] = useState<Option | undefined>(undefined);
  const [parks, setParks] = useState<Park[]>([]);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [lastSkip, setLastSkip] = useState<number>(0);
  const parkCache = useSelector(selectAllParks);

  useEffect(() => {
    setIsLoading(true);
    const guid =
      typeof initialParkGuid === "object" && initialParkGuid !== null ? initialParkGuid?.value : initialParkGuid;

    if (guid) {
      const cachedName = parkCache[guid].name;

      if (cachedName) {
        setParkOption({ label: cachedName, value: guid });
      } else {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/shared-data/park/${guid}`);
        get<Park>(dispatch, parameters, {}, false).then((response: Park) => {
          if (response) {
            setPark(response);
            setParkOption({ label: response.name, value: response.parkGuid } as Option);
          } else {
            console.log("no response");
            setParkOption(undefined);
          }
        });
      }
    } else {
      setParkOption(undefined);
    }
    setIsLoading(false);
  }, [initialParkGuid, dispatch, parkCache]);

  const handleChange = (selected: any[]) => {
    if (selected.length > 0) {
      setParkOption(selected[0]);
      onChange(selected[0]);
    } else {
      setParkOption(undefined);
      onChange(undefined);
      setLastSkip(0);
      setLastQuery("");
    }
  };

  const handleSearch = async (query: string, skip: number) => {
    setIsLoading(true);
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/shared-data/park?search=${query}&take=50&skip=${skip}`,
    );
    const response: any = await get(dispatch, parameters, {}, false);
    if (response) {
      const parkSearchOptions = response.map(
        (park: Park) =>
          ({
            label: park.name,
            value: park.parkGuid,
            labelElement: (
              <>
                {park.parkAreas?.map((area: any) => (
                  <>
                    <span> </span>
                    <Badge
                      className="comp-status-badge-closed"
                      key={area.name}
                    >
                      {area.name}
                    </Badge>
                  </>
                ))}
              </>
            ),
          }) as Option,
      );
      if (skip === 0) {
        setParks(parkSearchOptions);
      } else if (parks.length > 0) {
        setParks((parks) => [...parks, ...parkSearchOptions]);
      }
    }
    setIsLoading(false);
    setLastQuery(query);
    setLastSkip(skip);
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
        onSearch={(query) => handleSearch(query, 0)}
        onChange={handleChange}
        onFocus={() => {
          handleSearch(lastQuery, 0);
        }}
        options={parks}
        placeholder="Select"
        isInvalid={errorMessage.length > 0}
        useCache={false}
        className="comp-select comp-details-input full-width comp-async comp-async-select"
        renderMenuItemChildren={(option: any, props: any) => (
          <>
            <Highlighter search={props.text}>{option.label}</Highlighter>
            {option.labelElement}
          </>
        )}
        paginate={parks.length > 49}
        paginationText="Click here to load more parks, or type to search"
        onPaginate={(event) => {
          handleSearch(lastQuery, lastSkip + 50);
        }}
        maxResults={0}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  ) : (
    <span>{parkOption?.label}</span>
  );
};
