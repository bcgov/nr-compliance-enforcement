import { UUID } from "node:crypto";

export interface AttractantXrefTable {
  attractant_code: {
    active_ind: boolean;
    attractant_code: string;
  };
  hwcr_complaint_guid: UUID;
  create_user_id: string;
  active_ind: boolean;
}
