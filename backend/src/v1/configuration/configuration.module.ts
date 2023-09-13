import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService]
})
export class ConfigurationModule {}
