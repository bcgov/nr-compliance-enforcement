import { PickType } from "@nestjs/swagger";
import { PersonComplaintXrefCodeDto } from "./person_complaint_xref_code.dto";

export class CreatePersonComplaintXrefCodeDto extends PickType(PersonComplaintXrefCodeDto, [] as const) {}
