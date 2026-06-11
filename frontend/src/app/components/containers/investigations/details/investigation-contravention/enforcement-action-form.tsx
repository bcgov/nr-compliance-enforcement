import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
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
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { selectEnforcementActionsByAgency, selectTicketOutcomes } from "@/app/store/reducers/code-table-selectors";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import {
  EnforcementActionAttachmentSection,
  EnforcementActionAttachmentSectionHandle,
} from "./enforcement-action-attachment-section";
import { EnforcementActionAttachment } from "@/app/common/enforcement-action-attachment-utils";

const VIOLATION_TICKET_CODES = new Set(["FDVT", "PRVT"]);

const UPDATE_INVESTIGATION_TIMESTAMP = gql`
  mutation UpdateInvestigationTimestamp($investigationGuid: String!) {
    updateInvestigationTimestamp(investigationGuid: $investigationGuid) {
      investigationGuid
      updatedTimestamp
    }
  }
`;

const CREATE_ENFORCEMENT_ACTION = gql`
  mutation CreateEnforcementAction($input: CreateEnforcementActionInput!) {
    createEnforcementAction(input: $input) {
      enforcementActionIdentifier
      enforcementActionCode {
        enforcementActionCode
        shortDescription
      }
      dateIssued
      geoOrganizationUnitCode
      appUserIdentifier
      activeIndicator
      ticket {
        ticketIdentifier
        ticketOutcomeCode
        ticketAmount
        ticketNumber
        paidDate
      }
    }
  }
`;

