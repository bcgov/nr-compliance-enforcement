import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { OrderTypeCodeService } from "../../investigation/order_type_code/order_type_code.service";

@Resolver("OrderTypeCode")
export class OrderTypeCodeResolver {
  constructor(private readonly orderTypeCodeService: OrderTypeCodeService) {}
  private readonly logger = new Logger(OrderTypeCodeResolver.name);

  @Query("orderTypeCodes")
  @Roles(coreRoles)
  async findOrderTypeCodes() {
    try {
      return await this.orderTypeCodeService.findOrderTypeCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching order type codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
