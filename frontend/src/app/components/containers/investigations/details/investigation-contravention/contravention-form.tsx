import { FC, useEffect } from "react";
import { Contravention, CreateUpdateContraventionInput, InvestigationParty } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ContraventionDetailsForm, ContraventionDetailsFormValues } from "./contravention-details-form";
import { useMultiStepForm } from "@/app/hooks/multi-step-form";

interface ContraventionFormProps {
  activityGuid: string;
  contravention?: Contravention;
  parties?: InvestigationParty[];
  partyGuid?: string | null;
  discoveryDate?: string | null;
  investigationCommunity?: string | null;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void;
  onRequestSave: (fn: () => Promise<void>) => void;
  onRequestDelete?: (fn: () => Promise<void>) => void;
  onIsSavingChange?: (isSaving: boolean) => void;
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

const REMOVE_CONTRAVENTION = gql`
  mutation RemoveContravention($investigationGuid: String!, $contraventionGuid: String!, $partyGuid: String) {
    removeContravention(
      investigationGuid: $investigationGuid
      contraventionGuid: $contraventionGuid
      partyGuid: $partyGuid
    ) {
      investigationGuid
    }
  }
`;

export const ContraventionForm: FC<ContraventionFormProps> = ({
  activityGuid,
  contravention,
  parties,
  partyGuid,
  discoveryDate,
  investigationCommunity,
  onDirtyChange,
  onRequestValidate,
  onRequestSave,
  onRequestDelete,
  onIsSavingChange,
  onClose,
}) => {
  const isEditMode = !!contravention;

  const { registerStepValidate, registerStepValues, getStepValues, validateStep } = useMultiStepForm(
    onRequestValidate,
    onRequestSave,
  );

  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      onIsSavingChange?.(false);
      ToggleSuccess("Contravention added successfully");
      onClose();
    },
    onError: (error: any) => {
      onIsSavingChange?.(false);
      console.error("Error adding contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to add contravention");
    },
  });

  const editContraventionMutation = useGraphQLMutation(UPDATE_CONTRAVENTION, {
    onSuccess: () => {
      onIsSavingChange?.(false);
      ToggleSuccess("Contravention updated successfully");
      onClose();
    },
    onError: (error: any) => {
      onIsSavingChange?.(false);
      console.error("Error updating contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to update contravention");
    },
  });

  const deleteContraventionMutation = useGraphQLMutation(REMOVE_CONTRAVENTION, {
    onSuccess: () => {
      onIsSavingChange?.(false);
      ToggleSuccess("Contravention deleted successfully");
      onClose();
    },
    onError: (error: any) => {
      onIsSavingChange?.(false);
      console.error("Error deleting contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to delete contravention");
    },
  });

  useEffect(() => {
    onRequestSave(async () => {
      const isDetailsValid = await validateStep(0);
      if (!isDetailsValid) return;

      const step1Values = getStepValues<ContraventionDetailsFormValues>(0);
      if (!step1Values) return;

      const input: CreateUpdateContraventionInput = {
        investigationGuid: activityGuid,
        legislationReference: step1Values.selectedSection,
        date: step1Values.contraventionDate,
        community: step1Values.communityCode || null,
        investigationPartyGuids: step1Values.selectedPartyGuids,
        // selectedPartyGuid identifies the party row being edited, so update() knows which xref to move
        ...(isEditMode ? { selectedPartyGuid: partyGuid } : {}),
      };

      if (isEditMode) {
        onIsSavingChange?.(true);
        editContraventionMutation.mutate({ contraventionGuid: contravention!.contraventionIdentifier, input });
      } else {
        onIsSavingChange?.(true);
        addContraventionMutation.mutate({ input });
      }
    });
  }, [onRequestSave, getStepValues, validateStep, activityGuid, isEditMode, contravention, partyGuid]);

  useEffect(() => {
    if (!onRequestDelete || !isEditMode) return;

    onRequestDelete(async () => {
      if (!contravention?.contraventionIdentifier) return;
      onIsSavingChange?.(true);
      await deleteContraventionMutation.mutateAsync({
        investigationGuid: activityGuid,
        contraventionGuid: contravention.contraventionIdentifier,
        partyGuid: partyGuid ?? null,
      });
    });
  }, [onRequestDelete, contravention, activityGuid, isEditMode, partyGuid]);

  // Note: The forms are hidden when not active in order to prevent them from unmounting and losing state
  return (
    <ContraventionDetailsForm
      contravention={contravention}
      discoveryDate={discoveryDate}
      investigationCommunity={investigationCommunity}
      onDirtyChange={onDirtyChange}
      onRequestValidate={(fn) => registerStepValidate(0, fn)}
      onRequestValues={(fn) => registerStepValues<ContraventionDetailsFormValues>(0, fn)}
      parties={parties}
      partyGuid={partyGuid}
      isEditMode={isEditMode}
    />
  );
};
