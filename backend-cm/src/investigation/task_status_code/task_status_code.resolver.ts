import { Resolver, Query } from "@nestjs/graphql";
import { TaskStatusCodeService } from "./task_status_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("TaskStatusCode")
export class TaskStatusCodeResolver {
  constructor(private readonly taskStatusCodeService: TaskStatusCodeService) {}

  @Query("taskStatusCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.taskStatusCodeService.findAll();
  }
}
