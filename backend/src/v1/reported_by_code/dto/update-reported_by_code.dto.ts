import { PartialType } from "@nestjs/swagger";
import { CreateReportedByCodeDto } from "./create-reported_by_code.dto";

export class UpdateReportedByCodeDto extends PartialType(CreateReportedByCodeDto) {}
