import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("linked-complaint-xref")
@Controller({
  path: "linked-complaint-xref",
  version: "1",
})
export class LinkedComplaintXrefController {}
