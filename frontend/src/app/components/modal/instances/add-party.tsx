import { FC, memo, useEffect, useMemo, useState } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { PartyListSearch } from "@/app/components/common/party-list-search";
import {
  Alias,
  Address,
  BusinessIdentifier,
  ContactMethod,
  CreateInspectionPartyInput,
  CreateInvestigationPartyInput,
  InvestigationBusinessIdentifier,
  InvestigationParty,
  Party,
  InvestigationPersonFacialHairStyleCodeRef,
  PersonFacialHairStyleCode,
  InvestigationAttachmentReference,
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
  buildAddresses,
  buildAliases,
  buildContactMethods,
  buildIdentifiers,
  buildPersonBase,
  createEmptyPartyFormValues,
  mapAddressesFromPartyData,
  mapAliasesFromPartyData,
  mapContactMethodsFromPartyData,
} from "@/app/components/containers/parties/form/party-form-utils";
import { handleBusinessPartyMutationError } from "@/app/components/containers/parties/form/party-form-errors";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { formatDateColumnAsDate } from "@/app/common/methods";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";
import { getAttachments, getLatestObjectVersion } from "@/app/store/reducers/attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { PartyAttachments } from "@/app/components/containers/parties/attachments/party-attachments";

type ActivityType = "investigation" | "inspection";

