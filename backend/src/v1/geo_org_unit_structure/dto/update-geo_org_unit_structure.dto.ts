import { PartialType } from '@nestjs/swagger';
import { CreateGeoOrgUnitStructureDto } from './create-geo_org_unit_structure.dto';

export class UpdateGeoOrgUnitStructureDto extends PartialType(CreateGeoOrgUnitStructureDto) {}
