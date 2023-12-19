import { Module } from '@nestjs/common';
import { AttractantHwcrXrefService } from './attractant_hwcr_xref.service';
import { AttractantHwcrXrefController } from './attractant_hwcr_xref.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttractantHwcrXref])],
  controllers: [AttractantHwcrXrefController],
  providers: [AttractantHwcrXrefService],
  exports: [AttractantHwcrXrefService]
})
export class AttractantHwcrXrefModule {}
