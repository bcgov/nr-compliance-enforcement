import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { FacialHairStyleCodeResolver } from "src/shared/facial_hair_style_code/facial_hair_style_code.resolver";
import { FacialHairStyleCodeService } from "src/shared/facial_hair_style_code/facial_hair_style_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [FacialHairStyleCodeResolver, FacialHairStyleCodeService],
})
export class FacialHairStyleCodeModule {}
