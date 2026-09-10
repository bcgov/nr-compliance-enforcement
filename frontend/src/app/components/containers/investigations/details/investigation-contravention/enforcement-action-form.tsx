import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { Alert } from "react-bootstrap";
import { z } from "zod";
import {
  Contravention,
  CreateEnforcementActionInput,
  EnforcementAction,
  InvestigationParty,
  UpdateEnforcementActionInput,
} from "@/generated/graphql";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { CompInput } from "@/app/components/common/comp-input";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import {
  selectAdministrativePenaltyStatuses,
  selectCourtProsecutionStatuses,
  selectEnforcementActionsByAgency,
  selectOrderStatuses,
  selectOrderTypes,
  selectSanctionStatuses,
  selectSanctionTypes,
  selectTicketOutcomes,
  selectTicketTypes,
} from "@/app/store/reducers/code-table-selectors";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { copyInvestigationPartyAttachmentsToSharedParty } from "@/app/common/attachment-upload-helper";
import {
  EnforcementActionAttachmentSection,
  EnforcementActionAttachmentSectionHandle,
} from "./enforcement-action-attachment-section";
import { EnforcementActionAttachment } from "@/app/common/enforcement-action-attachment-utils";
import { getPartyName, isPartyProfileComplete } from "@/app/common/party-name";
import { ContraventionLabel } from "@/app/components/containers/investigations/details/investigation-contravention/enforcement-action-view-edit-content";
import { NON_EA_DECISION_CODES } from "./enforcement-action-constants";

const CODE_WARNING = "WARN";
const CODE_VIOLATION_TICKET = "FDVT";
const CODE_ADMINISTRATIVE_SANCTION = "ADSN";
const CODE_ORDER = "ORDR";
const CODE_RESTORATIVE_JUSTICE = "RJUS";
const CODE_COURT_PROSECUTION = "CTPR";
const CODE_ADMINISTRATIVE_PENALTY = "ADPN";
const DIVIDER_BEFORE_CODE = "ADPN"; // Administrative Penalty

// Decisions that record a "Comments" field, alongside Unfounded/Unresolved (which have no
// other fields at all).
const COMMENT_DECISION_CODES = new Set([CODE_ADMINISTRATIVE_SANCTION, CODE_RESTORATIVE_JUSTICE, CODE_ADMINISTRATIVE_PENALTY]);

const YES_NO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const boolToOption = (value: boolean | null | undefined): string => (value == null ? "" : value ? "true" : "false");
const optionToBool = (value: string): boolean | null => (value === "" ? null : value === "true");

// ticket_amount is stored as Decimal(10, 2) so enforce max amount
const ticketAmountValidator = z
  .string()
  .min(1, "Ticket amount is required")
  .refine(
    (val) => {
      const amount = Number.parseFloat(val);
      return Number.isNaN(amount) || amount < 100_000_000;
    },
    { message: "Ticket amount must be less than 100,000,000" },
  );

const UPDATE_INVESTIGATION_TIMESTAMP = gql`
  mutation UpdateInvestigationTimestamp($investigationGuid: String!) {
    updateInvestigationTimestamp(investigationGuid: $investigationGuid) {
      investigationGuid
      updatedTimestamp
    }
  }
`;

// Shared by both mutations - every decision-detail field is flattened onto EnforcementAction
// itself (only the ones matching the chosen decision code end up populated).
const ENFORCEMENT_ACTION_FIELDS = `
  enforcementActionIdentifier
  enforcementActionCode {
    enforcementActionCode
    shortDescription
  }
  dateIssued
  geoOrganizationUnitCode
  appUserIdentifier
  activeIndicator
  comment
  issuingOfficerIdentifier
  dateServed
  warningNumber
  sanctionTypeCode
  effectiveDate
  endDate
  sanctionStatusCode
  orderTypeCode
  orderStatusCode
  remediationRequired
  appealHearingDate
  hearingDate
  decisionDate
  courtProsecutionStatusCode
  administrativePenaltyStatusCode
  approvalInd
  ticket {
    ticketIdentifier
    ticketOutcomeCode
    ticketAmount
    ticketNumber
    ticketTypeCode
    appealHearingDate
  }
`;

