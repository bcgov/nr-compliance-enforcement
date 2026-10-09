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
  AddressFormValue,
  buildAddresses,
  buildAliases,
  buildBusinessCreateUpdate,
  buildContactMethods,
  buildContactPeople,
  buildExternalIds,
  buildPersonBase,
  createEmptyPartyFormValues,
  mapInvestigationPartyToDefaultValues,
  validateBusinessForm,
  validatePersonForm,
} from "@/app/components/containers/parties/form/party-form-utils";
import {
  handleBusinessPartyMutationError,
  scrollToFirstFieldError,
} from "@/app/components/containers/parties/form/party-form-errors";
import { PARTY_DUPLICATE_MESSAGE } from "@/app/components/containers/parties/form/party-unique-fields";
import { useUniqueFieldCheck } from "@/app/components/containers/parties/hooks/use-unique-field-check";
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
import { getPartyName, hasCompleteAddress } from "@/app/common/party-name";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";
import {
  buildSharedPartyAttachmentReferences,
  copyInvestigationPartyAttachmentsToSharedParty,
} from "@/app/common/attachment-upload-helper";

// Mirrors the backend's minimum-information check (InvestigationPartyService._hasMinimumInfo):
// a person needs first name, last name and date of birth; a business only needs its name, which
// is required to be published to global.
const hasMinimumInfo = (
  partyTypeValue: string,
  values: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: unknown;
    businessName?: string;
    addresses?: AddressFormValue[];
  },
): boolean =>
  partyTypeValue === PartyTypeCodes.ORGANIZATION
    ? !!values.businessName?.trim() && (values.addresses ?? []).some(hasCompleteAddress)
    : !!(values.firstName?.trim() && values.lastName?.trim() && values.dateOfBirth);

const ADD_PARTY_TO_INVESTIGATION = gql`
  mutation AddPartyToInvestigation($investigationGuid: String!, $input: [CreateInvestigationPartyInput]!) {
    addPartyToInvestigation(investigationGuid: $investigationGuid, input: $input) {
      partyIdentifier
      partyReference
    }
  }
`;

