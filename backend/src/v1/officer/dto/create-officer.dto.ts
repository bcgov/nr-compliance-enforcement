import { PickType } from "@nestjs/swagger";
import { OfficerDto } from "./officer.dto";

export class CreateOfficerDto extends PickType(OfficerDto, [
  "user_id",
  "person_guid",
  "office_guid",
  "auth_user_guid",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "coms_enrolled_ind",
  "deactivate_ind",
  "park_area_guid",
] as const) {}
