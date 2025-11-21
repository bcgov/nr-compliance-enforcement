import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { Contravention } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useCallback } from "react";
import { Button } from "react-bootstrap";

interface ContraventionItemProps {
  contravention: Contravention;
  investigationGuid: string;
  index: number;
}

export const ContraventionItem = ({ contravention, investigationGuid, index }: ContraventionItemProps) => {
  const REMOVE_CONTRAVENTION = gql`
    mutation RemoveContravention($investigationGuid: String!, $contraventionGuid: String!) {
      removeContravention(investigationGuid: $investigationGuid, contraventionGuid: $contraventionGuid) {
        investigationGuid
      }
    }
  `;

  const removeContraventionMutation = useGraphQLMutation(REMOVE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove contravention");
    },
  });

  const legislation = useLegislation(contravention.legislationIdentifierRef);
  const legislationData = legislation?.data?.legislation;

  const renderLegislation = () => {
    if (!legislationData) return "Loading...";
    const displayText = legislationData.alternateText ?? legislationData.legislationText;
    return `${legislationData.fullCitation} : ${displayText}`;
  };

  const dispatch = useAppDispatch();

  const handleRemoveContravention = useCallback(
    (contraventionGuid: string) => {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: DELETE_CONFIRM,
          data: {
            title: "Remove Contravention",
            description: `Are you sure you want to remove this contravention from this investigation? This action cannot be undone.`,
            deleteConfirmed: () => {},
          },
          callback: () => {
            removeContraventionMutation.mutate({
              investigationGuid: investigationGuid,
              contraventionGuid: contraventionGuid,
            });
          },
        }),
      );
    },
    [dispatch, investigationGuid, removeContraventionMutation],
  );

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <dt>Contravention {index + 1} (Alleged)</dt>
        <Button
          variant="outline-primary"
          size="sm"
          id="details-screen-edit-button"
          onClick={() => handleRemoveContravention(contravention?.contraventionIdentifier)}
        >
          <i className="bi bi-trash"></i>
          <span>Delete</span>
        </Button>
      </div>
      <div className="contravention-item p-3 mb-2">{renderLegislation()}</div>
    </>
  );
};
