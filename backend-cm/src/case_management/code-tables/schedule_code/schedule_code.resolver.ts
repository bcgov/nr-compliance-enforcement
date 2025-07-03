import { Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ScheduleCodeService } from "./schedule_code.service";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { coreRoles } from "src/enum/role.enum";

@UseGuards(JwtRoleGuard)
@Resolver("ScheduleCode")
export class ScheduleCodeResolver {
  constructor(private readonly service: ScheduleCodeService) {}

  @Query("scheduleCodes")
  @Roles(coreRoles)
  findAll() {
    return this.service.findAll();
  }
}
