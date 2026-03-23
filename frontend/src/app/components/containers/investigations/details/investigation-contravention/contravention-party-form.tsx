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
}

interface ContraventionPartyFormProps {
  contravention?: Contravention;
  parties?: InvestigationParty[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate?: (validateFn: () => Promise<boolean>) => void;
  onRequestValues?: (valuesFn: () => ContraventionPartyFormValues) => void;
}

const PARTY_TYPE_OPTIONS: CardOption[] = [
  {
    value: "known",
    label: "Known party",
    description: "Identified individual or entity",
    icon: "bi bi-person",
  },
  {
    value: "unknown",
    label: "Unknown party",
    description: "Unidentified individual or entity",
    icon: "bi bi-person-x",
  },
];

export const ContraventionPartyForm = ({
  contravention,
  parties,
  onDirtyChange,
  onRequestValidate,
  onRequestValues,
}: ContraventionPartyFormProps) => {
  const form = useForm({
    defaultValues: {
      partyType: "",
      selectedParties: [] as Option[],
    },
    onSubmit: async () => {},
  });

  const { markDirty } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  const partyType = useStore(form.baseStore, (state) => state.values.partyType);

  const partyOptions: Option[] =
    parties
      ?.filter((p: InvestigationParty | InspectionParty) => p.partyAssociationRole === "PTYOFINTRST")
      .map((party: InvestigationParty | InspectionParty) => ({
        value: party.partyIdentifier,
        label: party.business ? party.business.name : `${party?.person?.lastName}, ${party?.person?.firstName}`,
      })) ?? [];

  // Edit mode - populate parties
  useEffect(() => {
    const existingParties = contravention?.investigationParty;
    if (!existingParties) return;
    const options: Option[] = existingParties
      .filter((party): party is NonNullable<typeof party> => party !== null)
      .map((party) => ({
        value: party.partyIdentifier,
        label: party.business ? party.business.name : `${party.person?.lastName}, ${party.person?.firstName}`,
      }));
    form.setFieldValue("selectedParties", options);
    form.setFieldMeta("selectedParties", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
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
        render={(field) => (
          <CardOptionSelector
            id="party-type"
            options={PARTY_TYPE_OPTIONS}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
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
              .refine((val) => form.getFieldValue("partyType") === "unknown" || val.length > 0, {
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
