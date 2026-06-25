import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { GET_INVESTIGATION } from "@/app/components/containers/investigations/details/investigation-details";
import InvestigationPartyDetail from "@/app/components/containers/investigations/details/investigation-parties/investigation-party-detail";
import { useInvestigationReadOnly } from "../../../hooks/use-investigation-read-only";

const InvestigationPartyView: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid = "", partyIdentifier = "" } = useParams<{
    investigationGuid: string;
    partyIdentifier: string;
  }>();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  // Shares the cache entry populated by the investigation details view; hydrates on a cold deep-link.
  const { data, isLoading } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });

  const party = useMemo(
    () =>
      (data?.getInvestigation?.parties ?? []).find(
        (p): p is InvestigationParty => !!p && p.partyIdentifier === partyIdentifier,
      ),
    [data, partyIdentifier],
  );

  const backToParties = () => navigate(`/investigation/${investigationGuid}/parties`);

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
            onClick={backToParties}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Parties</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <InvestigationPartyDetail
      party={party}
      onBack={backToParties}
      onEdit={
        isReadOnly ? undefined : () => navigate(`/investigation/${investigationGuid}/party/${partyIdentifier}/edit`)
      }
    />
  );
};

export default InvestigationPartyView;
