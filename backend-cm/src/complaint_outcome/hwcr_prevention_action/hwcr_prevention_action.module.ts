import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { HWCRPreventionActionResolver } from "./hwcr_prevention_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [HWCRPreventionActionResolver, ActionCodeService],
})
export class HWCRPreventionActionModule {}
