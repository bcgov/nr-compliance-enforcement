import { Module } from '@nestjs/common';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';
import { GeoOrganizationUnitCodeController } from './geo_organization_unit_code.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeoOrganizationUnitCode } from './entities/geo_organization_unit_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoOrganizationUnitCode])],
  controllers: [GeoOrganizationUnitCodeController],
  providers: [GeoOrganizationUnitCodeService]
})
export class GeoOrganizationUnitCodeModule {}
