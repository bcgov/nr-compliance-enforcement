import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { BuildCodeResolver } from "src/shared/build_code/build_code.resolver";
import { BuildCodeService } from "src/shared/build_code/build_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [BuildCodeResolver, BuildCodeService],
})
export class BuildCodeModule {}
