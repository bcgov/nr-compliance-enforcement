import { FC, useState } from "react";
import { Modal, Button, Form, Alert, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { generateApiParameters, get, post } from "@common/api";
import config from "@/config";
import { applyStatusClass } from "@common/methods";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { ToggleSuccess, ToggleError } from "@common/toast";
import { CustomHint } from "@components/common/custom-hint";

type LinkComplaintModalProps = {
  close: () => void;
  submit: () => void;
};

type ValidationResult = {
  isValid: boolean;
  alertType?: "warning" | "info";
  message?: string;
  hasLinkedComplaints?: boolean;
  linkedCount?: number;
};

export const LinkComplaintModal: FC<LinkComplaintModalProps> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  const { title, complaint_identifier } = modalData;

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [complaintData, setComplaintData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  const getIssueDescription = (complaint: any): string => {
    const { type, issueType } = complaint;
    const codeMap = {
      HWCR: () => natureOfComplaints.find((item) => item.natureOfComplaint === issueType)?.longDescription,
      GIR: () => girTypeCodes.find((item) => item.girType === issueType)?.longDescription,
      ERS: () => violationCodes.find((item) => item.violation === issueType)?.longDescription,
    };
    return codeMap[type as keyof typeof codeMap]?.() || "";
  };

  const getStatusDescription = (status: string): string => {
    return statusCodes?.find((item: any) => item.complaintStatus === status)?.longDescription || status;
  };

  const validateComplaintLinking = async (complaint: any): Promise<ValidationResult> => {
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint/linked-complaints/${complaint.id}?related=true`,
    );
    const linkedComplaints: any = await get(dispatch, parameters, {}, false);

    if (!linkedComplaints || linkedComplaints.length === 0) {
      return { isValid: true };
    }

    const alreadyLinked = linkedComplaints.some((linked: any) => linked.id === complaint_identifier);
    if (alreadyLinked) {
      return {
        isValid: false,
        alertType: "warning",
        message: "These complaints are already linked",
      };
    }

    const isDuplicate = linkedComplaints.some(
      (linked: any) => linked.parent === true && linked.link_type === "DUPLICATE",
    );

    if (isDuplicate) {
      const parentId = linkedComplaints.find(
        (linked: any) => linked.parent === true && linked.link_type === "DUPLICATE",
      )?.id;
      return {
        isValid: false,
        alertType: "warning",
        message: `The complaint you selected is marked as duplicate. Please select its parent complaint #${parentId}`,
      };
    }

    return {
      isValid: true,
      alertType: "info",
      message: `This complaint is linked to ${linkedComplaints.length} other complaint${linkedComplaints.length > 1 ? "s" : ""}`,
      hasLinkedComplaints: true,
      linkedCount: linkedComplaints.length,
    };
  };

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      setHintText("");
    }
    if (text.length >= 2) {
      handleSearch(text);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/search/SECTOR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=10&query=${query}`,
      );
      const response: any = await get(dispatch, parameters, {}, false);
      setComplaintData(response?.complaints || []);
    } catch (error) {
      console.error("Error searching complaints:", error);
      setComplaintData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSelect = async (selected: any[]) => {
    if (selected.length === 0) {
      setSelectedComplaint(null);
      setHintText("");
      setValidation({ isValid: true });
      return;
    }

    const complaint = selected[0];

    if (complaint.id === complaint_identifier) {
      setValidation({
        isValid: false,
        alertType: "warning",
        message: "Cannot link a complaint to itself. Please select a different complaint.",
      });
      return;
    }

    setSelectedComplaint(complaint);

    const issue = getIssueDescription(complaint);
    setHintText(isFocused ? `${complaint.id}, ${complaint.type || ""}, ${issue}` : "");

    const validationResult = await validateComplaintLinking(complaint);
    setValidation(validationResult);
  };

  const handleLinkComplaints = async () => {
    if (!selectedComplaint) {
      ToggleError("Please select a complaint to link");
      return;
    }

    if (!validation.isValid) {
      ToggleError(validation.message || "Cannot link this complaint");
      return;
    }

    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/link-complaints`, {
        parentComplaintId: complaint_identifier,
        childComplaintId: selectedComplaint.id,
        linkType: "LINK",
      });
      await post(dispatch, parameters);

      ToggleSuccess("Complaints successfully linked");
      submit();
      close();
    } catch (error) {
      console.error("Error linking complaints:", error);
      ToggleError("Failed to link complaints");
    }
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {validation.message && (
          <Alert variant={validation.alertType || "info"}>
            <i
              className={`bi bi-${validation.alertType === "warning" ? "exclamation-triangle-fill" : "info-circle-fill"}`}
            ></i>
            <span> {validation.message}</span>
          </Alert>
        )}
        <Form className="comp-details-section">
          <Form.Group className="mb-3">
            <Form.Label>Link current complaint to:</Form.Label>
            <div className="complaint-search-container">
              <AsyncTypeahead
                clearButton
                id="complaint-search"
                labelKey="id"
                minLength={2}
                onInputChange={handleInputChange}
                onSearch={() => {}}
                onChange={handleComplaintSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                useCache={false}
                selected={selectedComplaint ? [selectedComplaint] : []}
                filterBy={() => true}
                isLoading={isLoading}
                options={complaintData}
                placeholder="Search for a complaint"
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
                      <div className={`badge ${applyStatusClass(option.status)}`}>
                        {getStatusDescription(option.status)}
                      </div>
                    </div>
                    <dt>
                      <small>{getIssueDescription(option)}</small>
                    </dt>
                  </>
                )}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleLinkComplaints}
          disabled={!validation.isValid}
        >
          Save and Close
        </Button>
      </Modal.Footer>
    </>
  );
};
