import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../../prisma/cm/prisma.cm.module";
import { CaseLocationCodeService } from "./case_location_code.service";
import { CaseLocationCodeResolver } from "./case_location_code.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [CaseLocationCodeResolver, CaseLocationCodeService],
})
export class CaseLocationCodeModule {}
