import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { GenderCodeResolver } from "src/shared/gender/gender_code.resolver";
import { GenderCodeService } from "src/shared/gender/gender_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [GenderCodeResolver, GenderCodeService],
})
export class GenderCodeModule {}
