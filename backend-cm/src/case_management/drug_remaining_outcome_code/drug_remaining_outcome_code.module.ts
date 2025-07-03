import { Module } from "@nestjs/common";
import { DrugRemainingOutcomeCodeService } from "./drug_remaining_outcome_code.service";
import { DrugRemainingOutcomeCodeResolver } from "./drug_remaining_outcome_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [DrugRemainingOutcomeCodeResolver, DrugRemainingOutcomeCodeService],
})
export class DrugRemainingOutcomeCodeModule {}
