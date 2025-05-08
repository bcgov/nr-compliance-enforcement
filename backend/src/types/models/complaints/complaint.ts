import { DelegateDto } from "../people/delegate";
import { BaseComplaint } from "nrs-ce-common-types";

export interface ComplaintDto extends BaseComplaint {
  organization: {
    area: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<DelegateDto>;
  parkAreaGuids: Array<string>;
}
