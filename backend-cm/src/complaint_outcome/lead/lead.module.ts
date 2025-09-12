import { Module } from "@nestjs/common";
import { LeadService } from "./lead.service";
import { LeadResolver } from "./lead.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [LeadResolver, LeadService],
})
export class LeadModule {}
