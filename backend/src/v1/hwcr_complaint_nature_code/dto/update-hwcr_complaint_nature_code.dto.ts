import { PartialType } from "@nestjs/swagger";
import { CreateHwcrComplaintNatureCodeDto } from "./create-hwcr_complaint_nature_code.dto";

export class UpdateHwcrComplaintNatureCodeDto extends PartialType(CreateHwcrComplaintNatureCodeDto) {}
