import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useAppDispatch } from "@/app/hooks/hooks";
import { buildSharedPartyAttachmentReferences } from "@/app/common/attachment-upload-helper";

const UPDATE_INVESTIGATION_PARTY_FROM_SHARED_PARTY_MUTATION = gql`
  mutation UpdateInvestigationPartyFromSharedParty(
    $investigationGuid: String!
    $partyIdentifier: String!
    $attachmentReferences: [CreateAttachmentReferenceInput]
  ) {
    updateInvestigationPartyFromSharedParty(
      investigationGuid: $investigationGuid
      partyIdentifier: $partyIdentifier
      attachmentReferences: $attachmentReferences
    ) {
      investigationGuid
    }
  }
`;

export const useUpdatePartyFromSharedParty = (investigationGuid: string) => {
  const dispatch = useAppDispatch();

  const updatePartyMutation = useGraphQLMutation(UPDATE_INVESTIGATION_PARTY_FROM_SHARED_PARTY_MUTATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: () => {
      ToggleSuccess("Party updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to update party");
    },
  });

  // Attachments are pinned from COMS before the update, since only the client can reach COMS
  return async (partyIdentifier: string, partyReference: string) => {
    let attachmentReferences;

    try {
      attachmentReferences = await buildSharedPartyAttachmentReferences({
        dispatch,
        sharedPartyGuid: partyReference,
      });
    } catch (error) {
      console.error("Error updating party:", error);
      ToggleError("Failed to update party");
      return;
    }

    updatePartyMutation.mutate({ investigationGuid, partyIdentifier, attachmentReferences });
  };
};
