import { PickType } from "@nestjs/swagger";
import { HwcrComplaintDto } from "./hwcr_complaint.dto";

export class CreateHwcrComplaintDto extends PickType(HwcrComplaintDto, [
    "complaint_identifier",
    "species_code",
    "hwcr_complaint_nature_code",
    "attractant_hwcr_xref",
    "other_attractants_text",
    "hwcr_complaint_guid",
    "create_user_id",
    "create_utc_timestamp",
    "update_user_id",
    "update_utc_timestamp"
          ] as const) {}
