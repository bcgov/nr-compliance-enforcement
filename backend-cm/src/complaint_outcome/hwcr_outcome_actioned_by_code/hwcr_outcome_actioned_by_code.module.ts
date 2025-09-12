import { Module } from "@nestjs/common";
import { HwcrOutcomeActionedByCodeService } from "./hwcr_outcome_actioned_by_code.service";
import { HwcrOutcomeActionedByCodeResolver } from "./hwcr_outcome_actioned_by_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [HwcrOutcomeActionedByCodeResolver, HwcrOutcomeActionedByCodeService],
})
export class HwcrOutcomeActionedByCodeModule {}
