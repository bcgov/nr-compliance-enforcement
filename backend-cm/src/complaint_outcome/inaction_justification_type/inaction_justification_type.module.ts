import { Module } from "@nestjs/common";
import { InactionJustificationTypeResolver } from "./inaction_justification_type.resolver";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [InactionJustificationTypeResolver, InactionJustificationTypeService],
})
export class InactionJustificationTypeModule {}
