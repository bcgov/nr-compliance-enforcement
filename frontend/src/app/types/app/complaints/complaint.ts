import { Delegate } from "@apptypes/app/people/delegate";
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
  parkAreaGuids: Array<string>; //refactor to move to shared type?
}
