import { Module } from "@nestjs/common";
import { ComplaintOutcomeService } from "./complaint_outcome.service";
import { ComplaintOutcomeResolver } from "./complaint_outcome.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { CaseFileActionModule } from "../case_file_action/case_file_action.module";

@Module({
  imports: [PrismaModuleCaseManagement, CaseFileActionModule],
  providers: [ComplaintOutcomeResolver, ComplaintOutcomeService],
})
export class ComplaintOutcomeModule {}
