import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { CdogsModule } from "../../external_api/cdogs/cdogs.module";
import { ComplaintModule } from "../complaint/complaint.module";
import { AutomapperModule } from "@automapper/nestjs";
import { CodeTableModule } from "../code-table/code-table.module";
import { CaseFileModule } from "../case_file/case_file.module";

@Module({
  imports: [CdogsModule, AutomapperModule, CodeTableModule, ComplaintModule, CaseFileModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
