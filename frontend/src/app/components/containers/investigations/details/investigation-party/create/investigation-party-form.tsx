import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { selectPartyAssociationRoleDropdown, selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import {
  Address,
  InvestigationAttachmentReference,
  InvestigationBusinessIdentifier,
  InvestigationParty,
  InvestigationPersonFacialHairStyleCodeRef,
  Party,
  PersonFacialHairStyleCode,
} from "@/generated/graphql";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormField } from "@/app/components/common/form-field";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessFormFields } from "@/app/components/containers/parties/form/business-form";
import {
  buildAddresses,
  buildAliases,
  buildContactMethods,
  buildContactPeople,
  buildIdentifiers,
  buildPersonBase,
  createEmptyPartyFormValues,
  mapAddressesFromPartyData,
  mapAliasesFromPartyData,
  mapContactMethodsFromPartyData,
  mapPartyToInvestigationPartyInput,
  mapContactPeopleFromPartyData,
  validatePersonForm,
} from "@/app/components/containers/parties/form/party-form-utils";
import {
  handleBusinessPartyMutationError,
  scrollToFirstFieldError,
} from "@/app/components/containers/parties/form/party-form-errors";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { formatDateColumnAsDate } from "@/app/common/methods";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { PartyAttachments } from "@/app/components/containers/parties/attachments/party-attachments";
import useUnsavedChangesWarning from "@/app/hooks/use-unsaved-changes-warning";
import { Button } from "react-bootstrap";
import { InvestigationPartyHeader } from "../investigation-party-header";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { usePartyMatchTrigger } from "@/app/components/containers/parties/hooks/use-party-match-trigger";
import { PartyMatchCard } from "@/app/components/containers/parties/match/party-match-card";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { REMOVE_PARTY_FROM_INVESTIGATION_MUTATION } from "@/app/components/containers/investigations/details/investigation-parties";

const ADD_PARTY_TO_INVESTIGATION = gql`
  mutation AddPartyToInvestigation($investigationGuid: String!, $input: [CreateInvestigationPartyInput]!) {
    addPartyToInvestigation(investigationGuid: $investigationGuid, input: $input) {
      partyIdentifier
    }
  }
`;

const UPDATE_INVESTIGATION_PARTY = gql`
  mutation UpdateInvestigationParty($investigationGuid: String!, $input: UpdateInvestigationPartyInput!) {
    updateInvestigationParty(investigationGuid: $investigationGuid, input: $input) {
      investigationGuid
      parties {
        partyIdentifier
      }
    }
  }
`;

interface InvestigationPartyFormProps {
  investigationGuid: string;
  // Present in edit mode; undefined when adding a new party.
  editParty?: InvestigationParty;
  // Investigation shown in the breadcrumb
  investigationLabel?: string;
}

