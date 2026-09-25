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
import { StatusChangeAdvisoryDetail } from "@/app/components/common/change-status-modal";
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

  // Removing a party that other records point at would leave those records linked to nothing
  const contraventionCountByParty = useMemo(() => {
    const counts = new Map<string, number>();
    for (const contravention of investigationData?.contraventions ?? []) {
      // A party is only counted once per contravention even if listed on it more than once
      const partyIdentifiers = new Set(
        (contravention?.investigationParty ?? [])
          .map((party) => party?.partyIdentifier)
          .filter((partyIdentifier): partyIdentifier is string => !!partyIdentifier),
      );
      for (const partyIdentifier of partyIdentifiers) {
        counts.set(partyIdentifier, (counts.get(partyIdentifier) ?? 0) + 1);
      }
    }
    return counts;
  }, [investigationData?.contraventions]);

  // taken by is not in the db so we need to fetch against object store
  const { data: attachments, isLoading: isLoadingAttachments } = useQuery({
    queryKey: ["investigation-attachment-taken-by", investigationGuid],
    queryFn: () => fetchAttachmentsWithMetadata(investigationGuid),
    staleTime: 5 * 60 * 1000,
    enabled: !isReadOnly,
  });

  const attachmentCountByParty = useMemo(() => {
    const counts = new Map<string, number>();
    for (const attachment of attachments ?? []) {
      if (attachment.takenBy) {
        counts.set(attachment.takenBy, (counts.get(attachment.takenBy) ?? 0) + 1);
      }
    }
    return counts;
  }, [attachments]);

  const getRemoveBlockedReasons = useCallback(
    (partyIdentifier: string, partyName: string): StatusChangeAdvisoryDetail[] => {
      // Prevent accidental removal in case coms request times out
      if (isLoadingAttachments) {
        return [{ id: "checking", content: <>Still checking whether {partyName} can be removed.</> }];
      }

      const reasons: StatusChangeAdvisoryDetail[] = [];
      const contraventionCount = contraventionCountByParty.get(partyIdentifier) ?? 0;
      const attachmentCount = attachmentCountByParty.get(partyIdentifier) ?? 0;

      if (contraventionCount > 0) {
        reasons.push({
          id: "contraventions",
          content: (
            <>
              {partyName} is associated with{" "}
              <strong>
                {contraventionCount} {contraventionCount === 1 ? "contravention" : "contraventions"}
              </strong>
              {"."}
            </>
          ),
        });
      }

      if (attachmentCount > 0) {
        reasons.push({
          id: "attachments",
          content: (
            <>
              {partyName} has{" "}
              <strong>
                {attachmentCount} {attachmentCount === 1 ? "attachment" : "attachments"}
              </strong>{" "}
              they have taken.
            </>
          ),
        });
      }

      return reasons;
    },
    [isLoadingAttachments, contraventionCountByParty, attachmentCountByParty],
  );

  const handleRemoveParty = useCallback(
    (partyIdentifier: string, partyName: string) => {
      // "Taken by" only exists in the object store, so the refusal has to be explained here
      const reasons = getRemoveBlockedReasons(partyIdentifier, partyName);
      const isBlocked = reasons.length > 0;

      dispatch(
        openModal({
          modalSize: "md",
          modalType: SAVE_CONFIRM,
          data: {
            title: "Remove Party",
            ...(isBlocked
              ? {
                  warning: (
                    <>
                      {partyName} <strong>cannot be removed</strong> from this investigation for the following reasons:
                    </>
                  ),
                  reasons,
                  cancelText: "Close",
                }
              : {
                  description: `Are you sure you want to remove ${partyName} from this investigation? This action cannot be undone.`,
                  cancelText: "No, go back",
                }),
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
    [dispatch, investigationGuid, removePartyMutation, getRemoveBlockedReasons],
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
