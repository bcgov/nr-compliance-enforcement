import { Module } from "@nestjs/common";
import { ChesService } from "./ches.service";
import { ConfigurationModule } from "../../../src/v1/configuration/configuration.module";

@Module({
  imports: [ConfigurationModule],
  providers: [ChesService],
  exports: [ChesService],
})
export class ChesModule {}
