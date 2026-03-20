import { Contravention, InspectionParty, InvestigationParty } from "@/generated/graphql";
import { useCallback, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import Option from "@apptypes/app/option";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { FormField } from "@/app/components/common/form-field";

export interface ContraventionPartyFormValues {
  selectedParties: string[];
}

interface ContraventionPartyFormProps {
  contravention?: Contravention;
  parties?: InvestigationParty[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate?: (validateFn: () => Promise<boolean>) => void;
  onRequestValues?: (valuesFn: () => ContraventionPartyFormValues) => void;
}

export const ContraventionPartyForm = ({
  contravention,
  parties,
  onDirtyChange,
  onRequestValidate,
  onRequestValues,
}: ContraventionPartyFormProps) => {
  const form = useForm({
    defaultValues: {
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

  // Mark Dirty on mount since we are a substep in a multi-step form
  useEffect(() => {
    markDirty();
  }, []);

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

  // Expose validate to modal - no required fields for now
  const handleValidate = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  useEffect(() => {
    onRequestValidate?.(handleValidate);
  }, [onRequestValidate, handleValidate]);

  // Expose values to modal
  const getValues = useCallback(
    (): ContraventionPartyFormValues => ({
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
        name="selectedParties"
        label="Party"
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
            placeholder="Select party"
            isClearable={true}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
          />
        )}
      />
    </form>
  );
};
