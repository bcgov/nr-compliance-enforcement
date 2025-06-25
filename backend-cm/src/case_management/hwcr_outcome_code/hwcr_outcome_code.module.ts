import { Module } from "@nestjs/common";
import { HwcrOutcomeCodeService } from "./hwcr_outcome_code.service";
import { HwcrOutcomeCodeResolver } from "./hwcr_outcome_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [HwcrOutcomeCodeResolver, HwcrOutcomeCodeService],
})
export class HwcrOutcomeCodeModule {}
