import { FC, useEffect, useState } from "react";
import { Contravention, CreateUpdateContraventionInput, InvestigationParty } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ContraventionDetailsForm, ContraventionDetailsFormValues } from "./contravention-details-form";
import { ContraventionPartyForm, ContraventionPartyFormValues } from "./contravention-party-form";

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
  const [validateStep1Fn, setValidateStep1Fn] = useState<(() => Promise<boolean>) | null>(null);
  const [validateStep2Fn, setValidateStep2Fn] = useState<(() => Promise<boolean>) | null>(null);
  const [getStep1Values, setGetStep1Values] = useState<(() => ContraventionDetailsFormValues) | null>(null);
  const [getStep2Values, setGetStep2Values] = useState<(() => ContraventionPartyFormValues) | null>(null);

  const isEditMode = !!contravention;

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

  // Expose validate to MultiStepModal
  useEffect(() => {
    onRequestValidate(async (step: number) => {
      if (step === 0) {
        return (await validateStep1Fn?.()) ?? false;
      }
      if (step === 1) {
        return (await validateStep2Fn?.()) ?? false;
      }
      return true;
    });
  }, [validateStep1Fn, validateStep2Fn, onRequestValidate]);

  // Expose save to MultiStepModal
  useEffect(() => {
    onRequestSave(async () => {
      const isValid = await validateStep2Fn?.();
      if (!isValid) return;

      const step1Values = getStep1Values?.();
      const step2Values = getStep2Values?.();
      if (!step1Values || !step2Values) return;

      const input: CreateUpdateContraventionInput = {
        investigationGuid: activityGuid,
        legislationReference: step1Values.selectedSection,
        investigationPartyGuids: step2Values.selectedParties,
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
  }, [validateStep2Fn, getStep1Values, getStep2Values, activityGuid, isEditMode, contravention]);

  return (
    <>
      {currentStep === 0 && (
        <ContraventionDetailsForm
          contravention={contravention}
          onDirtyChange={onDirtyChange}
          onRequestValidate={(fn) => setValidateStep1Fn(() => fn)}
          onRequestValues={(fn) => setGetStep1Values(() => fn)}
        />
      )}
      {currentStep === 1 && (
        <ContraventionPartyForm
          contravention={contravention}
          parties={parties}
          onDirtyChange={onDirtyChange}
          onRequestValidate={(fn) => setValidateStep2Fn(() => fn)}
          onRequestValues={(fn) => setGetStep2Values(() => fn)}
        />
      )}
    </>
  );
};
