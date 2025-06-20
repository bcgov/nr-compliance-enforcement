import { Module } from "@nestjs/common";
import { ParkService } from "./park.service";
import { ParkResolver } from "./park.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { ParkAreaService } from "./parkArea.service";
import { ParkAreaResolver } from "./parkArea.resolver";
import { ParkAreaMappingService } from "./parkAreaMapping.service";

@Module({
  imports: [PrismaModuleShared, AutomapperModule],
  providers: [ParkResolver, ParkService, ParkAreaResolver, ParkAreaService, ParkAreaMappingService],
  exports: [ParkService, ParkAreaService, ParkAreaMappingService],
})
export class ParkModule {}
