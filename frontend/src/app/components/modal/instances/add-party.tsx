import { FC, memo, useState } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { PartyListSearch } from "@/app/components/common/party-list-search";
import { CreateInspectionPartyInput, CreateInvestigationPartyInput, Party } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CompSelect } from "../../common/comp-select";
import { selectPartyAssociationRoleDropdown, selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { useForm, useStore } from "@tanstack/react-form";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { FormField } from "@/app/components/common/form-field";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessForm } from "@/app/components/containers/parties/form/business-form";
import z from "zod";
import { toDateOfBirth } from "@/app/common/methods";

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

// Helper to build contact methods array for the local party mutation
const buildLocalContactMethods = (phoneNumbers: any[], emailAddresses: any[]) => {
  const methods = [];

  if (phoneNumbers?.length) {
    methods.push(
      ...phoneNumbers.map((p: any) => ({
        contactMethodTypeCode: ContactMethods.PHONE,
        contactValue: p.value ?? "",
        isPrimary: p.isPrimary ?? false,
      })),
    );
  }

  if (emailAddresses?.length) {
    methods.push(
      ...emailAddresses.map((e: any) => ({
        contactMethodTypeCode: ContactMethods.EMAIL,
        contactValue: e.value ?? "",
        isPrimary: e.isPrimary ?? false,
      })),
    );
  }

  return methods.length ? methods : undefined;
};

// Helper to build business identifiers for the local party mutation
const buildLocalBusinessIdentifiers = (businessNumber: any, worksafeBCNumber: any) => {
  const identifiers = [];

  if (businessNumber?.identifierValue) {
    identifiers.push({
      businessIdentifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumber.identifierValue,
    });
  }

  if (worksafeBCNumber?.identifierValue) {
    identifiers.push({
      businessIdentifierCode: BusinessIdentifiers.WSBC_NUMBER,
      identifierValue: worksafeBCNumber.identifierValue,
    });
  }

  return identifiers.length ? identifiers : undefined;
};

// Helper to build aliases for the local party mutation
const buildLocalAliases = (aliases: any[]) => {
  const filtered = aliases?.filter((a: any) => a.name?.trim());
  return filtered?.length ? filtered.map((a: any) => ({ name: a.name })) : undefined;
};

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
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  // Vars
  const { title, activityGuid, onDirtyChange } = modalData;

  // Dirty Tracking
  const { markDirty } = useFormDirtyState(onDirtyChange);

  // State
  const [mode, setMode] = useState<"search" | "create">("search");
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

  // TanStack form for "create new" mode
  const createForm = useForm({
    defaultValues: {
      partyType: "",
      firstName: "",
      middleName: "",
      middleName2: "",
      lastName: "",
      dateOfBirth: undefined as Date | undefined,
      driversLicenseNumber: "",
      driversLicenseJurisdiction: "",
      sexCode: "",
      businessName: "",
      businessNumber: {} as any,
      worksafeBCNumber: {} as any,
      aliases: [] as any[],
      phoneNumbers: [] as any[],
      emailAddresses: [] as any[],
      contacts: [] as any[],
      partyAssociationRole: "",
    },
    onSubmit: async ({ value }) => {
      const input: any = {
        partyTypeCode: value.partyType,
        partyAssociationRole: value.partyAssociationRole,
      };

      if (value.partyType === PartyTypeCodes.PERSON) {
        input.person = {
          firstName: value.firstName,
          middleName: value.middleName?.trim() || undefined,
          middleName2: value.middleName2?.trim() || undefined,
          lastName: value.lastName,
          dateOfBirth: toDateOfBirth(value),
          driversLicenseNumber: value.driversLicenseNumber || undefined,
          driversLicenseJurisdiction: value.driversLicenseJurisdiction || undefined,
          sexCode: value.sexCode || undefined,
          contactMethods: buildLocalContactMethods(value.phoneNumbers, []),
        };
      } else {
        input.business = {
          name: value.businessName,
          contactMethods: buildLocalContactMethods(value.phoneNumbers, value.emailAddresses),
          businessIdentifiers: buildLocalBusinessIdentifiers(value.businessNumber, value.worksafeBCNumber),
          aliases: buildLocalAliases(value.aliases),
        };
      }

      if (activityType === "investigation") {
        addPartyMutation.mutate({ investigationGuid: activityGuid, input });
      } else {
        addPartyMutation.mutate({ inspectionGuid: activityGuid, input });
      }
      submit();
    },
  });

  const partyTypeValue = useStore(createForm.store, (state: any) => state.values.partyType);

  const partyTypeCodes = partyTypes
    ?.toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
    .filter((party: any) => [PartyTypeCodes.PERSON, PartyTypeCodes.BUSINESS].includes(party.value))
    .map((code: any) => ({
      value: code.value,
      label: code.label,
    }));

  const handleSearchPartyChange = (selected: Party) => {
    setPartyErrorMessage("");
    setSelectedParty(selected);
    markDirty();
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
          {/* Mode selection */}
          <div className="pb-3 d-flex">
            <Form.Check
              inline
              type="radio"
              id="mode-search"
              label="Search existing party"
              checked={mode === "search"}
              onChange={() => setMode("search")}
            />
            <Form.Check
              inline
              type="radio"
              id="mode-create"
              label="Create new party"
              checked={mode === "create"}
              onChange={() => setMode("create")}
            />
          </div>

          {mode === "search" && (
            <>
              <div
                className="comp-details-form-row pb-3"
                id="add-party-div"
              >
                <label htmlFor="createParty">Search for an existing party</label>
                <div className="comp-details-input full-width w-100">
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
                  className="comp-details-form-row pb-3"
                  id="add-party-div"
                >
                  <label htmlFor="partyRole">Party association role</label>
                  <div className="comp-details-input full-width w-100">
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
            </>
          )}
          {/* Create new party mode */}
          {mode === "create" && (
            <>
              <FormField
                form={createForm}
                name="partyType"
                label="Party Type"
                required
                validators={{ onChange: z.string().min(1, "Party type is required") }}
                render={(field) => (
                  <CompSelect
                    id="party-type-select"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={partyTypeCodes}
                    value={partyTypeCodes?.find((opt: any) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value || "")}
                    placeholder="Select party type"
                    isClearable={true}
                    showInactive={false}
                    enableValidation={true}
                    errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  />
                )}
              />

              {partyTypeValue === PartyTypeCodes.PERSON && (
                <PersonForm
                  form={createForm}
                  isDisabled={false}
                />
              )}

              {partyTypeValue === PartyTypeCodes.BUSINESS && (
                <BusinessForm
                  form={createForm}
                  isDisabled={false}
                  showContactPeople={false}
                />
              )}

              {partyTypeValue && (
                <FormField
                  form={createForm}
                  name="partyAssociationRole"
                  label="Party association role"
                  required
                  validators={{ onChange: z.string().min(1, "Party association role is required") }}
                  render={(field) => (
                    <CompSelect
                      id="party-role-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={partyRoleOptions}
                      value={partyRoleOptions?.find((opt: any) => opt.value === field.state.value)}
                      onChange={(option) => field.handleChange(option?.value || "")}
                      placeholder="Select"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />
              )}
            </>
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
            onClick={mode === "search" ? handleAddParty : () => createForm.handleSubmit()}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
