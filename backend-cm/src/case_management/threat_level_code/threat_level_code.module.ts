import { Module } from "@nestjs/common";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { ThreatLevelCodeResolver } from "./threat_level_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [ThreatLevelCodeResolver, ThreatLevelCodeService],
})
export class ThreatLevelCodeModule {}
