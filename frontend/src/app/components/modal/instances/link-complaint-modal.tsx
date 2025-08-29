import { FC, useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { AsyncTypeahead, Highlighter, useHint } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { generateApiParameters, get, post } from "@common/api";
import config from "@/config";
import { Badge } from "react-bootstrap";
import { applyStatusClass } from "@common/methods";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { ToggleSuccess, ToggleError } from "@common/toast";

type LinkComplaintModalProps = {
  close: () => void;
  submit: () => void;
};

type HintProps = {
  children: React.ReactNode;
  className?: string;
  hintText: string;
};

const CustomHint = ({ children, className, hintText }: HintProps) => {
  const { hintRef } = useHint();

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flex: 1,
        height: "100%",
        position: "relative",
      }}
    >
      {children}
      <input
        aria-hidden
        className="rbt-input-hint"
        ref={hintRef}
        readOnly
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          boxShadow: "none",
          color: "rgba(0, 0, 0, 0.54)",
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        tabIndex={-1}
        value={hintText}
      />
    </div>
  );
};

export const LinkComplaintModal: FC<LinkComplaintModalProps> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  const { title, complaint_identifier, complaint_type } = modalData;

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [complaintData, setComplaintData] = useState<any[]>([]);
  const [linkedComplaints, setLinkedComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showLinkedWarning, setShowLinkedWarning] = useState<boolean>(false);
  const [isDuplicateChild, setIsDuplicateChild] = useState<boolean>(false);

  const getStatusDescription = (input: string): string => {
    const code = statusCodes?.find((item: any) => item.complaintStatus === input);
    return code?.longDescription || input;
  };

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code.longDescription;
  };

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code.longDescription;
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code.longDescription;
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // Search using SECTOR type to get all complaint types
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/search/SECTOR?sortBy=incident_reported_utc_timestmp&orderBy=DESC&page=1&pageSize=10&query=${query}`,
      );
      const response: any = await get(dispatch, parameters, {}, false);
      if (response?.complaints) {
        setComplaintData(response.complaints);
      } else {
        setComplaintData([]);
      }
    } catch (error) {
      console.error("Error searching complaints:", error);
      setComplaintData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSelect = async (selected: any[]) => {
    if (selected.length > 0) {
      const complaint = selected[0];
      let issue = "";
      switch (complaint.type) {
        case "HWCR":
          issue = getNatureOfComplaint(complaint.issueType);
          break;
        case "GIR":
          issue = getGirTypeDescription(complaint.issueType);
          break;
        case "ERS":
          issue = getViolationDescription(complaint.issueType);
          break;
      }
      setSelectedComplaint(complaint);
      // SECTOR results have a generic structure
      setHintText(isFocused && complaint ? `${complaint.id}, ${complaint.type || ""}, ${issue}` : "");

      // Check if the selected complaint has linked complaints
      try {
        const parameters = generateApiParameters(
          `${config.API_BASE_URL}/v1/complaint/linked-complaints/${complaint.id}`,
        );
        const response: any = await get(dispatch, parameters, {}, false);
        if (response && response.length > 0) {
          setLinkedComplaints(response);

          // Check if this complaint is a duplicate child (has a parent with DUPLICATE linkage)
          const hasParentDuplicate = response.some(
            (linked: any) => linked.parent === true && linked.linkage_type === "DUPLICATE",
          );

          setIsDuplicateChild(hasParentDuplicate);
          setShowLinkedWarning(true);
        } else {
          setLinkedComplaints([]);
          setShowLinkedWarning(false);
          setIsDuplicateChild(false);
        }
      } catch (error) {
        console.error("Error fetching linked complaints:", error);
      }
    } else {
      setSelectedComplaint(null);
      setLinkedComplaints([]);
      setShowLinkedWarning(false);
      setIsDuplicateChild(false);
    }
  };

  const handleLinkComplaints = async () => {
    if (!selectedComplaint) {
      ToggleError("Please select a complaint to link");
      return;
    }

    // Prevent linking to a duplicate child complaint
    if (isDuplicateChild) {
      ToggleError("Cannot link to a duplicate complaint. Please select a parent complaint");
      return;
    }

    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/link-complaints`, {
        parentComplaintId: complaint_identifier,
        childComplaintId: selectedComplaint.id,
        linkageType: "LINK",
      });
      await post(dispatch, parameters);

      ToggleSuccess(`Complaints successfully linked`);
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
        {showLinkedWarning && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>
              {" "}
              {isDuplicateChild
                ? "The complaint you selected is marked as duplicate. Please select a parent complaint"
                : `This complaint is linked to ${linkedComplaints.length} other complaint${linkedComplaints.length > 1 ? "s" : ""}`}
            </span>
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
                onSearch={handleSearch}
                onChange={handleComplaintSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
                      <small>
                        {option.type === "HWCR" && getNatureOfComplaint(option.issueType)}
                        {option.type === "GIR" && getGirTypeDescription(option.issueType)}
                        {option.type === "ERS" && getViolationDescription(option.issueType)}
                      </small>
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
        >
          Link Complaints
        </Button>
      </Modal.Footer>
    </>
  );
};
