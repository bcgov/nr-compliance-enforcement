import { PartialType } from "@nestjs/mapped-types";
import { CreatePersonComplaintXrefCodeDto } from "./create-person_complaint_xref_code.dto";

export class UpdatePersonComplaintXrefCodeDto extends PartialType(CreatePersonComplaintXrefCodeDto) {}
