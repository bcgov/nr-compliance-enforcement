import { Contravention } from "@/generated/graphql";

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
