import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import COMPLAINT_TYPES, { complaintTypeToName } from "@apptypes/app/complaint-types";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  getComplaintCollaboratorsByComplaintId,
  getLinkedComplaints,
  selectActiveComplaintCollaborators,
  selectComplaintHeader,
  selectComplaintViewMode,
  selectRelatedData,
} from "@store/reducers/complaints";
import { applyStatusClass, formatDate, formatTime, getAvatarInitials } from "@common/methods";

import { Badge, Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

import { isFeatureActive, openModal, appUserGuid } from "@store/reducers/app";
import {
  ASSIGN_OFFICER,
  CHANGE_STATUS,
  MANAGE_COLLABORATORS,
  QUICK_CLOSE,
  REFER_COMPLAINT,
  LINK_COMPLAINT,
  CREATE_ADD_CASE,
} from "@apptypes/modal/modal-types";
import { exportComplaint } from "@store/reducers/documents-thunks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
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
    parkAreaGuids,
  } = useAppSelector(selectComplaintHeader(complaintType));
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));
  const showComplaintReferrals = useAppSelector(isFeatureActive(FEATURE_TYPES.COMPLAINT_REFERRALS));
  const showComplaintCollaboration = useAppSelector(isFeatureActive(FEATURE_TYPES.COMPLAINT_COLLABORATION));
  const showCreateAddCase = useAppSelector(isFeatureActive(FEATURE_TYPES.CASES));
  const userGuid = useAppSelector(appUserGuid);
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const collaborators = useAppSelector(selectActiveComplaintCollaborators);
  const userAgency = getUserAgency();
  const relatedData = useAppSelector(selectRelatedData);
  let referrals = relatedData.referrals ?? [];
  const agencyCodes = useAppSelector((state) => state.codeTables.agency);
  const dispatch = useAppDispatch();

  const [userIsCollaborator, setUserIsCollaborator] = useState<boolean>(false);
  useEffect(() => {
    setUserIsCollaborator(collaborators.some((c) => c.appUserGuid === userGuid));
  }, [collaborators, userGuid]);
  useEffect(() => {
    dispatch(getComplaintCollaboratorsByComplaintId(id));
  }, [id, dispatch]);

  const assignText = officerAssigned === "Not Assigned" ? "Assign" : "Reassign";
  const complaintWasReferred =
    complaintAgency !== userAgency && referrals.length > 0
      ? referrals[0].referred_to_agency.agency !== userAgency
      : false;
  const derivedStatus = complaintWasReferred && !userIsCollaborator ? "Referred" : status;

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
        modalSize: "md",
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
          park_area_guids: parkAreaGuids,
          isHeader: true,
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

  const openManageCollaboratorsModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MANAGE_COLLABORATORS,
        data: {
          title: "Manage collaborators",
          description: "Suggested officers",
          complaintId: id,
          complaintType: complaintType,
          zone: zone,
          agencyCode: complaintAgency,
        },
      }),
    );
  };

  const openLinkComplaintModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: LINK_COMPLAINT,
        data: {
          title: `Link complaint: #${id}`,
          complaint_identifier: id,
          complaint_type: complaintType,
        },
        callback: () => {
          dispatch(getLinkedComplaints(id));
        },
      }),
    );
  };

  const openCreateAddCaseModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: CREATE_ADD_CASE,
        data: {
          title: "Create/add case",
          complaint_identifier: id,
          agency_code: complaintAgency,
        },
      }),
    );
  };

  const exportComplaintToPdf = () => {
    dispatch(exportComplaint(complaintType, id, new Date(loggedDate)));
  };

  const collaboratorsTooltipOverlay = () => (
    <OverlayTrigger
      key={`${id}-collab-tooltip`}
      placement="bottom"
      trigger={["hover", "click"]}
      overlay={
        <Tooltip
          id={`tt-${id}`}
          className="comp-tooltip comp-tooltip-bottom collaborators-tooltip"
        >
          {collaborators.map((c) => {
            return (
              <div
                className="d-flex justify-content-start"
                key={`${c.appUserComplaintXrefGuid}`}
              >
                {c.lastName}, {c.firstName}
                <span className="mx-1">|</span>
                <span className="fw-bold">
                  {agencyCodes?.find(({ agency }) => agency === c.collaboratorAgency)?.shortDescription}
                </span>
              </div>
            );
          })}
        </Tooltip>
      }
    >
      <span
        id="comp-header-collaborator-count"
        className="fw-bold"
      >
        +{collaborators.length}
      </span>
    </OverlayTrigger>
  );

  const renderCommonDropdownItems = () => (
    <>
      {complaintType === "HWCR" && (
        <Dropdown.Item
          as="button"
          id="quick-close-button"
          onClick={openQuickCloseModal}
          disabled={isReadOnly}
        >
          <i className="bi bi-journal-x"></i>
          <span>Quick close</span>
        </Dropdown.Item>
      )}
      <Dropdown.Item
        as="button"
        id="link-complaint-button"
        onClick={openLinkComplaintModal}
      >
        <i className="bi bi-link-45deg"></i>
        <span>Link complaint</span>
      </Dropdown.Item>
      {showCreateAddCase && (
        <Dropdown.Item
          as="button"
          id="create-add-case-button"
          onClick={openCreateAddCaseModal}
          disabled={complaintAgency !== userAgency}
        >
          <i className="bi bi-folder-plus"></i>
          <span>Create/add case</span>
        </Dropdown.Item>
      )}
      {showComplaintReferrals && (
        <Dropdown.Item
          as="button"
          id="refer-button"
          onClick={openReferModal}
          disabled={status !== "Open" || complaintAgency !== userAgency}
        >
          <i className="bi bi-send"></i>
          <span>Refer</span>
        </Dropdown.Item>
      )}
      {showComplaintCollaboration && (
        <Dropdown.Item
          as="button"
          id="manage-collaborators-button"
          onClick={openManageCollaboratorsModal}
          disabled={complaintAgency !== userAgency}
        >
          <i className="bi bi-people"></i>
          <span>Manage collaborators</span>
        </Dropdown.Item>
      )}
      <Dropdown.Item
        as="button"
        id="export-pdf-button"
        onClick={() => exportComplaintToPdf()}
      >
        <i className="bi bi-file-earmark-pdf"></i>
        <span>Export</span>
      </Dropdown.Item>
    </>
  );

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
                      {/* Mobile includes assign and update status in dropdown */}
                      <Dropdown.Item
                        as="button"
                        id="assign-button"
                        onClick={openAsignOfficerModal}
                        disabled={isReadOnly}
                      >
                        <i className="bi bi-person-plus"></i>
                        <span>{assignText}</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        id="update-status-button"
                        onClick={openStatusChangeModal}
                        disabled={complaintAgency !== userAgency}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update Status</span>
                      </Dropdown.Item>
                      {renderCommonDropdownItems()}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="comp-header-actions-desktop">
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

                  <Dropdown className="comp-header-kebab-menu">
                    <Dropdown.Toggle
                      aria-label="Actions Menu"
                      variant="outline-light"
                      className="kebab-btn"
                      id="dropdown-basic"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                      <span>More actions</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">{renderCommonDropdownItems()}</Dropdown.Menu>
                  </Dropdown>
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
            className="mt-1 max-width-48ch"
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

      {complaintWasReferred && (
        <div className="comp-contex-banner">
          <div className="banner-content">
            This complaint has been referred to another agency. To request access, contact the lead agency.
          </div>
        </div>
      )}
      {userIsCollaborator && (
        <div className="comp-contex-banner comp-collaborator-banner">
          <div className="banner-content">
            {/* 
              Once there are three agencies passing complaints between each other, this logic for complaintAgency
              will need to be updated to pull the agency off of the collaborator app_user_complaint_xref records
              creator, but for now the owning agency is sufficient.
            */}
            {complaintAgency && (
              <>
                <span className="fw-bold">
                  {agencyCodes?.find(({ agency }) => agency === complaintAgency)?.shortDescription ||
                    complaintAgency ||
                    "Unknown Agency"}
                </span>
                {" added you to this complaint as a collaborator."}
              </>
            )}
          </div>
        </div>
      )}

      {/* <!-- complaint status details start --> */}
      {readOnly && (
        <section className="comp-details-body comp-container">
          <div className="comp-header-status-container">
            <div className="comp-details-status">
              <dl>
                <dt>Lead agency</dt>
                <dd>
                  <div className="comp-lead-agency">
                    <i className="bi bi-building"></i>
                    <span
                      id="comp-details-lead-agency-text-id"
                      className="comp-lead-agency-name"
                    >
                      {agencyCodes?.find(({ agency }) => agency === complaintAgency)?.longDescription ||
                        complaintAgency ||
                        "Unknown Agency"}
                    </span>
                  </div>
                </dd>
              </dl>
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
                    <div>
                      <span id="comp-details-assigned-officer-name-text-id">{officerAssigned}</span>
                      {collaborators.length > 0 && collaboratorsTooltipOverlay()}
                    </div>
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
