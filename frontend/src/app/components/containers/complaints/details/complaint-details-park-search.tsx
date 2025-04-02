import { AsyncTypeahead, Highlighter, useHint } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useState, ReactNode } from "react";
import Option from "@apptypes/app/option";
import { useAppDispatch } from "@hooks/hooks";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";

type Props = {
  id?: string;
  onChange?: (selected: Option | null, status: string | null) => void;
  errorMessage?: string;
  value?: Option | null;
};

export const ComplaintDetailsParkSearch: FC<Props> = ({
  id = "parks",
  onChange = () => {},
  errorMessage = "",
  value = null,
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parks, setParks] = useState<any[]>([]);

  const handleChange = (selected: any[]) => {
    onChange(
      selected.length > 0
        ? ({ label: selected[0].name as string, value: selected[0].parkGuid as string } as Option)
        : null,
      selected[0]?.status,
    );
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/shared-data/park?search=${query}&take=50&skip=0`,
    );
    const response: any = await get(dispatch, parameters, {}, false);
    if (response) {
      setParks(response);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <AsyncTypeahead
        clearButton
        id={id}
        labelKey="name"
        minLength={0}
        isLoading={isLoading}
        onSearch={handleSearch}
        onChange={handleChange}
        onFocus={() => handleSearch("")}
        selected={value ? [{ id: value.value }] : undefined}
        options={parks}
        placeholder="Search for a park"
        isInvalid={errorMessage.length > 0}
        useCache={true}
        className="comp-select comp-details-input full-width"
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
