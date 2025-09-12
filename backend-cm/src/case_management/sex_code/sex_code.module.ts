import { Module } from "@nestjs/common";
import { SexCodeService } from "./sex_code.service";
import { SexCodeResolver } from "./sex_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [SexCodeResolver, SexCodeService],
})
export class SexCodeModule {}
