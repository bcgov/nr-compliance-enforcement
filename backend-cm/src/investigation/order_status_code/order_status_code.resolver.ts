import { Logger } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { OrderStatusCodeService } from "../../investigation/order_status_code/order_status_code.service";

@Resolver("OrderStatusCode")
export class OrderStatusCodeResolver {
  constructor(private readonly orderStatusCodeService: OrderStatusCodeService) {}
  private readonly logger = new Logger(OrderStatusCodeResolver.name);

  @Query("orderStatusCodes")
  @Roles(coreRoles)
  async findOrderStatusCodes() {
    try {
      return await this.orderStatusCodeService.findOrderStatusCodes();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching order status codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
