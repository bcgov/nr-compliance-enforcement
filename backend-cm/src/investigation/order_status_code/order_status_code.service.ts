import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { order_status_code } from "../../../prisma/investigation/generated/order_status_code";
import { OrderStatusCode } from "../../investigation/order_status_code/dto/order_status_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class OrderStatusCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(OrderStatusCodeService.name);

  async findOrderStatusCodes(): Promise<OrderStatusCode[]> {
    const prismaCodes = await this.prisma.order_status_code.findMany({
      select: {
        order_status_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<order_status_code, OrderStatusCode>(
      prismaCodes as Array<order_status_code>,
      "order_status_code",
      "OrderStatusCode",
    );
  }
}
