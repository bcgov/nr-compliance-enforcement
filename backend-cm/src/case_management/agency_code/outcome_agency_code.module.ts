import { Module } from "@nestjs/common";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { OutcomeAgencyCodeResolver } from "./outcome_agency_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [OutcomeAgencyCodeResolver, OutcomeAgencyCodeService],
})
export class OutcomeAgencyCodeModule {}
