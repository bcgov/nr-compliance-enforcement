import { PartialType } from "@nestjs/mapped-types";
import { CreateLinkedComplaintXrefDto } from "./create-linked_complaint_xref.dto";

export class UpdateLinkedComplaintXrefDto extends PartialType(CreateLinkedComplaintXrefDto) {}
