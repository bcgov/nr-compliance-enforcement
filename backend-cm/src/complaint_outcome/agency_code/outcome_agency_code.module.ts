import { Module } from "@nestjs/common";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { OutcomeAgencyCodeResolver } from "./outcome_agency_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [OutcomeAgencyCodeResolver, OutcomeAgencyCodeService],
})
export class OutcomeAgencyCodeModule {}
