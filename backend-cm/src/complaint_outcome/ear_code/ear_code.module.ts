import { Module } from "@nestjs/common";
import { EarCodeService } from "./ear_code.service";
import { EarCodeResolver } from "./ear_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [EarCodeResolver, EarCodeService],
})
export class EarCodeModule {}
