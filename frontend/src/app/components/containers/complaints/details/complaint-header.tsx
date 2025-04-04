import { FC } from "react";
import { Link } from "react-router-dom";
import COMPLAINT_TYPES, { complaintTypeToName } from "@apptypes/app/complaint-types";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectComplaintHeader, selectComplaintViewMode } from "@store/reducers/complaints";
import { applyStatusClass, formatDate, formatTime, getAvatarInitials } from "@common/methods";

import { Badge, Button, Dropdown } from "react-bootstrap";

import { isFeatureActive, openModal } from "@store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS, QUICK_CLOSE, REFER_COMPLAINT } from "@apptypes/modal/modal-types";
import { exportComplaint } from "@store/reducers/documents-thunks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { setIsInEdit } from "@store/reducers/cases";
import useValidateComplaint from "@hooks/validate-complaint";
import { getUserAgency } from "@/app/service/user-service";

interface ComplaintHeaderProps {
  id: string;
  complaintType: string;
  readOnly: boolean;
  editButtonClick: () => void;
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
}

export const ComplaintHeader: FC<ComplaintHeaderProps> = ({
  id,
  complaintType,
  readOnly,
  editButtonClick,
  cancelButtonClick,
  saveButtonClick,
}) => {
  const {
    loggedDate,
    createdBy,
    lastUpdated,
    officerAssigned,
    status,
    statusCode,
    zone,
    natureOfComplaint,
    violationType,
    species,
    complaintAgency,
    girType,
  } = useAppSelector(selectComplaintHeader(complaintType));
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));
  const showComplaintReferrals = useAppSelector(isFeatureActive(FEATURE_TYPES.COMPLAINT_REFERRALS));
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const userAgency = getUserAgency();

  const dispatch = useAppDispatch();
  const assignText = officerAssigned === "Not Assigned" ? "Assign" : "Reassign";
  const derivedStatus = complaintAgency !== userAgency ? "Referred" : status;

  const openStatusChangeModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CHANGE_STATUS,
        data: {
          title: "Update status",
          description: "Status",
          complaint_identifier: id,
          complaint_type: complaintType,
          complaint_status: statusCode,
          is_officer_assigned: officerAssigned !== "Not Assigned",
        },
      }),
    );
  };

  const openReferModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: REFER_COMPLAINT,
        data: {
          title: "Refer complaint",
          description: "",
          id: id,
          complaint_type: complaintType,
        },
      }),
    );
  };

  const openAsignOfficerModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ASSIGN_OFFICER,
        data: {
          title: "Assign complaint",
          description: "Suggested officers",
          complaint_identifier: id,
          complaint_type: complaintType,
          zone: zone,
          agency_code: complaintAgency,
        },
      }),
    );
  };

  const validationResults = useValidateComplaint();
  const openQuickCloseModal = () => {
    if (!validationResults.canQuickCloseComplaint) {
      validationResults.scrollToErrors();
      dispatch(setIsInEdit({ showSectionErrors: true, hideAssessmentErrors: true }));
    } else {
      document.body.click();
      dispatch(
        openModal({
          modalSize: "lg",
          modalType: QUICK_CLOSE,
          data: {
            title: `Quick close: Complaint #${id}`,
            description: "",
            complaint_identifier: id,
            complaint_type: complaintType,
            complaint_status: status,
          },
        }),
      );
    }
  };

  const exportComplaintToPdf = () => {
    dispatch(exportComplaint(complaintType, id, new Date(loggedDate)));
  };

  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container">
          {/* <!-- breadcrumb start --> */}
          <div className="comp-complaint-breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {showExperimentalFeature && (
                  <li className="breadcrumb-item">
                    <i className="bi bi-house-door"></i> Home
                  </li>
                )}
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to={`/complaints/${complaintType}`}>{complaintTypeToName(complaintType)}</Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {id}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- complaint info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Complaint </span>#{id}
              </h1>
            </div>

            {/* Badges */}
            <div className="comp-details-badge-container">
              <Badge
                id="comp-details-status-text-id"
                className={`badge ${applyStatusClass(derivedStatus)}`}
              >
                {derivedStatus}
              </Badge>
            </div>

            {/* Action Buttons */}
            {readOnly && (
              <div className="comp-header-actions">
                <div className="comp-header-actions-mobile">
                  <Dropdown>
                    <Dropdown.Toggle
                      aria-label="Actions Menu"
                      variant="outline-primary"
                      className="icon-btn"
                      id="dropdown-basic"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      {complaintType === "HWCR" && (
                        <Dropdown.Item
                          as="button"
                          onClick={openQuickCloseModal}
                          disabled={isReadOnly}
                        >
                          <i className="bi bi-journal-x"></i>
                          <span>Quick close</span>
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        as="button"
                        onClick={openAsignOfficerModal}
                        disabled={isReadOnly}
                      >
                        <i className="bi bi-person-plus"></i>
                        <span>{assignText}</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        onClick={openStatusChangeModal}
                        disabled={complaintAgency !== userAgency}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update Status</span>
                      </Dropdown.Item>
                      {showComplaintReferrals && (
                        <Dropdown.Item
                          as="button"
                          onClick={openReferModal}
                          disabled={status !== " Open" || complaintAgency !== userAgency}
                        >
                          <i className="bi bi-send"></i>
                          <span>Refer</span>
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        as="button"
                        onClick={() => exportComplaintToPdf()}
                        disabled={complaintAgency !== userAgency}
                      >
                        <i className="bi bi-file-earmark-pdf"></i>
                        <span>Export</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="comp-header-actions-desktop">
                  {complaintType === "HWCR" && (
                    <Button
                      id="details-screen-close-button"
                      title="Quick close"
                      variant="outline-light"
                      onClick={openQuickCloseModal}
                      disabled={isReadOnly}
                    >
                      <i className="bi bi-journal-x"></i>
                      <span>Quick close</span>
                    </Button>
                  )}
                  <Button
                    id="details-screen-assign-button"
                    title="Assign to officer"
                    variant="outline-light"
                    onClick={openAsignOfficerModal}
                    disabled={isReadOnly}
                  >
                    <i className="bi bi-person-plus"></i>
                    <span>{assignText}</span>
                  </Button>
                  <Button
                    id="details-screen-update-status-button"
                    title="Update status"
                    variant="outline-light"
                    onClick={openStatusChangeModal}
                    disabled={complaintAgency !== userAgency}
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Update status</span>
                  </Button>
                  {showComplaintReferrals && (
                    <Button
                      id="details-screen-refer-button"
                      title="Refer"
                      variant="outline-light"
                      onClick={openReferModal}
                      disabled={status !== "Open" || complaintAgency !== userAgency}
                    >
                      <i className="bi bi-send"></i>
                      <span>Refer</span>
                    </Button>
                  )}
                  <Button
                    id="details-screen-export-complaint-button"
                    title="Export"
                    variant="outline-light"
                    onClick={() => exportComplaintToPdf()}
                    disabled={complaintAgency !== userAgency}
                  >
                    <i className="bi bi-file-earmark-pdf"></i>
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            )}
            {!readOnly && (
              <div className="comp-header-actions">
                <Button
                  id="details-screen-cancel-edit-button-top"
                  title="Cancel Edit Complaint"
                  variant="outline-light"
                  onClick={cancelButtonClick}
                >
                  Cancel
                </Button>
                <Button
                  id="details-screen-cancel-save-button-top"
                  title="Save Complaint"
                  variant="outline-light"
                  onClick={saveButtonClick}
                >
                  Save Complaint
                </Button>
              </div>
            )}
          </div>

          {/* Nature of Complaint Details */}
          <div
            className="comp-nature-of-complaint"
            id="comp-nature-of-complaint"
          >
            {readOnly && species && complaintType !== COMPLAINT_TYPES.ERS && (
              <span className="comp-box-species-type">{species}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            )}
            {readOnly && <span>{complaintType !== COMPLAINT_TYPES.ERS ? natureOfComplaint : violationType}</span>}
            {readOnly && girType && complaintType === COMPLAINT_TYPES.GIR && <span>{girType}</span>}
          </div>
        </div>
      </div>

      {complaintAgency !== userAgency && (
        <div className="comp-referral-banner">
          <div className="referral-content">
            This complaint has been referred to another agency. To request access, contact the lead agency.
          </div>
        </div>
      )}

      {/* <!-- complaint status details start --> */}
      {readOnly && (
        <section className="comp-details-body comp-container">
          <div className="comp-header-status-container">
            <div className="comp-details-status">
              <dl className="comp-details-date-logged">
                <dt>Date logged</dt>
                <dd className="comp-date-time-value">
                  <div id="complaint-date-logged">
                    <i className="bi bi-calendar"></i>
                    {formatDate(loggedDate)}
                  </div>
                  <div>
                    <i className="bi bi-clock"></i>
                    {formatTime(loggedDate)}
                  </div>
                </dd>
              </dl>

              <dl className="comp-details-date-assigned">
                <dt>Last updated</dt>
                <dd className="comp-date-time-value">
                  {lastUpdated && (
                    <>
                      <div>
                        <i className="bi bi-calendar"></i>
                        {formatDate(lastUpdated)}
                      </div>
                      <div>
                        <i className="bi bi-clock"></i>
                        {formatTime(lastUpdated)}
                      </div>
                    </>
                  )}
                  {!lastUpdated && <>N/A</>}
                </dd>
              </dl>

              <dl>
                <dt>Officer assigned</dt>
                <dd>
                  <div
                    data-initials-sm={getAvatarInitials(officerAssigned)}
                    className="comp-avatar comp-avatar-sm comp-avatar-orange"
                  >
                    <span id="comp-details-assigned-officer-name-text-id">{officerAssigned}</span>
                  </div>
                </dd>
              </dl>

              <dl>
                <dt>Created by</dt>
                <dd>
                  <div
                    data-initials-sm={getAvatarInitials(createdBy)}
                    className="comp-avatar comp-avatar-sm comp-avatar-blue"
                  >
                    <span>{createdBy}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </section>
      )}
      {/* <!-- complaint status details end --> */}
    </>
  );
};
