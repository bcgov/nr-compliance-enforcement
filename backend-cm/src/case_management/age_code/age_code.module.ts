import { Module } from "@nestjs/common";
import { AgeCodeService } from "./age_code.service";
import { AgeCodeResolver } from "./age_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [AgeCodeResolver, AgeCodeService],
})
export class AgeCodeModule {}
