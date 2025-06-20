import { Module } from "@nestjs/common";
import { CaseFileService } from "./case_file.service";
import { CaseFileResolver } from "./case_file.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { CaseFileActionModule } from "../case_file_action/case_file_action.module";

@Module({
  imports: [PrismaModuleCaseManagement, CaseFileActionModule],
  providers: [CaseFileResolver, CaseFileService],
})
export class CaseFileModule {}
