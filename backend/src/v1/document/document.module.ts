import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { ConfigurationModule } from "../configuration/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
