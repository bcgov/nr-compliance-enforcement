import { PartialType } from "@nestjs/swagger";
import { CreateOfficerDto } from "./create-officer.dto";

export class UpdateOfficerDto extends PartialType(CreateOfficerDto) {
  user_roles?: string[];
}
