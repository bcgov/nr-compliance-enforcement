import { FC, memo, useEffect, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CompSelect } from "../../common/comp-select";
import { selectPartyAssociationRoleDropdown } from "@/app/store/reducers/code-table-selectors";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

type ActivityType = "investigation" | "inspection";

const createEditPartyRoleMutation = (activityType: ActivityType) => {
  if (activityType === "investigation") {
    return gql`
      mutation EditPartyRoleInInvestigation(
        $investigationGuid: String!
        $partyIdentifier: String!
        $partyAssociationRole: String!
      ) {
        editPartyRoleInInvestigation(
          investigationGuid: $investigationGuid
          partyIdentifier: $partyIdentifier
          partyAssociationRole: $partyAssociationRole
        ) {
          investigationGuid
          description
          investigationStatus {
            investigationStatusCode
            shortDescription
            longDescription
          }
          parties {
            partyIdentifier
            person {
              firstName
              lastName
            }
            business {
              name
            }
            partyAssociationRole
          }
          leadAgency
        }
      }
    `;
  } else {
    return gql`
      mutation EditPartyRoleInInspection(
        $inspectionGuid: String!
        $partyIdentifier: String!
        $partyAssociationRole: String!
      ) {
        editPartyRoleInInspection(
          inspectionGuid: $inspectionGuid
          partyIdentifier: $partyIdentifier
          partyAssociationRole: $partyAssociationRole
        ) {
          inspectionGuid
          description
          inspectionStatus {
            inspectionStatusCode
            shortDescription
            longDescription
          }
          parties {
            partyIdentifier
            person {
              firstName
              lastName
            }
            business {
              name
            }
            partyAssociationRole
          }
          leadAgency
        }
      }
    `;
  }
};

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type EditPartyModalProps = {
  activityType: ActivityType;
  close: () => void;
  submit: () => void;
};

export const EditPartyModal: FC<EditPartyModalProps> = ({ activityType, close, submit }) => {
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const partyRoles = useAppSelector(selectPartyAssociationRoleDropdown);

  const { title, activityGuid, partyIdentifier, partyAssociationRole, onDirtyChange } = modalData;

  const { markDirty } = useFormDirtyState(onDirtyChange);

  const [selectedPartyRole, setSelectedPartyRole] = useState<string | null>();
  const [partyRoleErrorMessage, setPartyRoleErrorMessage] = useState<string>("");
  const EDIT_PARTY_ROLE_MUTATION = createEditPartyRoleMutation(activityType);
  const editPartyRoleMutation = useGraphQLMutation(EDIT_PARTY_ROLE_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party role updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating party role:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to update party role");
    },
  });

  const handlePartyRoleChange = (partyRole: string) => {
    setPartyRoleErrorMessage("");
    markDirty();
    setSelectedPartyRole(partyRole);
  };

  const handleEditParty = async () => {
    if (!selectedPartyRole) {
      setPartyRoleErrorMessage("Please select a party association role.");
      return;
    }

    if (partyRoleErrorMessage) return;

    if (activityType === "investigation") {
      editPartyRoleMutation.mutate({
        investigationGuid: activityGuid,
        partyIdentifier: partyIdentifier,
        partyAssociationRole: selectedPartyRole,
      });
    } else {
      editPartyRoleMutation.mutate({
        inspectionGuid: activityGuid,
        partyIdentifier: partyIdentifier,
        partyAssociationRole: selectedPartyRole,
      });
    }
    submit();
  };

  const partyRoleOptions = partyRoles
    ?.sort((left: any, right: any) => left.displayOrder - right.displayOrder)
    .filter((option: any) => {
      return (
        (activityType === "investigation" && option.caseActivityTypeCode === "INVSTGTN") ||
        (activityType === "inspection" && option.caseActivityTypeCode === "INSPECTION")
      );
    })
    .map((option: any) => {
      return {
        value: option.value,
        label: option.label,
      };
    });
  useEffect(() => {
    setSelectedPartyRole(partyAssociationRole || null);
  }, [partyAssociationRole]);

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {loading && <ModalLoading />}
        <div
          className="comp-details-body"
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          {partyIdentifier && (
            <div
              className="comp-details-form-row"
              id="edit-party-div"
              style={{ paddingBottom: "16px" }}
            >
              <label htmlFor="partyRole">Party association role</label>
              <div
                className="comp-details-input full-width"
                style={{ width: "100%" }}
              >
                <CompSelect
                  id="party-role-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={partyRoleOptions}
                  onChange={(option) => handlePartyRoleChange(option?.value || "")}
                  placeholder="Select"
                  isClearable={false}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={partyRoleErrorMessage || ""}
                  value={
                    selectedPartyRole
                      ? {
                          value: selectedPartyRole,
                          label:
                            partyRoles.find((role) => role.value === selectedPartyRole)?.label || selectedPartyRole,
                        }
                      : null
                  }
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="edit-party-cancel-button"
            title="Cancel Edit Party"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="edit-party-save-button"
            title="Save Edit Party"
            onClick={handleEditParty}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
