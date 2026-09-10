import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { OrderTypeCodeResolver } from "../../investigation/order_type_code/order_type_code.resolver";
import { OrderTypeCodeService } from "../../investigation/order_type_code/order_type_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [OrderTypeCodeResolver, OrderTypeCodeService],
  exports: [OrderTypeCodeService],
})
export class OrderTypeCodeModule {}
