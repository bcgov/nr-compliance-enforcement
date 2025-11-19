import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { OfficeService } from "./office.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles, Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateOfficeInput, UpdateOfficeInput } from "./dto/office";

@UseGuards(JwtRoleGuard)
@Resolver("Office")
export class OfficeResolver {
  constructor(private readonly officeService: OfficeService) {}

  @Query("offices")
  @Roles(coreRoles)
  async findAll(
    @Args("geoOrganizationUnitCodes") geoOrganizationUnitCodes?: string[],
    @Args("agencyCode") agencyCode?: string,
  ) {
    return await this.officeService.findAll(geoOrganizationUnitCodes, agencyCode);
  }

  @Query("office")
  @Roles(coreRoles)
  async findOne(
    @Args("officeGuid") officeGuid?: string,
    @Args("geoOrganizationUnitCode") geoOrganizationUnitCode?: string,
    @Args("agencyCode") agencyCode?: string,
  ) {
    return await this.officeService.findOne(officeGuid, geoOrganizationUnitCode, agencyCode);
  }

  @Mutation("createOffice")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  async create(@Args("input") input: CreateOfficeInput) {
    return await this.officeService.create(input);
  }

  @Mutation("updateOffice")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  async update(@Args("officeGuid") officeGuid: string, @Args("input") input: UpdateOfficeInput) {
    return await this.officeService.update(officeGuid, input);
  }

  @Query("officesByZone")
  @Roles(coreRoles)
  async findOfficesByZone(@Args("zoneCode") zoneCode: string) {
    return await this.officeService.findOfficesByZone(zoneCode);
  }
}
