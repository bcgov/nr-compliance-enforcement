import { PickType } from "@nestjs/swagger";
import { OfficeDto } from "./office.dto";

export class CreateOfficeDto extends PickType(OfficeDto, [
  "geo_organization_unit_code",
  "agency_code",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
] as const) {}
