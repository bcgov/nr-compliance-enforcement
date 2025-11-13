import { Logger, UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { CaseActivityCreateInput, CaseActivityRemoveInput } from "src/shared/case_activity/dto/case_activity";

@UseGuards(JwtRoleGuard)
@Resolver("CaseActivity")
export class CaseActivityResolver {
  constructor(private readonly caseActivityService: CaseActivityService) {}
  private readonly logger = new Logger(CaseActivityResolver.name);

  @Mutation("createCaseActivity")
  @Roles(coreRoles)
  async create(@Args("input") input: CaseActivityCreateInput) {
    try {
      return await this.caseActivityService.create(input);
    } catch (error) {
      this.logger.error("Create case file error:", error);
      throw new GraphQLError("Error creating case activity", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("removeCaseActivity")
  @Roles(coreRoles)
  async remove(@Args("input") input: CaseActivityRemoveInput) {
    try {
      return await this.caseActivityService.remove(input);
    } catch (error) {
      this.logger.error("Remove case file error:", error);
      throw new GraphQLError("Error removing case activity", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
