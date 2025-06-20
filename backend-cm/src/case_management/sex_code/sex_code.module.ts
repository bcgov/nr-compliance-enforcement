import { Module } from "@nestjs/common";
import { SexCodeService } from "./sex_code.service";
import { SexCodeResolver } from "./sex_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [SexCodeResolver, SexCodeService],
})
export class SexCodeModule {}
