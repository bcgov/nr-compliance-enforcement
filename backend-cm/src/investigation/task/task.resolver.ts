import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { TaskService } from "./task.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import {
  UnauthorizedAccessException,
  UNAUTHORIZED_ERROR_CODE,
} from "../../common/exceptions/unauthorized-access.exception";
import { CreateUpdateTaskInput } from "../../investigation/task/dto/task";

@UseGuards(JwtRoleGuard)
@Resolver("Task")
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskResolver.name);

  @Query("tasks")
  @Roles(coreRoles)
  async findAll(@Args("investigationId") investigationGuid: string) {
    return await this.taskService.findMany(investigationGuid);
  }

  @Query("task")
  @Roles(coreRoles)
  async findOne(@Args("taskId") taskGuid: string) {
    try {
      return await this.taskService.findOne(taskGuid);
    } catch (error) {
      if (error instanceof UnauthorizedAccessException) {
        throw new GraphQLError(error.message, { extensions: { code: UNAUTHORIZED_ERROR_CODE } });
      }
      this.logger.error(error);
      throw new GraphQLError("Error fetching task", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
    }
  }

  @Mutation("createTask")
  @Roles(coreRoles)
  async create(@Args("input") taskInput: CreateUpdateTaskInput) {
    return await this.taskService.create(taskInput);
  }

  @Mutation("removeTask")
  @Roles(coreRoles)
  async remove(@Args("taskId") taskIdentifier: string) {
    return await this.taskService.remove(taskIdentifier);
  }

  @Mutation("updateTask")
  @Roles(coreRoles)
  async update(@Args("input") taskInput: CreateUpdateTaskInput) {
    return await this.taskService.update(taskInput);
  }
}
