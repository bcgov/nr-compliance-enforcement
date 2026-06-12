import { FC, memo, useMemo, useState } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { PartyListSearch } from "@/app/components/common/party-list-search";
import {
  Alias,
  Address,
  BusinessIdentifier,
  ContactMethod,
  CreateInspectionPartyInput,
  CreateInvestigationPartyInput,
  InvestigationAlias,
  InvestigationBusinessIdentifier,
  InvestigationContactMethod,
  InvestigationParty,
  Party,
  InvestigationPersonFacialHairStyleCodeRef,
  PersonFacialHairStyleCode,
} from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleSuccess } from "@/app/common/toast";
import { CompSelect } from "../../common/comp-select";
import { selectPartyAssociationRoleDropdown, selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { useForm, useStore } from "@tanstack/react-form";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { FormField } from "@/app/components/common/form-field";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessFormFields } from "@/app/components/containers/parties/form/business-form";
import {
  AddressFormValue,
  buildAddresses,
  buildContactMethods,
  buildIdentifiers,
  mapAddressesFromPartyData,
  mapContactMethodsFromPartyData,
} from "@/app/components/containers/parties/form/party-form-utils";
import { handleBusinessPartyMutationError } from "@/app/components/containers/parties/form/party-form-errors";
import z from "zod";
import { formatDateOfBirth, toDateOfBirth } from "@/app/common/methods";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";

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

