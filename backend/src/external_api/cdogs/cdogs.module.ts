import { Module } from "@nestjs/common";
import { CdogsService } from "./cdogs.service";
import { ConfigurationModule } from "src/v1/configuration/configuration.module";

@Module({
  imports: [ConfigurationModule],
  providers: [CdogsService],
  exports: [CdogsService],
})
export class CdogsModule {}
