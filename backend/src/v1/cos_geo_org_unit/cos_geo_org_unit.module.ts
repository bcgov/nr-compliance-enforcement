import { Module } from "@nestjs/common";
import { CosGeoOrgUnitService } from "./cos_geo_org_unit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CosGeoOrgUnit } from "./entities/cos_geo_org_unit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CosGeoOrgUnit])],
  controllers: [],
  providers: [CosGeoOrgUnitService],
})
export class CosGeoOrgUnitModule {}
