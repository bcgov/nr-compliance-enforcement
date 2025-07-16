import { PickType } from "@nestjs/swagger";
import { CompMthdRecvCdAgcyCdXrefDto } from "./comp_mthd_recv_cd_agcy_cd_xref.dto";

export class CreateCompMthdRecvCdAgcyCdXrefDto extends PickType(CompMthdRecvCdAgcyCdXrefDto, [
  "comp_mthd_recv_cd_agcy_cd_xref_guid",
  "complaint_method_received_code",
  "agency_code_ref",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "active_ind",
] as const) {}
