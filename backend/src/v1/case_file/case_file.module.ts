import { Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { CaseFileController } from "./case_file.controller";
import { CaseFileService } from "./case_file.service";
import { CodeTableModule } from "../code-table/code-table.module";

@Module({
  imports: [
    AutomapperModule,
    CodeTableModule
  ],
  controllers: [CaseFileController],
  providers: [CaseFileService],
})
export class CaseFileModule {}
