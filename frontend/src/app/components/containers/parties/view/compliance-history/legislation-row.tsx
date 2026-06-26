import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { FC } from "react";
import { Contravention } from "@/generated/graphql";

export type LegislationRowProps = {
  contravention: Contravention;
  partyReference: string;
};

export const LegislationRow: FC<LegislationRowProps> = ({ contravention, partyReference }) => {
  const legislation = useLegislation(contravention?.legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;
  const displayText = legislationData?.fullCitation;
  const enforcementActions = useAppSelector((state) => state.codeTables["enforcement-action-type"]);
  const ticketOutcomes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.TICKET_OUTCOME_TYPE));

  const matchingParty = contravention.investigationParty?.find((party) => party?.partyReference === partyReference);

  const enforcementActionRows = matchingParty?.enforcementActions ?? [];

  // No enforcement actions: still show the citation
  if (enforcementActionRows.length === 0) {
    return <p className="ms-4 mb-1">{displayText}</p>;
  }

  return (
    <>
      {matchingParty?.enforcementActions?.map((enforcementAction) => (
        <p
          className="ms-4 mb-1"
          key={enforcementAction?.enforcementActionIdentifier}
        >
          {displayText}{" "}
          {enforcementActions.find(
            (ea) => ea.enforcementActionCode === enforcementAction?.enforcementActionCode.enforcementActionCode,
          )?.shortDescription ?? ""}
          {enforcementAction?.ticket?.ticketOutcomeCode &&
            ` (${
              ticketOutcomes.find((t) => t.ticketOutcomeCode === enforcementAction?.ticket?.ticketOutcomeCode)
                ?.shortDescription ?? ""
            })`}
        </p>
      ))}
    </>
  );
};

export default LegislationRow;
