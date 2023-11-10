import { Module } from '@nestjs/common';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoOrgUnitTypeCode } from './entities/geo_org_unit_type_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoOrgUnitTypeCode])],
  controllers: [],
  providers: [GeoOrgUnitTypeCodeService]
})
export class GeoOrgUnitTypeCodeModule {}
