import { FC, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { GET_INVESTIGATION } from "@/app/components/containers/investigations/details/investigation-details";
import InvestigationPartyDetail from "@/app/components/containers/investigations/details/investigation-parties/investigation-party-view";
import { useInvestigationReadOnly } from "../../../hooks/use-investigation-read-only";
import { useUpdatePartyFromSharedParty } from "../../../hooks/use-update-party-from-shared-party";

const InvestigationPartyView: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid = "", partyIdentifier = "" } = useParams<{
    investigationGuid: string;
    partyIdentifier: string;
  }>();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  // Should be a warm cache from the investigation details view
  const { data, isLoading } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
    refetchInterval: 30 * 1000, // poll for shared party changes
  });

  const party = useMemo(
    () =>
      (data?.getInvestigation?.parties ?? []).find(
        (p): p is InvestigationParty => !!p && p.partyIdentifier === partyIdentifier,
      ),
    [data, partyIdentifier],
  );

  const updatePartyFromSharedParty = useUpdatePartyFromSharedParty(investigationGuid);

  const location = useLocation();
  const backTab = location.state?.from === "contraventions" ? "contraventions" : "parties";
  const backLabel = backTab === "contraventions" ? "Contraventions" : "Parties";
  const backToInvestigationTab = () => navigate(`/investigation/${investigationGuid}/${backTab}`);

  if (isLoading) {
    return (
      <div className="comp-details-view">
        <div className="comp-details-content">
          <p>Loading party details...</p>
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="comp-details-view">
        <div className="comp-details-content">
          <p>Party not found.</p>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={backToInvestigationTab}
          >
            <i className="bi bi-arrow-left"></i>
            <span>{backLabel}</span>
          </Button>
        </div>
      </div>
    );
  }

  let editDisabledReason: string | undefined;
  if (isReadOnly) {
    editDisabledReason = "Parties can only be edited on open investigations";
  } else if (party.isUpToDate === false) {
    editDisabledReason = "Parties can only be edited once their information is up-to-date";
  }

  return (
    <InvestigationPartyDetail
      party={party}
      investigationGuid={investigationGuid}
      investigationLabel={data?.getInvestigation?.name ?? undefined}
      onBack={backToInvestigationTab}
      backLabel={backLabel}
      onEdit={() => navigate(`/investigation/${investigationGuid}/party/${partyIdentifier}/edit`)}
      editDisabledReason={editDisabledReason}
      onUpdateParty={
        isReadOnly
          ? undefined
          : () => {
              if (party.partyReference) {
                updatePartyFromSharedParty(partyIdentifier, party.partyReference);
              }
            }
      }
    />
  );
};

export default InvestigationPartyView;
