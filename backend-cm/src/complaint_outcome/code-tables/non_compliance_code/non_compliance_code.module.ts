import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { NonComplianceCodeService } from "./non_compliance_code.service";
import { NonComplianceCodeResolver } from "./non_compliance.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [NonComplianceCodeResolver, NonComplianceCodeService],
})
export class NonComplianceCodeModule {}