const UPDATE_INVESTIGATION_PARTY_MUTATION = gql`
  mutation UpdateInvestigationParty($investigationGuid: String!, $input: UpdateInvestigationPartyInput!) {
    updateInvestigationParty(investigationGuid: $investigationGuid, input: $input) {
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

// Helper to map between global ContactMethod types and locals
const toContactMethod = (cm: InvestigationContactMethod): ContactMethod => ({
  contactMethodGuid: cm.contactMethodGuid,
  typeCode: cm.typeCode,
  value: cm.value,
  isPrimary: cm.isPrimary,
});

type AddEditPartyModalProps = {
  activityType: ActivityType;
  modalMode: "add" | "edit";
  close: () => void;
  submit: () => void;
};

export const AddEditPartyModal: FC<AddEditPartyModalProps> = ({ activityType, modalMode, close, submit }) => {
  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const partyRoles = useAppSelector(selectPartyAssociationRoleDropdown);
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  // Vars
  const { title, activityGuid, onDirtyChange } = modalData;

  // The full party object passed in for edit mode
  const editParty: InvestigationParty | undefined = modalData.party;

  // Dirty Tracking
  const { markDirty } = useFormDirtyState(onDirtyChange);

  // State
  const [mode, setMode] = useState<"search" | "create">("search");
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [selectedPartyRole, setSelectedPartyRole] = useState<string | null>();
  const [partyErrorMessage, setPartyErrorMessage] = useState<string>("");
  const [partyRoleErrorMessage, setPartyRoleErrorMessage] = useState<string>("");

  // Hooks
  const { data: fullPartyData } = useGraphQLQuery(GET_PARTY, {
    queryKey: ["party-for-add", selectedParty?.partyIdentifier],
    variables: { partyIdentifier: selectedParty?.partyIdentifier },
    enabled: !!selectedParty?.partyIdentifier,
  });

  const defaultValues = useMemo(() => {
    if (modalMode === "edit" && editParty) {
      return {
        partyType: editParty.partyTypeCode || "",
        personGuid: editParty.person?.personGuid || "",
        firstName: editParty.person?.firstName || "",
        middleNames: editParty.person?.middleNames || "",
        lastName: editParty.person?.lastName || "",
        dateOfBirth: editParty.person?.dateOfBirth
          ? formatDateOfBirth(String(editParty.person.dateOfBirth))
          : undefined,
        approximateAgeCode: editParty.person?.approximateAgeCode || "",
        driversLicenseNumber: editParty.person?.driversLicenseNumber || null,
        driversLicenseClass: editParty.person?.driversLicenseClass || null,
        driversLicenseCountryCode: editParty.person?.driversLicenseCountryCode || null,
        driversLicenseCountrySubdivisionCode: editParty.person?.driversLicenseCountrySubdivisionCode || null,
        genderCode: editParty.person?.genderCode || "",
        heightInCm: editParty.person?.heightInCm || null,
        weightInKg: editParty.person?.weightInKg || null,
        complexionCode: editParty.person?.complexionCode || "",
        buildCode: editParty.person?.buildCode || "",
        hairColourCode: editParty.person?.hairColourCode || "",
        hairLengthCode: editParty.person?.hairLengthCode || "",
        hairColourOther: editParty.person?.hairColourOther || null,
        eyeColourCode: editParty.person?.eyeColourCode || "",
        eyeColourOther: editParty.person?.eyeColourOther || null,
        facialHairIndicator: editParty.person?.facialHairIndicator || null,
        facialHairStyleCodes:
          editParty.person?.facialHairStyleCodes
            ?.filter((fhs): fhs is InvestigationPersonFacialHairStyleCodeRef => fhs != null)
            .map((fhs) => ({
              personFacialStyleHairCodeGuid: fhs?.investigationPersonFacialStyleHairCodeRefGuid,
              personGuid: fhs?.investigationPersonGuid,
              facialHairStyleCode: fhs?.facialHairStyleCodeRef,
            })) ?? [],
        additionalHairDescriptors: editParty.person?.additionalHairDescriptors || null,
        tattooIndicator: editParty.person?.tattooIndicator || null,
        tattooDescription: editParty.person?.tattooDescription || null,
        additionalDescriptors: editParty.person?.additionalDescriptors || null,
        comments: editParty.person?.comments || null,
        boloIndicator: editParty.person?.boloIndicator || null,
        businessName: editParty.business?.name || "",
        businessNumber: (() => {
          const found = editParty.business?.businessIdentifiers
            ?.filter((bi): bi is InvestigationBusinessIdentifier => bi != null)
            .find((bi) => bi.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER);
          return found
            ? { identifierGuid: found.businessIdentifierGuid, identifierValue: found.identifierValue }
            : { identifierValue: "" };
        })(),
        worksafeBCNumber: (() => {
          const found = editParty.business?.businessIdentifiers
            ?.filter((bi): bi is InvestigationBusinessIdentifier => bi != null)
            .find((bi) => bi.identifierCode === BusinessIdentifiers.WSBC_NUMBER);
          return found ? { identifierGuid: found.businessIdentifierGuid, identifierValue: found.identifierValue } : {};
        })(),
        aliases:
          editParty.aliases
            ?.filter((a): a is InvestigationAlias => a != null)
            .map((a) => ({
              aliasGuid: a.aliasGuid,
              name: a.name,
            })) || [],
        phoneNumbers: mapContactMethodsFromPartyData(
          (editParty.contactMethods ?? [])
            .filter((cm): cm is InvestigationContactMethod => cm != null)
            .map(toContactMethod),
          ContactMethods.PHONE,
        ),
        emailAddresses: mapContactMethodsFromPartyData(
          (editParty.contactMethods ?? [])
            .filter((cm): cm is InvestigationContactMethod => cm != null)
            .map(toContactMethod),
          ContactMethods.EMAIL,
        ),
        addresses: mapAddressesFromPartyData(editParty.addresses as Address[]),
        contacts: [] as any[],
        partyAssociationRole: editParty.partyAssociationRole || "",
      };
    }

    return {
      partyType: "",
      personGuid: "",
      firstName: "",
      middleNames: "",
      lastName: "",
      dateOfBirth: undefined as Date | undefined,
      approximateAgeCode: "",
      driversLicenseNumber: "",
      driversLicenseClass: "",
      driversLicenseCountryCode: "",
      driversLicenseCountrySubdivisionCode: "",
      genderCode: "",
      heightInCm: null,
      weightInKg: null,
      complexionCode: "",
      buildCode: "",
      hairColourCode: "",
      hairLengthCode: "",
      hairColourOther: "",
      eyeColourCode: "",
      eyeColourOther: "",
      facialHairIndicator: "",
      facialHairStyleCodes: [] as PersonFacialHairStyleCode[],
      additionalHairDescriptors: "",
      boloIndicator: "",
      comments: "",
      tattooIndicator: "",
      tattooDescription: "",
      additionalDescriptors: "",
      businessName: "",
      businessNumber: {},
      worksafeBCNumber: {},
      aliases: [] as Alias[],
      phoneNumbers: [] as ContactMethod[],
      emailAddresses: [] as ContactMethod[],
      addresses: [] as AddressFormValue[],
      contacts: [] as any[],
      partyAssociationRole: "",
    };
  }, [modalMode, editParty]);

  // TanStack form for "create new" and "edit" mode
  const partyForm = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (modalMode === "edit" && editParty) {
        // Update mutation
        const input: any = {
          partyIdentifier: editParty.partyIdentifier,
          partyAssociationRole: value.partyAssociationRole,
          aliases: value.aliases?.map((a: Alias) => ({ aliasGuid: a.aliasGuid, name: a.name })) || [],
          addresses: buildAddresses(value.addresses, true),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
        };

        if (value.partyType === PartyTypeCodes.PERSON) {
          input.person = {
            personGuid: value.personGuid,
            firstName: value.firstName,
            middleNames: value.middleNames?.trim() || undefined,
            lastName: value.lastName,
            dateOfBirth: toDateOfBirth(value),
            approximateAgeCode: value.approximateAgeCode || null,
            driversLicenseNumber: value.driversLicenseNumber || null,
            driversLicenseClass: value.driversLicenseClass || null,
            driversLicenseCountryCode: value.driversLicenseCountryCode || null,
            driversLicenseCountrySubdivisionCode: value.driversLicenseCountrySubdivisionCode || null,
            genderCode: value.genderCode || null,
            heightInCm: value.heightInCm || null,
            weightInKg: value.weightInKg || null,
            complexionCode: value.complexionCode || null,
            buildCode: value.buildCode || null,
            hairColourCode: value.hairColourCode || null,
            hairLengthCode: value.hairLengthCode || null,
            hairColourOther: value.hairColourOther || null,
            eyeColourCode: value.eyeColourCode || null,
            eyeColourOther: value.eyeColourOther || null,
            facialHairIndicator: value.facialHairIndicator || null,
            facialHairStyleCodes:
              value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
                investigationPersonFacialStyleHairCodeRefGuid: fhs.personFacialStyleHairCodeGuid,
                investigationPersonGuid: fhs.personGuid,
                facialHairStyleCodeRef: fhs.facialHairStyleCode,
              })) || [],
            additionalHairDescriptors: value.additionalHairDescriptors || null,
            comments: value.comments || null,
            tattooIndicator: value.tattooIndicator || null,
            tattooDescription: value.tattooDescription || null,
            additionalDescriptors: value.additionalDescriptors || null,
            boloIndicator: value.boloIndicator || null,
          };
        } else {
          input.business = {
            name: value.businessName,
            businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
          };
        }

        updatePartyMutation.mutate({ investigationGuid: activityGuid, input });
      } else {
        // Create mutation
        const input: any = {
          partyTypeCode: value.partyType,
          partyAssociationRole: value.partyAssociationRole,
          aliases: value.aliases?.map((a: Alias) => ({ aliasGuid: a.aliasGuid, name: a.name })) || [],
          addresses: buildAddresses(value.addresses, false),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
        };

        if (value.partyType === PartyTypeCodes.PERSON) {
          input.person = {
            firstName: value.firstName,
            middleNames: value.middleNames?.trim() || undefined,
            lastName: value.lastName,
            dateOfBirth: toDateOfBirth(value),
            approximateAgeCode: value.approximateAgeCode || null,
            driversLicenseNumber: value.driversLicenseNumber || null,
            driversLicenseClass: value.driversLicenseClass || null,
            driversLicenseCountryCode: value.driversLicenseCountryCode || null,
            driversLicenseCountrySubdivisionCode: value.driversLicenseCountrySubdivisionCode || null,
            genderCode: value.genderCode || null,
            heightInCm: value.heightInCm || null,
            weightInKg: value.weightInKg || null,
            complexionCode: value.complexionCode || null,
            buildCode: value.buildCode || null,
            hairColourCode: value.hairColourCode || null,
            hairLengthCode: value.hairLengthCode || null,
            hairColourOther: value.hairColourOther || null,
            eyeColourCode: value.eyeColourCode || null,
            eyeColourOther: value.eyeColourOther || null,
            facialHairIndicator: value.facialHairIndicator || null,
            facialHairStyleCodes:
              value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
                investigationPersonFacialStyleHairCodeRefGuid: fhs.personFacialStyleHairCodeGuid,
                investigationPersonGuid: fhs.personGuid,
                facialHairStyleCodeRef: fhs.facialHairStyleCode,
              })) || [],
            additionalHairDescriptors: value.additionalHairDescriptors || null,
            comments: value.comments || null,
            tattooIndicator: value.tattooIndicator || null,
            tattooDescription: value.tattooDescription || null,
            additionalDescriptors: value.additionalDescriptors || null,
            boloIndicator: value.boloIndicator || null,
          };
        } else {
          input.business = {
            name: value.businessName,
            businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
          };
        }

        if (activityType === "investigation") {
          addPartyMutation.mutate({ investigationGuid: activityGuid, input });
        } else {
          addPartyMutation.mutate({ inspectionGuid: activityGuid, input });
        }
      }
    },
  });

  const ADD_PARTY_MUTATION = createAddPartyMutation(activityType);
  const addPartyMutation = useGraphQLMutation(ADD_PARTY_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party added successfully");
      submit();
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      handleBusinessPartyMutationError(partyForm, error, "Failed to add party");
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party updated successfully");
      submit();
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      handleBusinessPartyMutationError(partyForm, error, "Failed to update party");
    },
  });

  const partyTypeValue = useStore(partyForm.store, (state: any) => state.values.partyType);

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

    const party = fullPartyData?.party ?? selectedParty;

    const addPartyInput = {
      partyTypeCode: party.partyTypeCode || "",
      partyReference: party.partyIdentifier,
      aliases: party.aliases
        ?.filter((a: Alias): a is Alias => a != null)
        .map((a: Alias) => ({
          name: a.name,
        })),
      contactMethods: party.contactMethods
        ?.filter((cm: ContactMethod): cm is ContactMethod => cm != null)
        .map((cm: ContactMethod) => ({
          typeCode: cm.typeCode,
          value: cm.value,
          isPrimary: cm.isPrimary ?? false,
        })),
      addresses: party.addresses
        ?.filter((address: Address | null): address is Address => address != null)
        .map((address: Address) => ({
          addressName: address.addressName ?? "",
          address: address.address ?? null,
          city: address.city ?? null,
          province: address.province ?? null,
          postalCode: address.postalCode ?? null,
          country: address.country ?? null,
          isPrimary: address.isPrimary ?? false,
        })),
      ...(party.person?.lastName && {
        person: {
          firstName: party.person?.firstName || "",
          lastName: party.person?.lastName || "",
          middleNames: party.person?.middleName,
          personReference: party.person?.personGuid || "",
          dateOfBirth: party.person?.dateOfBirth,
          approximateAgeCode: party.person?.approximateAgeCode || null,
          driversLicenseNumber: party.person?.driversLicenseNumber || null,
          driversLicenseClass: party.person?.driversLicenseClass || null,
          driversLicenseCountryCode: party.person?.driversLicenseCountryCode || null,
          driversLicenseCountrySubdivisionCode: party.person?.driversLicenseCountrySubdivisionCode || null,
          genderCode: party.person?.genderCode || null,
          heightInCm: party.person?.heightInCm || null,
          weightInKg: party.person?.weightInKg || null,
          complexionCode: party.person?.complexionCode || null,
          buildCode: party.person?.buildCode || null,
          hairColourCode: party.person?.hairColourCode || null,
          hairLengthCode: party.person?.hairLengthCode || null,
          hairColourOther: party.person?.hairColourOther || null,
          eyeColourCode: party.person?.eyeColourCode || null,
          eyeColourOther: party.person?.eyeColourOther || null,
          facialHairIndicator: party.person?.facialHairIndicator || null,
          facialHairStyleCodes:
            party.person?.facialHairStyleCodes?.map((fhs: InvestigationPersonFacialHairStyleCodeRef) => ({
              investigationPersonFacialStyleHairCodeRefGuid: fhs.investigationPersonFacialStyleHairCodeRefGuid,
              investigationPersonGuid: fhs.investigationPersonGuid,
              facialHairStyleCodeRef: fhs.facialHairStyleCodeRef,
            })) || [],
          additionalHairDescriptors: party.person?.additionalHairDescriptors || null,
          comments: party.person?.comments || null,
          tattooIndicator: party.person?.tattooIndicator || null,
          tattooDescription: party.person?.tattooDescription || null,
          additionalDescriptors: party.person?.additionalDescriptors || null,
          boloIndicator: party.person?.boloIndicator || null,
        },
      }),
      ...(party.business?.name && {
        business: {
          name: party.business.name,
          businessReference: party.business.businessGuid,
          businessIdentifiers: party.business?.identifiers
            ?.filter((bi: BusinessIdentifier): bi is BusinessIdentifier => bi != null)
            .map((bi: BusinessIdentifier) => ({
              identifierCode: bi.identifierCode,
              identifierValue: bi.identifierValue,
            })),
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
          {/* Mode selection - only shown in add mode */}
          {modalMode === "add" && activityType === "investigation" && (
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
          )}

          {/* Search existing party mode - only available in add mode */}
          {modalMode === "add" && mode === "search" && (
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

          {/* Create new party / Edit party form */}
          {(modalMode === "edit" || (modalMode === "add" && mode === "create")) && (
            <>
              <FormField
                form={partyForm}
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
                    isDisabled={modalMode === "edit"}
                  />
                )}
              />

              {partyTypeValue === PartyTypeCodes.PERSON && (
                <PersonForm
                  form={partyForm}
                  isDisabled={false}
                />
              )}

              {partyTypeValue === PartyTypeCodes.BUSINESS && (
                <BusinessFormFields
                  form={partyForm}
                  isDisabled={false}
                  showContactPeople={false}
                />
              )}

              {partyTypeValue && (
                <FormField
                  form={partyForm}
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
            title="Cancel"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-party-save-button"
            title="Save"
            onClick={modalMode === "add" && mode === "search" ? handleAddParty : () => partyForm.handleSubmit()}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