export const InvestigationPartyForm: FC<InvestigationPartyFormProps> = ({
  investigationGuid,
  editParty,
  investigationLabel,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditMode = !!editParty;

  const partyRoles = useAppSelector(selectPartyAssociationRoleDropdown);
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const [partyIdentifier, setPartyIdentifier] = useState<string>(editParty?.partyIdentifier ?? "");
  const [attachmentsDirty, setAttachmentsDirty] = useState(false);
  const [triggerSaveAttachments, setTriggerSaveAttachments] = useState(0);

  const [addMatchGuid, setAddMatchGuid] = useState<string>("");

  const isLinkedParty = !!editParty?.partyReference;

  const { data: matchPartyData } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", addMatchGuid],
    variables: { partyIdentifier: addMatchGuid },
    enabled: !!addMatchGuid,
  });

  const defaultValues = useMemo(() => {
    if (isEditMode && editParty) {
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
        contacts: mapContactPeopleFromPartyData(editParty.business?.contactPeople),
        partyAssociationRole: editParty.partyAssociationRole || "",
      };
    }

    return {
      ...createEmptyPartyFormValues(),
      partyAssociationRole: "",
    };
  }, [isEditMode, editParty]);

  const form = useForm({
    defaultValues,
    // fires only when a submission attempt is blocked by validation
    onSubmitInvalid: () => scrollToFirstFieldError(),
    onSubmit: async ({ value }) => {
      if (isEditMode && editParty) {
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
            contactPeople: buildContactPeople(value.contacts, true) ?? [],
          };
        }

        updatePartyMutation.mutate({ investigationGuid, input });
      } else {
        // an added person must have at least one entered field
        if (value.partyType === PartyTypeCodes.PERSON) {
          const validationError = validatePersonForm(value);
          if (validationError) {
            ToggleError(validationError);
            return;
          }
        }

        const input: any = {
          partyTypeCode: value.partyType,
          partyAssociationRole: value.partyAssociationRole,
          aliases: buildAliases(value.aliases, false),
          addresses: buildAddresses(value.addresses),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, false),
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
            contactPeople: buildContactPeople(value.contacts, false),
          };
        }

        addPartyMutation.mutate({ investigationGuid, input });
      }
    },
  });

  const navigateToParties = () => {
    allowNavigation();
    navigate(`/investigation/${investigationGuid}/parties`);
  };

  // After the create/update succeeds, flush attachments; their onSaved callback handles navigation.
  const flushAttachmentsThenNavigate = () => {
    // Work around for timing issue
    setTriggerSaveAttachments((n) => n + 1);
  };

  const addPartyMutation = useGraphQLMutation(ADD_PARTY_TO_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: (data: any) => {
      const created = data?.addPartyToInvestigation?.[0];
      if (created?.partyIdentifier) setPartyIdentifier(created.partyIdentifier);
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      handleBusinessPartyMutationError(form, error, "Failed to add party");
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: () => {
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      handleBusinessPartyMutationError(form, error, "Failed to update party");
    },
  });

  const removePartyMutation = useGraphQLMutation(REMOVE_PARTY_FROM_INVESTIGATION_MUTATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: () => {
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error removing original party after copy:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove the original party");
    },
  });

  // handles the scenario where a placeholder party is added but a suggested party is later
  // added to the investigation.   Removes the placeholder and adds the global party.
  // in the future might need merge logic to prevent data loss
  const replaceLocalPartyWithGlobalMutation = useGraphQLMutation(ADD_PARTY_TO_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: (data: any) => {
      const created = data?.addPartyToInvestigation?.[0];
      if (created?.partyIdentifier) setPartyIdentifier(created.partyIdentifier);

      if (isEditMode && editParty?.partyIdentifier) {
        removePartyMutation.mutate({ investigationGuid, partyIdentifier: editParty.partyIdentifier });
      } else {
        flushAttachmentsThenNavigate();
      }
    },
    onError: (error: any) => {
      console.error("Error copying party:", error);
      handleBusinessPartyMutationError(form, error, "Failed to add party");
    },
  });

  const isDirty =
    useStore(form.baseStore, (state) => Object.values(state.fieldMetaBase).some((field) => field?.isTouched)) ||
    attachmentsDirty;
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);

  const partyTypeCodes = partyTypes
    ?.toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
    .filter((party: any) => [PartyTypeCodes.PERSON, PartyTypeCodes.BUSINESS].includes(party.value))
    .map((code: any) => ({ value: code.value, label: code.label }));

  const partyRoleOptions = partyRoles
    ?.filter((option: any) => option.caseActivityTypeCode === "INVSTGTN")
    .toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
    .map((option: any) => ({ value: option.value, label: option.label }));

  const title = useMemo(() => {
    if (!isEditMode || !editParty) return "New Party";
    if (editParty.business?.name) return editParty.business.name;
    const name = [editParty.person?.firstName, editParty.person?.lastName].filter(Boolean).join(" ").trim();
    return name || editParty.placeholderName || "Edit party";
  }, [isEditMode, editParty]);

  const saveButtonClick = () => {
    form.handleSubmit();
  };

  const confirmCancel = () => {
    form.reset();
    navigateToParties();
  };

  const cancelButtonClick = () => {
    if (!isDirty) {
      navigateToParties();
      return;
    }
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: confirmCancel,
        },
      }),
    );
  };

  // disable saving from validation start through mutation completion
  const formSubmitting = useStore(form.store, (state: any) => state.isSubmitting) as boolean;
  const isDisabled = addPartyMutation.isPending || updatePartyMutation.isPending;
  const saveDisabled = formSubmitting || isDisabled;

  const { matches, handleFieldBlur } = usePartyMatchTrigger(form, isLinkedParty);

  const handleAddMatch = (party: Party) => {
    const partyAssociationRole = form.getFieldValue("partyAssociationRole");

    if (!partyAssociationRole) {
      form.validateField("partyAssociationRole", "change");
      return;
    }

    if (party.partyIdentifier) {
      setAddMatchGuid(party.partyIdentifier);
    }
  };

  useEffect(() => {
    if (!addMatchGuid || !matchPartyData?.party) {
      return;
    }

    const input = mapPartyToInvestigationPartyInput(matchPartyData.party, form.getFieldValue("partyAssociationRole"));

    replaceLocalPartyWithGlobalMutation.mutate({ investigationGuid, input: [input] });

    // Clear the trigger so stale query data can't re-fire the copy on a later render.
    setAddMatchGuid("");
  }, [addMatchGuid, matchPartyData, investigationGuid]);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationPartyHeader
        title={title}
        investigationGuid={investigationGuid}
        investigationLabel={investigationLabel}
        actions={
          <>
            <Button
              id="party-cancel-button"
              title={isEditMode ? "Cancel edit party" : "Cancel new party"}
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="party-save-button"
              title="Save party"
              variant="outline-light"
              onClick={saveButtonClick}
              disabled={saveDisabled}
            >
              Save changes
            </Button>
          </>
        }
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Party details</h2>
        </div>
        <FormErrorBanner form={form} />

        <div className="comp-party-form-layout">
          <form
            className="comp-party-form"
            onBlur={handleFieldBlur}
            onSubmit={(e) => {
              e.preventDefault();
              saveButtonClick();
            }}
          >
            <fieldset disabled={isDisabled}>
              <FormField
                form={form}
                name="partyAssociationRole"
                label="Investigation role"
                required
                validators={{ onChange: z.string().min(1, "Investigation role is required") }}
                render={(field) => (
                  <CompSelect
                    id="party-role-select"
                    classNamePrefix="comp-select"
                    className="comp-details-input mb-3"
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

              <hr className="comp-details-section-divider" />
              <div className="comp-details-section-header">
                <h3>Identifying information</h3>
              </div>

              <FormField
                form={form}
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
                    placeholder="Select party type"
                    isClearable={true}
                    showInactive={false}
                    enableValidation={true}
                    errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    isDisabled={isDisabled || isEditMode}
                  />
                )}
              />
              {partyTypeValue === PartyTypeCodes.PERSON && (
                <PersonForm
                  form={form}
                  isDisabled={isDisabled}
                />
              )}

              {partyTypeValue === PartyTypeCodes.BUSINESS && (
                <BusinessFormFields
                  form={form}
                  isDisabled={isDisabled}
                  showContactPeople={true}
                  showInvestigationFields={true}
                  showDisplayInInvestigation={true}
                  businessGuid={editParty?.business?.businessGuid ?? undefined}
                />
              )}
            </fieldset>

            {partyTypeValue && (
              <>
                <div className="comp-details-section-header pt-5">
                  <h3>Attachments</h3>
                </div>
                <PartyAttachments
                  partyId={partyIdentifier}
                  activityId={investigationGuid}
                  attachmentReferences={editParty?.attachmentReferences as InvestigationAttachmentReference[]}
                  attachmentType={AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT}
                  allowUpload
                  allowDelete
                  triggerSave={triggerSaveAttachments}
                  onDirtyChange={(_, dirty) => setAttachmentsDirty(dirty)}
                  onSaved={() => {
                    ToggleSuccess(isEditMode ? "Party updated successfully" : "Party added successfully");
                    navigateToParties();
                  }}
                />
              </>
            )}
          </form>
          {matches.length > 0 && (
            <div className="comp-party-match-results">
              {matches.map((match) => (
                <PartyMatchCard
                  key={match.partyIdentifier}
                  party={match}
                  onAdd={handleAddMatch}
                  isDisabled={isDisabled}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvestigationPartyForm;
