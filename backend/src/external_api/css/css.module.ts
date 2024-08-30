import { Module } from "@nestjs/common";
import { CssService } from "./css.service";
import { ConfigurationModule } from "../../v1/configuration/configuration.module";

@Module({
  imports: [ConfigurationModule],
  providers: [CssService],
  exports: [CssService],
})
export class CssModule {}
