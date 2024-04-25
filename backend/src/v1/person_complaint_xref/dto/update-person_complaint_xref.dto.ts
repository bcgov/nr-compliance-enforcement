import { PartialType } from "@nestjs/mapped-types";
import { CreatePersonComplaintXrefDto } from "./create-person_complaint_xref.dto";

export class UpdatePersonComplaintXrefDto extends PartialType(CreatePersonComplaintXrefDto) {}
