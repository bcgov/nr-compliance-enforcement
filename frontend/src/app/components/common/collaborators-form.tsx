import { FC, useState } from "react";
import { Button, ListGroup, Alert } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { CompSelect } from "@components/common/comp-select";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import Option from "@apptypes/app/option";
import { getAvatarInitials } from "@/app/common/methods";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

type CollaboratorsFormProps = {
  agencyOptions: Option[];
  getUserOptions: (agency: string) => Option[];
  collaborators: { appUserGuid: string; firstName?: string; lastName?: string; collaboratorAgency?: string }[];
  onAdd: (appUserGuid: string) => void;
  onRemove: (appUserGuid: string) => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  submit: () => void;
};

export const CollaboratorsForm: FC<CollaboratorsFormProps> = ({
  agencyOptions,
  getUserOptions,
  collaborators,
  onAdd,
  onRemove,
  onDirtyChange,
  submit,
}) => {
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));

  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const [selectedAgency, setSelectedAgency] = useState<Option | null>();
  const [selectedAgencyError, setSelectedAgencyError] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Option | null>();
  const [selectedPersonError, setSelectedPersonError] = useState<string>("");

  const officerDropdownList = selectedAgency ? getUserOptions(selectedAgency.value as string) : [];

  const handleSelectedAgencyChange = (selectedOption: Option | null) => {
    setSelectedAgency(selectedOption);
    setSelectedAgencyError("");
    setSelectedPerson(null);
    markDirty();
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
      onAdd(selectedPerson.value);
      setSelectedAgency(null);
      setSelectedPerson(null);
      markClean();
    }
  };

  return (
    <>
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
                      onClick={() => onRemove(collaborator.appUserGuid)}
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
            onClick={submit}
            id="close-collaborator-modal-button"
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};