const UPDATE_ENFORCEMENT_ACTION = gql`
  mutation UpdateEnforcementAction($input: UpdateEnforcementActionInput!) {
    updateEnforcementAction(input: $input) {
      enforcementActionIdentifier
      enforcementActionCode {
        enforcementActionCode
        shortDescription
      }
      dateIssued
      geoOrganizationUnitCode
      appUserIdentifier
      activeIndicator
      ticket {
        ticketIdentifier
        ticketOutcomeCode
        ticketAmount
        ticketNumber
        paidDate
      }
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

  const currentUserGuid = useAppSelector(selectAppUserGuid);
  const agency = useAppSelector(selectOfficerAgency);
  const officersInAgency = useAppSelector((state) => selectOfficersByAgency(state, agency));
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const enforcementActionSelector = useMemo(() => selectEnforcementActionsByAgency(agency), [agency]);
  const enforcementActionOptions = useAppSelector(enforcementActionSelector);
  const ticketOutcomeOptions = useAppSelector(selectTicketOutcomes);

  const communityOptions = areaCodes.map((c) => ({
    value: c.area ?? "",
    label: c.areaName ?? "",
  }));

  const officerOptions = [...(officersInAgency ?? [])].map((o) => ({
    value: o.app_user_guid,
    label: `${o.last_name}, ${o.first_name}`,
  }));

  const [isViolationTicket, setIsViolationTicket] = useState(
    VIOLATION_TICKET_CODES.has(enforcementAction?.enforcementActionCode?.enforcementActionCode ?? ""),
  );

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

  const form = useForm({
    defaultValues: {
      dateIssued: enforcementAction?.dateIssued ? new Date(enforcementAction.dateIssued) : new Date(),
      community: enforcementAction?.geoOrganizationUnitCode ?? contravention?.community ?? "",
      servingOfficer: enforcementAction?.appUserIdentifier ?? currentUserGuid ?? "",
      enforcementActionCode: enforcementAction?.enforcementActionCode?.enforcementActionCode ?? "",
      ticketAmount: enforcementAction?.ticket?.ticketAmount?.toString() ?? "",
      ticketNumber: enforcementAction?.ticket?.ticketNumber ?? "",
      ticketOutcomeCode: enforcementAction?.ticket?.ticketOutcomeCode ?? "ISUD",
      paidDate: enforcementAction?.ticket?.paidDate ? new Date(enforcementAction.ticket.paidDate) : null,
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

  // Expose save to modal
  useEffect(() => {
    onRequestSave(async () => {
      const formValid = await validateForm();
      if (!formValid) return;

      const value = form.state.values;
      const paidDate =
        value.ticketOutcomeCode === "PAID" && value.paidDate ? new Date(value.paidDate).toISOString() : null;
      onIsSavingChange?.(true);
      try {
        let enforcementActionId: string;
        if (isEdit) {
          const input: UpdateEnforcementActionInput = {
            enforcementActionIdentifier: enforcementAction!.enforcementActionIdentifier,
            enforcementActionCode: value.enforcementActionCode,
            dateIssued: value.dateIssued,
            geoOrganizationUnitCode: value.community,
            appUserIdentifier: value.servingOfficer,
            ...(isViolationTicket && {
              ticketOutcomeCode: value.ticketOutcomeCode,
              ticketAmount: Number.parseFloat(value.ticketAmount),
              ticketNumber: value.ticketNumber,
              paidDate,
            }),
          };
          await updateMutation.mutateAsync({ input });
          enforcementActionId = enforcementAction!.enforcementActionIdentifier;
        } else {
          const input: CreateEnforcementActionInput = {
            contraventionIdentifier: contravention?.contraventionIdentifier ?? "",
            partyIdentifier: party?.partyIdentifier ?? "",
            enforcementActionCode: value.enforcementActionCode,
            dateIssued: value.dateIssued,
            geoOrganizationUnitCode: value.community,
            appUserIdentifier: value.servingOfficer,
            ...(isViolationTicket && {
              ticketOutcomeCode: value.ticketOutcomeCode,
              ticketAmount: Number.parseFloat(value.ticketAmount),
              ticketNumber: value.ticketNumber,
              paidDate,
            }),
          };
          const created: any = await saveMutation.mutateAsync({ input });
          enforcementActionId = created.createEnforcementAction.enforcementActionIdentifier;
        }

        // Attachments and timestamp update are best effort but do not block the save
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
        } catch (sideEffectError) {
          console.error("Enforcement action saved, but a post-save update failed", sideEffectError);
        }

        ToggleSuccess(isEdit ? "Enforcement action updated successfully" : "Enforcement action saved successfully");
        onDirtyChange?.(0, false);
        onClose();
      } catch {
        ToggleError(isEdit ? "Failed to update enforcement action" : "Failed to save enforcement action");
      } finally {
        onIsSavingChange?.(false);
      }
    });
  }, [onRequestSave, isEdit, isViolationTicket, enforcementAction, contravention, party, investigationGuid]);

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
        ToggleSuccess("Enforcement action deleted successfully");
        onDirtyChange?.(0, false);
        onClose();
      } catch {
        ToggleError("Failed to delete enforcement action");
      } finally {
        onIsSavingChange?.(false);
      }
    });
  }, [onRequestDelete, isEdit, enforcementAction, investigationGuid]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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

      <div className="row mb-3">
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
        <div className="col-6">
          <FormField
            form={form}
            name="enforcementActionCode"
            label="Enforcement action"
            required
            validators={{
              onChange: z.string().min(1, "Enforcement action is required"),
              onSubmit: z.string().min(1, "Enforcement action is required"),
            }}
            render={(field) => (
              <CompSelect
                id="enforcement-action-code"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={enforcementActionOptions}
                value={enforcementActionOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  field.handleChange(option?.value ?? "");
                  setIsViolationTicket(VIOLATION_TICKET_CODES.has(option?.value ?? ""));
                }}
                placeholder="Select enforcement action"
                isClearable
                showInactive={false}
                enableValidation
                errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
              />
            )}
          />
        </div>
      </div>

      {isViolationTicket && (
        <>
          <div className="row mb-3">
            <div className="col-6">
              <FormField
                form={form}
                name="ticketAmount"
                label="Ticket amount"
                required
                validators={{
                  onChange: z.string().min(1, "Ticket amount is required"),
                  onSubmit: z.string().min(1, "Ticket amount is required"),
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
                    placeholder="Enter ticket amount"
                  />
                )}
              />
            </div>
            <div className="col-6">
              <FormField
                form={form}
                name="ticketOutcomeCode"
                label="Ticket outcome"
                required
                validators={{
                  onChange: z.string().min(1, "Ticket outcome is required"),
                  onSubmit: z.string().min(1, "Ticket outcome is required"),
                }}
                render={(field) => (
                  <CompSelect
                    id="enforcement-action-ticket-outcome"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={ticketOutcomeOptions}
                    value={ticketOutcomeOptions.find((opt) => opt.value === field.state.value)}
                    onChange={(option) => field.handleChange(option?.value ?? "")}
                    placeholder="Select outcome"
                    isClearable={false}
                    showInactive={false}
                    enableValidation
                    errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
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
            <form.Subscribe selector={(state) => state.values.ticketOutcomeCode}>
              {(ticketOutcomeCode) =>
                ticketOutcomeCode === "PAID" && (
                  <div className="col-6">
                    <FormField
                      form={form}
                      name="paidDate"
                      label="Date paid"
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
                          id="enforcement-action-date-paid"
                          onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                          selectedDate={field.state.value}
                          errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                          vertical={true}
                        />
                      )}
                    />
                  </div>
                )
              }
            </form.Subscribe>
          </div>
        </>
      )}

      <EnforcementActionAttachmentSection
        ref={attachmentsRef}
        investigationGuid={investigationGuid}
        existingAttachments={existingAttachments}
        onDirtyChange={setAttachmentsDirty}
      />
    </form>
  );
};
