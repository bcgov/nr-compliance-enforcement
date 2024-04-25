import { Module } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationController } from "./configuration.controller";
import { Configuration } from "./entities/configuration.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
