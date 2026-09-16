import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { SanctionTypeCodeService } from "../../investigation/sanction_type_code/sanction_type_code.service";

@Resolver("SanctionTypeCode")
export class SanctionTypeCodeResolver {
  constructor(private readonly sanctionTypeCodeService: SanctionTypeCodeService) {}
  private readonly logger = new Logger(SanctionTypeCodeResolver.name);

  @Query("sanctionTypeCodes")
  @Roles(coreRoles)
  async findSanctionTypeCodes() {
    try {
      return await this.sanctionTypeCodeService.findSanctionTypeCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching sanction type codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
