import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { SanctionStatusCodeService } from "../../investigation/sanction_status_code/sanction_status_code.service";

@Resolver("SanctionStatusCode")
export class SanctionStatusCodeResolver {
  constructor(private readonly sanctionStatusCodeService: SanctionStatusCodeService) {}
  private readonly logger = new Logger(SanctionStatusCodeResolver.name);

  @Query("sanctionStatusCodes")
  @Roles(coreRoles)
  async findSanctionStatusCodes() {
    try {
      return await this.sanctionStatusCodeService.findSanctionStatusCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching sanction status codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
