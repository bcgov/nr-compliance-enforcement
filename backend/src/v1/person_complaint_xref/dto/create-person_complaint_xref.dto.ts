import { PickType } from "@nestjs/swagger";
import { PersonComplaintXrefDto } from "./person_complaint_xref.dto";

export class CreatePersonComplaintXrefDto extends PickType(PersonComplaintXrefDto, [] as const) {}