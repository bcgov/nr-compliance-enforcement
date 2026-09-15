import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { AdministrativePenaltyStatusCodeService } from "../../investigation/administrative_penalty_status_code/administrative_penalty_status_code.service";

@Resolver("AdministrativePenaltyStatusCode")
export class AdministrativePenaltyStatusCodeResolver {
  constructor(private readonly administrativePenaltyStatusCodeService: AdministrativePenaltyStatusCodeService) {}
  private readonly logger = new Logger(AdministrativePenaltyStatusCodeResolver.name);

  @Query("administrativePenaltyStatusCodes")
  @Roles(coreRoles)
  async findAdministrativePenaltyStatusCodes() {
    try {
      return await this.administrativePenaltyStatusCodeService.findAdministrativePenaltyStatusCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching administrative penalty status codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
