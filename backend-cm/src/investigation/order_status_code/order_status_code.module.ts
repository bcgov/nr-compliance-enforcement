import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { OrderStatusCodeResolver } from "../../investigation/order_status_code/order_status_code.resolver";
import { OrderStatusCodeService } from "../../investigation/order_status_code/order_status_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [OrderStatusCodeResolver, OrderStatusCodeService],
  exports: [OrderStatusCodeService],
})
export class OrderStatusCodeModule {}
