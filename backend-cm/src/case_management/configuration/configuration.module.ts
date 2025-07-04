import { Module } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResolver } from "./configuration.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [ConfigurationResolver, ConfigurationService],
})
export class ConfigurationModule {}
