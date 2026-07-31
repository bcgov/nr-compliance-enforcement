import { Module } from "@nestjs/common";
import { ComplaintOutcomeService } from "./complaint_outcome.service";
import { ComplaintOutcomeResolver } from "./complaint_outcome.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { CaseFileActionModule } from "../case_file_action/case_file_action.module";
import { SexCodeModule } from "../../shared/sex_code/sex_code.module";

@Module({
  imports: [PrismaModuleComplaintOutcome, CaseFileActionModule, SexCodeModule],
  providers: [ComplaintOutcomeResolver, ComplaintOutcomeService],
})
export class ComplaintOutcomeModule {}
