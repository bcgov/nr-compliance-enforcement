import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { SectorCodeService } from "./sector_code.service";
import { SectorCodeResolver } from "./sector_code.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [SectorCodeResolver, SectorCodeService],
})
export class SectorCodeModule {}
