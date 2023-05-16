import { PickType } from "@nestjs/swagger";
import { HwcrComplaintDto } from "./hwcr_complaint.dto";

export class CreateHwcrComplaintDto extends PickType(HwcrComplaintDto, [
    "complaint_identifier",
    "species_code",
    "hwcr_complaint_nature_code",
    "attractant_hwcr_xref",
    "other_attractants_text",
    "create_user_id",
    "create_user_guid",
    "create_timestamp",
    "update_user_id",
    "update_user_guid",
    "update_timestamp"
          ] as const) {}
