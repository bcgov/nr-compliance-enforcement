import { Module } from "@nestjs/common";
import { LeadService } from "./lead.service";
import { LeadResolver } from "./lead.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [LeadResolver, LeadService],
})
export class LeadModule {}
