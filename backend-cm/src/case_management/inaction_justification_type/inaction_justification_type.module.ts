import { Module } from "@nestjs/common";
import { InactionJustificationTypeResolver } from "./inaction_justification_type.resolver";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [InactionJustificationTypeResolver, InactionJustificationTypeService],
})
export class InactionJustificationTypeModule {}
