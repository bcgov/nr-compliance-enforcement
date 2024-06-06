import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { CdogsModule } from "src/external_api/cdogs/cdogs.module";
import { ComplaintModule } from "../complaint/complaint.module";

@Module({
  imports: [CdogsModule, ComplaintModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
