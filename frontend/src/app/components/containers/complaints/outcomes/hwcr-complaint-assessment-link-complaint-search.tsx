import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useState } from "react";
import { Badge } from "react-bootstrap";
import Option from "@apptypes/app/option";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { generateApiParameters, get } from "@common/api";
import { applyStatusClass } from "@common/methods";
import config from "@/config";

type Props = {
  id?: string;
  onChange?: (selected: Option | null, status: string | null) => void;
  errorMessage?: string;
};

export const HWCRComplaintAssessmentLinkComplaintSearch: FC<Props> = ({
  id = "linkedComplaint",
  onChange = () => {},
  errorMessage = "",
}) => {
  const dispatch = useAppDispatch();
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));

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

  const handleChange = (selected: any[]) =>
    onChange(
      selected.length > 0 ? ({ label: selected[0].id as string, value: selected[0].id as string } as Option) : null,
      selected[0]?.status,
    );

  const handleSearch = async (query: string) => {
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint/search/HWCR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&zone=SPCE&page=1&pageSize=10&query=${query}`,
    );
    const response: any = await get(dispatch, parameters);
    if (response) {
      setComplaintData(response.complaints);
    }
  };

  return (
    <div>
      <AsyncTypeahead
        id={id}
        labelKey="id"
        minLength={2}
        onSearch={handleSearch}
        onChange={handleChange}
        filterBy={() => true}
        isLoading={false}
        options={complaintData}
        placeholder="Search for a complaint"
        isInvalid={errorMessage.length > 0}
        renderMenuItemChildren={(option: any, props: any) => (
          <>
            <div>
              <Highlighter search={props.text}>{`Incident #${option.id}`}</Highlighter>{" "}
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
