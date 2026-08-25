import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useAppDispatch } from "@/app/hooks/hooks";
import { buildSharedPartyAttachmentReferences } from "@/app/common/attachment-upload-helper";
import { deleteAttachments, getAttachments } from "@/app/store/reducers/attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";

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

      const localAttachments = await dispatch(
        getAttachments(investigationGuid, partyIdentifier, AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT, true),
      );
      if (localAttachments.length) {
        await dispatch(
          deleteAttachments(localAttachments, investigationGuid, AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT),
        );
      }
    } catch (error) {
      console.error("Error updating party:", error);
      ToggleError("Failed to update party");
      return;
    }

    updatePartyMutation.mutate({ investigationGuid, partyIdentifier, attachmentReferences });
  };
};
