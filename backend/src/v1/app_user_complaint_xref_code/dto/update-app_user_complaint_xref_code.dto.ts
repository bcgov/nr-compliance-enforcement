import { PartialType } from "@nestjs/mapped-types";
import { CreateAppUserComplaintXrefCodeDto } from "./create-app_user_complaint_xref_code.dto";

export class UpdateAppUserComplaintXrefCodeDto extends PartialType(CreateAppUserComplaintXrefCodeDto) {}
