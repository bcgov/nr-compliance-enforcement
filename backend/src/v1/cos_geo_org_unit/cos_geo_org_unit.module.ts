import { Module } from '@nestjs/common';
import { CosGeoOrgUnitService } from './cos_geo_org_unit.service';
import { CosGeoOrgUnitController } from './cos_geo_org_unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosGeoOrgUnit } from './entities/cos_geo_org_unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CosGeoOrgUnit])],
  controllers: [CosGeoOrgUnitController],
  providers: [CosGeoOrgUnitService]
})
export class CosGeoOrgUnitModule {}
