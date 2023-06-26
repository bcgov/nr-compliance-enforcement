import { PartialType } from '@nestjs/mapped-types';
import { CreateCosGeoOrgUnitDto } from './create-cos_geo_org_unit.dto';

export class UpdateCosGeoOrgUnitDto extends PartialType(CreateCosGeoOrgUnitDto) {}
