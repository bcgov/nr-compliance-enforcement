import { FC, useState, useEffect } from "react";
import { applyStatusClass } from "@common/methods";
import { Alert, Badge, Button, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { LinkedComplaint } from "@/app/types/app/complaints/linked-complaint";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { complaintTypeToName } from "@apptypes/app/complaint-types";
import { openModal } from "@store/reducers/app";
import { DELETE_CONFIRM } from "@apptypes/modal/modal-types";
import { getLinkedComplaints } from "@store/reducers/complaints";
import { generateApiParameters, post } from "@common/api";
import config from "@/config";
import { ToggleError, ToggleSuccess } from "@common/toast";

type Props = {
  linkedComplaintData: LinkedComplaint[];
  id?: string;
  canUnlink?: boolean;
};

export const LinkedComplaintList: FC<Props> = ({ linkedComplaintData, id, canUnlink = true }) => {
  const dispatch = useAppDispatch();
  const [expandedComplaints, setExpandedComplaints] = useState<Record<string, boolean>>({});
  const [viewMoreDuplicates, setViewMoreDuplicates] = useState<boolean>(false);
  const [viewMoreLinked, setViewMoreLinked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("LINK");

  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  // Helper functions to get description
  const getAgencyDescription = (agencyCode: string): string => {
    const agency = agencies?.find((item: any) => item.agency === agencyCode);
    return agency?.longDescription || agencyCode || "";
  };

  const getIssueDescription = (data: LinkedComplaint): string => {
    if (!data.issueType) return "";

    if (data.complaintType === "HWCR") {
      const code = natureOfComplaints?.find((item: any) => item.natureOfComplaint === data.issueType);
      return code?.longDescription || data.issueType;
    } else if (data.complaintType === "GIR") {
      const code = girTypeCodes?.find((item: any) => item.girType === data.issueType);
      return code?.longDescription || data.issueType;
    } else if (data.complaintType === "ERS") {
      const code = violationCodes?.find((item: any) => item.violation === data.issueType);
      return code?.longDescription || data.issueType;
    }

    return data.issueType;
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

  const toggleViewMore = (type: "DUPLICATE" | "LINK") => {
    if (type === "DUPLICATE") {
      setViewMoreDuplicates(!viewMoreDuplicates);
    } else {
      setViewMoreLinked(!viewMoreLinked);
    }
  };

  const renderViewMore = (complaints: LinkedComplaint[], type: "DUPLICATE" | "LINK") => {
    const viewMore = type === "DUPLICATE" ? viewMoreDuplicates : viewMoreLinked;
    if (complaints.length > 5) {
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
  const showTabs = hasLinkedComplaints && hasDuplicateComplaints;

  useEffect(() => {
    if (!hasLinkedComplaints && hasDuplicateComplaints) {
      setActiveTab("DUPLICATE");
    } else if (hasLinkedComplaints && !hasDuplicateComplaints) {
      setActiveTab("LINK");
    } else if (hasLinkedComplaints && hasDuplicateComplaints) {
      setActiveTab("LINK");
    }
  }, [hasLinkedComplaints, hasDuplicateComplaints, showTabs]);

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
                    to={`/complaint/${data.complaintType || "HWCR"}/${data.id}`}
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
                {data.complaintType && (
                  <>
                    <div>{complaintTypeToName(data.complaintType)}</div>
                    <div> • </div>
                  </>
                )}
                {getIssueDescription(data) && <div>{getIssueDescription(data)}</div>}
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

  return linkedComplaintData.length === 0 ? null : (
    <div className="comp-complaint-details-block">
      <div>
        <h2>Associated complaints</h2>
      </div>

      {showTabs ? (
        <Tab.Container
          id="linked-complaints-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "LINK")}
        >
          <Nav
            variant="tabs"
            className="mb-3"
          >
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
