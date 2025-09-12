import { Module } from "@nestjs/common";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { ThreatLevelCodeResolver } from "./threat_level_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [ThreatLevelCodeResolver, ThreatLevelCodeService],
})
export class ThreatLevelCodeModule {}
