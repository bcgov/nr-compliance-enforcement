import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM, SAVE_CONFIRM } from "@apptypes/modal/modal-types";
import { selectPartyAssociationRoleDropdown, selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { ImageUpdateInput, InvestigationAttachmentReference, InvestigationParty, Party } from "@/generated/graphql";
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
import { Alert, Button, Spinner } from "react-bootstrap";
import { InvestigationPartyHeader } from "../investigation-party-header";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { usePartyMatchTrigger } from "@/app/components/containers/parties/hooks/use-party-match-trigger";
import { PartyMatchCard } from "@/app/components/containers/parties/match/party-match-card";
import { getPartyName } from "@/app/common/party-name";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";
import { buildSharedPartyAttachmentReferences } from "@/app/common/attachment-upload-helper";

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

export const ADD_PARTY_TO_INVESTIGATION_FROM_SHARED_PARTY = gql`
  mutation AddPartyToInvestigationFromSharedParty(
    $investigationGuid: String!
    $partyReference: String!
    $partyAssociationRole: String!
    $attachmentReferences: [CreateAttachmentReferenceInput]
  ) {
    addPartyToInvestigationFromSharedParty(
      investigationGuid: $investigationGuid
      partyReference: $partyReference
      partyAssociationRole: $partyAssociationRole
      attachmentReferences: $attachmentReferences
    ) {
      partyIdentifier
    }
  }
`;

const REPLACE_PARTY_ON_INVESTIGATION_FROM_SHARED_PARTY = gql`
  mutation ReplacePartyOnInvestigationFromSharedParty(
    $investigationGuid: String!
    $partyIdentifier: String!
    $partyReference: String!
    $partyAssociationRole: String!
    $attachmentReferences: [CreateAttachmentReferenceInput]
  ) {
    replacePartyOnInvestigationFromSharedParty(
      investigationGuid: $investigationGuid
      partyIdentifier: $partyIdentifier
      partyReference: $partyReference
      partyAssociationRole: $partyAssociationRole
      attachmentReferences: $attachmentReferences
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
  // Shared party guids already linked to this investigation
  linkedPartyReferences?: string[];
}

export const InvestigationPartyForm: FC<InvestigationPartyFormProps> = ({
  investigationGuid,
  editParty,
  investigationLabel,
  linkedPartyReferences = [],
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

  const copyInFlightRef = useRef(false);
  const [copyPending, setCopyPending] = useState(false);
  const [attachmentsSaving, setAttachmentsSaving] = useState(false);

  const isLinkedParty = !!editParty?.partyReference;

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

  const pendingImagesRef = useRef<ImageUpdateInput[]>([]);

  const handlePendingImagesChange = useCallback((images: ImageUpdateInput[]) => {
    pendingImagesRef.current = images;
  }, []);

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
          images: pendingImagesRef.current,
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
    setAttachmentsSaving(true);
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
      copyInFlightRef.current = false;
      setCopyPending(false);
      handleBusinessPartyMutationError(form, error, "Failed to add party");
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY, {
    invalidateQueries: [
      ["getInvestigation", investigationGuid],
      ["party", editParty?.partyReference],
      ["searchPartyEvents", editParty?.partyReference],
      ["searchParties"],
    ],
    onSuccess: () => {
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
      handleBusinessPartyMutationError(form, error, "Failed to update party");
    },
  });

  const addPartyFromSharedPartyMutation = useGraphQLMutation(ADD_PARTY_TO_INVESTIGATION_FROM_SHARED_PARTY, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: (data: any) => {
      const created = data?.addPartyToInvestigationFromSharedParty;
      if (created?.partyIdentifier) setPartyIdentifier(created.partyIdentifier);
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error copying party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
      handleBusinessPartyMutationError(form, error, "Failed to add party");
    },
  });

  const replacePartyFromSharedPartyMutation = useGraphQLMutation(REPLACE_PARTY_ON_INVESTIGATION_FROM_SHARED_PARTY, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: (data: any) => {
      const replacementPartyIdentifier = data?.replacePartyOnInvestigationFromSharedParty?.partyIdentifier;
      if (replacementPartyIdentifier) setPartyIdentifier(replacementPartyIdentifier);
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error copying party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
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
    .filter((party: any) => [PartyTypeCodes.PERSON, PartyTypeCodes.ORGANIZATION].includes(party.value))
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
    if (isEditMode && isLinkedParty) {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: SAVE_CONFIRM,
          data: {
            title: "Save party",
            description:
              "Saving this party will update its details for all NatSuite users and will be available for use in future investigations.",
            cancelText: "Cancel",
            saveText: "Save and close",
          },
          callback: () => {
            form.handleSubmit();
          },
        }),
      );
      return;
    }
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
  const isDisabled = addPartyMutation.isPending || updatePartyMutation.isPending || copyPending || attachmentsSaving;
  const saveDisabled = formSubmitting || isDisabled;

  const {
    matches: allMatches,
    isFetching: matchFetching,
    hasSearched: matchSearched,
    error: matchError,
    handleFieldBlur,
  } = usePartyMatchTrigger(form, isLinkedParty);

  // A party already linked to this investigation is not a useful suggestion
  const matches = allMatches.filter((match) => !linkedPartyReferences.includes(match.party.partyIdentifier ?? ""));

  // Pulse every card except one showing the same party at the same position as the previous set
  const matchGuids = matches.map((match) => match.party.partyIdentifier ?? "").join(",");
  const prevMatchGuidsRef = useRef("");
  const [pulseGuids, setPulseGuids] = useState(new Set<string>());

  useEffect(() => {
    const previous = prevMatchGuidsRef.current.split(",");
    prevMatchGuidsRef.current = matchGuids;
    setPulseGuids(new Set(matchGuids.split(",").filter((guid, index) => guid && guid !== previous[index])));
    // Clear once the animation is done
    const timer = setTimeout(() => setPulseGuids(new Set()), 2000);
    return () => clearTimeout(timer);
  }, [matchGuids]);

  const [matchPaneStyle, setMatchPaneStyle] = useState<{ top: number; maxHeight: number }>();

  useEffect(() => {
    const layout = document.querySelector<HTMLElement>(".comp-party-form-layout");
    const scroller = document.querySelector<HTMLElement>(".comp-main-content");
    if (!layout || !scroller) return;

    const measure = () => {
      const layoutTop = layout.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      const overflows = scroller.scrollHeight > scroller.clientHeight;
      const below = overflows ? Math.max(0, scroller.scrollHeight - layoutTop - layout.offsetHeight) : 24;
      const next = { top: layoutTop, maxHeight: scroller.clientHeight - layoutTop - below };
      setMatchPaneStyle((prev) => (prev?.top === next.top && prev?.maxHeight === next.maxHeight ? prev : next));
    };

    measure();
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(layout);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const [showMatchRules, setShowMatchRules] = useState(false);

  // The pane scrolls its own results using overlay buttons page down and back up
  const matchScrollRef = useRef<HTMLDivElement>(null);
  const [matchScroll, setMatchScroll] = useState({ up: false, down: false });

  const updateMatchScroll = () => {
    const el = matchScrollRef.current;
    if (!el) return;
    const up = el.scrollTop > 0;
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setMatchScroll((prev) => (prev.up === up && prev.down === down ? prev : { up, down }));
  };

  useEffect(() => {
    updateMatchScroll();
    const content = matchScrollRef.current?.firstElementChild;
    if (!content) return;
    const observer = new ResizeObserver(updateMatchScroll);
    observer.observe(content);
    return () => observer.disconnect();
  }, [matchGuids, matchError, matchFetching, matchPaneStyle]);

  // A changed result set reads from the top
  useEffect(() => {
    matchScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [matchGuids]);

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
    if (!addMatchGuid || copyInFlightRef.current) {
      return;
    }

    const sharedPartyGuid = addMatchGuid;

    // Potential long stuff happening... disable the form
    copyInFlightRef.current = true;
    setCopyPending(true);

    // Clear the trigger so it can't re-fire the copy on a later render.
    setAddMatchGuid("");

    const copyParty = async () => {
      const attachmentReferences = await buildSharedPartyAttachmentReferences({
        dispatch,
        sharedPartyGuid,
      });

      if (isEditMode && editParty) {
        replacePartyFromSharedPartyMutation.mutate({
          investigationGuid,
          partyIdentifier: editParty.partyIdentifier,
          partyReference: sharedPartyGuid,
          partyAssociationRole: form.getFieldValue("partyAssociationRole"),
          attachmentReferences,
        });
      } else {
        addPartyFromSharedPartyMutation.mutate({
          investigationGuid,
          partyReference: sharedPartyGuid,
          partyAssociationRole: form.getFieldValue("partyAssociationRole"),
          attachmentReferences,
        });
      }
    };

    void copyParty().catch((error) => {
      console.error("Error copying party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
    });
  }, [addMatchGuid, investigationGuid]);

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
        <div className="comp-party-form-layout">
          <form
            className="comp-party-form"
            onBlur={handleFieldBlur}
            onSubmit={(e) => {
              e.preventDefault();
              saveButtonClick();
            }}
          >
            <div className="comp-details-section-header">
              <h3>Party details</h3>
            </div>
            <FormErrorBanner form={form} />
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

              {partyTypeValue === PartyTypeCodes.ORGANIZATION && (
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
                  sharedPartyId={editParty?.partyReference ?? undefined}
                  activityId={investigationGuid}
                  attachmentReferences={editParty?.attachmentReferences as InvestigationAttachmentReference[]}
                  attachmentType={AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT}
                  onPendingImagesChange={handlePendingImagesChange}
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
          {(matchError || matchFetching || matchSearched) && (
            <div
              className="comp-party-match-results"
              style={matchPaneStyle && { top: matchPaneStyle.top }}
            >
              {matchError ? (
                <Alert
                  className="comp-complaint-details-alert"
                  variant="warning"
                >
                  <i className="bi bi-info-circle-fill me-3"></i>
                  <span>Matching profiles are unavailable right now.</span>
                </Alert>
              ) : (
                <>
                  <div
                    className="comp-party-match-results-scroll"
                    ref={matchScrollRef}
                    onScroll={updateMatchScroll}
                    style={matchPaneStyle && { maxHeight: matchPaneStyle.maxHeight }}
                  >
                    <div>
                      <Alert
                        className="comp-complaint-details-alert"
                        variant="info"
                      >
                        <div className="d-flex align-items-center">
                          {matchFetching ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-3"
                              />
                              <span>Looking for matching published profiles...</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-info-circle-fill me-3"></i>
                              <span>
                                {matches.length
                                  ? "Potentially matching published profiles found."
                                  : "No matching published profiles found."}
                              </span>
                            </>
                          )}
                        </div>
                        <Button
                          variant="link"
                          className="d-block p-0"
                          aria-expanded={showMatchRules}
                          onClick={() => setShowMatchRules((show) => !show)}
                        >
                          <i className={`bi bi-chevron-${showMatchRules ? "down" : "right"} me-1`} />
                          <span>See matching rules</span>
                        </Button>
                        {showMatchRules && (
                          <div className="comp-party-match-rules">
                            <span>Identifier (licence, business number, WorkSafeBC, contact phone/email)</span>
                            <span>1000</span>
                            <span>Name, date of birth, phone, email, address, city</span>
                            <span>50</span>
                            <span>Descriptor (sex, age range, height, hair...)</span>
                            <span>10</span>
                            <span>Similar (typo, sound-alike, short form, close birthdate)</span>
                            <span>&times; 0.5</span>
                            <span>Cross-field (alias, first as middle, similar legal name)</span>
                            <span>&times; 0.25</span>
                            <span>First + last name bonus</span>
                            <span>+100</span>
                            <span>Name + date of birth bonus</span>
                            <span>+850</span>
                            <span>Shown / likely match / strong match</span>
                            <span>&ge; 50 / 250 / 850</span>
                          </div>
                        )}
                      </Alert>
                      <div
                        className={`comp-party-match-cards${matchFetching ? " comp-party-match-cards-fetching" : ""}`}
                      >
                        {matches.map((match) => (
                          <PartyMatchCard
                            key={match.party.partyIdentifier}
                            party={match.party}
                            score={match.score}
                            matchedFields={match.matchedFields}
                            onAdd={handleAddMatch}
                            isDisabled={isDisabled}
                            pulse={pulseGuids.has(match.party.partyIdentifier ?? "")}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {matchScroll.up && (
                    <Button
                      variant="light"
                      className="comp-party-match-scroll-button comp-party-match-scroll-button-up border shadow-sm"
                      onClick={() => matchScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      <i className="bi bi-arrow-up me-1" />
                      <span>Back to top</span>
                    </Button>
                  )}
                  {matchScroll.down && (
                    <Button
                      variant="light"
                      className="comp-party-match-scroll-button comp-party-match-scroll-button-down border shadow-sm"
                      onClick={() =>
                        matchScrollRef.current?.scrollBy({
                          top: matchScrollRef.current.clientHeight * 0.8,
                          behavior: "smooth",
                        })
                      }
                    >
                      <i className="bi bi-arrow-down me-1" />
                      <span>More profiles</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvestigationPartyForm;
