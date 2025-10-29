import { PartialType } from "@nestjs/mapped-types";
import { CreateAppUserComplaintXrefDto } from "./create-app_user_complaint_xref.dto";

export class UpdateAppUserComplaintXrefDto extends PartialType(CreateAppUserComplaintXrefDto) {}
