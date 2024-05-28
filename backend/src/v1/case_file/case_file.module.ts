import { Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { CaseFileController } from "./case_file.controller";
import { CaseFileService } from "./case_file.service";

@Module({
  imports: [AutomapperModule],
  controllers: [CaseFileController],
  providers: [CaseFileService],
})
export class CaseFileModule {}
