import { Resolver, Query, Args } from "@nestjs/graphql";
import { TaskService } from "./task.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("Task")
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query("tasks")
  @Roles(coreRoles)
  async findAll(@Args("investigationId") investigationGuid: string) {
    return await this.taskService.findMany(investigationGuid);
  }

  @Query("task")
  @Roles(coreRoles)
  async findOne(@Args("taskId") taskGuid: string) {
    return await this.taskService.findOne(taskGuid);
  }
}
