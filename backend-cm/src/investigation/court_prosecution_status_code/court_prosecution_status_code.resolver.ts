import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { CourtProsecutionStatusCodeService } from "../../investigation/court_prosecution_status_code/court_prosecution_status_code.service";

@Resolver("CourtProsecutionStatusCode")
export class CourtProsecutionStatusCodeResolver {
  constructor(private readonly courtProsecutionStatusCodeService: CourtProsecutionStatusCodeService) {}
  private readonly logger = new Logger(CourtProsecutionStatusCodeResolver.name);

  @Query("courtProsecutionStatusCodes")
  @Roles(coreRoles)
  async findCourtProsecutionStatusCodes() {
    try {
      return await this.courtProsecutionStatusCodeService.findCourtProsecutionStatusCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching court prosecution status codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
