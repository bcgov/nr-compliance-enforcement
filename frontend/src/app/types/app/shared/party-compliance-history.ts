import { PartyHistoryContravention } from "@/generated/graphql";

export type PartyComplianceActivity = {
  id?: string | null;
  name?: string | null;
  activityType?: string | null;
  leadAgency?: string | null;
  leadAgencyDescription?: string | null;
  role?: string | null;
  sameAgency?: boolean;
  status: string;
  primaryInvestigatorName?: string;
  supervisorName?: string;
  dateOpened?: Date | null;
  contraventions?: PartyHistoryContravention[] | null;
};

export type PartyComplianceRelation = {
  caseId?: string | null;
  caseName?: string | null;
  activities?: PartyComplianceActivity[] | null;
  leadAgency?: string | null;
  sameAgency?: boolean;
};

export type PartyComplianceHistoryRow = {
  rowKey: string;
  activity: PartyComplianceActivity;
  contravention: PartyHistoryContravention | null;
};
