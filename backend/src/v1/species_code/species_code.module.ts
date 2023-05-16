import { Module } from '@nestjs/common';
import { SpeciesCodeService } from './species_code.service';
import { SpeciesCodeController } from './species_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesCode } from './entities/species_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesCode])],
  controllers: [SpeciesCodeController],
  providers: [SpeciesCodeService]
})
export class SpeciesCodeModule {}
