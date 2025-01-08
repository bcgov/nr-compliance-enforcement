import { PickType } from "@nestjs/swagger";
import { OfficerTeamXrefDto } from "./officer_team_xref.dto";

export class CreateOfficerTeamXrefDto extends PickType(OfficerTeamXrefDto, [
  "officer_guid",
  "team_guid",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "active_ind",
] as const) {}
