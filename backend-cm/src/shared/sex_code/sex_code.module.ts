import { Module } from "@nestjs/common";
import { SexCodeService } from "./sex_code.service";
import { SexCodeResolver } from "./sex_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [SexCodeResolver, SexCodeService],
  exports: [SexCodeService],
})
export class SexCodeModule {}
