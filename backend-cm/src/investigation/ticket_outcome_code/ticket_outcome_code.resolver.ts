import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { TicketOutcomeCodeService } from "../../investigation/ticket_outcome_code/ticket_outcome_code.service";

@Resolver("TicketOutcome")
export class TicketOutcomeCodeResolver {
  constructor(private readonly ticketOutcomeService: TicketOutcomeCodeService) {}
  private readonly logger = new Logger(TicketOutcomeCodeResolver.name);

  @Query("ticketOutcomeCodes")
  @Roles(coreRoles)
  async findTicketOutcomeCodes() {
    try {
      return await this.ticketOutcomeService.findTicketOutcomeCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching ticket outcome codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
