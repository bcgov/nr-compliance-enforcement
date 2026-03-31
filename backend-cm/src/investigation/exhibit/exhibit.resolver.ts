import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { ExhibitService } from "./exhibit.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateUpdateExhibitInput } from "../../investigation/exhibit/dto/exhibit";

@UseGuards(JwtRoleGuard)
@Resolver("Exhibit")
export class ExhibitResolver {
  constructor(private readonly exhibitService: ExhibitService) {}

  @Query("getExhibitsByTask")
  @Roles(coreRoles)
  async findAll(@Args("taskId") taskId: string) {
    return await this.exhibitService.findMany(taskId);
  }

  @Query("getExhibit")
  @Roles(coreRoles)
  async findOne(@Args("exhibitGuid") exhibitGuid: string) {
    return await this.exhibitService.findOne(exhibitGuid);
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
