import { Module, forwardRef } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { CdogsModule } from "../../external_api/cdogs/cdogs.module";
import { ComplaintModule } from "../complaint/complaint.module";
import { AutomapperModule } from "@automapper/nestjs";
import { CodeTableModule } from "../code-table/code-table.module";

@Module({
  imports: [CdogsModule, AutomapperModule, CodeTableModule, forwardRef(() => ComplaintModule)],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
