import { Agency } from "../../app/code-tables/agency";
import { ReportedBy } from "../../app/code-tables/reported-by";

export interface ComplaintCallerInformation {
  name?: string;
  address?: string;
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  alternatePhone?: string;
  ownedByAgencyCode: Agency;
  reportedByCode?: ReportedBy;
  isPrivacyRequested: string;
}
