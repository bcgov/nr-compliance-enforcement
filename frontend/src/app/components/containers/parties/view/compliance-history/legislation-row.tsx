import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { FC, Fragment } from "react";
import { PartyHistoryContravention } from "@/generated/graphql";
import { buildLegislationDisplayParts, formatCitationWithAct } from "@/app/types/app/legislation";

export type LegislationRowProps = {
  contravention: PartyHistoryContravention;
  partyReference: string;
};

export const LegislationRow: FC<LegislationRowProps> = ({ contravention, partyReference }) => {
  // Ancestors are needed to put the act in front of a regulation's citation
  const legislation = useLegislation(contravention?.legislationIdentifierRef, true);
  const legislationData = legislation?.data?.legislation;
  const displayText = legislationData
    ? formatCitationWithAct(buildLegislationDisplayParts(legislationData), legislationData.fullCitation ?? "")
    : undefined;
  const enforcementActions = useAppSelector((state) => state.codeTables["enforcement-action-type"]);
  const ticketOutcomes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.TICKET_OUTCOME_TYPE));

  const matchingParty = contravention.investigationParty?.find((party) => party?.partyReference === partyReference);

  const enforcementActionRows = matchingParty?.enforcementActions ?? [];

  // No enforcement actions: still show the citation
  if (enforcementActionRows.length === 0) {
    return (
      <div className="party-compliance-outcomes">
        <span>{displayText}</span>
      </div>
    );
  }

  return (
    <div className="party-compliance-outcomes">
      {matchingParty?.enforcementActions?.map((enforcementAction) => (
        <Fragment key={enforcementAction?.enforcementActionIdentifier}>
          <span>{displayText}</span>
          <span>
            {enforcementActions.find(
              (ea) => ea.enforcementActionCode === enforcementAction?.enforcementActionCode.enforcementActionCode,
            )?.shortDescription ?? ""}
            {enforcementAction?.ticket?.ticketOutcomeCode &&
              ` (${
                ticketOutcomes.find((t) => t.ticketOutcomeCode === enforcementAction?.ticket?.ticketOutcomeCode)
                  ?.shortDescription ?? ""
              })`}
          </span>
        </Fragment>
      ))}
    </div>
  );
};
