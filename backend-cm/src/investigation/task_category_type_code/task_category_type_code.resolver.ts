import { Resolver, Query } from "@nestjs/graphql";
import { TaskCategoryTypeCodeService } from "./task_category_type_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("TaskCategoryTypeCode")
export class TaskCategoryTypeCodeResolver {
  constructor(private readonly taskCategoryCodeService: TaskCategoryTypeCodeService) {}

  @Query("taskCategoryTypeCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.taskCategoryCodeService.findAll();
  }
}
