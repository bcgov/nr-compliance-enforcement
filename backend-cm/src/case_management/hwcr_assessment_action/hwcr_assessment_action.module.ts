import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { HWCRAssessmentActionResolver } from "./hwcr_assessment_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [HWCRAssessmentActionResolver, ActionCodeService],
})
export class HWCRAssessmentActionModule {}
