import { Agency } from "../../app/code-tables/agency";
import { AgencyCode } from "../../code-tables/agency-code";

export interface ComplaintCallerInformation {
  name?: string;
  address?: string;
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  alternatePhone?: string;
  referredByAgencyCode?: AgencyCode;
  ownedByAgencyCode: AgencyCode;
}
