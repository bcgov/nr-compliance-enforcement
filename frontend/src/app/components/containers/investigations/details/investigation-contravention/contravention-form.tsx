import { FC, useEffect } from "react";
import { Contravention, CreateUpdateContraventionInput, InvestigationParty } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ContraventionDetailsForm, ContraventionDetailsFormValues } from "./contravention-details-form";
import { ContraventionPartyForm, ContraventionPartyFormValues } from "./contravention-party-form";
import { useMultiStepForm } from "@/app/hooks/multi-step-form";

interface ContraventionFormProps {
  currentStep: number;
  activityGuid: string;
  contravention?: Contravention;
  parties?: InvestigationParty[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void;
  onRequestSave: (fn: () => Promise<void>) => void;
  onClose: () => void;
}

const ADD_CONTRAVENTION = gql`
  mutation CreateContravention($input: CreateUpdateContraventionInput!) {
    createContravention(input: $input) {
      investigationGuid
    }
  }
`;

const UPDATE_CONTRAVENTION = gql`
  mutation UpdateContravention($contraventionGuid: String!, $input: CreateUpdateContraventionInput!) {
    updateContravention(contraventionGuid: $contraventionGuid, input: $input) {
      investigationGuid
    }
  }
`;

export const ContraventionForm: FC<ContraventionFormProps> = ({
  currentStep,
  activityGuid,
  contravention,
  parties,
  onDirtyChange,
  onRequestValidate,
  onRequestSave,
  onClose,
}) => {
  const isEditMode = !!contravention;

  const { registerStepValidate, registerStepValues, getStepValues, validateStep } = useMultiStepForm(
    onRequestValidate,
    onRequestSave,
  );

  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error adding contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add contravention");
    },
  });

  const editContraventionMutation = useGraphQLMutation(UPDATE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention updated successfully");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to update contravention");
    },
  });

  // Expose save to MultiStepModal
  useEffect(() => {
    onRequestSave(async () => {
      const isValid = await validateStep(1);
      if (!isValid) return;

      const step1Values = getStepValues<ContraventionDetailsFormValues>(0);
      const step2Values = getStepValues<ContraventionPartyFormValues>(1);
      if (!step1Values || !step2Values) return;

      const input: CreateUpdateContraventionInput = {
        investigationGuid: activityGuid,
        legislationReference: step1Values.selectedSection,
        date: step1Values.contraventionDate,
        community: step1Values.communityCode || null,
        investigationPartyGuids: step2Values.partyType === "unknown" ? [] : step2Values.selectedParties,
      };

      if (isEditMode) {
        editContraventionMutation.mutate({
          contraventionGuid: contravention?.contraventionIdentifier,
          input,
        });
      } else {
        addContraventionMutation.mutate({ input });
      }
    });
  }, [onRequestSave, getStepValues, activityGuid, isEditMode, contravention]);

  // Note: The forms are hidden when not active in order to prevent them from unmounting and losing state
  return (
    <>
      <div className={currentStep === 0 ? "" : "d-none"}>
        <ContraventionDetailsForm
          contravention={contravention}
          onDirtyChange={onDirtyChange}
          onRequestValidate={(fn) => registerStepValidate(0, fn)}
          onRequestValues={(fn) => registerStepValues<ContraventionDetailsFormValues>(0, fn)}
        />
      </div>
      <div className={currentStep === 1 ? "" : "d-none"}>
        <ContraventionPartyForm
          contravention={contravention}
          parties={parties}
          onDirtyChange={onDirtyChange}
          onRequestValidate={(fn) => registerStepValidate(1, fn)}
          onRequestValues={(fn) => registerStepValues<ContraventionPartyFormValues>(1, fn)}
        />
      </div>
    </>
  );
};
