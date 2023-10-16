import { PickType } from "@nestjs/swagger";
import { PersonComplaintXrefDto } from "./person_complaint_xref.dto";

export class CreatePersonComplaintXrefDto extends PickType(PersonComplaintXrefDto, [
    "create_user_id",
    "create_timestamp",
    "update_user_id",
    "update_timestamp",
    "complaint_identifier",
          ] as const) {}