const createAddPartyMutation = (activityType: ActivityType) => {
  if (activityType === "investigation") {
    return gql`
      mutation AddPartyToInvestigation($investigationGuid: String!, $input: [CreateInvestigationPartyInput]!) {
        addPartyToInvestigation(investigationGuid: $investigationGuid, input: $input) {
          partyIdentifier
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

type AddEditPartyModalProps = {
  activityType: ActivityType;
  modalMode: "add" | "edit";
  close: () => void;
  submit: () => void;
};

export const AddEditPartyModal: FC<AddEditPartyModalProps> = ({ activityType, modalMode, close, submit }) => {
  const dispatch = useAppDispatch();

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
  const { markDirty, handleChildDirtyChange } = useFormDirtyState(onDirtyChange);

  // State
  const [mode, setMode] = useState<"search" | "create">("search");
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [selectedPartyRole, setSelectedPartyRole] = useState<string | null>();
  const [partyErrorMessage, setPartyErrorMessage] = useState<string>("");
  const [partyRoleErrorMessage, setPartyRoleErrorMessage] = useState<string>("");
  const [triggerSaveAttachments, setTriggerSaveAttachments] = useState(0);
  const [pendingAttachmentsSaveAfterCreate, setPendingAttachmentsSaveAfterCreate] = useState(false);
  const [partyIdentifier, setPartyIdentifier] = useState<string>(editParty?.partyIdentifier ?? "");

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
          ? formatDateColumnAsDate(String(editParty.person.dateOfBirth))
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
              personFacialStyleHairCodeGuid: fhs?.personFacialStyleHairCodeGuid,
              personGuid: fhs?.personGuid,
              facialHairStyleCode: fhs?.facialHairStyleCode,
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
        aliases: mapAliasesFromPartyData(editParty.aliases),
        phoneNumbers: mapContactMethodsFromPartyData(editParty.contactMethods, ContactMethods.PHONE),
        emailAddresses: mapContactMethodsFromPartyData(editParty.contactMethods, ContactMethods.EMAIL),
        addresses: mapAddressesFromPartyData(editParty.addresses as Address[]),
        contacts: [] as any[],
        partyAssociationRole: editParty.partyAssociationRole || "",
      };
    }

    return {
      ...createEmptyPartyFormValues(),
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
          aliases: buildAliases(value.aliases, true),
          addresses: buildAddresses(value.addresses),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
        };

        if (value.partyType === PartyTypeCodes.PERSON) {
          input.person = {
            personGuid: value.personGuid,
            ...buildPersonBase(value),
            facialHairStyleCodes:
              value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
                personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
                personGuid: fhs.personGuid,
                facialHairStyleCode: fhs.facialHairStyleCode,
              })) || [],
          };
        } else {
          input.business = {
            name: value.businessName?.trim(),
            businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
          };
        }

        updatePartyMutation.mutate({ investigationGuid: activityGuid, input });
      } else {
        // Create mutation
        const input: any = {
          partyTypeCode: value.partyType,
          partyAssociationRole: value.partyAssociationRole,
          aliases: buildAliases(value.aliases, false),
          addresses: buildAddresses(value.addresses),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
        };

        if (value.partyType === PartyTypeCodes.PERSON) {
          input.person = {
            ...buildPersonBase(value),
            facialHairStyleCodes:
              value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
                personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
                personGuid: fhs.personGuid,
                facialHairStyleCode: fhs.facialHairStyleCode,
              })) || [],
          };
        } else {
          input.business = {
            name: value.businessName?.trim(),
            businessIdentifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber),
          };
        }
        if (activityType === "investigation") {
          addPartyMutation.mutate({ investigationGuid: activityGuid, input });
        } else {
          const {
            aliases: _aliases,
            addresses: _addresses,
            contactMethods: _contactMethods,
            ...inspectionInput
          } = input;
          addPartyMutation.mutate({ inspectionGuid: activityGuid, input: inspectionInput });
        }
      }
    },
  });

  const isFormDirty = useStore(partyForm.store, (state: any) => state.isDirty);
  useEffect(() => {
    handleChildDirtyChange(1, isFormDirty);
  }, [isFormDirty]);

  const ADD_PARTY_MUTATION = createAddPartyMutation(activityType);
  const addPartyMutation = useGraphQLMutation(ADD_PARTY_MUTATION, {
    onSuccess: (data: any) => {
      const createdParty = data?.addPartyToInvestigation?.[0];
      if (createdParty?.partyIdentifier) {
        setPartyIdentifier(createdParty.partyIdentifier);
      }

      if (pendingAttachmentsSaveAfterCreate) {
        setPendingAttachmentsSaveAfterCreate(false);
        setTriggerSaveAttachments((n) => n + 1);
      } else {
        ToggleSuccess("Party added successfully");
        submit();
      }
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      handleBusinessPartyMutationError(partyForm, error, "Failed to add party");
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY_MUTATION, {
    onSuccess: () => {
      if (pendingAttachmentsSaveAfterCreate) {
        setPendingAttachmentsSaveAfterCreate(false);
        setTriggerSaveAttachments((n) => n + 1);
      } else {
        ToggleSuccess("Party updated successfully");
        submit();
      }
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

  const saveButtonClick = () => {
    setPendingAttachmentsSaveAfterCreate(true);
    partyForm.handleSubmit();
  };

  const resolveThumbnailPin = async (
    dispatch: ReturnType<typeof useAppDispatch>,
    imageIconId: string | undefined,
  ): Promise<{ thumbObjectId: string | undefined; thumbVersion: string | undefined }> => {
    // Pin the thumbnail alongside it, when the image has one
    if (imageIconId === undefined) {
      return { thumbObjectId: undefined, thumbVersion: undefined };
    }

    const thumb = await dispatch(getLatestObjectVersion(imageIconId));
    if (thumb === undefined) {
      return { thumbObjectId: undefined, thumbVersion: undefined };
    }

    return { thumbObjectId: imageIconId, thumbVersion: thumb.s3VersionId };
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

    // Get all the attachments associated with the party
    const attachments = await dispatch(
      getAttachments(party.partyIdentifier, undefined, AttachmentEnum.PARTY_ATTACHMENT, true),
    );

    const versionLinks: InvestigationAttachmentReference[] = [];

    for (const attachment of attachments) {
      if (attachment.id === undefined) {
        continue;
      }

      // Pin the image version
      const version = await dispatch(getLatestObjectVersion(attachment.id));
      if (version === undefined) {
        continue;
      }

      // Pin the thumbnail alongside it, when the image has one
      const { thumbObjectId, thumbVersion } = await resolveThumbnailPin(dispatch, attachment.imageIconId);

      versionLinks.push({
        objectId: attachment.id,
        version: version.s3VersionId,
        fileName: attachment.name,
        createdAt: attachment.createdAt,
        thumbObjectId,
        thumbVersion,
        activeInd: true,
      });
    }

    // new guids for the copied addresses so the same party can be added more than once
    const newAddressGuidByAddressReference = new Map<string, string>();
    for (const address of party.addresses ?? []) {
      if (address?.addressGuid) newAddressGuidByAddressReference.set(address.addressGuid, uuidv4());
    }

    const addPartyInput = {
      partyTypeCode: party.partyTypeCode || "",
      partyReference: party.partyIdentifier,
      attachmentReferences: versionLinks
        ?.filter((av: InvestigationAttachmentReference): av is InvestigationAttachmentReference => av != null)
        .map((av: InvestigationAttachmentReference) => ({
          objectId: av.objectId,
          version: av.version,
          fileName: av.fileName,
          createdAt: av.createdAt,
          thumbObjectId: av.thumbObjectId,
          thumbVersion: av.thumbVersion,
        })),
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
          displayInInvestigation: address.displayInInvestigation ?? true,
          addressGuid: newAddressGuidByAddressReference.get(address.addressGuid ?? ""),
          contactMethods: address.contactMethods
            ?.filter((cm): cm is ContactMethod => cm != null)
            .map((cm: ContactMethod) => ({
              typeCode: cm.typeCode,
              value: cm.value,
              isPrimary: cm.isPrimary ?? false,
            })),
        })),
      ...(party.person?.lastName && {
        person: {
          ...buildPersonBase(party.person),
          personReference: party.person?.personGuid || "",
          facialHairStyleCodes:
            party.person?.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
              personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
              personGuid: fhs.personGuid,
              facialHairStyleCode: fhs.facialHairStyleCode,
            })) || [],
        },
      }),
      ...(party.business?.name && {
        business: {
          name: party.business.name,
          businessReference: party.business.businessGuid,
          businessIdentifiers: party.business?.businessIdentifiers
            ?.filter((bi: BusinessIdentifier): bi is BusinessIdentifier => bi != null)
            .map((bi: BusinessIdentifier) => ({
              identifierCode: bi.identifierCode,
              identifierValue: bi.identifierValue,
            })),
          contactPeople: party.business?.contactPeople
            ?.filter((cp: any) => cp?.person != null)
            .map((cp: any) => ({
              person: {
                personReference: cp.person.personGuid || "",
                firstName: cp.person.firstName ?? null,
                lastName: cp.person.lastName ?? null,
              },
              title: cp.title ?? null,
              displayInInvestigation: cp.displayInInvestigation ?? true,
              isPrimary: cp.isPrimary ?? false,
              contactMethods: cp.contactMethods
                ?.filter((cm: ContactMethod | null): cm is ContactMethod => cm != null)
                .map((cm: ContactMethod) => ({
                  typeCode: cm.typeCode,
                  value: cm.value,
                  isPrimary: cm.isPrimary ?? false,
                })),
              // map office address references to the new guids created for the copied addresses above
              officeAddressGuids: cp.associatedAddresses
                ?.map((aa: any) => newAddressGuidByAddressReference.get(aa?.address?.addressGuid ?? ""))
                .filter((guid: string | undefined): guid is string => !!guid),
            })),
        },
      }),
      partyAssociationRole: selectedPartyRole,
    };

    setPendingAttachmentsSaveAfterCreate(false);

    // Backend expects the named ids
    if (activityType === "investigation") {
      addPartyMutation.mutate({
        investigationGuid: activityGuid,
        input: addPartyInput as CreateInvestigationPartyInput,
      });
    } else {
      addPartyMutation.mutate({ inspectionGuid: activityGuid, input: addPartyInput as CreateInspectionPartyInput });
    }
  };

  const partyRoleOptions = partyRoles
    ?.toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
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
                label="Known"
                checked={mode === "search"}
                onChange={() => setMode("search")}
              />
              <Form.Check
                inline
                type="radio"
                id="mode-create"
                label="Unknown"
                checked={mode === "create"}
                onChange={() => {
                  // unknown parties are created on the full party form
                  if (modalData.onSelectUnknown) {
                    close();
                    modalData.onSelectUnknown();
                    return;
                  }
                  markDirty();
                  setMode("create");
                }}
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
                label="Type"
                required
                validators={{ onChange: z.string().min(1, "Party type is required") }}
                render={(field) => (
                  <CompSelect
                    id="party-type-select"
                    classNamePrefix="comp-select"
                    className="comp-details-input mb-3"
                    options={partyTypeCodes}
                    value={partyTypeCodes?.find((opt: any) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value || "")}
                    placeholder="Select type"
                    isClearable={true}
                    showInactive={false}
                    enableValidation={true}
                    errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    isDisabled={modalMode === "edit"}
                  />
                )}
              />

              {partyTypeValue && (
                <PartyAttachments
                  partyId={partyIdentifier}
                  activityId={activityGuid}
                  attachmentReferences={editParty?.attachmentReferences as InvestigationAttachmentReference[]}
                  attachmentType={AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT}
                  allowUpload
                  allowDelete
                  triggerSave={triggerSaveAttachments}
                  onDirtyChange={(_, isDirty) => handleChildDirtyChange(0, isDirty)}
                  onSaved={() => {
                    ToggleSuccess(modalMode === "add" ? "Party added successfully" : "Party updated successfully");
                    submit();
                  }}
                />
              )}

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
            onClick={() => {
              if (modalMode === "add" && mode === "search") {
                handleAddParty();
              } else {
                saveButtonClick();
              }
            }}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