const CREATE_ENFORCEMENT_ACTION = gql`
  mutation CreateEnforcementAction($input: CreateEnforcementActionInput!) {
    createEnforcementAction(input: $input) {
      publishedPartyReference
      ${ENFORCEMENT_ACTION_FIELDS}
    }
  }
`;

const UPDATE_ENFORCEMENT_ACTION = gql`
  mutation UpdateEnforcementAction($input: UpdateEnforcementActionInput!) {
    updateEnforcementAction(input: $input) {
      ${ENFORCEMENT_ACTION_FIELDS}
    }
  }
`;

const REMOVE_ENFORCEMENT_ACTION = gql`
  mutation RemoveEnforcementAction($enforcementActionId: String!) {
    removeEnforcementAction(enforcementActionId: $enforcementActionId) {
      enforcementActionIdentifier
    }
  }
`;

interface EnforcementActionFormProps {
  investigationGuid: string;
  contravention?: Contravention;
  party?: InvestigationParty;
  primaryInvestigatorGuid?: string;
  enforcementAction?: EnforcementAction;
  existingAttachments: EnforcementActionAttachment[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void;
  onRequestSave: (fn: () => Promise<void>) => void;
  onRequestDelete?: (fn: () => Promise<void>) => void;
  onIsSavingChange?: (isSaving: boolean) => void;
  onClose: () => void;
}

export const EnforcementActionForm: FC<EnforcementActionFormProps> = ({
  investigationGuid,
  contravention,
  party,
  primaryInvestigatorGuid,
  enforcementAction,
  existingAttachments,
  onDirtyChange,
  onRequestValidate,
  onRequestSave,
  onRequestDelete,
  onIsSavingChange,
  onClose,
}) => {
  const isEdit = !!enforcementAction;
  const attachmentsRef = useRef<EnforcementActionAttachmentSectionHandle>(null);

  //Check if party is local or global (i.e. if it has a partyReference, it is global)
  const willPublishParty = !isEdit && !!party && !party.partyReference;

  const dispatch = useAppDispatch();
  const currentUserGuid = useAppSelector(selectAppUserGuid);
  const agency = useAppSelector(selectOfficerAgency);
  const officersInAgency = useAppSelector((state) => selectOfficersByAgency(state, agency));
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const enforcementActionSelector = useMemo(() => selectEnforcementActionsByAgency(agency), [agency]);
  const enforcementActionOptions = useAppSelector(enforcementActionSelector);
  const ticketOutcomeOptions = useAppSelector(selectTicketOutcomes);
  const ticketTypeOptions = useAppSelector(selectTicketTypes);
  const sanctionTypeOptions = useAppSelector(selectSanctionTypes);
  const sanctionStatusOptions = useAppSelector(selectSanctionStatuses);
  const orderTypeOptions = useAppSelector(selectOrderTypes);
  const orderStatusOptions = useAppSelector(selectOrderStatuses);
  const courtProsecutionStatusOptions = useAppSelector(selectCourtProsecutionStatuses);
  const administrativePenaltyStatusOptions = useAppSelector(selectAdministrativePenaltyStatuses);

  const isRestrictedToCommentDecisions = !isPartyProfileComplete(party);
  const enforcementActionSelectOptions = useMemo(() => {
    const options = enforcementActionOptions.map((opt) => {
      const isDisabled = isRestrictedToCommentDecisions && !NON_EA_DECISION_CODES.has(opt.value ?? "");
      if (!isDisabled) return opt;

      return {
        ...opt,
        isDisabled,
        labelElement: <span className="enforcement-action-decision-option-disabled">{opt.label}</span>,
      };
    });

    const dividerIndex = options.findIndex((opt) => opt.value === DIVIDER_BEFORE_CODE);
    if (dividerIndex === -1) return options;

    const dividerOption = {
      value: "__enforcement_action_divider__",
      label: "",
      isDisabled: true,
      isSeparator: true,
      className: "enforcement-action-decision-divider mx-2 my-1",
    };

    return [...options.slice(0, dividerIndex), dividerOption, ...options.slice(dividerIndex)];
  }, [enforcementActionOptions, isRestrictedToCommentDecisions]);

  const communityOptions = areaCodes.map((c) => ({
    value: c.area ?? "",
    label: c.areaName ?? "",
  }));

  const officerOptions = [...(officersInAgency ?? [])].map((o) => ({
    value: o.app_user_guid,
    label: `${o.last_name}, ${o.first_name}`,
  }));

  // Single source of truth for which decision is currently selected - every other flag below is
  // derived from it, rather than tracked as its own separate piece of state.
  const [selectedCode, setSelectedCode] = useState(
    enforcementAction?.enforcementActionCode?.enforcementActionCode ?? "",
  );
  const [hasDecision, setHasDecision] = useState(!!selectedCode);

  const isNonEADecision = NON_EA_DECISION_CODES.has(selectedCode);
  const isWarning = selectedCode === CODE_WARNING;
  const isViolationTicket = selectedCode === CODE_VIOLATION_TICKET;
  const isAdministrativeSanction = selectedCode === CODE_ADMINISTRATIVE_SANCTION;
  const isOrder = selectedCode === CODE_ORDER;
  const isRestorativeJustice = selectedCode === CODE_RESTORATIVE_JUSTICE;
  const isCourtProsecution = selectedCode === CODE_COURT_PROSECUTION;
  const isAdministrativePenalty = selectedCode === CODE_ADMINISTRATIVE_PENALTY;
  const hasCommentField = isNonEADecision || COMMENT_DECISION_CODES.has(selectedCode);

  const saveMutation = useGraphQLMutation(CREATE_ENFORCEMENT_ACTION);
  const updateMutation = useGraphQLMutation(UPDATE_ENFORCEMENT_ACTION);
  const deleteMutation = useGraphQLMutation(REMOVE_ENFORCEMENT_ACTION);
  const updateTimestampMutation = useGraphQLMutation(UPDATE_INVESTIGATION_TIMESTAMP, {
    onError: () => ToggleError("Failed to update investigation timestamp"),
  });

  const dateValidator = z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (val) return new Date(val as string);
      return null;
    },
    z
      .date({ invalid_type_error: "Date is required" })
      .nullable()
      .refine((val) => val !== null, { message: "Date is required" }),
  );

  const optionalDateValidator = z.preprocess((val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val as string);
  }, z.date().nullable());

  const form = useForm({
    defaultValues: {
      dateIssued: enforcementAction?.dateIssued ? new Date(enforcementAction.dateIssued) : new Date(),
      community: enforcementAction?.geoOrganizationUnitCode ?? contravention?.community ?? "",
      servingOfficer: enforcementAction?.appUserIdentifier ?? primaryInvestigatorGuid ?? "",
      issuingOfficer: enforcementAction?.issuingOfficerIdentifier ?? primaryInvestigatorGuid ?? "",
      dateServed: enforcementAction?.dateServed ? new Date(enforcementAction.dateServed) : new Date(),
      enforcementActionCode: enforcementAction?.enforcementActionCode?.enforcementActionCode ?? "",
      comment: enforcementAction?.comment ?? "",
      // Violation Ticket
      ticketTypeCode: enforcementAction?.ticket?.ticketTypeCode ?? "",
      ticketAmount: enforcementAction?.ticket?.ticketAmount?.toString() ?? "",
      ticketNumber: enforcementAction?.ticket?.ticketNumber ?? "",
      ticketOutcomeCode: enforcementAction?.ticket?.ticketOutcomeCode ?? "",
      // Warning
      warningNumber: enforcementAction?.warningNumber ?? "",
      // Administrative Sanction
      sanctionTypeCode: enforcementAction?.sanctionTypeCode ?? "",
      effectiveDate: enforcementAction?.effectiveDate ? new Date(enforcementAction.effectiveDate) : null,
      endDate: enforcementAction?.endDate ? new Date(enforcementAction.endDate) : null,
      sanctionStatusCode: enforcementAction?.sanctionStatusCode ?? "",
      // Order
      orderTypeCode: enforcementAction?.orderTypeCode ?? "",
      orderStatusCode: enforcementAction?.orderStatusCode ?? "",
      // Shared: Order/Violation Ticket appeal hearing date
      appealHearingDate: enforcementAction?.ticket?.appealHearingDate
        ? new Date(enforcementAction.ticket.appealHearingDate)
        : enforcementAction?.appealHearingDate
          ? new Date(enforcementAction.appealHearingDate)
          : null,
      // Shared: Order/Restorative Justice/Court Prosecution/Administrative Penalty
      remediationRequired: boolToOption(enforcementAction?.remediationRequired),
      // Restorative Justice
      hearingDate: enforcementAction?.hearingDate ? new Date(enforcementAction.hearingDate) : null,
      decisionDate: enforcementAction?.decisionDate ? new Date(enforcementAction.decisionDate) : null,
      // Court Prosecution
      courtProsecutionStatusCode: enforcementAction?.courtProsecutionStatusCode ?? "",
      // Shared: Court Prosecution/Administrative Penalty
      approvalInd: boolToOption(enforcementAction?.approvalInd),
      // Administrative Penalty
      administrativePenaltyStatusCode: enforcementAction?.administrativePenaltyStatusCode ?? "",
    },
    onSubmit: async () => {},
  });

  const validateForm = async (): Promise<boolean> => {
    const results = await form.validateAllFields("submit");
    const hasErrors = Object.values(results).some((fieldErrors) => fieldErrors && Object.keys(fieldErrors).length > 0);
    return !hasErrors;
  };

  const [attachmentsDirty, setAttachmentsDirty] = useState(false);
  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );
  const isDirty = isFormDirty || attachmentsDirty;

  useEffect(() => {
    onDirtyChange?.(0, isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    return () => {
      onDirtyChange?.(0, false);
    };
  }, []);

  // Expose validate to modal
  useEffect(() => {
    onRequestValidate(async () => {
      return validateForm();
    });
  }, [onRequestValidate]);

  type FormValues = typeof form.state.values;

  // Ticket details only apply to violation ticket actions, and are shared by create and update
  const buildTicketFields = (value: FormValues) => {
    if (!isViolationTicket) return {};

    return {
      ticketOutcomeCode: value.ticketOutcomeCode,
      ticketAmount: Number.parseFloat(value.ticketAmount),
      ticketNumber: value.ticketNumber,
      ticketTypeCode: value.ticketTypeCode || null,
      appealHearingDate: value.appealHearingDate ? new Date(value.appealHearingDate).toISOString() : null,
    };
  };

  // Fields for whichever decision-detail table matches the currently selected decision. The
  // backend only reads the fields relevant to that decision's code, so nothing else needs to be
  // explicitly cleared here.
  const buildDecisionDetailFields = (value: FormValues) => {
    switch (selectedCode) {
      case CODE_WARNING:
        return { warningNumber: value.warningNumber };
      case CODE_ADMINISTRATIVE_SANCTION:
        return {
          sanctionTypeCode: value.sanctionTypeCode,
          effectiveDate: value.effectiveDate ? new Date(value.effectiveDate).toISOString() : null,
          endDate: value.endDate ? new Date(value.endDate).toISOString() : null,
          sanctionStatusCode: value.sanctionStatusCode,
        };
      case CODE_ORDER:
        return {
          orderTypeCode: value.orderTypeCode || null,
          remediationRequired: optionToBool(value.remediationRequired),
          appealHearingDate: value.appealHearingDate ? new Date(value.appealHearingDate).toISOString() : null,
          orderStatusCode: value.orderStatusCode,
        };
      case CODE_RESTORATIVE_JUSTICE:
        return {
          hearingDate: value.hearingDate ? new Date(value.hearingDate).toISOString() : null,
          decisionDate: value.decisionDate ? new Date(value.decisionDate).toISOString() : null,
          remediationRequired: optionToBool(value.remediationRequired),
        };
      case CODE_COURT_PROSECUTION:
        return {
          approvalInd: optionToBool(value.approvalInd),
          remediationRequired: optionToBool(value.remediationRequired),
          courtProsecutionStatusCode: value.courtProsecutionStatusCode,
        };
      case CODE_ADMINISTRATIVE_PENALTY:
        return {
          approvalInd: optionToBool(value.approvalInd),
          remediationRequired: optionToBool(value.remediationRequired),
          administrativePenaltyStatusCode: value.administrativePenaltyStatusCode,
        };
      default:
        return {};
    }
  };

  // Comment applies to Unfounded/Unresolved plus a handful of other decisions. Always included
  // (as null otherwise) so switching away from one of those decisions clears out a stale comment.
  const buildCommentField = (value: FormValues) => ({
    comment: hasCommentField ? value.comment : null,
  });

  // Issuing officer/date served apply to every decision except Unfounded/Unresolved. Always
  // included (as null otherwise), same reasoning as the comment field above.
  const buildMutualFields = (value: FormValues) => ({
    issuingOfficerIdentifier: isNonEADecision ? null : value.issuingOfficer,
    dateServed: isNonEADecision || !value.dateServed ? null : new Date(value.dateServed).toISOString(),
  });

  // Everything that follows a successful save. Best effort: a failure here is logged but never
  // reported as a failed save, because the enforcement action itself is already persisted.
  const runPostSaveSideEffects = async (
    enforcementActionId: string,
    value: FormValues,
    publishedPartyReference: string | null,
  ) => {
    try {
      const enforcementActionLabel =
        enforcementActionOptions.find((opt) => opt.value === value.enforcementActionCode)?.label ?? "";
      await attachmentsRef.current?.persist(enforcementActionId, {
        fileType: "Photo",
        title: value.ticketNumber,
        description: enforcementActionLabel,
        date: value.dateIssued,
        takenBy: value.servingOfficer,
        location: "",
      });
      await updateTimestampMutation.mutateAsync({ investigationGuid });

      // The party's attachments live in COMS under the investigation's tags, which the shared party
      // page never looks at. Copy them across so the newly published profile carries them.
      if (publishedPartyReference && party?.partyIdentifier) {
        const failedFiles = await copyInvestigationPartyAttachmentsToSharedParty({
          dispatch,
          investigationGuid,
          investigationPartyGuid: party.partyIdentifier,
          sharedPartyGuid: publishedPartyReference,
        });

        if (failedFiles.length > 0) {
          ToggleError(`Party was saved, but these attachments could not be copied: ${failedFiles.join(", ")}`);
        }
      }
    } catch (sideEffectError) {
      console.error("Enforcement action saved, but a post-save update failed", sideEffectError);
    }
  };

  const showSaveSuccessToast = () => {
    if (isEdit) {
      ToggleSuccess("Decision updated successfully");
    } else if (willPublishParty) {
      ToggleSuccess("Decision and party details saved successfully");
    } else {
      ToggleSuccess("Decision saved successfully");
    }
  };

  // Expose save to modal
  useEffect(() => {
    onRequestSave(async () => {
      const formValid = await validateForm();
      if (!formValid) return;

      const value = form.state.values;
      onIsSavingChange?.(true);
      try {
        let enforcementActionId: string;
        let publishedPartyReference: string | null = null;
        if (isEdit) {
          const input: UpdateEnforcementActionInput = {
            enforcementActionIdentifier: enforcementAction!.enforcementActionIdentifier,
            enforcementActionCode: value.enforcementActionCode,
            dateIssued: value.dateIssued,
            geoOrganizationUnitCode: value.community,
            appUserIdentifier: value.servingOfficer,
            ...buildMutualFields(value),
            ...buildTicketFields(value),
            ...buildDecisionDetailFields(value),
            ...buildCommentField(value),
          };
          await updateMutation.mutateAsync({ input });
          enforcementActionId = enforcementAction!.enforcementActionIdentifier;
        } else {
          const input: CreateEnforcementActionInput = {
            contraventionIdentifier: contravention?.contraventionIdentifier ?? "",
            partyIdentifier: party?.partyIdentifier,
            enforcementActionCode: value.enforcementActionCode,
            dateIssued: value.dateIssued,
            geoOrganizationUnitCode: value.community,
            appUserIdentifier: value.servingOfficer,
            ...buildMutualFields(value),
            ...buildTicketFields(value),
            ...buildDecisionDetailFields(value),
            ...buildCommentField(value),
          };
          const created: any = await saveMutation.mutateAsync({ input });
          enforcementActionId = created.createEnforcementAction.enforcementActionIdentifier;
          publishedPartyReference = created.createEnforcementAction.publishedPartyReference ?? null;
        }

        await runPostSaveSideEffects(enforcementActionId, value, publishedPartyReference);

        showSaveSuccessToast();
        onDirtyChange?.(0, false);
        onClose();
      } catch {
        ToggleError(isEdit ? "Failed to update decision" : "Failed to save decision");
      } finally {
        onIsSavingChange?.(false);
      }
    });
  }, [onRequestSave, isEdit, selectedCode, enforcementAction, contravention, party, investigationGuid]);

  // Expose delete to modal
  useEffect(() => {
    if (!onRequestDelete || !isEdit) return;

    onRequestDelete(async () => {
      if (!enforcementAction?.enforcementActionIdentifier) return;
      onIsSavingChange?.(true);
      try {
        await deleteMutation.mutateAsync({
          enforcementActionId: enforcementAction.enforcementActionIdentifier,
        });
        await updateTimestampMutation.mutateAsync({ investigationGuid });
        ToggleSuccess("Decision deleted successfully");
        onDirtyChange?.(0, false);
        onClose();
      } catch {
        ToggleError("Failed to delete decision");
      } finally {
        onIsSavingChange?.(false);
      }
    });
  }, [onRequestDelete, isEdit, enforcementAction, investigationGuid]);

  const renderCommentField = () => (
    <div className="row mb-3">
      <div className="col-12">
        <FormField
          form={form}
          name="comment"
          label="Comment"
          render={(field) => (
            <ValidationTextArea
              id="enforcement-action-comment"
              className="comp-form-control comp-details-input"
              rows={4}
              value={field.state.value}
              onChange={(value: string) => field.handleChange(value)}
              placeholderText="Enter a comment"
              maxLength={4000}
              errMsg={field.state.meta.errors?.[0]?.message ?? ""}
            />
          )}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {willPublishParty && (
        <Alert
          variant="warning"
          id="enforcement-action-publish-party-notice"
        >
          <i className="bi bi-info-circle-fill pe-2" /> Saving this decision will also save the details of the party
          involved for use in future investigations.
        </Alert>
      )}

      {contravention && (
        <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
          {isRestrictedToCommentDecisions && (
            <Alert
              variant="warning"
              id="enforcement-action-restricted-decisions-notice"
              className="px-2 py-2"
            >
              <i className="bi bi-info-circle-fill pe-2" />
              {party
                ? "This profile is incomplete. Enforcement actions are unavailable."
                : "The party is unknown. Enforcement actions are unavailable."}
            </Alert>
          )}
          <div className="text-muted small mb-1">Party</div>
          <div className="mb-2">{getPartyName(party)}</div>
          <div className="text-muted small mb-1">Contravention</div>
          <div>
            <ContraventionLabel legislationIdentifierRef={contravention.legislationIdentifierRef} />
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-6">
          <FormField
            form={form}
            name="enforcementActionCode"
            label="Decision"
            required
            validators={{
              onChange: z.string().min(1, "Decision is required"),
              onSubmit: z.string().min(1, "Decision is required"),
            }}
            render={(field) => (
              <CompSelect
                id="enforcement-action-code"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={enforcementActionSelectOptions}
                value={enforcementActionSelectOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  field.handleChange(option?.value ?? "");
                  setSelectedCode(option?.value ?? "");
                  setHasDecision(!!option?.value);
                }}
                placeholder="Select"
                isClearable
                showInactive={false}
                enableValidation
                errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
              />
            )}
          />
        </div>
      </div>

      {isNonEADecision && renderCommentField()}

      {!isNonEADecision && hasDecision && (
        <>
          <div className="row mb-3">
            <div className="col-6">
              <FormField
                form={form}
                name="dateIssued"
                label="Date issued"
                required
                validators={{
                  onChange: dateValidator,
                  onSubmit: dateValidator,
                }}
                render={(field) => (
                  <ValidationDatePicker
                    classNamePrefix="comp-details-edit-calendar-input"
                    className="comp-details-input full-width"
                    id="enforcement-action-date-issued"
                    maxDate={new Date()}
                    onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                    selectedDate={field.state.value}
                    errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                    vertical={true}
                  />
                )}
              />
            </div>
            <div className="col-6">
              <FormField
                form={form}
                name="issuingOfficer"
                label="Issuing officer"
                required
                validators={{
                  onChange: z.string().min(1, "Issuing officer is required"),
                  onSubmit: z.string().min(1, "Issuing officer is required"),
                }}
                render={(field) => (
                  <CompSelect
                    id="enforcement-action-issuing-officer"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={officerOptions}
                    value={officerOptions.find((opt) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value ?? "")}
                    placeholder="Select officer"
                    isClearable
                    showInactive={false}
                    enableValidation
                    errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                  />
                )}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <FormField
                form={form}
                name="dateServed"
                label="Date served"
                required
                validators={{
                  onChange: dateValidator,
                  onSubmit: dateValidator,
                }}
                render={(field) => (
                  <ValidationDatePicker
                    classNamePrefix="comp-details-edit-calendar-input"
                    className="comp-details-input full-width"
                    id="enforcement-action-date-served"
                    maxDate={new Date()}
                    onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                    selectedDate={field.state.value}
                    errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                    vertical={true}
                  />
                )}
              />
            </div>
            <div className="col-6">
              <FormField
                form={form}
                name="servingOfficer"
                label="Serving officer"
                required
                validators={{
                  onChange: z.string().min(1, "Serving officer is required"),
                  onSubmit: z.string().min(1, "Serving officer is required"),
                }}
                render={(field) => (
                  <CompSelect
                    id="enforcement-action-serving-officer"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={officerOptions}
                    value={officerOptions.find((opt) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value ?? "")}
                    placeholder="Select officer"
                    isClearable
                    showInactive={false}
                    enableValidation
                    errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                  />
                )}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <FormField
                form={form}
                name="community"
                label="Community"
                required
                validators={{
                  onChange: z.string().min(1, "Community is required"),
                  onSubmit: z.string().min(1, "Community is required"),
                }}
                render={(field) => (
                  <CompSelect
                    id="enforcement-action-community"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={communityOptions}
                    value={communityOptions.find((opt) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value ?? "")}
                    placeholder="Select community"
                    isClearable
                    showInactive={false}
                    enableValidation
                    errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                  />
                )}
              />
            </div>
          </div>

          {isWarning && (
            <div className="row mb-3">
              <div className="col-6">
                <FormField
                  form={form}
                  name="warningNumber"
                  label="Warning number"
                  required
                  validators={{
                    onChange: z.string().min(1, "Warning number is required"),
                    onSubmit: z.string().min(1, "Warning number is required"),
                  }}
                  render={(field) => (
                    <CompInput
                      id="enforcement-action-warning-number"
                      divid="enforcement-action-warning-number-value"
                      type="input"
                      inputClass="comp-form-control"
                      error={field.state.meta.errors?.[0]?.message ?? ""}
                      onChange={(evt: any) => field.handleChange(evt.target.value)}
                      value={field.state.value}
                      placeholder="Enter warning number"
                    />
                  )}
                />
              </div>
            </div>
          )}

          {isViolationTicket && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="ticketTypeCode"
                    label="Ticket type"
                    required
                    validators={{
                      onChange: z.string().min(1, "Ticket type is required"),
                      onSubmit: z.string().min(1, "Ticket type is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-ticket-type"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={ticketTypeOptions}
                        value={ticketTypeOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select ticket type"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="ticketNumber"
                    label="Ticket number"
                    required
                    validators={{
                      onChange: z.string().min(1, "Ticket number is required"),
                      onSubmit: z.string().min(1, "Ticket number is required"),
                    }}
                    render={(field) => (
                      <CompInput
                        id="enforcement-action-ticket-number"
                        divid="enforcement-action-ticket-number-value"
                        type="input"
                        inputClass="comp-form-control"
                        error={field.state.meta.errors?.[0]?.message ?? ""}
                        onChange={(evt: any) => field.handleChange(evt.target.value)}
                        value={field.state.value}
                        placeholder="Enter ticket number"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="ticketAmount"
                    label="Amount"
                    required
                    validators={{
                      onChange: ticketAmountValidator,
                      onSubmit: ticketAmountValidator,
                    }}
                    render={(field) => (
                      <CompInput
                        id="enforcement-action-ticket-amount"
                        divid="enforcement-action-ticket-amount-value"
                        type="input"
                        inputClass="comp-form-control"
                        error={field.state.meta.errors?.[0]?.message ?? ""}
                        onChange={(evt: any) => {
                          const value = evt.target.value;
                          if (/^\d*\.?\d{0,2}$/.test(value)) {
                            field.handleChange(value);
                          }
                        }}
                        value={field.state.value}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="ticketOutcomeCode"
                    label="Status"
                    required
                    validators={{
                      onChange: z.string().min(1, "Status is required"),
                      onSubmit: z.string().min(1, "Status is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-ticket-outcome"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={ticketOutcomeOptions}
                        value={ticketOutcomeOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select status"
                        isClearable={false}
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="appealHearingDate"
                    label="Appeal hearing date"
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-ticket-appeal-hearing-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {isAdministrativeSanction && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="sanctionTypeCode"
                    label="Sanction type"
                    required
                    validators={{
                      onChange: z.string().min(1, "Sanction type is required"),
                      onSubmit: z.string().min(1, "Sanction type is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-sanction-type"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={sanctionTypeOptions}
                        value={sanctionTypeOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select sanction type"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="effectiveDate"
                    label="Effective date"
                    required
                    validators={{
                      onChange: dateValidator,
                      onSubmit: dateValidator,
                    }}
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-effective-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="endDate"
                    label="End date"
                    required
                    validators={{
                      onChange: dateValidator,
                      onSubmit: dateValidator,
                    }}
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-end-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="sanctionStatusCode"
                    label="Status"
                    required
                    validators={{
                      onChange: z.string().min(1, "Status is required"),
                      onSubmit: z.string().min(1, "Status is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-sanction-status"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={sanctionStatusOptions}
                        value={sanctionStatusOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select status"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {isOrder && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="orderTypeCode"
                    label="Order type"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-order-type"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={orderTypeOptions}
                        value={orderTypeOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select order type"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="remediationRequired"
                    label="Remediation required"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-order-remediation-required"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="appealHearingDate"
                    label="Appeal hearing date"
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-order-appeal-hearing-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="orderStatusCode"
                    label="Status"
                    required
                    validators={{
                      onChange: z.string().min(1, "Status is required"),
                      onSubmit: z.string().min(1, "Status is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-order-status"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={orderStatusOptions}
                        value={orderStatusOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select status"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {isRestorativeJustice && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="hearingDate"
                    label="Hearing date"
                    validators={{
                      onChange: optionalDateValidator,
                      onSubmit: optionalDateValidator,
                    }}
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-rj-hearing-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="decisionDate"
                    label="Decision date"
                    validators={{
                      onChange: optionalDateValidator,
                      onSubmit: optionalDateValidator,
                    }}
                    render={(field) => (
                      <ValidationDatePicker
                        classNamePrefix="comp-details-edit-calendar-input"
                        className="comp-details-input full-width"
                        maxDate={new Date()}
                        id="enforcement-action-rj-decision-date"
                        onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                        selectedDate={field.state.value}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        vertical={true}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="remediationRequired"
                    label="Remediation required"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-rj-remediation-required"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {isCourtProsecution && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="approvalInd"
                    label="Approval"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-cp-approval"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="remediationRequired"
                    label="Remediation required"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-cp-remediation-required"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="courtProsecutionStatusCode"
                    label="Status"
                    required
                    validators={{
                      onChange: z.string().min(1, "Status is required"),
                      onSubmit: z.string().min(1, "Status is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-cp-status"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={courtProsecutionStatusOptions}
                        value={courtProsecutionStatusOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select status"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {isAdministrativePenalty && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="approvalInd"
                    label="Approval"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-ap-approval"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  <FormField
                    form={form}
                    name="remediationRequired"
                    label="Remediation required"
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-ap-remediation-required"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={YES_NO_OPTIONS}
                        value={YES_NO_OPTIONS.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <FormField
                    form={form}
                    name="administrativePenaltyStatusCode"
                    label="Status"
                    required
                    validators={{
                      onChange: z.string().min(1, "Status is required"),
                      onSubmit: z.string().min(1, "Status is required"),
                    }}
                    render={(field) => (
                      <CompSelect
                        id="enforcement-action-ap-status"
                        classNamePrefix="comp-select"
                        className="comp-details-input"
                        options={administrativePenaltyStatusOptions}
                        value={administrativePenaltyStatusOptions.find((opt) => opt.value === field.state.value)}
                        onChange={(option) => field.handleChange(option?.value ?? "")}
                        placeholder="Select status"
                        isClearable
                        showInactive={false}
                        enableValidation
                        errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {COMMENT_DECISION_CODES.has(selectedCode) && renderCommentField()}

          <EnforcementActionAttachmentSection
            ref={attachmentsRef}
            investigationGuid={investigationGuid}
            existingAttachments={existingAttachments}
            onDirtyChange={setAttachmentsDirty}
          />
        </>
      )}
    </form>
  );
};
