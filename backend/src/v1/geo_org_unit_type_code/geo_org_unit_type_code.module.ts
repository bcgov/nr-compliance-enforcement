import { Module } from '@nestjs/common';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';
import { GeoOrgUnitTypeCodeController } from './geo_org_unit_type_code.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoOrgUnitTypeCode } from './entities/geo_org_unit_type_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoOrgUnitTypeCode])],
  controllers: [GeoOrgUnitTypeCodeController],
  providers: [GeoOrgUnitTypeCodeService]
})
export class GeoOrgUnitTypeCodeModule {}
