import { Module } from "@nestjs/common";
import { AgencyCodeService } from "./agency_code.service";
import { AgencyCodeResolver } from "./agency_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [AgencyCodeResolver, AgencyCodeService],
})
export class AgencyCodeModule {}
