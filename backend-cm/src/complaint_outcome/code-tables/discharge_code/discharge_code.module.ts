import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { DischargeCodeService } from "./discharge_code.service";
import { DischargeCodeResolver } from "./discharge_code.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [DischargeCodeResolver, DischargeCodeService],
})
export class DischargeCodeModule {}
