import { FC, memo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { PartyListSearch } from "@/app/components/common/party-list-search";
import { CreateInspectionPartyInput, CreateInvestigationPartyInput, Party } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CompSelect } from "../../common/comp-select";
import { selectPartyAssociationRoleDropdown } from "@/app/store/reducers/code-table-selectors";

type ActivityType = "investigation" | "inspection";

const createAddPartyMutation = (activityType: ActivityType) => {
  if (activityType === "investigation") {
    return gql`
      mutation AddPartyToInvestigation($investigationGuid: String!, $input: [CreateInvestigationPartyInput]!) {
        addPartyToInvestigation(investigationGuid: $investigationGuid, input: $input) {
          investigationGuid
          description
          investigationStatus {
            investigationStatusCode
            shortDescription
            longDescription
          }
          parties {
            person {
              firstName
              lastName
            }
            business {
              name
            }
          }
          leadAgency
        }
      }
    `;
  } else {
    return gql`
      mutation AddPartyToInspection($inspectionGuid: String!, $input: [CreateInspectionPartyInput]!) {
        addPartyToInspection(inspectionGuid: $inspectionGuid, input: $input) {
          inspectionGuid
          description
          inspectionStatus {
            inspectionStatusCode
            shortDescription
            longDescription
          }
          parties {
            person {
              firstName
              lastName
            }
            business {
              name
            }
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

type AddPartyModalProps = {
  activityType: ActivityType;
  close: () => void;
  submit: () => void;
};

export const AddPartyModal: FC<AddPartyModalProps> = ({ activityType, close, submit }) => {
  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const partyRoles = useAppSelector(selectPartyAssociationRoleDropdown);

  // Vars
  const { title, activityGuid } = modalData;

  // State
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [selectedPartyRole, setSelectedPartyRole] = useState<string | null>();
  const [partyErrorMessage, setPartyErrorMessage] = useState<string>("");
  const [partyRoleErrorMessage, setPartyRoleErrorMessage] = useState<string>("");
  const ADD_PARTY_MUTATION = createAddPartyMutation(activityType);
  const addPartyMutation = useGraphQLMutation(ADD_PARTY_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party added successfully");
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add party");
    },
  });

  const handleSearchPartyChange = (selected: Party) => {
    setPartyErrorMessage("");
    setSelectedParty(selected);
  };

  const handlePartyRoleChange = (partyRole: string) => {
    setPartyRoleErrorMessage("");
    setSelectedPartyRole(partyRole);
  };

  const handleAddParty = async () => {
    if (!selectedParty) {
      setPartyErrorMessage("Please select a party to add.");
      return;
    }

    if (!selectedPartyRole) {
      setPartyRoleErrorMessage("Please select a party association role.");
      return;
    }

    if (partyErrorMessage || partyRoleErrorMessage) return;

    const addPartyInput = {
      partyTypeCode: selectedParty.partyTypeCode || "",
      partyReference: selectedParty.partyIdentifier,
      ...(selectedParty.person?.lastName && {
        person: {
          firstName: selectedParty.person?.firstName || "",
          lastName: selectedParty.person?.lastName || "",
          middleName: selectedParty.person?.middleName,
          middleName2: selectedParty.person?.middleName2,
          personReference: selectedParty.person?.personGuid,
        },
      }),
      ...(selectedParty.business?.name && {
        business: {
          name: selectedParty.business.name,
          businessReference: selectedParty.business.businessGuid,
        },
      }),
      partyAssociationRole: selectedPartyRole,
    };
    const typeCastedInput =
      activityType === "investigation"
        ? (addPartyInput as CreateInvestigationPartyInput)
        : (addPartyInput as CreateInspectionPartyInput);

    // Backend expects the named ids
    if (activityType === "investigation") {
      addPartyMutation.mutate({ investigationGuid: activityGuid, input: typeCastedInput });
    } else {
      addPartyMutation.mutate({ inspectionGuid: activityGuid, input: typeCastedInput });
    }

    submit();
    close();
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
          <div
            className="comp-details-form-row"
            id="add-party-div"
            style={{ paddingBottom: "16px" }}
          >
            <label htmlFor="createParty">Search for an existing party</label>
            <div
              className="comp-details-input full-width"
              style={{ width: "100%" }}
            >
              <PartyListSearch
                id="createParty"
                onChange={(e: Party) => handleSearchPartyChange(e)}
                errorMessage={partyErrorMessage}
              />
            </div>
          </div>
          {selectedParty?.person && (
            <>
              <h4>Person details</h4>
              <div className="comp-details-form-row">
                <div className="col-md-6">
                  <strong>First Name:</strong>
                  <p id="selected-party-firstName">{selectedParty?.person?.firstName}</p>
                </div>
                <div className="col-md-6">
                  <strong>Last Name:</strong>
                  <p id="selected-party-firstName">{selectedParty?.person?.lastName}</p>
                </div>
              </div>
            </>
          )}
          {selectedParty?.business && (
            <>
              <h4>Business details</h4>
              <div className="comp-details-form-row">
                <div className="col-md-6">
                  <strong>Business name:</strong>
                  <p id="selected-party-businessName">{selectedParty?.business?.name}</p>
                </div>
              </div>
            </>
          )}
          {(selectedParty?.person || selectedParty?.business) && (
            <div
              className="comp-details-form-row"
              id="add-party-div"
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
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={partyRoleErrorMessage || ""}
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
            id="add-party-cancel-button"
            title="Cancel Add Party"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-party-save-button"
            title="Save Add Party"
            onClick={handleAddParty}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
