import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useState } from "react";
import { Badge, Form } from "react-bootstrap";
import Option from "@apptypes/app/option";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { generateApiParameters, get } from "@common/api";
import { applyStatusClass } from "@common/methods";
import config from "@/config";
import { CustomHint } from "@components/common/custom-hint";

type Props = {
  id?: string;
  onChange?: (selected: Option | null, status: string | null) => void;
  errorMessage?: string;
  value?: Option | null;
};

export const HWCRAssessmentLinkComplaintSearch: FC<Props> = ({
  id = "linkedComplaint",
  onChange = () => {},
  errorMessage = "",
  value = null,
}) => {
  const dispatch = useAppDispatch();
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [complaintData, setComplaintData] = useState<any[]>([]);

  const getStatusDescription = (input: string): string => {
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code.longDescription;
  };

  const getSpecies = (input: string): string => {
    const code = speciesCodes.find((item) => item.species === input);
    return code.longDescription;
  };

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code.longDescription;
  };

  const handleChange = (selected: any[]) => {
    onChange(
      selected.length > 0 ? ({ label: selected[0].id as string, value: selected[0].id as string } as Option) : null,
      selected[0]?.status,
    );
    setHintText(
      isFocused && selected.length > 0
        ? `${selected[0].id}, ${getSpecies(selected[0].species)}, ${getNatureOfComplaint(selected[0].natureOfComplaint)}`
        : "",
    );
  };

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      setHintText("");
    }
  };

  const handleSearch = async (query: string) => {
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=10&query=${query}`,
    );
    const response: any = await get(dispatch, parameters, {}, false);
    if (response) {
      setComplaintData(response.complaints);
    }
  };

  return (
    <div className="complaint-search-container">
      <AsyncTypeahead
        clearButton
        id={id}
        labelKey="id"
        minLength={2}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selected={value ? [{ id: value.value }] : undefined}
        filterBy={() => true}
        isLoading={false}
        options={complaintData}
        placeholder="Search for a complaint"
        isInvalid={errorMessage.length > 0}
        className="comp-select comp-details-input full-width comp-async comp-async-text"
        renderInput={({ inputRef, referenceElementRef, ...inputProps }: any) => (
          <CustomHint hintText={hintText}>
            <Form.Control
              {...inputProps}
              ref={(node: any) => {
                inputRef(node);
                referenceElementRef(node);
              }}
              type="text"
              className="rbt-input-text"
            />
          </CustomHint>
        )}
        renderMenuItemChildren={(option: any, props: any) => (
          <>
            <div>
              <Highlighter search={props.text}>{`Complaint #${option.id}`}</Highlighter>{" "}
              <Badge bg="species-badge comp-species-badge">{getSpecies(option.species)}</Badge>{" "}
              <div className={`badge ${applyStatusClass(option.status)}`}>{getStatusDescription(option.status)}</div>
            </div>
            <dt>
              <small>{getNatureOfComplaint(option.natureOfComplaint)}</small>
            </dt>
          </>
        )}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
