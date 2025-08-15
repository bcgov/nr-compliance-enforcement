import { Module } from "@nestjs/common";
import { WebeocService } from "./webeoc.service";
import { ConfigurationModule } from "../../v1/configuration/configuration.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [ConfigurationModule, CacheModule.register()],
  providers: [WebeocService],
  exports: [WebeocService],
})
export class WebeocModule {}
