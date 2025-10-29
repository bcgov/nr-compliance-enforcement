import { PickType } from "@nestjs/swagger";
import { AppUserComplaintXrefCodeDto } from "./app_user_complaint_xref_code.dto";

export class CreateAppUserComplaintXrefCodeDto extends PickType(AppUserComplaintXrefCodeDto, [] as const) {}
