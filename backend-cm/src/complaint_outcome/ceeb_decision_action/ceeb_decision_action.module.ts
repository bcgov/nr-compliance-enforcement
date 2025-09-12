import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { ActionCodeService } from "../action_code/action_code.service";
import { CEEBDecisionActionResolver } from "./ceeb_decision_action.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [CEEBDecisionActionResolver, ActionCodeService],
})
export class CEEBDecisionActionModule {}
