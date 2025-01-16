import { Module } from "@nestjs/common";
import { CssService } from "./css.service";
import { ConfigurationModule } from "../../v1/configuration/configuration.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [ConfigurationModule, CacheModule.register()],
  providers: [CssService],
  exports: [CssService],
})
export class CssModule {}
