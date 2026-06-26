import { FC, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { ToggleError } from "@/app/common/toast";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { GET_INVESTIGATION } from "@/app/components/containers/investigations/details/investigation-details";
import { useInvestigationReadOnly } from "../../../hooks/use-investigation-read-only";
import { InvestigationPartyForm } from "./investigation-party-form";

const InvestigationPartyEdit: FC = () => {
  const { investigationGuid = "", partyIdentifier } = useParams<{
    investigationGuid: string;
    partyIdentifier: string;
  }>();
  const isEditMode = !!partyIdentifier;
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  const { data, isLoading } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });

  const parties = useMemo(
    () => (data?.getInvestigation?.parties ?? []).filter(Boolean) as InvestigationParty[],
    [data],
  );

  const editParty = useMemo(
    () => (isEditMode ? parties.find((p) => p.partyIdentifier === partyIdentifier) : undefined),
    [isEditMode, parties, partyIdentifier],
  );

  const partyMissing = isEditMode && !isReadOnly && !isLoading && !editParty;
  useEffect(() => {
    if (partyMissing) ToggleError("Party not found");
  }, [partyMissing]);

  const partiesTab = `/investigation/${investigationGuid}/parties`;

  if (isReadOnly) {
    return <Navigate to={partiesTab} replace />;
  }

  // Edit mode hydrates from the cached investigation before mounting the form so it initializes with the right values.
  if (isEditMode && isLoading) {
    return (
      <div className="comp-investigation-edit-headerdetails">
        <section className="comp-details-body comp-container">
          <p className="p-4">Loading party details...</p>
        </section>
      </div>
    );
  }

  if (partyMissing) {
    return <Navigate to={partiesTab} replace />;
  }

  return (
    <InvestigationPartyForm
      key={partyIdentifier ?? "new"}
      investigationGuid={investigationGuid}
      editParty={editParty}
      parties={parties}
    />
  );
};

export default InvestigationPartyEdit;
