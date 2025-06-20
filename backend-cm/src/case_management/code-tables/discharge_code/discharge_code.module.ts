import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../../prisma/cm/prisma.cm.module";
import { DischargeCodeService } from "./discharge_code.service";
import { DischargeCodeResolver } from "./discharge_code.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [DischargeCodeResolver, DischargeCodeService],
})
export class DischargeCodeModule {}
