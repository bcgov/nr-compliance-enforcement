import { Module } from "@nestjs/common";
import { SpeciesCodeService } from "./species_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpeciesCode } from "./entities/species_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesCode])],
  controllers: [],
  providers: [SpeciesCodeService],
  exports: [SpeciesCodeService],
})
export class SpeciesCodeModule {}
