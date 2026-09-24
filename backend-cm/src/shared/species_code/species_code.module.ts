import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { SpeciesCodeResolver } from "src/shared/species_code/species_code.resolver";
import { SpeciesCodeService } from "src/shared/species_code/species_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [SpeciesCodeResolver, SpeciesCodeService],
})
export class SpeciesCodeModule {}
