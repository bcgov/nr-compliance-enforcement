import { Delegate } from "../people/delegate";
import { BaseComplaint } from "nrs-ce-common-types";

export interface Complaint extends BaseComplaint {
  organization: {
    area: string;
    areaName?: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<Delegate>;
}
