import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import InvestigationPartyDetail from "@/app/components/containers/investigations/details/investigation-parties/investigation-party-detail";
import { useInvestigationReadOnly } from "../../../hooks/use-investigation-read-only";

interface InvestigationPartyViewProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

const InvestigationPartyView: FC<InvestigationPartyViewProps> = ({ investigationGuid, investigationData }) => {
  const navigate = useNavigate();
  const { partyIdentifier = "" } = useParams<{ partyIdentifier: string }>();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  const party = useMemo(
    () =>
      (investigationData?.parties ?? []).find(
        (p): p is InvestigationParty => !!p && p.partyIdentifier === partyIdentifier,
      ),
    [investigationData, partyIdentifier],
  );

  const backToParties = () => navigate(`/investigation/${investigationGuid}/parties`);

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
