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
  onChange?: (selected: Option | null) => void;
  errorMessage?: string;
  value?: Option | null;
};

export const ComplaintListSearch: FC<Props> = ({
  id = "complaintListSearch",
  onChange = () => {},
  errorMessage = "",
  value = null,
}) => {
  const dispatch = useAppDispatch();
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  //States
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [complaintData, setComplaintData] = useState<any[]>([]);

  const getStatusDescription = (input: string): string => {
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code.longDescription;
  };

  const getIssueDescription = (complaint: any): string => {
    const { type, issueType } = complaint;
    const codeMap = {
      HWCR: () => natureOfComplaints.find((item) => item.natureOfComplaint === issueType)?.longDescription,
      GIR: () => girTypeCodes.find((item) => item.girType === issueType)?.longDescription,
      ERS: () => violationCodes.find((item) => item.violation === issueType)?.longDescription,
    };
    return codeMap[type as keyof typeof codeMap]?.() || "";
  };

  const handleComplaintSelect = async (selected: any[]) => {
    if (selected.length === 0) {
      setSelectedComplaint(null);
      onChange(null); //update parent component
      setHintText("");
      return;
    }

    const complaint = selected[0];
    setSelectedComplaint(complaint);
    onChange(
      selected.length > 0 ? ({ label: selected[0].id as string, value: selected[0].id as string } as Option) : null,
    );

    const issue = getIssueDescription(complaint);
    setHintText(isFocused ? `${complaint.id}, ${complaint.type || ""}, ${issue}` : "");
  };

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      setHintText("");
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/search/SECTOR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=10&query=${query}`,
      );
      const response: any = await get(dispatch, parameters, {}, false);
      setComplaintData(response?.complaints || []);
    } catch (error) {
      console.error("Error searching complaints:", error);
      setComplaintData([]);
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
        onChange={handleComplaintSelect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selected={selectedComplaint ? [selectedComplaint] : []}
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
              <Badge bg="species-badge comp-species-badge">{option.type || "Unknown"}</Badge>{" "}
              <div className={`badge ${applyStatusClass(option.status)}`}>{getStatusDescription(option.status)}</div>
            </div>
            <dt>
              <small>{getIssueDescription(option)}</small>
            </dt>
          </>
        )}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
