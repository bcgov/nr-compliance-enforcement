import { AgencyCode } from "../../code-tables/agency-code";
import { ReportedByCode } from "../../code-tables/reported-by-code";

export interface ComplaintCallerInformation {
  name?: string;
  address?: string;
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  alternatePhone?: string;
  reportedByCode?: ReportedByCode;
  ownedByAgencyCode: AgencyCode;
}
