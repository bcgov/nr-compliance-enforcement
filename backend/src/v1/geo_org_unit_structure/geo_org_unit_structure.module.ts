import { Module } from '@nestjs/common';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoOrgUnitStructure } from './entities/geo_org_unit_structure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoOrgUnitStructure])],
  controllers: [],
  providers: [GeoOrgUnitStructureService]
})
export class GeoOrgUnitStructureModule {}
