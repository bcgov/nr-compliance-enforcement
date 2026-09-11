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
import Option from "@apptypes/app/option";
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

// Decisions that record a "Comments" field
const COMMENT_DECISION_CODES = new Set([
  CODE_ADMINISTRATIVE_SANCTION,
  CODE_RESTORATIVE_JUSTICE,
  CODE_ADMINISTRATIVE_PENALTY,
]);

const YES_NO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const boolToOption = (value: boolean | null | undefined): string => {
  if (value == null) return "";
  return value ? "true" : "false";
};
const optionToBool = (value: string): boolean | null => (value === "" ? null : value === "true");
const toDateOrNull = (value?: string | Date | null): Date | null => (value ? new Date(value) : null);

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

  const [selectedCode, setSelectedCode] = useState(
    enforcementAction?.enforcementActionCode?.enforcementActionCode ?? "",
  ); //selected decision code
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
      appealHearingDate: toDateOrNull(
        enforcementAction?.ticket?.appealHearingDate ?? enforcementAction?.appealHearingDate,
      ),
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

  // Comment applies to Unfounded/Unresolved plus other decisions
  const buildCommentField = (value: FormValues) => ({
    comment: hasCommentField ? value.comment : null,
  });

  // Issuing officer/date served apply to every decision except Unfounded/Unresolved
  const buildMutualFields = (value: FormValues) => ({
    issuingOfficerIdentifier: isNonEADecision ? null : value.issuingOfficer,
    dateServed: isNonEADecision || !value.dateServed ? null : new Date(value.dateServed).toISOString(),
  });

  // Everything that follows a successful save
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

  const renderSelectField = (
    name: string,
    label: string,
    options: Option[],
    config: { id: string; required?: boolean; placeholder?: string; isClearable?: boolean },
  ) => {
    const { id, required = false, placeholder = "Select", isClearable = true } = config;
    return (
      <FormField
        form={form}
        name={name}
        label={label}
        required={required}
        validators={
          required
            ? {
                onChange: z.string().min(1, `${label} is required`),
                onSubmit: z.string().min(1, `${label} is required`),
              }
            : undefined
        }
        render={(field) => (
          <CompSelect
            id={id}
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={options}
            value={options.find((opt) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder={placeholder}
            isClearable={isClearable}
            showInactive={false}
            enableValidation
            errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
          />
        )}
      />
    );
  };

  const renderYesNoField = (name: string, label: string, id: string) =>
    renderSelectField(name, label, YES_NO_OPTIONS, { id });

  const renderDateField = (name: string, label: string, id: string, config: { required?: boolean } = {}) => {
    const { required = false } = config;
    const validator = required ? dateValidator : optionalDateValidator;
    return (
      <FormField
        form={form}
        name={name}
        label={label}
        required={required}
        validators={{ onChange: validator, onSubmit: validator }}
        render={(field) => (
          <ValidationDatePicker
            classNamePrefix="comp-details-edit-calendar-input"
            className="comp-details-input full-width"
            maxDate={new Date()}
            id={id}
            onChange={(date: Date, _time: string | null) => field.handleChange(date)}
            selectedDate={field.state.value}
            errMsg={field.state.meta.errors?.[0]?.message ?? ""}
            vertical={true}
          />
        )}
      />
    );
  };

  const renderTextField = (name: string, label: string, placeholder: string, config: { required?: boolean } = {}) => {
    const { required = false } = config;
    return (
      <FormField
        form={form}
        name={name}
        label={label}
        required={required}
        validators={
          required
            ? {
                onChange: z.string().min(1, `${label} is required`),
                onSubmit: z.string().min(1, `${label} is required`),
              }
            : undefined
        }
        render={(field) => (
          <CompInput
            id={`enforcement-action-${name}`}
            divid={`enforcement-action-${name}-value`}
            type="input"
            inputClass="comp-form-control"
            error={field.state.meta.errors?.[0]?.message ?? ""}
            onChange={(evt: any) => field.handleChange(evt.target.value)}
            value={field.state.value}
            placeholder={placeholder}
          />
        )}
      />
    );
  };

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
              {renderDateField("dateIssued", "Date issued", "enforcement-action-date-issued", { required: true })}
            </div>
            <div className="col-6">
              {renderSelectField("issuingOfficer", "Issuing officer", officerOptions, {
                id: "enforcement-action-issuing-officer",
                required: true,
                placeholder: "Select officer",
              })}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              {renderDateField("dateServed", "Date served", "enforcement-action-date-served", { required: true })}
            </div>
            <div className="col-6">
              {renderSelectField("servingOfficer", "Serving officer", officerOptions, {
                id: "enforcement-action-serving-officer",
                required: true,
                placeholder: "Select officer",
              })}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              {renderSelectField("community", "Community", communityOptions, {
                id: "enforcement-action-community",
                required: true,
                placeholder: "Select community",
              })}
            </div>
          </div>

          {isWarning && (
            <div className="row mb-3">
              <div className="col-6">
                {renderTextField("warningNumber", "Warning number", "Enter warning number", { required: true })}
              </div>
            </div>
          )}

          {isViolationTicket && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderSelectField("ticketTypeCode", "Ticket type", ticketTypeOptions, {
                    id: "enforcement-action-ticket-type",
                    required: true,
                    placeholder: "Select ticket type",
                  })}
                </div>
                <div className="col-6">
                  {renderTextField("ticketNumber", "Ticket number", "Enter ticket number", { required: true })}
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
                  {renderSelectField("ticketOutcomeCode", "Status", ticketOutcomeOptions, {
                    id: "enforcement-action-ticket-outcome",
                    required: true,
                    placeholder: "Select status",
                    isClearable: false,
                  })}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderDateField(
                    "appealHearingDate",
                    "Appeal hearing date",
                    "enforcement-action-ticket-appeal-hearing-date",
                  )}
                </div>
              </div>
            </>
          )}

          {isAdministrativeSanction && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderSelectField("sanctionTypeCode", "Sanction type", sanctionTypeOptions, {
                    id: "enforcement-action-sanction-type",
                    required: true,
                    placeholder: "Select sanction type",
                  })}
                </div>
                <div className="col-6">
                  {renderDateField("effectiveDate", "Effective date", "enforcement-action-effective-date", {
                    required: true,
                  })}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderDateField("endDate", "End date", "enforcement-action-end-date", { required: true })}
                </div>
                <div className="col-6">
                  {renderSelectField("sanctionStatusCode", "Status", sanctionStatusOptions, {
                    id: "enforcement-action-sanction-status",
                    required: true,
                    placeholder: "Select status",
                  })}
                </div>
              </div>
            </>
          )}

          {isOrder && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderSelectField("orderTypeCode", "Order type", orderTypeOptions, {
                    id: "enforcement-action-order-type",
                    placeholder: "Select order type",
                  })}
                </div>
                <div className="col-6">
                  {renderYesNoField(
                    "remediationRequired",
                    "Remediation required",
                    "enforcement-action-order-remediation-required",
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderDateField(
                    "appealHearingDate",
                    "Appeal hearing date",
                    "enforcement-action-order-appeal-hearing-date",
                  )}
                </div>
                <div className="col-6">
                  {renderSelectField("orderStatusCode", "Status", orderStatusOptions, {
                    id: "enforcement-action-order-status",
                    required: true,
                    placeholder: "Select status",
                  })}
                </div>
              </div>
            </>
          )}

          {isRestorativeJustice && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderDateField("hearingDate", "Hearing date", "enforcement-action-rj-hearing-date")}
                </div>
                <div className="col-6">
                  {renderDateField("decisionDate", "Decision date", "enforcement-action-rj-decision-date")}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderYesNoField(
                    "remediationRequired",
                    "Remediation required",
                    "enforcement-action-rj-remediation-required",
                  )}
                </div>
              </div>
            </>
          )}

          {isCourtProsecution && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderYesNoField("approvalInd", "Approval", "enforcement-action-cp-approval")}
                </div>
                <div className="col-6">
                  {renderYesNoField(
                    "remediationRequired",
                    "Remediation required",
                    "enforcement-action-cp-remediation-required",
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderSelectField("courtProsecutionStatusCode", "Status", courtProsecutionStatusOptions, {
                    id: "enforcement-action-cp-status",
                    required: true,
                    placeholder: "Select status",
                  })}
                </div>
              </div>
            </>
          )}

          {isAdministrativePenalty && (
            <>
              <div className="row mb-3">
                <div className="col-6">
                  {renderYesNoField("approvalInd", "Approval", "enforcement-action-ap-approval")}
                </div>
                <div className="col-6">
                  {renderYesNoField(
                    "remediationRequired",
                    "Remediation required",
                    "enforcement-action-ap-remediation-required",
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  {renderSelectField("administrativePenaltyStatusCode", "Status", administrativePenaltyStatusOptions, {
                    id: "enforcement-action-ap-status",
                    required: true,
                    placeholder: "Select status",
                  })}
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
