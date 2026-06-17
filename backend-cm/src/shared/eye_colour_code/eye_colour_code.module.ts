import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { EyeColourCodeResolver } from "src/shared/eye_colour_code/eye_colour_code.resolver";
import { EyeColourCodeService } from "src/shared/eye_colour_code/eye_colour_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [EyeColourCodeResolver, EyeColourCodeService],
})
export class EyeColourCodeModule {}
