import { Module } from "@nestjs/common";
import { AgeCodeService } from "./age_code.service";
import { AgeCodeResolver } from "./age_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [AgeCodeResolver, AgeCodeService],
})
export class AgeCodeModule {}
