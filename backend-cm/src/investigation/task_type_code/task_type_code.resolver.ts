import { Resolver, Query } from "@nestjs/graphql";
import { TaskTypeCodeService } from "./task_type_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("TaskTypeCode")
export class TaskTypeCodeResolver {
  constructor(private readonly taskTypeCodeService: TaskTypeCodeService) {}

  @Query("taskTypeCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.taskTypeCodeService.findAll();
  }
}
