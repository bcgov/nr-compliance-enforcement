import { FC, useState, useEffect } from "react";
import { applyStatusClass, getIssueDescription } from "@common/methods";
import { Alert, Badge, Button, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { LinkedComplaint } from "@/app/types/app/complaints/linked-complaint";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { complaintTypeToName } from "@apptypes/app/complaint-types";
import { openModal, isFeatureActive } from "@store/reducers/app";
import { DELETE_CONFIRM } from "@apptypes/modal/modal-types";
import { getLinkedComplaints } from "@store/reducers/complaints";
import { generateApiParameters, post } from "@common/api";
import config from "@/config";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { CaseFile } from "@/generated/graphql";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";

type Props = {
  linkedComplaintData: LinkedComplaint[];
  associatedCaseFiles: CaseFile[];
  id?: string;
  canUnlink?: boolean;
};

type AssociatedDataType = "DUPLICATE" | "LINK" | "CASES";

export const LinkedComplaintList: FC<Props> = ({ linkedComplaintData, associatedCaseFiles, id, canUnlink = true }) => {
  const dispatch = useAppDispatch();

  const casesActive = useAppSelector(isFeatureActive(FEATURE_TYPES.CASES));

  const [expandedComplaints, setExpandedComplaints] = useState<Record<string, boolean>>({});
  const [viewMoreDuplicates, setViewMoreDuplicates] = useState<boolean>(false);
  const [viewMoreLinked, setViewMoreLinked] = useState<boolean>(false);
  const [viewMoreCases, setViewMoreCases] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(casesActive ? "CASES" : "LINK");

  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  // Helper functions to get description
  const getAgencyDescription = (agencyCode: string): string => {
    const agency = agencies?.find((item: any) => item.agency === agencyCode);
    return agency?.longDescription || agencyCode || "";
  };

  const toggleExpand = (id: string) => {
    setExpandedComplaints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUnlinkComplaint = (linkedComplaintId: string) => {
    if (!id) return;

    dispatch(
      openModal({
        modalType: DELETE_CONFIRM,
        modalSize: "md",
        data: {
          title: `Unlink complaint #${linkedComplaintId}`,
          description: (
            <Alert variant="warning">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{` #${id} will no longer be linked to #${linkedComplaintId}`}</span>
            </Alert>
          ),
          confirmText: "unlink",
          deleteConfirmed: async () => {
            try {
              const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/unlink-complaints`, {
                complaintId: id,
                linkedComplaintId: linkedComplaintId,
              });
              await post(dispatch, parameters);

              ToggleSuccess(`Complaint #${linkedComplaintId} unlinked successfully`);
              // Refresh the linked complaints lis
              dispatch(getLinkedComplaints(id));
            } catch (error) {
              console.error("Error unlinking complaint:", error);
              ToggleError("Failed to unlink complaint");
            }
          },
        },
      }),
    );
  };

  const toggleViewMore = (type: AssociatedDataType) => {
    if (type === "DUPLICATE") {
      setViewMoreDuplicates(!viewMoreDuplicates);
    } else if (type === "LINK") {
      setViewMoreLinked(!viewMoreLinked);
    } else if (type === "CASES") {
      setViewMoreCases(!viewMoreCases);
    }
  };

  const renderViewMore = (items: LinkedComplaint[] | CaseFile[], type: AssociatedDataType) => {
    let viewMore;
    if (type === "DUPLICATE") {
      viewMore = viewMoreDuplicates;
    } else if (type === "CASES") {
      viewMore = viewMoreCases;
    } else {
      viewMore = viewMoreLinked;
    }

    if (items.length > 5) {
      if (!viewMore) {
        return (
          <>
            View more <BsChevronDown />
          </>
        );
      } else {
        return (
          <>
            View less <BsChevronUp />
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  const duplicateComplaints = linkedComplaintData.filter(
    (item: any) => !item.link_type || item.link_type === "DUPLICATE",
  );
  const linkedComplaints = linkedComplaintData.filter((item: any) => item.link_type === "LINK");

  const hasLinkedComplaints = linkedComplaints.length > 0;
  const hasDuplicateComplaints = duplicateComplaints.length > 0;
  const hasAssociatedCaseFiles = associatedCaseFiles.length > 0;
  const showTabs = [hasLinkedComplaints, hasDuplicateComplaints, hasAssociatedCaseFiles].filter(Boolean).length > 1;

  useEffect(() => {
    if (hasAssociatedCaseFiles) {
      setActiveTab("CASES");
    } else if (hasLinkedComplaints) {
      setActiveTab("LINK");
    } else if (hasDuplicateComplaints) {
      setActiveTab("DUPLICATE");
    }
  }, [hasAssociatedCaseFiles, hasLinkedComplaints, hasDuplicateComplaints, showTabs]);

  const renderComplaintList = (complaints: LinkedComplaint[], type: "DUPLICATE" | "LINK") => {
    const viewMore = type === "DUPLICATE" ? viewMoreDuplicates : viewMoreLinked;

    if (complaints.length === 0) {
      return <div className="text-muted p-3">No {type === "DUPLICATE" ? "duplicate" : "linked"} complaints found.</div>;
    }

    return (
      <>
        <div>
          {complaints.map((data, index) => (
            <div
              className={`comp-linked-complaint-item ${index > 4 && !viewMore ? "hide-item" : "show-item"}`}
              key={data.id}
              role="button"
              tabIndex={index}
              onClick={() => toggleExpand(data.id)}
              onKeyDown={() => toggleExpand(data.id)}
            >
              <div className="item-header">
                <div className="item-link">
                  <Link
                    to={`/complaint/${data.type || "HWCR"}/${data.id}`}
                    id={data.id}
                  >
                    {data.id}
                  </Link>
                </div>
                {data.agency && (
                  <>
                    <div>{getAgencyDescription(data.agency)}</div>
                    <div> • </div>
                  </>
                )}
                {data.type && (
                  <>
                    <div>{complaintTypeToName(data.type)}</div>
                    <div> • </div>
                  </>
                )}
                {getIssueDescription(data, natureOfComplaints, girTypeCodes, violationCodes) && (
                  <div>{getIssueDescription(data, natureOfComplaints, girTypeCodes, violationCodes)}</div>
                )}
                <div className="comp-details-badge-container ms-auto">
                  <Badge className={`badge ${applyStatusClass(data.status)}`}>{data.status}</Badge>
                  {type === "LINK" && id && canUnlink && (
                    <Button
                      variant="link"
                      className="ms-2 text-primary p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlinkComplaint(data.id);
                      }}
                    >
                      Unlink
                    </Button>
                  )}
                </div>
              </div>
              {expandedComplaints[data.id] && (
                <div className="comp-details-section">
                  <div>
                    <dt>Complaint description</dt>
                    <dd>{data.details}</dd>
                  </div>
                  {data.name && (
                    <div>
                      <dt>Name</dt>
                      <dd>{data.name}</dd>
                    </div>
                  )}
                  {data.phone && (
                    <div>
                      <dt>Primary phone</dt>
                      <dd>{formatPhoneNumber(data.phone)}</dd>
                    </div>
                  )}
                  {data.address && (
                    <div>
                      <dt>Address</dt>
                      <dd>{data.address}</dd>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="viewMore"
          onClick={() => toggleViewMore(type)}
          onKeyDown={() => toggleViewMore(type)}
        >
          {renderViewMore(complaints, type)}
        </div>
      </>
    );
  };

  const renderCaseFileList = (caseFiles: CaseFile[]) => {
    if (caseFiles.length === 0) {
      return <div className="text-muted p-3">No associated case files found.</div>;
    }

    return (
      <>
        <div>
          {caseFiles.map((data, index) => {
            const caseStatus = data.caseStatus?.caseStatusCode;
            return (
              <div
                className={`comp-linked-complaint-item ${index > 4 && !viewMoreCases ? "hide-item" : "show-item"}`}
                key={data.caseIdentifier}
                tabIndex={index}
              >
                <div className="item-header">
                  <div className="item-link">
                    <Link to={`/case/${data.caseIdentifier}`}>{data.name || data.caseIdentifier}</Link>
                  </div>
                  {data.leadAgency && <div>{data.leadAgency.longDescription}</div>}
                  {
                    <div className="comp-details-badge-container ms-auto">
                      <Badge className={`badge ${applyStatusClass(caseStatus!)}`}>
                        {data.caseStatus?.shortDescription}
                      </Badge>
                    </div>
                  }
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="viewMore"
          onClick={() => toggleViewMore("CASES")}
          onKeyDown={() => toggleViewMore("CASES")}
        >
          {renderViewMore(caseFiles, "CASES")}
        </button>
      </>
    );
  };

  return !hasAssociatedCaseFiles && !hasDuplicateComplaints && !hasLinkedComplaints ? null : (
    <div className="comp-complaint-details-block">
      <div>
        <h2>Associated data</h2>
      </div>

      {showTabs ? (
        <Tab.Container
          id="associated-data-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "LINK")}
        >
          <Nav
            variant="tabs"
            className="mb-3"
          >
            {hasAssociatedCaseFiles && casesActive && (
              <Nav.Item>
                <Nav.Link eventKey="CASES">Associated cases ({associatedCaseFiles.length})</Nav.Link>
              </Nav.Item>
            )}
            {hasLinkedComplaints && (
              <Nav.Item>
                <Nav.Link eventKey="LINK">Linked complaints ({linkedComplaints.length})</Nav.Link>
              </Nav.Item>
            )}
            {hasDuplicateComplaints && (
              <Nav.Item>
                <Nav.Link eventKey="DUPLICATE">Duplicate complaints ({duplicateComplaints.length})</Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          <Tab.Content>
            {hasAssociatedCaseFiles && casesActive && (
              <Tab.Pane eventKey="CASES">{renderCaseFileList(associatedCaseFiles)}</Tab.Pane>
            )}
            {hasLinkedComplaints && (
              <Tab.Pane eventKey="LINK">{renderComplaintList(linkedComplaints, "LINK")}</Tab.Pane>
            )}
            {hasDuplicateComplaints && (
              <Tab.Pane eventKey="DUPLICATE">{renderComplaintList(duplicateComplaints, "DUPLICATE")}</Tab.Pane>
            )}
          </Tab.Content>
        </Tab.Container>
      ) : (
        <div>
          {hasAssociatedCaseFiles && casesActive && (
            <>
              <h3 className="mb-3">Associated cases ({associatedCaseFiles.length})</h3>
              {renderCaseFileList(associatedCaseFiles)}
            </>
          )}
          {hasLinkedComplaints && (
            <>
              <h3 className="mb-3">Linked complaints ({linkedComplaints.length})</h3>
              {renderComplaintList(linkedComplaints, "LINK")}
            </>
          )}
          {hasDuplicateComplaints && (
            <>
              <h3 className="mb-3">Duplicate complaints ({duplicateComplaints.length})</h3>
              {renderComplaintList(duplicateComplaints, "DUPLICATE")}
            </>
          )}
        </div>
      )}
    </div>
  );
};
