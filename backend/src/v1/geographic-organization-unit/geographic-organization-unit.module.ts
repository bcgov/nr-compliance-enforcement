import { Module } from '@nestjs/common';
import { GeographicOrganizationUnitService } from './geographic-organization-unit.service';
import { GeographicOrganizationUnitController } from './geographic-organization-unit.controller';

@Module({
  controllers: [GeographicOrganizationUnitController],
  providers: [GeographicOrganizationUnitService]
})
export class GeographicOrganizationUnitModule {}
