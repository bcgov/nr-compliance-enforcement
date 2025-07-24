import { PickType } from "@nestjs/swagger";
import { FeatureAgencyXrefDto } from "./feature_agency_xref.dto";

export class CreateFeatureAgencyXrefDto extends PickType(FeatureAgencyXrefDto, [
  "feature_agency_xref_guid",
  "feature_code",
  "agency_code_ref",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "active_ind",
] as const) {}
