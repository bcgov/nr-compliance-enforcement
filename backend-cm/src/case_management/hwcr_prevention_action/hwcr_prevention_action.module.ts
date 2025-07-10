import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { HWCRPreventionActionResolver } from "./hwcr_prevention_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [HWCRPreventionActionResolver, ActionCodeService],
})
export class HWCRPreventionActionModule {}
