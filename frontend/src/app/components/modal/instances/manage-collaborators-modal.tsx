import { FC, useEffect, useState } from "react";
import { Modal, Button, ListGroup, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { CompSelect } from "@components/common/comp-select";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import { filterOfficerByAgency, selectOfficers } from "@store/reducers/officer";
import Option from "@apptypes/app/option";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { Roles } from "@/app/types/app/roles";
import COMPLAINT_TYPES from "@/app/types/app/complaint-types";
import {
  addCollaboratorToComplaint,
  getComplaintCollaboratorsByComplaintId,
  removeCollaboratorFromComplaint,
  selectComplaint,
  selectActiveComplaintCollaborators,
} from "@/app/store/reducers/complaints";
import { getAvatarInitials } from "@/app/common/methods";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { AgencyType } from "@/app/types/app/agency-types";

type ManageCollaboratorsModalProps = {
  close: () => void;
  complaintId: string;
  complaintType: string;
};

export const ManageCollaboratorsModal: FC<ManageCollaboratorsModalProps> = ({ close, complaintId, complaintType }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const complaintData = useAppSelector(selectComplaint);

  const { title } = modalData;

  const [selectedAgency, setSelectedAgency] = useState<Option | null>();
  const [selectedAgencyError, setSelectedAgencyError] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Option | null>();
  const [selectedPersonError, setSelectedPersonError] = useState<string>("");
  const [officerDropdownList, setOfficerDropdownList] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    dispatch(getComplaintCollaboratorsByComplaintId(complaintId));
  }, [complaintId, dispatch]);
  const collaborators = useAppSelector(selectActiveComplaintCollaborators);

  const allOfficers = useAppSelector(selectOfficers);
  // Get officers for the selected agency
  useEffect(() => {
    if (selectedAgency && allOfficers) {
      const filteredOfficers = filterOfficerByAgency(selectedAgency.value as string, allOfficers);
      const officerDropdown = filteredOfficers
        .filter(
          (officer: AppUser) => complaintType === COMPLAINT_TYPES.HWCR || !officer.user_roles.includes(Roles.HWCR_ONLY),
        )
        .filter((officer) => !collaborators.some((c) => c.appUserGuid === officer.app_user_guid)) // Keep the officer if the complaint type is HWCR or if they don't have the HWCR_ONLY role for non-HWCR.
        .map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }));
      setOfficerDropdownList(officerDropdown);
    }
  }, [selectedAgency, complaintType, allOfficers, collaborators]);

  const agencyOptions = agencies
    .filter(
      (agency) =>
        !agency.externalAgencyInd && agency.agency !== complaintData?.ownedBy && agency.agency !== AgencyType.SECTOR,
    )
    .map((agency) => ({
      label: agency.longDescription,
      labelElement: <AgencyBanner agency={agency.agency} />,
      value: agency.agency,
    }));

  const handleSelectedAgencyChange = (selectedOption: Option | null) => {
    setSelectedAgency(selectedOption);
    setSelectedAgencyError("");
    // Reset officer selection when agency changes
    setSelectedPerson(null);
  };

  const handleSelectedPersonChange = (selectedOption: Option | null) => {
    setSelectedPerson(selectedOption);
    setSelectedPersonError("");
  };

  const handleSaveCollaborator = () => {
    let hasError = false;

    if (!selectedAgency) {
      setSelectedAgencyError("Please select an agency");
      hasError = true;
    }
    if (!selectedPerson) {
      setSelectedPersonError("Please select an officer");
      hasError = true;
    }

    if (!hasError && selectedPerson?.value) {
      const complaintUrl = window.location.href;
      dispatch(addCollaboratorToComplaint(complaintId, selectedPerson.value, complaintType, complaintUrl));
      // Reset selections after successful add
      setSelectedAgency(null);
      setSelectedPerson(null);
    }
  };

  const handleRemoveCollaborator = (appUserComplaintXrefGuid: string) => {
    dispatch(removeCollaboratorFromComplaint(complaintId, appUserComplaintXrefGuid));
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h1">{`${title}`}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <FeatureFlag feature={FEATURE_TYPES.COLLABORATOR_EMAILS}>
          <Alert
            variant="warning"
            className="comp-complaint-details-alert"
            id="comp-complaint-refer-alert"
          >
            <div>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{`Clicking ‘Add as a collaborator’ will send an email on your behalf to notify the user of the invitation.`}</span>
            </div>
          </Alert>
        </FeatureFlag>
        <div className="manage-collaborators-modal comp-details-form">
          <div className="comp-details-form-row">
            <label htmlFor="select-agency">
              Select agency<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="select-agency"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={agencyOptions}
                enableValidation={true}
                placeholder="Select agency"
                errorMessage={selectedAgencyError}
                value={selectedAgency}
                onChange={handleSelectedAgencyChange}
              />
            </div>
          </div>

          <div className="comp-details-form-row pb-3">
            <label htmlFor="select-officer">
              Select user<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="select-officer"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={officerDropdownList}
                enableValidation={true}
                placeholder="Select user"
                errorMessage={selectedPersonError}
                value={selectedPerson}
                onChange={handleSelectedPersonChange}
                isDisabled={!selectedAgency}
              />
            </div>
          </div>

          <div className="comp-details-form-actions d-flex justify-content-end gap-1">
            <Button onClick={handleSaveCollaborator}>Add as a collaborator</Button>
          </div>

          <div className="collaborators-section">
            <div>
              <h5 id="current-collaborators-title">
                {collaborators.length > 0 ? "Current collaborators" : "No current collaborators"}
              </h5>
              {collaborators.length > 0 && (
                <ListGroup className="pb-3">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.appUserGuid}
                      className="collaborator-item d-flex flex-row justify-content-between pb-3"
                    >
                      <div className="collaborator-info">
                        <div
                          className="collaborator-name comp-avatar comp-avatar-sm comp-avatar-orange"
                          data-initials-sm={getAvatarInitials(`${collaborator.lastName}, ${collaborator.firstName}`)}
                        >
                          {collaborator.lastName}, {collaborator.firstName} |{" "}
                          <span className="fw-bold">
                            {
                              agencies.find((item: any) => item.agency === collaborator.collaboratorAgency)
                                ?.shortDescription
                            }
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveCollaborator(collaborator.appUserComplaintXrefGuid)}
                      >
                        Remove user
                      </Button>
                    </div>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>
          <div className="comp-details-form-actions d-flex justify-content-end">
            <Button
              variant="outline-primary"
              onClick={close}
              id="close-collaborator-modal-button"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
