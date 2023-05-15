import { Module } from '@nestjs/common';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { GeoOrgUnitStructureController } from './geo_org_unit_structure.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoOrgUnitStructure } from './entities/geo_org_unit_structure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoOrgUnitStructure])],
  controllers: [GeoOrgUnitStructureController],
  providers: [GeoOrgUnitStructureService]
})
export class GeoOrgUnitStructureModule {}
