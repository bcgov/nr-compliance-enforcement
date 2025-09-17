import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { CaseLocationCodeService } from "./case_location_code.service";
import { CaseLocationCodeResolver } from "./case_location_code.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [CaseLocationCodeResolver, CaseLocationCodeService],
})
export class CaseLocationCodeModule {}
