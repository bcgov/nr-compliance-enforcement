import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { ExhibitService } from "./exhibit.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards, NotFoundException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateUpdateExhibitInput } from "../../investigation/exhibit/dto/exhibit";

@UseGuards(JwtRoleGuard)
@Resolver("Exhibit")
export class ExhibitResolver {
  constructor(private readonly exhibitService: ExhibitService) {}
  private readonly logger = new Logger(ExhibitResolver.name);

  @Query("getExhibitsByTask")
  @Roles(coreRoles)
  async findAll(@Args("taskId") taskId: string) {
    return await this.exhibitService.findMany(taskId);
  }

  @Query("searchExhibitsByInvestigation")
  @Roles(coreRoles)
  async searchByInvestigation(
    @Args("page") page: number,
    @Args("pageSize") pageSize: number,
    @Args("filters") filters: any,
  ) {
    return await this.exhibitService.search(page, pageSize, filters);
  }

  @Query("getExhibit")
  @Roles(coreRoles)
  async findOne(@Args("exhibitGuid") exhibitGuid: string) {
    try {
      return await this.exhibitService.findOne(exhibitGuid);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(error.message, { extensions: { code: "NOT_FOUND" } });
      }
      this.logger.error(error);
      throw new GraphQLError("Error fetching exhibit", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
    }
  }

  @Mutation("createExhibit")
  @Roles(coreRoles)
  async create(@Args("input") input: CreateUpdateExhibitInput) {
    return await this.exhibitService.create(input);
  }

  @Mutation("removeExhibit")
  @Roles(coreRoles)
  async remove(@Args("exhibitGuid") exhibitGuid: string) {
    return await this.exhibitService.remove(exhibitGuid);
  }

  @Mutation("updateExhibit")
  @Roles(coreRoles)
  async update(@Args("input") input: CreateUpdateExhibitInput) {
    return await this.exhibitService.update(input);
  }
}
