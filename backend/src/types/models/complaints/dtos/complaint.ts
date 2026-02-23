import { DelegateDto } from "../../app_user/delegate";
import { BaseComplaint } from "nrs-ce-common-types";

export interface ComplaintDto extends Omit<BaseComplaint, "incidentDateTime"> {
  incidentDate: Date;
  incidentTime: string;
  organization: {
    area: string;
    areaName: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<DelegateDto>;
  type: string;
  parkGuid?: string;
}
