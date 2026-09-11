import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { order_type_code } from "../../../prisma/investigation/generated/order_type_code";
import { OrderTypeCode } from "../../investigation/order_type_code/dto/order_type_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class OrderTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(OrderTypeCodeService.name);

  async findOrderTypeCodes(): Promise<OrderTypeCode[]> {
    const prismaCodes = await this.prisma.order_type_code.findMany({
      select: {
        order_type_code: true,
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

    return this.mapper.mapArray<order_type_code, OrderTypeCode>(
      prismaCodes as Array<order_type_code>,
      "order_type_code",
      "OrderTypeCode",
    );
  }
}
