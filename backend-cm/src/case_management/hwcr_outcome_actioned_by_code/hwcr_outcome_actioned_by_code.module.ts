import { Module } from "@nestjs/common";
import { HwcrOutcomeActionedByCodeService } from "./hwcr_outcome_actioned_by_code.service";
import { HwcrOutcomeActionedByCodeResolver } from "./hwcr_outcome_actioned_by_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [HwcrOutcomeActionedByCodeResolver, HwcrOutcomeActionedByCodeService],
})
export class HwcrOutcomeActionedByCodeModule {}
