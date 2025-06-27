import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../../prisma/cm/prisma.cm.module";
import { NonComplianceCodeService } from "./non_compliance_code.service";
import { NonComplianceCodeResolver } from "./non_compliance.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [NonComplianceCodeResolver, NonComplianceCodeService],
})
export class NonComplianceCodeModule {}
