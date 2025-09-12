import { Module } from "@nestjs/common";
import { CaseFileActionService } from "./case_file_action.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [CaseFileActionService],
  exports: [CaseFileActionService],
})
export class CaseFileActionModule {}
