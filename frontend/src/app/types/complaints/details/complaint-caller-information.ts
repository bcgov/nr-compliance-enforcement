import { Agency } from "../../app/code-tables/agency";

export interface ComplaintCallerInformation {
  name?: string;
  address?: string;
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  alternatePhone?: string;
  referredByAgencyCode?: Agency;
  ownedByAgencyCode: Agency;
}
