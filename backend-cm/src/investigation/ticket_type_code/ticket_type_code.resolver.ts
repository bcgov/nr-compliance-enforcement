import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { TicketTypeCodeService } from "../../investigation/ticket_type_code/ticket_type_code.service";

@Resolver("TicketTypeCode")
export class TicketTypeCodeResolver {
  constructor(private readonly ticketTypeCodeService: TicketTypeCodeService) {}
  private readonly logger = new Logger(TicketTypeCodeResolver.name);

  @Query("ticketTypeCodes")
  @Roles(coreRoles)
  async findTicketTypeCodes() {
    try {
      return await this.ticketTypeCodeService.findTicketTypeCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching ticket type codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
