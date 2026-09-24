import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { SAVE_CONFIRM } from "@/app/types/modal/modal-types";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { fetchAttachmentsWithMetadata } from "@common/attachment-utils";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CaseActivities } from "@/app/constants/case-activities";
import { useInvestigationReadOnly } from "../hooks/use-investigation-read-only";
import { useUpdatePartyFromSharedParty } from "../hooks/use-update-party-from-shared-party";

interface InvestigationPartiesProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const REMOVE_PARTY_FROM_INVESTIGATION_MUTATION = gql`
  mutation RemovePartyFromInvestigation($investigationGuid: String!, $partyIdentifier: String!) {
    removePartyFromInvestigation(investigationGuid: $investigationGuid, partyIdentifier: $partyIdentifier) {
      investigationGuid
      parties {
        partyIdentifier
        person {
          firstName
          lastName
          personGuid
        }
        business {
          name
          businessGuid
        }
      }
    }
  }
`;

export const InvestigationParties: FC<InvestigationPartiesProps> = ({ investigationGuid, investigationData }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  const removePartyMutation = useGraphQLMutation(REMOVE_PARTY_FROM_INVESTIGATION_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing party:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove party");
    },
  });

  const updatePartyFromSharedParty = useUpdatePartyFromSharedParty(investigationGuid);

  const handleAddParty = () => {
    navigate(`/investigation/${investigationGuid}/party/add`);
  };

  const parties = (investigationData?.parties ?? []).filter(Boolean) as InvestigationParty[];

  // Fetch parties on contraventions so we can unlink them and leave dirty data
  const partiesOnContraventions = useMemo(
    () =>
      new Set(
        (investigationData?.contraventions ?? []).flatMap(
          (contravention) =>
            contravention?.investigationParty
              ?.map((party) => party?.partyIdentifier)
              .filter((partyIdentifier): partyIdentifier is string => !!partyIdentifier) ?? [],
        ),
      ),
    [investigationData?.contraventions],
  );

  // taken by is not in the db so we need to fetch against object store
  const { data: attachments, isLoading: isLoadingAttachments } = useQuery({
    queryKey: ["investigation-attachment-taken-by", investigationGuid],
    queryFn: () => fetchAttachmentsWithMetadata(investigationGuid),
    staleTime: 5 * 60 * 1000,
    enabled: !isReadOnly,
  });

  const partiesTakenByAttachment = useMemo(
    () =>
      new Set(
        (attachments ?? []).map((attachment) => attachment.takenBy).filter((takenBy): takenBy is string => !!takenBy),
      ),
    [attachments],
  );

  const removeBlockedReason = useCallback(
    (party: { partyIdentifier: string }): string | null => {
      // Prevent accidental removal in case coms request times out
      if (isLoadingAttachments) {
        return "Checking whether this party can be removed.";
      }
      if (partiesOnContraventions.has(party.partyIdentifier)) {
        return "This party is associated with a contravention and cannot be removed.";
      }
      if (partiesTakenByAttachment.has(party.partyIdentifier)) {
        return "This party is associated with attachments that were taken by them and cannot be removed.";
      }
      return null;
    },
    [isLoadingAttachments, partiesOnContraventions, partiesTakenByAttachment],
  );

  const handleRemoveParty = useCallback(
    (partyIdentifier: string, partyName: string) => {
      // "Taken by" only exists in the object store, so the refusal has to be explained here
      const blockedReason = removeBlockedReason({ partyIdentifier });
      if (blockedReason) {
        ToggleError(blockedReason);
        return;
      }

      dispatch(
        openModal({
          modalSize: "md",
          modalType: SAVE_CONFIRM,
          data: {
            title: "Remove Party",
            description: `Are you sure you want to remove ${partyName} from this investigation? This action cannot be undone.`,
            cancelText: "No, go back",
            saveText: "Yes, remove party",
          },
          callback: () => {
            removePartyMutation.mutate({
              investigationGuid: investigationGuid,
              partyIdentifier: partyIdentifier,
            });
          },
        }),
      );
    },
    [dispatch, investigationGuid, removePartyMutation, removeBlockedReason],
  );

  return (
    <>
      <div className="row align-items-center">
        <div className="col">
          <h2 className="mb-0">Parties</h2>
        </div>
        <div className="col-auto">
          <Button
            id="add-party-button"
            variant="primary"
            size="sm"
            onClick={handleAddParty}
            disabled={isReadOnly}
          >
            <i className="bi bi-plus-circle me-1" /> {/**/}
            Add party
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <PartiesList
            parties={parties}
            onRemoveParty={isReadOnly ? undefined : handleRemoveParty}
            onViewParty={(partyIdentifier) => navigate(`/investigation/${investigationGuid}/party/${partyIdentifier}`)}
            onUpdateParty={
              isReadOnly
                ? undefined
                : (partyIdentifier) => {
                    const partyReference = parties.find((p) => p.partyIdentifier === partyIdentifier)?.partyReference;
                    if (partyReference) {
                      updatePartyFromSharedParty(partyIdentifier, partyReference);
                    }
                  }
            }
            activityType={CaseActivities.INVESTIGATION}
          />
        </div>
      </div>
    </>
  );
};

export default InvestigationParties;
