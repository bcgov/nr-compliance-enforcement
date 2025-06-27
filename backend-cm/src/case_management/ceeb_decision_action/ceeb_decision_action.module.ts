import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { ActionCodeService } from "../action_code/action_code.service";
import { CEEBDecisionActionResolver } from "./ceeb_decision_action.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [CEEBDecisionActionResolver, ActionCodeService],
})
export class CEEBDecisionActionModule {}
