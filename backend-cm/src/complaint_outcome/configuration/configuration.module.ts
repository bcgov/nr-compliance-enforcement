import { Module } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResolver } from "./configuration.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [ConfigurationResolver, ConfigurationService],
})
export class ConfigurationModule {}
