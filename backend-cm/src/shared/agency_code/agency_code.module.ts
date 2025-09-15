import { Module } from "@nestjs/common";
import { AgencyCodeService } from "./agency_code.service";
import { AgencyCodeResolver } from "./agency_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [AgencyCodeResolver, AgencyCodeService],
})
export class AgencyCodeModule {}
