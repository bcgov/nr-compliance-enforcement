import { FC, useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";
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
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectModalData, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { LegislationText } from "@/app/components/common/legislation-text";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { selectEnforcementActionsByAgency, selectTicketOutcomes } from "@/app/store/reducers/code-table-selectors";
import {
  CREATE_ENFORCEMENT_ACTION,
  getPartyLabel,
  UPDATE_ENFORCEMENT_ACTION,
} from "@/app/components/containers/investigations/details/investigation-contravention";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { CompInput } from "@/app/components/common/comp-input";

const VIOLATION_TICKET_CODES = ["FDVT", "PRVT"];

type AddEditEnforcementActionModalProps = {
  close: () => void;
  submit: () => void;
};

const LegislationDisplay: FC<{ legislationIdentifierRef: string }> = ({ legislationIdentifierRef }) => {
  const legislation = useLegislation(legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;
  if (!legislationData) return <span>Loading...</span>;
  const displayText = legislationData.alternateText ?? legislationData.legislationText;
  return (
    <>
      {legislationData.fullCitation} : <LegislationText>{displayText}</LegislationText>
    </>
  );
};

export const AddEditEnforcementActionModal: FC<AddEditEnforcementActionModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { contravention, party, enforcementAction, onDirtyChange } = modalData ?? {};

  const isEdit = !!enforcementAction;

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
    VIOLATION_TICKET_CODES.includes(
      (enforcementAction as EnforcementAction)?.enforcementActionCode?.enforcementActionCode ?? "",
    ),
  );

  const saveMutation = useGraphQLMutation(CREATE_ENFORCEMENT_ACTION, {
    onSuccess: () => {
      ToggleSuccess("Enforcement action saved successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to save enforcement action");
    },
  });

  const updateMutation = useGraphQLMutation(UPDATE_ENFORCEMENT_ACTION, {
    onSuccess: () => {
      ToggleSuccess("Enforcement action updated successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to update enforcement action");
    },
  });

  const isSaving = saveMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      dateIssued: enforcementAction?.dateIssued ? new Date(enforcementAction.dateIssued) : new Date(),
      community: enforcementAction?.geoOrganizationUnitCode ?? (contravention as Contravention)?.community ?? "",
      servingOfficer: enforcementAction?.appUserIdentifier ?? currentUserGuid ?? "",
      enforcementActionCode: enforcementAction?.enforcementActionCode?.enforcementActionCode ?? "",
      ticketAmount: enforcementAction?.ticket?.ticketAmount?.toString() ?? "",
      ticketNumber: enforcementAction?.ticket?.ticketNumber ?? "",
      ticketOutcomeCode: enforcementAction?.ticket?.ticketOutcomeCode ?? "ISSUED",
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        const input: UpdateEnforcementActionInput = {
          enforcementActionIdentifier: enforcementAction.enforcementActionIdentifier,
          enforcementActionCode: value.enforcementActionCode,
          dateIssued: value.dateIssued,
          geoOrganizationUnitCode: value.community,
          appUserIdentifier: value.servingOfficer,
          ...(isViolationTicket && {
            ticketOutcomeCode: value.ticketOutcomeCode,
            ticketAmount: Number.parseFloat(value.ticketAmount),
            ticketNumber: value.ticketNumber,
          }),
        };
        await updateMutation.mutateAsync({ input });
      } else {
        const input: CreateEnforcementActionInput = {
          contraventionIdentifier: (contravention as Contravention)?.contraventionIdentifier,
          partyIdentifier: (party as InvestigationParty)?.partyIdentifier,
          enforcementActionCode: value.enforcementActionCode,
          dateIssued: value.dateIssued,
          geoOrganizationUnitCode: value.community,
          appUserIdentifier: value.servingOfficer,
          ...(isViolationTicket && {
            ticketOutcomeCode: value.ticketOutcomeCode,
            ticketAmount: Number.parseFloat(value.ticketAmount),
            ticketNumber: value.ticketNumber,
          }),
        };
        await saveMutation.mutateAsync({ input });
      }
    },
  });

  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  const handleClose = () => {
    markClean();
    form.reset();
    close();
  };

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

  return (
    <>
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>{isEdit ? "Edit enforcement action" : "Add enforcement action"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* View-only fields */}
        <div className="comp-view-field mb-3">
          <div className="mb-2">
            <span className="comp-view-field__label">Party</span>
            <span className="comp-view-field__value">{getPartyLabel(party)}</span>
          </div>
          <div>
            <span className="comp-view-field__label">Contravention</span>
            <span className="comp-view-field__value">
              <LegislationDisplay
                legislationIdentifierRef={(contravention as Contravention)?.legislationIdentifierRef}
              />
            </span>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
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
                      setIsViolationTicket(VIOLATION_TICKET_CODES.includes(option?.value ?? ""));
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
                      <input
                        id="enforcement-action-ticket-amount"
                        type="number"
                        className="form-control comp-details-input"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter ticket amount"
                        min={0}
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
              </div>
            </>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex gap-2 ms-auto">
          <Button
            variant="outline-primary"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => form.handleSubmit()}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
