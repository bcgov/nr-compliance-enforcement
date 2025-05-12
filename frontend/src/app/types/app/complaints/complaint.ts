import { Delegate } from "@apptypes/app/people/delegate";
import { BaseComplaint } from "nrs-ce-common-types";
import { Park } from "@apptypes/app/shared/park";

export interface Complaint extends BaseComplaint {
  organization: {
    area: string;
    areaName?: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<Delegate>;
  park?: string;
}
