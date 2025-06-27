import { Module } from "@nestjs/common";
import { CaseFileActionService } from "./case_file_action.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [CaseFileActionService],
  exports: [CaseFileActionService],
})
export class CaseFileActionModule {}
