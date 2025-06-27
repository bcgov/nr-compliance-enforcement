import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { HWCRAssessmentActionResolver } from "./hwcr_assessment_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [HWCRAssessmentActionResolver, ActionCodeService],
})
export class HWCRAssessmentActionModule {}
