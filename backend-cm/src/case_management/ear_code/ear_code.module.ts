import { Module } from "@nestjs/common";
import { EarCodeService } from "./ear_code.service";
import { EarCodeResolver } from "./ear_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [EarCodeResolver, EarCodeService],
})
export class EarCodeModule {}
