import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { HairColourCodeResolver } from "src/shared/hair_colour_code/hair_colour_code.resolver";
import { HairColourCodeService } from "src/shared/hair_colour_code/hair_colour_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [HairColourCodeResolver, HairColourCodeService],
})
export class HairColourCodeModule {}
