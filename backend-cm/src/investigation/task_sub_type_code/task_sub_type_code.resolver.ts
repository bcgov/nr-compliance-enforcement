import { Resolver, Query } from "@nestjs/graphql";
import { TaskSubTypeCodeService } from "./task_sub_type_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("TaskSubTypeCode")
export class TaskSubTypeCodeResolver {
  constructor(private readonly taskSubTypeCodeService: TaskSubTypeCodeService) {}

  @Query("taskSubTypeCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.taskSubTypeCodeService.findAll();
  }
}
