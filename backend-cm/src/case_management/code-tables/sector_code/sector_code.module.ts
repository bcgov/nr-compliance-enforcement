import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../../prisma/cm/prisma.cm.module";
import { SectorCodeService } from "./sector_code.service";
import { SectorCodeResolver } from "./sector_code.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [SectorCodeResolver, SectorCodeService],
})
export class SectorCodeModule {}