const UPDATE_INVESTIGATION_PARTY = gql`
  mutation UpdateInvestigationParty($investigationGuid: String!, $input: UpdateInvestigationPartyInput!) {
    updateInvestigationParty(investigationGuid: $investigationGuid, input: $input) {
      investigationGuid
      parties {
        partyIdentifier
        partyReference
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
  // True when the party is on a contravention, so its role cannot be changed
  isRoleLocked?: boolean;
}

export const InvestigationPartyForm: FC<InvestigationPartyFormProps> = ({
  investigationGuid,
  editParty,
  investigationLabel,
  linkedPartyReferences = [],
  isRoleLocked,
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
  const justPublishedRef = useRef(false);

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
      // a party must have at least one entered field
      const validationError =
        value.partyType === PartyTypeCodes.PERSON ? validatePersonForm(value) : await validateBusinessForm(value);
      if (validationError) {
        ToggleError(validationError);
        return;
      }

      if (isEditMode && editParty) {
        const input: any = {
          partyIdentifier: editParty.partyIdentifier,
          partyAssociationRole: value.partyAssociationRole,
          aliases: buildAliases(value.aliases, true),
          externalIds: buildExternalIds(value.externalIds, true),
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
        const input: any = {
          partyTypeCode: value.partyType,
          partyAssociationRole: value.partyAssociationRole,
          aliases: buildAliases(value.aliases, false),
          externalIds: buildExternalIds(value.externalIds, false),
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

  const { uniqueFieldConflict, checkUniqueFieldConflicts, handleDuplicateIdentifierError } = useUniqueFieldCheck(
    form,
    editParty?.partyReference ?? undefined,
  );

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

  // Set by onSuccess when this save just published the party, and consumed once PartyAttachments
  // reports (via onSaved) that any attachment added in this same save has finished uploading -
  // otherwise the copy below can run before that upload and miss it entirely.
  const pendingSharedCopyRef = useRef<{ investigationPartyGuid: string; sharedPartyGuid: string } | null>(null);

  // The party's attachments live in COMS under the investigation's tags, which the shared party
  // page never looks at. Copy them across so a newly published profile carries them.
  const copyPartyAttachmentsToSharedParty = async (investigationPartyGuid: string, sharedPartyGuid: string) => {
    const failedFiles = await copyInvestigationPartyAttachmentsToSharedParty({
      dispatch,
      investigationGuid,
      investigationPartyGuid,
      sharedPartyGuid,
    });

    if (failedFiles.length > 0) {
      ToggleError(`Party was saved, but these attachments could not be copied: ${failedFiles.join(", ")}`);
    }
  };

  const addPartyMutation = useGraphQLMutation(ADD_PARTY_TO_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid], ["searchParties"]],
    onSuccess: (data: any) => {
      const created = data?.addPartyToInvestigation?.[0];
      if (created?.partyIdentifier) setPartyIdentifier(created.partyIdentifier);
      justPublishedRef.current = !!created?.partyReference;
      pendingSharedCopyRef.current =
        created?.partyIdentifier && created?.partyReference
          ? { investigationPartyGuid: created.partyIdentifier, sharedPartyGuid: created.partyReference }
          : null;
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
      if (handleDuplicateIdentifierError(error)) return;
      handleBusinessPartyMutationError(form, error, "Failed to add party");
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY, {
    invalidateQueries: [
      ["getInvestigation", investigationGuid],
      ["party", editParty?.partyReference],
      ["searchPartyEvents", editParty?.partyReference],
      ["searchParties"],
      ["InvestigationParty"],
      ["InvestigationPartyRoles"],
    ],
    onSuccess: (data: any) => {
      const updatedParty = data?.updateInvestigationParty?.parties?.find(
        (p: any) => p.partyIdentifier === editParty?.partyIdentifier,
      );
      const newlyPublished = !isLinkedParty && !!updatedParty?.partyReference;
      justPublishedRef.current = newlyPublished;
      pendingSharedCopyRef.current =
        newlyPublished && editParty?.partyIdentifier
          ? { investigationPartyGuid: editParty.partyIdentifier, sharedPartyGuid: updatedParty.partyReference }
          : null;
      flushAttachmentsThenNavigate();
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      copyInFlightRef.current = false;
      setCopyPending(false);
      if (handleDuplicateIdentifierError(error)) return;
      handleBusinessPartyMutationError(form, error, "Failed to update party");
    },
  });

  const addPartyFromSharedPartyMutation = useGraphQLMutation(ADD_PARTY_TO_INVESTIGATION_FROM_SHARED_PARTY, {
    invalidateQueries: [["getInvestigation", investigationGuid], ["InvestigationParty"], ["InvestigationPartyRoles"]],
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
    invalidateQueries: [["getInvestigation", investigationGuid], ["InvestigationParty"], ["InvestigationPartyRoles"]],
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

  const minimumInfoValues = useStore(form.store, (state) => ({
    firstName: state.values.firstName,
    lastName: state.values.lastName,
    dateOfBirth: state.values.dateOfBirth,
    businessName: state.values.businessName,
    addresses: state.values.addresses,
  }));
  const willPublish = !isLinkedParty && hasMinimumInfo(partyTypeValue, minimumInfoValues);

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

  const saveButtonClick = async () => {
    if (await checkUniqueFieldConflicts()) {
      return;
    }

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

    // Warning to publish party if it now has minimum info - applies whether the party is being
    // created, or is an existing local party (not yet linked to a shared party) being edited.
    if (willPublish && matches.length === 0) {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: SAVE_CONFIRM,
          data: {
            title: isEditMode ? "Save party" : "Create new party",
            warnings: ["This profile will be published and available for use in future investigations."],
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

    if (matches.length > 0) {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: SAVE_CONFIRM,
          data: {
            title: isEditMode ? "Save party" : "Create new party",
            warnings: [
              ...(willPublish
                ? ["This profile will be published and available for use in future investigations."]
                : []),
              "Potential matching profiles were found based on the information entered.",
            ],
            description:
              "Confirm this party does not match an existing profile before saving, to avoid the creation of duplicate records.",
            cancelText: "Cancel",
            saveText: "Confirm",
          },
          callback: () => {
            form.handleSubmit();
          },
        }),
      );
    } else {
      form.handleSubmit();
    }
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

    const sharedPartyGuid = party.partyIdentifier;

    if (!sharedPartyGuid) {
      return;
    }

    dispatch(
      openModal({
        modalSize: "md",
        modalType: SAVE_CONFIRM,
        data: {
          title: `Add ${getPartyName(party)} to investigation`,
          warnings: [
            "Selecting this profile will replace any information entered in the form. The profile can be edited once it has been added to the investigation.",
          ],
          cancelText: "Cancel",
          saveText: "Confirm",
        },
        callback: () => {
          setAddMatchGuid(sharedPartyGuid);
        },
      }),
    );
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
            <FormErrorBanner
              form={form}
              errorMessage={uniqueFieldConflict ? PARTY_DUPLICATE_MESSAGE : undefined}
            />
            <fieldset disabled={isDisabled}>
              <FormField
                form={form}
                name="partyAssociationRole"
                label="Investigation role"
                required
                validators={{ onChange: z.string().min(1, "Investigation role is required") }}
                render={(field) => (
                  <>
                    <CompSelect
                      id="party-role-select"
                      classNamePrefix="comp-select"
                      className={isRoleLocked ? "comp-details-input" : "comp-details-input mb-3"}
                      options={partyRoleOptions}
                      value={partyRoleOptions?.find((opt: any) => opt.value === field.state.value)}
                      onChange={(option) => field.handleChange(option?.value || "")}
                      placeholder="Select"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                      isDisabled={isDisabled || isRoleLocked}
                    />
                    {isRoleLocked && (
                      <div className="form-text mb-3">
                        The role cannot be changed because a contravention has been added to this party.
                      </div>
                    )}
                  </>
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
                  isPublished={isLinkedParty}
                />
              )}

              {partyTypeValue === PartyTypeCodes.ORGANIZATION && (
                <BusinessFormFields
                  form={form}
                  isDisabled={isDisabled}
                  isPublished={isLinkedParty}
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
                  onSaved={async () => {
                    const pendingSharedCopy = pendingSharedCopyRef.current;
                    pendingSharedCopyRef.current = null;
                    if (pendingSharedCopy) {
                      await copyPartyAttachmentsToSharedParty(
                        pendingSharedCopy.investigationPartyGuid,
                        pendingSharedCopy.sharedPartyGuid,
                      );
                    }

                    const action = isEditMode ? "updated" : "added";
                    ToggleSuccess(
                      justPublishedRef.current
                        ? `Party ${action} and published for use in future investigations`
                        : `Party ${action} successfully`,
                    );
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
                    <h3 className="mb-1">Search results</h3>

                    {matchFetching && (
                      <div className="d-flex align-items-center">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-3"
                        />
                        <span>Looking for matching published profiles...</span>
                      </div>
                    )}

                    {!matchFetching && (
                      <p>
                        {matches.length === 0
                          ? "No matching published profiles found."
                          : "Potentially matching published profiles found."}
                      </p>
                    )}

                    {/* Matching profile cards */}
                    <div
                      className={`comp-party-match-cards${matchFetching ? " comp-party-match-cards-fetching" : ""} mb-3`}
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

                  <div>
                    <div className="comp-party-match-rules p-2 d-flex flex-column flex-start align-items-start">
                      <Button
                        variant="link"
                        className="d-block p-0 comp-party-match-rules-title"
                        aria-expanded={showMatchRules}
                        onClick={() => setShowMatchRules((show) => !show)}
                      >
                        <span>How scoring works</span>&nbsp;&nbsp;
                        <i className={`bi bi-chevron-${showMatchRules ? "up" : "down"} me-1`} />
                      </Button>
                      {showMatchRules && (
                        <div className="d-flex flex-column gap-3">
                          <div
                            className="mt-2"
                            style={{ borderTop: "1px solid #c7c7c7" }}
                          >
                            <div className="mt-2">
                              <span>
                                Identifier (licence, business number, WorkSafeBC, contact phone/email){" "}
                                <strong> = 1000</strong>
                              </span>
                            </div>
                          </div>
                          <span>
                            Name, date of birth, phone, email, address, city <strong> = 50 </strong>
                          </span>
                          <span>
                            Descriptor (sex, age range, height, hair...) <strong> = 10</strong>
                          </span>
                          <span>
                            Similar (typo, sound-alike, short form, close birthdate) <strong> x 0.5</strong>
                          </span>
                          <span>
                            Cross-field (alias, first as middle, similar legal name)<strong> x 0.25</strong>
                          </span>
                          <span>
                            First + last name bonus <strong> + 100</strong>
                          </span>
                          <span>
                            Name + date of birth bonus <strong> + 850</strong>
                          </span>
                          <span>
                            Shown / likely match / strong match <strong> &ge; 50 / 250 / 850</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
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
