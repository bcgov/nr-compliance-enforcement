import { UUID } from "node:crypto";

export interface ActionTaken {
  action_taken_guid: UUID;
  tablename: string;
  dataid: number;
  username: string;
  positionname: string;
  entrydate: Date;
  subscribername: string;
  prevdataid: string;
  fk_table_345?: string;
  fk_table_346?: string;
  action_datetime: Date;
  action_logged_by: string;
  action_logged_by_position: string;
  action_updated_by: string;
  action_updated_by_position: string;
  action_details: string;
  flag_AT: string | boolean;
}
