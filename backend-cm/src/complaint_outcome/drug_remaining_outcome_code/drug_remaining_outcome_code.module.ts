import { Module } from "@nestjs/common";
import { DrugRemainingOutcomeCodeService } from "./drug_remaining_outcome_code.service";
import { DrugRemainingOutcomeCodeResolver } from "./drug_remaining_outcome_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [DrugRemainingOutcomeCodeResolver, DrugRemainingOutcomeCodeService],
})
export class DrugRemainingOutcomeCodeModule {}
