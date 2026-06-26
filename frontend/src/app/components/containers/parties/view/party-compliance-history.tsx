import { FC } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Contravention } from "@/generated/graphql";
import { CaseActivities } from "@/app/constants/case-activities";
import { useAppSelector } from "@/app/hooks/hooks";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { applyStatusClass } from "@/app/common/methods";

export type PartyComplianceActivity = {
  id?: string | null;
  name?: string | null;
  activityType?: string | null;
  leadAgency?: string | null;
  role?: string | null;
  sameAgency?: boolean;
  status: string;
  primaryInvestigatorName?: string;
  contraventions?: Contravention[] | null;
};

export type PartyComplianceRelation = {
  caseId?: string | null;
  caseName?: string | null;
  activities?: PartyComplianceActivity[] | null;
  leadAgency?: string | null;
  sameAgency?: boolean;
};

type LegislationRowProps = {
  contravention: Contravention;
  partyGuid: string;
};

const LegislationRow: FC<LegislationRowProps> = ({ contravention, partyGuid }) => {
  const legislation = useLegislation(contravention?.legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;
  const displayText = legislationData?.fullCitation;
  const enforcementActions = useAppSelector((state) => state.codeTables["enforcement-action-type"]);

  const matchingParty = contravention.investigationParty?.find((party) => party?.partyReference === partyGuid);

  return (
    <>
      <p className="ms-4 mb-1">{displayText}</p>
      {matchingParty?.enforcementActions?.map((enforcementAction) => (
        <p
          key={enforcementAction?.enforcementActionIdentifier}
          className="ms-5 mb-1"
        >
          {enforcementActions.find(
            (ea) => ea.enforcementActionCode === enforcementAction?.enforcementActionCode.enforcementActionCode,
          )?.shortDescription ?? ""}
        </p>
      ))}
    </>
  );
};

const buildActivityPath = (activity: PartyComplianceActivity): string => {
  const segment = activity.activityType === CaseActivities.INVESTIGATION ? "investigation" : "inspection";
  return `/${segment}/${activity.id}`;
};

interface PartyComplianceHistoryProps {
  partyRelations: PartyComplianceRelation[];
  id: string;
}

export const PartyComplianceHistory: FC<PartyComplianceHistoryProps> = ({ partyRelations, id }) => {
  const activities = partyRelations
    .flatMap((relation) => relation.activities ?? [])
    .toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""));

  return (
    <div className="party-details-item">
      {activities.map((activity) => (
        <div key={activity.id}>
          <p className="mb-1">
            <Badge
              bg="species-badge comp-species-badge"
              className="ms-2"
            >
              {activity.role}
            </Badge>{" "}
            {activity.sameAgency ? (
              <Link to={buildActivityPath(activity)}>{activity.name}</Link>
            ) : (
              <span>{activity.name}</span>
            )}
            <span className="ms-2">
              Primary investigator: {activity.primaryInvestigatorName}
              {activity.leadAgency && ` (${activity.leadAgency})`}
            </span>{" "}
            <Badge
              bg="species-badge comp-species-badge"
              className={`${applyStatusClass(activity.status ?? "")}`}
            >
              {activity.status}
            </Badge>
          </p>
          {activity.status !== "Open" &&
            activity.contraventions?.map((contravention) => (
              <LegislationRow
                key={contravention.contraventionIdentifier}
                contravention={contravention}
                partyGuid={id}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default PartyComplianceHistory;
