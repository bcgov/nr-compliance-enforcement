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
import { InvestigationAttachmentReference, InvestigationParty, Party } from "@/generated/graphql";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormField } from "@/app/components/common/form-field";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessFormFields } from "@/app/components/containers/parties/form/business-form";
import {
  buildAddresses,
  buildAliases,
  buildBusinessCreateUpdate,
  buildContactMethods,
  buildContactPeople,
  buildPersonBase,
  createEmptyPartyFormValues,
  mapInvestigationPartyToDefaultValues,
  mapPartyToInvestigationPartyInput,
  validatePersonForm,
} from "@/app/components/containers/parties/form/party-form-utils";
import {
  handleBusinessPartyMutationError,
  scrollToFirstFieldError,
} from "@/app/components/containers/parties/form/party-form-errors";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { isYoungPerson } from "@/app/common/methods";
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
import { getPartyName } from "@/app/common/party-name";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";

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

const REPLACE_PARTY_ON_INVESTIGATION = gql`
  mutation ReplacePartyOnInvestigation(
    $investigationGuid: String!
    $partyIdentifier: String!
    $input: CreateInvestigationPartyInput!
  ) {
    replacePartyOnInvestigation(
      investigationGuid: $investigationGuid
      partyIdentifier: $partyIdentifier
      input: $input
    ) {
      partyIdentifier
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

  // Identifying Information data
  const dob = editParty?.person?.dateOfBirth ? new Date(String(editParty?.person?.dateOfBirth)) : null;

  // Young person badge (shown in header): DOB under 19, or approximate age 18 and under.
  const personIsYoung = isYoungPerson(dob, editParty?.person?.approximateAgeCode);

  const defaultValues = useMemo(() => {
    if (isEditMode && editParty) {
      return mapInvestigationPartyToDefaultValues(editParty, { mapContacts: true });
    }
    return { ...createEmptyPartyFormValues(), partyAssociationRole: "" };
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
          input.person = { personGuid: value.personGuid, ...buildPersonBase(value) };
        } else {
          input.business = {
            ...buildBusinessCreateUpdate(value),
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
          input.person = buildPersonBase(value);
        } else {
          input.business = {
            ...buildBusinessCreateUpdate(value),
            contactPeople: buildContactPeople(value.contacts, false),
          };
        }

        addPartyMutation.mutate({ investigationGuid, input });
      }
    },
  });

  const navigateToPreviousParty = () => {
    allowNavigation();
    if (partyIdentifier) {
      navigate(`/investigation/${investigationGuid}/party/${partyIdentifier}`);
    } else {
      navigate(`/investigation/${investigationGuid}/parties`);
    }
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

  const replacePartyMutation = useGraphQLMutation(REPLACE_PARTY_ON_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: (data: any) => {
      const replacementPartyIdentifier = data?.replacePartyOnInvestigation?.partyIdentifier;
      if (replacementPartyIdentifier) setPartyIdentifier(replacementPartyIdentifier);
      flushAttachmentsThenNavigate();
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
    const name = getPartyName(editParty);
    return name || editParty.placeholderName || "Edit party";
  }, [isEditMode, editParty]);

  const saveButtonClick = () => {
    form.handleSubmit();
  };

  const confirmCancel = () => {
    form.reset();
    navigateToPreviousParty();
  };

  const cancelButtonClick = () => {
    if (!isDirty) {
      navigateToPreviousParty();
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

    if (isEditMode && editParty) {
      replacePartyMutation.mutate({
        investigationGuid,
        partyIdentifier: editParty.partyIdentifier,
        input,
      });
    } else {
      addPartyMutation.mutate({ investigationGuid, input: [input] });
    }

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
        badges={
          <PartyBadges
            isSafetyConcern={
              !!(editParty?.person?.safetyConcernIndicator || editParty?.business?.safetyConcernIndicator)
            }
            isPublished={!!editParty?.partyReference}
            isYoungPerson={personIsYoung}
          />
        }
        isEditMode={true}
        identifier={editParty?.partyIdentifier}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h3>Party details</h3>
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
              <h5 className="pb-2">
                Enter the information you know about the party. Matching profiles will be suggested as you type.
              </h5>
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
                    navigateToPreviousParty();
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
