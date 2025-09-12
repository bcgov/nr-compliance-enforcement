import { Module } from "@nestjs/common";
import { HwcrOutcomeCodeService } from "./hwcr_outcome_code.service";
import { HwcrOutcomeCodeResolver } from "./hwcr_outcome_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [HwcrOutcomeCodeResolver, HwcrOutcomeCodeService],
})
export class HwcrOutcomeCodeModule {}
