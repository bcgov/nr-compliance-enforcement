import { PartialType } from "@nestjs/swagger";
import { CreateComplaintTypeCodeDto } from "./create-complaint_type_code.dto";

export class UpdateComplaintTypeCodeDto extends PartialType(CreateComplaintTypeCodeDto) {}
