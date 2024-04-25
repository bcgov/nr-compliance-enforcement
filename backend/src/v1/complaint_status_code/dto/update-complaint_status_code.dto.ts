import { PartialType } from "@nestjs/swagger";
import { CreateComplaintStatusCodeDto } from "./create-complaint_status_code.dto";

export class UpdateComplaintStatusCodeDto extends PartialType(CreateComplaintStatusCodeDto) {}
