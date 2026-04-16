import { Contravention, InspectionParty, InvestigationParty } from "@/generated/graphql";
import { useCallback, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import Option from "@apptypes/app/option";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { FormField } from "@/app/components/common/form-field";

import z from "zod";
import { CardOption, CardOptionSelector } from "@/app/components/common/card-option";

export interface ContraventionPartyFormValues {
  partyType: string;
  selectedParties: string[];
  partyGuid?: string | null;
}

interface ContraventionPartyFormProps {
  contravention?: Contravention;
  parties?: InvestigationParty[];
  partyGuid?: string | null;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate?: (validateFn: () => Promise<boolean>) => void;
  onRequestValues?: (valuesFn: () => ContraventionPartyFormValues) => void;
}

export const ContraventionPartyForm = ({
  contravention,
  parties,
  partyGuid,
  onDirtyChange,
  onRequestValidate,
  onRequestValues,
}: ContraventionPartyFormProps) => {
  const form = useForm({
    defaultValues: {
      partyType: "",
      selectedParties: [] as Option[],
      selectedParty: partyGuid ?? "",
    },
    onSubmit: async () => {},
  });

  const { markDirty } = useFormDirtyState(onDirtyChange);

  const partyType = useStore(form.baseStore, (state) => state.values.partyType);

  const partyOptions: Option[] =
    parties
      ?.filter((p: InvestigationParty | InspectionParty) => p.partyAssociationRole === "PTYOFINTRST")
      .map((party: InvestigationParty | InspectionParty) => ({
        value: party.partyIdentifier,
        label: party.business ? party.business.name : `${party?.person?.lastName}, ${party?.person?.firstName}`,
      })) ?? [];

  const hasParties = partyOptions.length > 0;

  const partyTypeOptions: CardOption[] = [
    {
      value: "known",
      label: "Known party",
      description: hasParties ? "Identified individual or entity" : "No parties of interest added to investigation",
      icon: "bi bi-person",
      disabled: !hasParties,
      disabledMessage: "No parties of interest have been added to this investigation",
    },
    {
      value: "unknown",
      label: "Unknown party",
      description: "Unidentified individual or entity",
      icon: "bi bi-person-x",
    },
  ];

  // Edit mode - populate parties
  useEffect(() => {
    const existingParties = contravention?.investigationParty;
    if (!existingParties) return;

    // Set party type based on whether parties exist
    const partyType = existingParties.length > 0 ? "known" : "unknown";
    form.setFieldValue("partyType", partyType);
    form.setFieldMeta("partyType", (meta) => ({ ...meta, isDirty: false, isTouched: false }));

    // Populate parties if known
    if (existingParties.length > 0) {
      const options: Option[] = existingParties
        .filter((party): party is NonNullable<typeof party> => party !== null)
        .map((party) => ({
          value: party.partyIdentifier,
          label: party.business ? party.business.name : `${party.person?.lastName}, ${party.person?.firstName}`,
        }));
      form.setFieldValue("selectedParties", options);
      form.setFieldMeta("selectedParties", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    }
  }, [contravention?.investigationParty]);

  // Expose validate to modal
  const handleValidate = useCallback(async (): Promise<boolean> => {
    await form.handleSubmit();
    const hasErrors = Object.values(form.state.fieldMeta).some((field) => field?.errors && field.errors.length > 0);
    return !hasErrors;
  }, [form]);

  useEffect(() => {
    onRequestValidate?.(handleValidate);
  }, [onRequestValidate, handleValidate]);

  // Expose values to modal
  const getValues = useCallback(
    (): ContraventionPartyFormValues => ({
      partyType: form.getFieldValue("partyType"),
      selectedParties: form.getFieldValue("selectedParties").flatMap((p) => (p.value ? [p.value] : [])),
    }),
    [form],
  );

  useEffect(() => {
    onRequestValues?.(getValues);
  }, [onRequestValues, getValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormField
        form={form}
        name="partyType"
        label="Select party type"
        required
        validators={{
          onSubmit: z.enum(["known", "unknown"], {
            message: "Please select a party type",
          }),
        }}
        render={(field) => (
          <CardOptionSelector
            id="party-type"
            options={partyTypeOptions}
            value={field.state.value}
            onChange={(value) => {
              markDirty();
              field.handleChange(value);
            }}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
          />
        )}
      />

      <div className={partyType === "known" ? "pt-3" : "d-none"}>
        <FormField
          form={form}
          name="selectedParties"
          label="Name"
          required
          validators={{
            onSubmit: z
              .array(z.object({ value: z.string(), label: z.string() }))
              .refine((val) => form.getFieldValue("partyType") !== "known" || val.length > 0, {
                message: "At least one party is required",
              }),
          }}
          render={(field) => (
            <ValidationMultiSelect
              id="party-select"
              classNamePrefix="comp-select"
              className="comp-details-input"
              options={partyOptions}
              values={field.state.value}
              onChange={(option: Option) => {
                field.handleChange(option);
                markDirty();
              }}
              placeholder="Select names"
              isClearable={true}
              errMsg={field.state.meta.errors?.[0]?.message || ""}
            />
          )}
        />
      </div>
    </form>
  );
};
